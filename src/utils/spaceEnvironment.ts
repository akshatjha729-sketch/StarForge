import * as THREE from 'three';
import { createEarthTexture, createEarthCloudsTexture } from './spaceTextures';

export interface SpaceEnvironmentResult {
  environmentGroup: THREE.Group;
  earthMesh: THREE.Mesh;
  cloudsMesh: THREE.Mesh;
  atmosphereMesh: THREE.Mesh;
  orbitPathLine: THREE.Line;
  orbitMarkerDot: THREE.Mesh;
  starsPoints: THREE.Points;
  sunLight: THREE.DirectionalLight;
  earthBounceLight: THREE.DirectionalLight;
  updateAnimation: (time: number) => void;
}

/**
 * Creates a realistic space environment with Earth, atmosphere glow,
 * orbital trajectory line, directional solar lighting, and deep space starfield.
 */
export function createSpaceEnvironment(): SpaceEnvironmentResult {
  const environmentGroup = new THREE.Group();
  environmentGroup.name = 'SpaceEnvironment';

  // =========================================================================
  // 1. REALISTIC NASA BLUE MARBLE EARTH WITH CLOUDS & ATMOSPHERE
  // =========================================================================
  const earthRadius = 11.5;

  // Primary: Load genuine NASA Blue Marble equirectangular satellite texture map
  const textureLoader = new THREE.TextureLoader();
  const fallbackTexture = createEarthTexture(2048, 1024);

  const earthMat = new THREE.MeshStandardMaterial({
    map: fallbackTexture,
    roughness: 0.65,
    metalness: 0.04,
  });

  // Load real NASA photographic satellite map
  textureLoader.load(
    '/earth_daymap.jpg',
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    },
    undefined,
    () => {
      // Procedural Earth fallback if network blocked
      console.warn('Using procedural Earth fallback map.');
    }
  );

  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 48);
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  // Position Earth curved below the spacecraft
  earthMesh.position.set(0, -14.2, -6.5);
  earthMesh.rotation.x = 0.28; // Earth axial tilt
  earthMesh.rotation.y = 1.1;
  environmentGroup.add(earthMesh);

  // Concentric Realistic Cloud Sphere (floats above Earth surface with differential orbit speed)
  const cloudsTexture = createEarthCloudsTexture(2048, 1024);
  const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.008, 64, 48);
  const cloudsMat = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.62,
    roughness: 0.9,
    metalness: 0.0,
    depthWrite: false,
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
  earthMesh.add(cloudsMesh);

  // Atmospheric Glow Shell (Rayleigh scattering rim in Sky Blue)
  const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.028, 48, 36);
  const atmosMat = new THREE.MeshStandardMaterial({
    color: '#0ea5e9',
    transparent: true,
    opacity: 0.28,
    roughness: 1.0,
    metalness: 0.0,
    side: THREE.BackSide,
  });
  const atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
  earthMesh.add(atmosphereMesh);

  // Atmospheric thin limb haze ring in Sky Blue
  const hazeGeo = new THREE.RingGeometry(earthRadius * 1.01, earthRadius * 1.075, 64);
  const hazeMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });
  const hazeRing = new THREE.Mesh(hazeGeo, hazeMat);
  hazeRing.position.z = 0.1;
  earthMesh.add(hazeRing);

  // =========================================================================
  // 2. ORBITAL TRAJECTORY (Thin glowing trajectory ellipse)
  // =========================================================================
  const orbitPoints: THREE.Vector3[] = [];
  const orbitRadiusX = 8.5;
  const orbitRadiusY = 5.2;
  const segments = 120;

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * orbitRadiusX;
    const y = -1.2 + Math.sin(theta) * 0.8;
    const z = Math.sin(theta) * orbitRadiusY - 2.5;
    orbitPoints.push(new THREE.Vector3(x, y, z));
  }

  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.35,
    linewidth: 1,
  });
  const orbitPathLine = new THREE.Line(orbitGeo, orbitMat);
  environmentGroup.add(orbitPathLine);

  // Glowing current-orbital-position pip along the track
  const markerGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const markerMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.85,
  });
  const orbitMarkerDot = new THREE.Mesh(markerGeo, markerMat);
  environmentGroup.add(orbitMarkerDot);

  // =========================================================================
  // 3. DEEP SPACE STARFIELD (Procedural non-gaming celestial background)
  // =========================================================================
  const starCount = 1400;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Distant sphere distribution
    const r = 60 + Math.random() * 35;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = r * Math.cos(phi);

    // Varied stellar temperatures (O/B blue-white, G yellow-white, M soft red)
    const temp = Math.random();
    if (temp > 0.8) {
      // Blue-white young star
      starColors[i3] = 0.75;
      starColors[i3 + 1] = 0.88;
      starColors[i3 + 2] = 1.0;
    } else if (temp > 0.3) {
      // Pure white
      starColors[i3] = 0.95;
      starColors[i3 + 1] = 0.96;
      starColors[i3 + 2] = 1.0;
    } else {
      // Warm yellow/amber
      starColors[i3] = 1.0;
      starColors[i3 + 1] = 0.92;
      starColors[i3 + 2] = 0.8;
    }
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.85,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    sizeAttenuation: false,
  });

  const starsPoints = new THREE.Points(starGeo, starMat);
  environmentGroup.add(starsPoints);

  // =========================================================================
  // 4. REALISTIC SPACE LIGHTING RIG
  // =========================================================================
  // Directional Sun lighting with realistic aerospace illumination
  const sunLight = new THREE.DirectionalLight('#fffcf0', 2.5);
  sunLight.position.set(12, 14, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  environmentGroup.add(sunLight);

  // Deep-space cosmic fill (ambient)
  const cosmicFill = new THREE.AmbientLight('#081024', 0.6);
  environmentGroup.add(cosmicFill);

  // Earth Albedo bounce light (soft blue reflection from Earth below)
  const earthBounceLight = new THREE.DirectionalLight('#1a4f8a', 0.45);
  earthBounceLight.position.set(0, -10, -2);
  environmentGroup.add(earthBounceLight);

  // Animation helper
  const updateAnimation = (time: number) => {
    // Very slow Earth rotation
    earthMesh.rotation.y = 1.1 + time * 0.015;

    // Subtle cloud layer differential drift
    cloudsMesh.rotation.y = 0.08 + time * 0.022;

    // Subtle orbital marker pulse / movement
    const orbitAngle = time * 0.08;
    const mx = Math.cos(orbitAngle) * orbitRadiusX;
    const my = -1.2 + Math.sin(orbitAngle) * 0.8;
    const mz = Math.sin(orbitAngle) * orbitRadiusY - 2.5;
    orbitMarkerDot.position.set(mx, my, mz);
  };

  return {
    environmentGroup,
    earthMesh,
    cloudsMesh,
    atmosphereMesh,
    orbitPathLine,
    orbitMarkerDot,
    starsPoints,
    sunLight,
    earthBounceLight,
    updateAnimation,
  };
}
