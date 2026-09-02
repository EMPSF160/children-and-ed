/* ==========================================================================
   Three.js 3D Background - Educational Constellation & Interactive Mesh
   ========================================================================== */

(function() {
  const canvas = document.getElementById('three-hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles constellation
  const particleCount = 180;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = [];

  const color1 = new THREE.Color(0x38BDF8); // Cyan / Sky Blue
  const color2 = new THREE.Color(0xFF6B00); // Saffron Orange
  const color3 = new THREE.Color(0x818CF8); // Soft Purple

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 50;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;

    // Mixed colors
    const rand = Math.random();
    let chosenColor;
    if (rand < 0.45) chosenColor = color1;
    else if (rand < 0.8) chosenColor = color3;
    else chosenColor = color2;

    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;

    velocities.push({
      x: (Math.random() - 0.5) * 0.03,
      y: (Math.random() - 0.5) * 0.03,
      z: (Math.random() - 0.5) * 0.02
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Material
  const pMaterial = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, pMaterial);
  scene.add(particleSystem);

  // Floating Icosahedrons (Educational Gem Nodes)
  const sphereGroup = new THREE.Group();
  const gemGeom = new THREE.IcosahedronGeometry(2.5, 0);
  
  for (let j = 0; j < 4; j++) {
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: j % 2 === 0 ? 0x38BDF8 : 0xFF7A00,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const mesh = new THREE.Mesh(gemGeom, wireframeMat);
    mesh.position.set(
      (Math.random() - 0.5) * 50 + (j % 2 === 0 ? 15 : -15),
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.scale.setScalar(0.7 + Math.random() * 0.6);
    sphereGroup.add(mesh);
  }
  scene.add(sphereGroup);

  // Line Mesh Connecting Nearby Nodes
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x38BDF8,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });

  const linePositions = new Float32Array(particleCount * particleCount * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineMesh);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  // Responsive Resize
  function handleResize() {
    if (!canvas) return;
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', handleResize);
  handleResize();

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleSystem.rotation.y = elapsedTime * 0.03 + targetX * 1.5;
    particleSystem.rotation.x = elapsedTime * 0.02 + targetY * 1.5;

    sphereGroup.children.forEach((gem, idx) => {
      gem.rotation.x += 0.008 * (idx + 1);
      gem.rotation.y += 0.006 * (idx + 1);
    });

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i].x;
      pos[i3 + 1] += velocities[i].y;
      pos[i3 + 2] += velocities[i].z;

      if (pos[i3] > 40 || pos[i3] < -40) velocities[i].x *= -1;
      if (pos[i3 + 1] > 25 || pos[i3 + 1] < -25) velocities[i].y *= -1;
      if (pos[i3 + 2] > 20 || pos[i3 + 2] < -20) velocities[i].z *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    // Connect Lines
    let lineIdx = 0;
    const lPos = lineGeometry.attributes.position.array;
    const connectDist = 12;

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectDist) {
          lPos[lineIdx++] = pos[i * 3];
          lPos[lineIdx++] = pos[i * 3 + 1];
          lPos[lineIdx++] = pos[i * 3 + 2];

          lPos[lineIdx++] = pos[j * 3];
          lPos[lineIdx++] = pos[j * 3 + 1];
          lPos[lineIdx++] = pos[j * 3 + 2];
        }
      }
    }
    lineGeometry.setDrawRange(0, lineIdx / 3);
    lineGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
})();
