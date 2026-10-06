import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildRealisticSatellite } from '../utils/spacecraftModel';
import { createEarthTexture, createEarthCloudsTexture } from '../utils/spaceTextures';

interface RealisticEarthOrbitBackgroundProps {
  className?: string;
  isPaused?: boolean;
}

export const RealisticEarthOrbitBackground: React.FC<RealisticEarthOrbitBackgroundProps> = ({
  className = '',
  isPaused = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let isMounted = true;
    let animId: number;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    // Position camera to view half Earth from LEO/MEO perspective
    camera.position.set(0, 1.2, 14.5);
    camera.lookAt(0, -0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Space Lighting
    // Directional Sun lighting from upper-left casting realistic day/night terminator
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(-18, 12, 16);
    scene.add(sunLight);

    // Subtle soft ambient light for night-side visibility
    const ambientLight = new THREE.AmbientLight(0x0a1628, 0.45);
    scene.add(ambientLight);

    // Subtle cyan rim fill light from atmospheric scattering
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(12, -4, -10);
    scene.add(rimLight);

    // 3. Cosmic Starfield
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const r = 180 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = r * Math.cos(phi);

      const isBlue = Math.random() > 0.7;
      starColors[idx] = isBlue ? 0.75 : 0.95;
      starColors[idx + 1] = isBlue ? 0.9 : 0.95;
      starColors[idx + 2] = 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. One Half Earth Planet (Prominently framed)
    const earthRadius = 5.2;
    const earthGroup = new THREE.Group();
    // Position Earth so its upper-half horizon curves beautifully through the frame
    earthGroup.position.set(0.5, -4.8, -1.0);
    // Earth's natural 23.5° axial tilt
    earthGroup.rotation.z = THREE.MathUtils.degToRad(-23.5);
    earthGroup.rotation.x = THREE.MathUtils.degToRad(12);
    scene.add(earthGroup);

    // Earth Surface Material with Texture
    const textureLoader = new THREE.TextureLoader();
    let earthMapTexture: THREE.Texture = createEarthTexture(2048, 1024);

    // Try loading real high-res NASA Blue Marble texture from public directory
    textureLoader.load(
      '/earth_real_map_2048.jpg',
      (tex) => {
        if (!isMounted) return;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        earthMat.map = tex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback to secondary daymap if available
        textureLoader.load('/earth_daymap.jpg', (tex2) => {
          if (!isMounted) return;
          earthMat.map = tex2;
          earthMat.needsUpdate = true;
        });
      }
    );

    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthMapTexture,
      roughness: 0.55,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Atmospheric Cloud Layer Sphere (Hovering above surface)
    const cloudsTexture = createEarthCloudsTexture(2048, 1024);
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.014, 48, 48);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.52,
      blending: THREE.NormalBlending,
      roughness: 0.9,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    // Atmospheric Blue Limb Aura (Fresnel Halo Effect)
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.04, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 0.95;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // 5. Realistic Spacecraft Satellite Revolving around Earth
    const satResult = buildRealisticSatellite();
    const satGroup = satResult.rootGroup;
    // Scale satellite to realistic proportion relative to the orbital distance
    satGroup.scale.set(0.32, 0.32, 0.32);
    scene.add(satGroup);

    // 6. Orbital Trajectory Path (Luminous Elliptical Ring)
    // Orbit parameters relative to Earth center
    const orbitRadiusA = 7.6; // Semi-major axis
    const orbitRadiusB = 7.1; // Semi-minor axis
    const orbitInclination = THREE.MathUtils.degToRad(32); // Orbital plane tilt

    const orbitPoints: THREE.Vector3[] = [];
    const orbitSegments = 120;
    for (let i = 0; i <= orbitSegments; i++) {
      const angle = (i / orbitSegments) * Math.PI * 2;
      const x = orbitRadiusA * Math.cos(angle);
      const y = orbitRadiusB * Math.sin(angle) * Math.sin(orbitInclination);
      const z = orbitRadiusB * Math.sin(angle) * Math.cos(orbitInclination);
      orbitPoints.push(new THREE.Vector3(x + earthGroup.position.x, y + earthGroup.position.y, z + earthGroup.position.z));
    }

    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.35,
      gapSize: 0.25,
      transparent: true,
      opacity: 0.45,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    scene.add(orbitLine);

    // Satellite Telemetry Signal Pulse Ring
    const pulseGeo = new THREE.RingGeometry(0.1, 0.45, 32);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    pulseMesh.rotation.x = Math.PI / 2;
    satGroup.add(pulseMesh);

    // 7. Animation Loop: Earth rotation + Satellite Revolution
    let orbitAngle = 0.8; // Initial orbital position (visible in foreground)
    const orbitSpeed = 0.007; // Smooth orbital speed
    const earthRotationSpeed = 0.0012; // Realistic planetary rotation
    const cloudRotationSpeed = 0.0016; // Atmospheric cloud drift

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || 600;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!isMounted) return;

      if (!isPaused) {
        // Slowly rotate Earth and cloud layer
        earthMesh.rotation.y += earthRotationSpeed;
        cloudsMesh.rotation.y += cloudRotationSpeed;

        // Revolve satellite in realistic elliptical orbit around Earth
        orbitAngle += orbitSpeed;
        if (orbitAngle > Math.PI * 2) {
          orbitAngle -= Math.PI * 2;
        }

        const localX = orbitRadiusA * Math.cos(orbitAngle);
        const localY = orbitRadiusB * Math.sin(orbitAngle) * Math.sin(orbitInclination);
        const localZ = orbitRadiusB * Math.sin(orbitAngle) * Math.cos(orbitInclination);

        satGroup.position.set(
          localX + earthGroup.position.x,
          localY + earthGroup.position.y,
          localZ + earthGroup.position.z
        );

        // Satellite realistic attitude: Solar wings face sunlight, dish points to Earth
        // Tangent vector to orbit (velocity vector)
        const nextAngle = orbitAngle + 0.02;
        const nextX = orbitRadiusA * Math.cos(nextAngle) + earthGroup.position.x;
        const nextY = orbitRadiusB * Math.sin(nextAngle) * Math.sin(orbitInclination) + earthGroup.position.y;
        const nextZ = orbitRadiusB * Math.sin(nextAngle) * Math.cos(orbitInclination) + earthGroup.position.z;

        const forwardVec = new THREE.Vector3(nextX, nextY, nextZ).sub(satGroup.position).normalize();
        satGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), forwardVec);

        // Slowly oscillate solar wings tracking sunlight
        satResult.solarWingsGroup.rotation.x = Math.sin(orbitAngle) * 0.25;

        // Pulse telemetry ring
        const pulseScale = (Date.now() * 0.003) % 2.5 + 0.5;
        pulseMesh.scale.set(pulseScale, pulseScale, pulseScale);
        pulseMat.opacity = Math.max(0, 0.8 - pulseScale * 0.28);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      earthGeo.dispose();
      cloudsGeo.dispose();
      atmosphereGeo.dispose();
      orbitGeo.dispose();
    };
  }, [isPaused]);

  if (!webGlSupported) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-b from-[#030712] via-[#071329] to-[#040915] ${className}`} />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
