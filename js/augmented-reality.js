// Augmented Reality Features
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AR capabilities if supported
  initARCapabilities();
  
  // Initialize holographic projections
  initHolographicProjections();
  
  // Initialize predictive UI
  initPredictiveUI();
});

// Initialize AR capabilities
function initARCapabilities() {
  const arViewButton = document.getElementById('ar-view-button');
  
  if (!arViewButton) return;
  
  // Check if WebXR is supported
  if ('xr' in navigator) {
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      if (supported) {
        arViewButton.classList.remove('hidden');
        arViewButton.addEventListener('click', startARSession);
      } else {
        console.log('AR not supported on this device');
        // Create fallback experience
        initARFallbackExperience();
      }
    });
  } else {
    console.log('WebXR not supported on this browser');
    // Create fallback experience
    initARFallbackExperience();
  }
}

// Start AR session
function startARSession() {
  if (!navigator.xr) return;
  
  // Request AR session
  navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test']
  }).then((session) => {
    // AR session started
    session.addEventListener('end', () => {
      // AR session ended
      console.log('AR session ended');
    });
    
    // Initialize AR scene
    initARScene(session);
  }).catch((error) => {
    console.error('Error starting AR session:', error);
    // Show error message to user
    showARErrorMessage();
  });
}

// Initialize AR scene
function initARScene(session) {
  // Create WebXR compatible Three.js scene
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { xrCompatible: true });
  
  // Initialize Three.js renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: gl,
    alpha: true
  });
  
  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  
  // Create AR content
  createARContent(scene);
  
  // Set up reference space
  session.requestReferenceSpace('local').then((referenceSpace) => {
    // Set up animation loop
    renderer.setAnimationLoop((timestamp, frame) => {
      if (!frame) return;
      
      // Update camera based on XR view
      const viewerPose = frame.getViewerPose(referenceSpace);
      if (viewerPose) {
        const view = viewerPose.views[0];
        const viewport = session.renderState.baseLayer.getViewport(view);
        
        renderer.setSize(viewport.width, viewport.height);
        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);
        
        // Render scene
        renderer.render(scene, camera);
      }
    });
  });
}

// Create AR content
function createARContent(scene) {
  // Create holographic resume elements
  
  // Profile hologram
  const profileGeometry = new THREE.CircleGeometry(0.1, 32);
  const profileMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x00f6ff) },
      uTime: { value: 0.0 }
    },
    vertexShader: window.shaders.hologramVertex,
    fragmentShader: window.shaders.hologramFragment,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  const profile = new THREE.Mesh(profileGeometry, profileMaterial);
  profile.position.set(0, 0, -0.5);
  scene.add(profile);
  
  // Skills visualization
  const skillsGeometry = new THREE.TorusGeometry(0.15, 0.02, 16, 100);
  const skillsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xff36ab) },
      uTime: { value: 0.0 }
    },
    vertexShader: window.shaders.hologramVertex,
    fragmentShader: window.shaders.hologramFragment,
    transparent: true,
    wireframe: true
  });
  
  const skills = new THREE.Mesh(skillsGeometry, skillsMaterial);
  skills.position.set(0.3, 0, -0.5);
  skills.rotation.x = Math.PI / 2;
  scene.add(skills);
  
  // Experience timeline
  const timelineGeometry = new THREE.BoxGeometry(0.5, 0.01, 0.01);
  const timelineMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f6ff,
    transparent: true,
    opacity: 0.7
  });
  
  const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
  timeline.position.set(-0.3, 0, -0.5);
  scene.add(timeline);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add point light
  const pointLight = new THREE.PointLight(0x00f6ff, 1, 1);
  pointLight.position.set(0, 0.2, -0.3);
  scene.add(pointLight);
  
  // Animation
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Animate profile
    profile.rotation.y = elapsedTime * 0.5;
    
    // Animate skills
    skills.rotation.z = elapsedTime * 0.3;
    
    // Update shader uniforms
    if (profileMaterial.uniforms) {
      profileMaterial.uniforms.uTime.value = elapsedTime;
    }
    
    if (skillsMaterial.uniforms) {
      skillsMaterial.uniforms.uTime.value = elapsedTime;
    }
  }
  
  animate();
}

// Initialize AR fallback experience
function initARFallbackExperience() {
  const arFallbackButton = document.getElementById('ar-fallback-button');
  
  if (!arFallbackButton) return;
  
  arFallbackButton.classList.remove('hidden');
  arFallbackButton.addEventListener('click', () => {
    // Show 3D model in a modal instead of AR
    showFallback3DExperience();
  });
}

// Show AR error message
function showARErrorMessage() {
  const arErrorMessage = document.createElement('div');
  arErrorMessage.className = 'ar-error-message';
  arErrorMessage.innerHTML = `
    <div class="error-content">
      <h3>AR Not Available</h3>
      <p>Augmented Reality is not available on your device or browser. Try using a compatible device with ARCore or ARKit support.</p>
      <button class="close-error">Close</button>
    </div>
  `;
  
  document.body.appendChild(arErrorMessage);
  
  // Close error message
  arErrorMessage.querySelector('.close-error').addEventListener('click', () => {
    document.body.removeChild(arErrorMessage);
  });
}

// Show fallback 3D experience
function showFallback3DExperience() {
  const fallbackModal = document.createElement('div');
  fallbackModal.className = 'fallback-modal';
  fallbackModal.innerHTML = `
    <div class="fallback-content">
      <div class="fallback-header">
        <h3>3D Resume Experience</h3>
        <button class="close-fallback">&times;</button>
      </div>
      <div class="fallback-body">
        <div id="fallback-3d-container"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(fallbackModal);
  
  // Close fallback modal
  fallbackModal.querySelector('.close-fallback').addEventListener('click', () => {
    document.body.removeChild(fallbackModal);
  });
  
  // Initialize 3D scene in fallback container
  initFallback3DScene();
}

// Initialize fallback 3D scene
function initFallback3DScene() {
  const container = document.getElementById('fallback-3d-container');
  if (!container) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5;
  
  // Create 3D resume elements (similar to AR content but adapted for screen viewing)
  
  // Profile hologram
  const profileGeometry = new THREE.CircleGeometry(1, 32);
  const profileMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x00f6ff) },
      uTime: { value: 0.0 }
    },
    vertexShader: window.shaders.hologramVertex,
    fragmentShader: window.shaders.hologramFragment,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  const profile = new THREE.Mesh(profileGeometry, profileMaterial);
  profile.position.set(-2, 0, 0);
  scene.add(profile);
  
  // Skills visualization
  const skillsGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
  const skillsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xff36ab) },
      uTime: { value: 0.0 }
    },
    vertexShader: window.shaders.hologramVertex,
    fragmentShader: window.shaders.hologramFragment,
    transparent: true,
    wireframe: true
  });
  
  const skills = new THREE.Mesh(skillsGeometry, skillsMaterial);
  skills.position.set(2, 0, 0);
  skills.rotation.x = Math.PI / 2;
  scene.add(skills);
  
  // Experience timeline
  const timelineGeometry = new THREE.BoxGeometry(5, 0.1, 0.1);
  const timelineMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f6ff,
    transparent: true,
    opacity: 0.7
  });
  
  const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
  timeline.position.set(0, -2, 0);
  scene.add(timeline);
  
  // Add experience nodes to timeline
  const node1Geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const node1Material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x00f6ff) },
      uTime: { value: 0.0 }
    },
    vertexShader: window.shaders.hologramVertex,
    fragmentShader: window.shaders.hologramFragment,
    transparent: true
  });
  
  const node1 = new THREE.Mesh(node1Geometry, node1Material);
  node1.position.set(-1.5, -2, 0);
  scene.add(node1);
  
  const node2Geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const node2Material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xff36ab) },
      uTime: { value: 0.0 }
    },
    vertexShader: window.shaders.hologramVertex,
    fragmentShader: window.shaders.hologramFragment,
    transparent: true
  });
  
  const node2 = new THREE.Mesh(node2Geometry, node2Material);
  node2.position.set(1.5, -2, 0);
  scene.add(node2);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add point light
  const pointLight = new THREE.PointLight(0x00f6ff, 1, 10);
  pointLight.position.set(0, 2, 5);
  scene.add(pointLight);
  
  // Animation
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate elements
    profile.rotation.y = elapsedTime * 0.5;
    skills.rotation.z = elapsedTime * 0.3;
    
    // Animate nodes
    node1.position.y = -2 + Math.sin(elapsedTime) * 0.1;
    node2.position.y = -2 + Math.sin(elapsedTime + Math.PI) * 0.1;
    
    // Update shader uniforms
    scene.traverse((child) => {
      if (child.material && child.material.uniforms && child.material.uniforms.uTime) {
        child.material.uniforms.uTime.value = elapsedTime;
      }
    });
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Make scene interactive
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };
  
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
  });
  
  container.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
      
      scene.rotation.y += deltaMove.x * 0.01;
      scene.rotation.x += deltaMove.y * 0.01;
    }
    
    previousMousePosition = {
      x: e.offsetX,
      y: e.offsetY
    };
  });
  
  container.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  container.addEventListener('mouseleave', () => {
    isDragging = false;
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Initialize holographic projections
function initHolographicProjections() {
  const hologramContainers = document.querySelectorAll('.hologram-container');
  
  hologramContainers.forEach(container => {
    const hologramType = container.getAttribute('data-hologram');
    
    switch (hologramType) {
      case 'profile':
        createProfileHologram(container);
        break;
      case 'skills':
        createSkillsHologram(container);
        break;
      case 'projects':
        createProjectsHologram(container);
        break;
      case 'experience':
        createExperienceHologram(container);
        break;
    }
  });
}

// Create profile hologram
function createProfileHologram(container) {
  if (!container) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5;
  
  // Create profile hologram
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x00f6ff) },
      uTime: { value: 0.0 }
    },
    vertexShader: window.shaders.hologramVertex,
    fragmentShader: window.shaders.hologramFragment,
    transparent: true,
    wireframe: true
  });
  
  const hologram = new THREE.Mesh(geometry, material);
  scene.add(hologram);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add point light
  const pointLight = new THREE.PointLight(0x00f6ff, 1, 10);
  pointLight.position.set(2, 2, 2);
  scene.add(pointLight);
  
  // Animation
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate hologram
    hologram.rotation.y = elapsedTime * 0.3;
    hologram.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;
    
    // Update shader uniforms
    if (material.uniforms) {
      material.uniforms.uTime.value = elapsedTime;
    }
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Create skills hologram
function createSkillsHologram(container) {
  if (!container) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5;
  
  // Create skills hologram
  const particleCount = 100;
  const particles = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const alphas = new Float32Array(particleCount);
  
  // Distribute particles in a sphere
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    
   
(Content truncated due to size limit. Use line ranges to read in chunks)