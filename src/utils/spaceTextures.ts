import * as THREE from 'three';

/**
 * Procedural Earth texture generator
 * Generates an equirectangular Earth map with continents, oceans, atmospheric clouds,
 * and night-side city lights without external network requests.
 */
export function createEarthTexture(width = 2048, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Ocean Base (physically accurate deep navy/cyan gradient)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0a2342'); // Polar deep
  oceanGrad.addColorStop(0.25, '#073b6a'); // Mid-latitude
  oceanGrad.addColorStop(0.5, '#0c4d87'); // Tropical warm deep
  oceanGrad.addColorStop(0.75, '#073b6a');
  oceanGrad.addColorStop(1, '#0a2342');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle ocean bathymetry shelf variations
  ctx.fillStyle = 'rgba(12, 90, 150, 0.25)';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const cx = (Math.sin(i * 1.7) * 0.5 + 0.5) * width;
    const cy = (Math.cos(i * 2.3) * 0.4 + 0.5) * height;
    ctx.arc(cx, cy, 120 + (i % 5) * 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Continents Representation (simplified global landmass approximation)
  ctx.fillStyle = '#2d5a27'; // Continental green/olive

  const drawLandmass = (
    pts: [number, number][],
    fillColor = '#3a6634',
    mountainColor = '#5c5240'
  ) => {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * width, pts[0][1] * height);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0] * width, pts[i][1] * height);
    }
    ctx.closePath();
    ctx.fill();

    // Mountainous interior
    ctx.fillStyle = mountainColor;
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * width, pts[0][1] * height);
    for (let i = 1; i < pts.length; i += 2) {
      const mx = (pts[i][0] * 0.8 + 0.1) * width;
      const my = (pts[i][1] * 0.8 + 0.1) * height;
      ctx.lineTo(mx, my);
    }
    ctx.closePath();
    ctx.fill();
  };

  // North America
  drawLandmass([
    [0.12, 0.20], [0.26, 0.18], [0.32, 0.24], [0.28, 0.38],
    [0.24, 0.46], [0.20, 0.44], [0.15, 0.35], [0.10, 0.28]
  ], '#2c5929', '#635338');

  // South America
  drawLandmass([
    [0.26, 0.50], [0.33, 0.52], [0.36, 0.60], [0.32, 0.78],
    [0.28, 0.82], [0.26, 0.65], [0.23, 0.55]
  ], '#1f4e1f', '#4a422d');

  // Europe
  drawLandmass([
    [0.46, 0.22], [0.55, 0.20], [0.56, 0.32], [0.48, 0.35],
    [0.44, 0.30]
  ], '#3d6b35', '#574c3b');

  // Africa
  drawLandmass([
    [0.46, 0.38], [0.58, 0.38], [0.60, 0.50], [0.55, 0.72],
    [0.50, 0.74], [0.45, 0.58], [0.42, 0.44]
  ], '#685e3a', '#786c47');

  // Asia
  drawLandmass([
    [0.56, 0.18], [0.82, 0.18], [0.88, 0.30], [0.80, 0.48],
    [0.72, 0.45], [0.65, 0.48], [0.60, 0.36]
  ], '#3a6132', '#6b5c3e');

  // Australia
  drawLandmass([
    [0.76, 0.64], [0.86, 0.62], [0.88, 0.74], [0.80, 0.78],
    [0.74, 0.70]
  ], '#7a5a30', '#8c6b3e');

  // Antarctica & Ice Shelves
  ctx.fillStyle = '#dcebf7';
  ctx.beginPath();
  ctx.rect(0, height * 0.88, width, height * 0.12);
  ctx.fill();

  // Arctic Ice Cap
  ctx.fillStyle = '#e8f4fc';
  ctx.beginPath();
  ctx.rect(0, 0, width, height * 0.08);
  ctx.fill();

  // 3. Cloud Swirls (translucent atmospheric weather systems)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
  for (let c = 0; c < 28; c++) {
    const cx = (c / 28) * width;
    const cy = (Math.sin(c * 1.5) * 0.28 + 0.5) * height;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140 + (c % 4) * 35, 35 + (c % 3) * 15, (c * 0.2), 0, Math.PI * 2);
    ctx.fill();
  }

  // Cyclonic spirals
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
  ctx.lineWidth = 14;
  for (let s = 0; s < 6; s++) {
    const sx = (0.2 + s * 0.14) * width;
    const sy = (0.3 + (s % 2) * 0.4) * height;
    ctx.beginPath();
    ctx.arc(sx, sy, 55, 0, Math.PI * 1.7);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural Photovoltaic Solar Panel Texture
 * Produces crisp silicon cell grids with busbars and anti-reflective coating
 */
export function createSolarPanelTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep dark blue / purple silicon substrate
  ctx.fillStyle = '#081738';
  ctx.fillRect(0, 0, width, height);

  const cols = 8;
  const rows = 16;
  const cellW = width / cols;
  const cellH = height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;

      // Cell border gap
      ctx.fillStyle = '#030814';
      ctx.fillRect(x, y, cellW, cellH);

      // Silicon Wafer with anti-reflective sheen
      const grad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
      grad.addColorStop(0, '#0e2968');
      grad.addColorStop(0.5, '#0b2052');
      grad.addColorStop(1, '#08183d');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1.5, y + 1.5, cellW - 3, cellH - 3);

      // Micro grid contact lines (silver)
      ctx.strokeStyle = 'rgba(180, 210, 255, 0.4)';
      ctx.lineWidth = 0.8;
      for (let ly = y + 4; ly < y + cellH - 3; ly += 6) {
        ctx.beginPath();
        ctx.moveTo(x + 2, ly);
        ctx.lineTo(x + cellW - 2, ly);
        ctx.stroke();
      }

      // Main silver collection busbar
      ctx.strokeStyle = 'rgba(230, 240, 255, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x + cellW * 0.5, y + 2);
      ctx.lineTo(x + cellW * 0.5, y + cellH - 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Gold Multi-Layer Insulation (MLI) Foil Texture
 * Used on real aerospace satellite thermal blankets (Kapton / Mylar)
 */
export function createGoldFoilTexture(width = 256, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#cca330';
  ctx.fillRect(0, 0, width, height);

  // Micro crinkle pattern
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 2 + Math.random() * 8;
    const brightness = Math.random() > 0.5 ? 'rgba(255, 235, 140, 0.25)' : 'rgba(120, 85, 15, 0.3)';
    ctx.fillStyle = brightness;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Embossed thermal tape grid
  ctx.strokeStyle = 'rgba(180, 130, 30, 0.4)';
  ctx.lineWidth = 1.2;
  for (let p = 0; p < width; p += 32) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(width, p);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural Earth Cloud Layer Texture
 * Generates transparent white atmospheric clouds with cyclonic whorls and trade-wind bands
 */
export function createEarthCloudsTexture(width = 2048, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);

  // Cloud bands and storms
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';

  // Tropical convergence zone and mid-latitude weather bands
  for (let c = 0; c < 48; c++) {
    const cx = (c / 48) * width;
    const cy = (Math.sin(c * 1.6) * 0.22 + 0.48) * height;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 180 + (c % 5) * 40, 45 + (c % 4) * 20, c * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cyclones / Hurricane swirls
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 18;
  const storms = [
    [0.22, 0.32],
    [0.72, 0.28],
    [0.85, 0.65],
    [0.38, 0.70],
    [0.54, 0.25],
  ];
  storms.forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.arc(sx * width, sy * height, 70, 0, Math.PI * 1.85);
    ctx.stroke();
    // Inner core eye
    ctx.beginPath();
    ctx.arc(sx * width, sy * height, 35, 0.4, Math.PI * 1.6);
    ctx.stroke();
  });

  // Soft polar cloud caps
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  grad.addColorStop(0.12, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.45)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
