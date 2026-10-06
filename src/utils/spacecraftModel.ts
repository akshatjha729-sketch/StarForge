import * as THREE from 'three';
import { createGoldFoilTexture, createSolarPanelTexture } from './spaceTextures';

export interface SubsystemAnchor {
  name: 'POWER' | 'COMMUNICATION' | 'ATTITUDE' | 'THERMAL' | 'COMPUTE';
  position: THREE.Vector3;
  meshRef?: THREE.Mesh | THREE.Group;
}

export interface SpacecraftModelResult {
  rootGroup: THREE.Group;
  satelliteGroup: THREE.Group;
  solarWingsGroup: THREE.Group;
  antennaDish: THREE.Mesh;
  subsystemMeshes: Record<string, THREE.Mesh>;
  anchors: SubsystemAnchor[];
}

/**
 * Builds a realistic aerospace Earth-observation satellite model
 * Proportions and details modeled after real LEO spacecraft (Sentinel/Landsat style)
 */
export function buildRealisticSatellite(): SpacecraftModelResult {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'SpacecraftSystem';

  const satelliteGroup = new THREE.Group();
  satelliteGroup.name = 'SatelliteBus';
  rootGroup.add(satelliteGroup);

  // Reusable Materials
  const goldTexture = createGoldFoilTexture();
  const solarTexture = createSolarPanelTexture();

  const goldMliMaterial = new THREE.MeshStandardMaterial({
    color: '#d4af37',
    roughness: 0.38,
    metalness: 0.75,
    map: goldTexture,
    bumpMap: goldTexture,
    bumpScale: 0.04,
  });

  const aluminumMaterial = new THREE.MeshStandardMaterial({
    color: '#c2cad4',
    roughness: 0.3,
    metalness: 0.85,
  });

  const darkAlloyMaterial = new THREE.MeshStandardMaterial({
    color: '#1a202c',
    roughness: 0.6,
    metalness: 0.5,
  });

  const solarCellMaterial = new THREE.MeshStandardMaterial({
    color: '#1b3260',
    roughness: 0.22,
    metalness: 0.6,
    map: solarTexture,
  });

  const opticalLensMaterial = new THREE.MeshPhysicalMaterial({
    color: '#081c3b',
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.5,
    transparent: true,
    opacity: 0.85,
  });

  const subsystemMeshes: Record<string, THREE.Mesh> = {};

  // =========================================================================
  // 1. MAIN SATELLITE BUS (Body)
  // =========================================================================
  const busGeo = new THREE.BoxGeometry(1.4, 2.2, 1.4);
  const busMesh = new THREE.Mesh(busGeo, goldMliMaterial);
  busMesh.castShadow = true;
  busMesh.receiveShadow = true;
  satelliteGroup.add(busMesh);

  // Carbon composite top & bottom structural deck plates
  const deckPlateGeo = new THREE.BoxGeometry(1.5, 0.08, 1.5);
  const topDeck = new THREE.Mesh(deckPlateGeo, darkAlloyMaterial);
  topDeck.position.y = 1.14;
  satelliteGroup.add(topDeck);

  const bottomDeck = new THREE.Mesh(deckPlateGeo, darkAlloyMaterial);
  bottomDeck.position.y = -1.14;
  satelliteGroup.add(bottomDeck);

  // Trunnion pins / launch adapter ring at bottom
  const adapterRingGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.25, 24);
  const adapterRing = new THREE.Mesh(adapterRingGeo, aluminumMaterial);
  adapterRing.position.y = -1.26;
  satelliteGroup.add(adapterRing);

  // =========================================================================
  // 2. THERMAL SUBSYSTEM (Radiator Louvers on cold face)
  // =========================================================================
  const radiatorGeo = new THREE.BoxGeometry(1.2, 1.6, 0.04);
  const radiatorMesh = new THREE.Mesh(radiatorGeo, aluminumMaterial);
  radiatorMesh.position.set(0, 0, -0.72);
  satelliteGroup.add(radiatorMesh);

  // Thermal louver slats
  for (let l = -0.6; l <= 0.6; l += 0.2) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.02), darkAlloyMaterial);
    slat.position.set(0, l, -0.74);
    satelliteGroup.add(slat);
  }
  subsystemMeshes['THERMAL'] = radiatorMesh;

  // =========================================================================
  // 3. COMPUTE SUBSYSTEM (Avionics bay access panel on front face)
  // =========================================================================
  const avionicsGeo = new THREE.BoxGeometry(0.9, 0.9, 0.05);
  const avionicsMesh = new THREE.Mesh(avionicsGeo, darkAlloyMaterial);
  avionicsMesh.position.set(0, 0.4, 0.72);
  satelliteGroup.add(avionicsMesh);

  // Avionics status marker bead
  const computeMarkerGeo = new THREE.SphereGeometry(0.04, 12, 12);
  const computeIndicator = new THREE.Mesh(
    computeMarkerGeo,
    new THREE.MeshBasicMaterial({ color: 0x10b981 })
  );
  computeIndicator.position.set(0.35, 0.75, 0.75);
  satelliteGroup.add(computeIndicator);
  subsystemMeshes['COMPUTE'] = avionicsMesh;

  // =========================================================================
  // 4. ATTITUDE SUBSYSTEM (Star Trackers + Reaction Control Pods)
  // =========================================================================
  // Dual optical Star Tracker tubes angled toward deep space
  const trackerMount = new THREE.Group();
  trackerMount.position.set(-0.72, -0.4, 0.4);

  const trackerTubeGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.28, 16);
  const tracker1 = new THREE.Mesh(trackerTubeGeo, darkAlloyMaterial);
  tracker1.rotation.z = Math.PI / 4;
  trackerMount.add(tracker1);

  const tracker2 = new THREE.Mesh(trackerTubeGeo, darkAlloyMaterial);
  tracker2.rotation.x = -Math.PI / 5;
  tracker2.rotation.z = Math.PI / 4;
  tracker2.position.set(0, 0.2, 0);
  trackerMount.add(tracker2);
  satelliteGroup.add(trackerMount);

  // Hydrazine RCS Thruster quads (4 corners of bus)
  const thrusterGeo = new THREE.ConeGeometry(0.05, 0.12, 12);
  const thrusterCorners = [
    [0.72, 1.0, 0.72, Math.PI / 2],
    [-0.72, 1.0, 0.72, -Math.PI / 2],
    [0.72, -1.0, 0.72, Math.PI / 2],
    [-0.72, -1.0, -0.72, -Math.PI / 2],
  ];
  thrusterCorners.forEach(([tx, ty, tz, rot]) => {
    const nozzle = new THREE.Mesh(thrusterGeo, aluminumMaterial);
    nozzle.position.set(tx, ty, tz);
    nozzle.rotation.z = rot;
    satelliteGroup.add(nozzle);
  });
  subsystemMeshes['ATTITUDE'] = tracker1;

  // =========================================================================
  // 5. COMMUNICATION SUBSYSTEM (High-Gain Parabolic Dish Antenna)
  // =========================================================================
  const commsGroup = new THREE.Group();
  commsGroup.position.set(0, 1.35, 0.2);

  // Gimbal boom
  const gimbalGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12);
  const gimbal = new THREE.Mesh(gimbalGeo, aluminumMaterial);
  commsGroup.add(gimbal);

  // Parabolic dish (inverted bowl)
  const dishGeo = new THREE.SphereGeometry(0.55, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const dishMesh = new THREE.Mesh(dishGeo, aluminumMaterial);
  dishMesh.position.y = 0.35;
  dishMesh.rotation.x = Math.PI * 0.75; // Angled toward Earth ground station
  dishMesh.scale.set(1, 0.4, 1);
  commsGroup.add(dishMesh);

  // Sub-reflector tripod and feed horn
  const feedHornGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.15, 12);
  const feedHorn = new THREE.Mesh(feedHornGeo, darkAlloyMaterial);
  feedHorn.position.set(0, 0.5, 0.2);
  commsGroup.add(feedHorn);

  // Dual helical low-gain omni antennas
  const omniGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8);
  const omni1 = new THREE.Mesh(omniGeo, aluminumMaterial);
  omni1.position.set(-0.6, 1.35, -0.6);
  satelliteGroup.add(omni1);

  const omni2 = new THREE.Mesh(omniGeo, aluminumMaterial);
  omni2.position.set(0.6, 1.35, -0.6);
  satelliteGroup.add(omni2);

  satelliteGroup.add(commsGroup);
  subsystemMeshes['COMMUNICATION'] = dishMesh;

  // =========================================================================
  // 6. PAYLOAD INSTRUMENTS (Earth Observation Optical Telescope Barrel)
  // =========================================================================
  // Facing Nadir (downwards towards Earth)
  const payloadGroup = new THREE.Group();
  payloadGroup.position.set(0, -0.85, 0.45);

  const telescopeBaffleGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.7, 24);
  const telescopeBaffle = new THREE.Mesh(telescopeBaffleGeo, darkAlloyMaterial);
  telescopeBaffle.rotation.x = Math.PI / 2;
  payloadGroup.add(telescopeBaffle);

  const lensGeo = new THREE.CircleGeometry(0.3, 24);
  const lens = new THREE.Mesh(lensGeo, opticalLensMaterial);
  lens.position.z = 0.36;
  payloadGroup.add(lens);

  // Gold thermal ring around telescope aperture
  const lensRingGeo = new THREE.TorusGeometry(0.31, 0.03, 12, 24);
  const lensRing = new THREE.Mesh(lensRingGeo, goldMliMaterial);
  lensRing.position.z = 0.36;
  payloadGroup.add(lensRing);

  satelliteGroup.add(payloadGroup);

  // =========================================================================
  // 7. POWER SUBSYSTEM (Articulated Twin Solar Array Wings)
  // =========================================================================
  const solarWingsGroup = new THREE.Group();
  solarWingsGroup.name = 'SolarWings';
  satelliteGroup.add(solarWingsGroup);

  const makeSolarWing = (direction: 1 | -1) => {
    const wing = new THREE.Group();
    const boomLength = 0.6;
    const panelWidth = 2.4;
    const panelHeight = 0.85;
    const panelThickness = 0.03;

    // Gimbal / Yoke attachment boom
    const boomGeo = new THREE.CylinderGeometry(0.04, 0.04, boomLength, 12);
    const boom = new THREE.Mesh(boomGeo, darkAlloyMaterial);
    boom.rotation.z = Math.PI / 2;
    boom.position.x = direction * (boomLength / 2);
    wing.add(boom);

    // Multi-panel solar wing (3 articulated panels per side)
    const wingRootX = direction * boomLength;
    const panelSpacing = 0.85;

    for (let p = 0; p < 3; p++) {
      const px = wingRootX + direction * (p * panelSpacing + 0.45);
      const panelGroup = new THREE.Group();
      panelGroup.position.x = px;

      // Photovoltaic cell surface
      const panelGeo = new THREE.BoxGeometry(0.8, panelHeight, panelThickness);
      const panelMesh = new THREE.Mesh(panelGeo, solarCellMaterial);
      panelMesh.castShadow = true;
      panelMesh.receiveShadow = true;
      panelGroup.add(panelMesh);

      // Gold frame around panel edge
      const frameGeo = new THREE.BoxGeometry(0.82, panelHeight + 0.02, 0.01);
      const frame = new THREE.Mesh(frameGeo, goldMliMaterial);
      frame.position.z = -0.015;
      panelGroup.add(frame);

      wing.add(panelGroup);
    }

    return wing;
  };

  const leftWing = makeSolarWing(1);
  const rightWing = makeSolarWing(-1);
  solarWingsGroup.add(leftWing);
  solarWingsGroup.add(rightWing);

  // Assign Power subsystem mesh reference
  subsystemMeshes['POWER'] = leftWing.children[1] as THREE.Mesh;

  // =========================================================================
  // 8. SUBSYSTEM HOTSPOT ANCHORS (World-space coordinates relative to root)
  // =========================================================================
  const anchors: SubsystemAnchor[] = [
    {
      name: 'POWER',
      position: new THREE.Vector3(2.1, 0, 0),
      meshRef: leftWing,
    },
    {
      name: 'COMMUNICATION',
      position: new THREE.Vector3(0, 1.85, 0.3),
      meshRef: dishMesh,
    },
    {
      name: 'ATTITUDE',
      position: new THREE.Vector3(-0.95, -0.4, 0.45),
      meshRef: trackerMount,
    },
    {
      name: 'THERMAL',
      position: new THREE.Vector3(0, 0, -0.95),
      meshRef: radiatorMesh,
    },
    {
      name: 'COMPUTE',
      position: new THREE.Vector3(0, 0.4, 0.95),
      meshRef: avionicsMesh,
    },
  ];

  return {
    rootGroup,
    satelliteGroup,
    solarWingsGroup,
    antennaDish: dishMesh,
    subsystemMeshes,
    anchors,
  };
}
