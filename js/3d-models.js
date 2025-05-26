// 3D Models and WebGL Components
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Three.js scene for background
  initBackgroundScene();
  
  // Initialize 3D models when sections are in view
  initSectionObservers();
});

// Global Three.js variables
let renderer, scene, camera, clock;
let particles, particleSystem;

// Initialize the background WebGL scene
function initBackgroundScene() {
  // Create scene, camera and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('webgl-container').appendChild(renderer.domElement);
  
  // Initialize clock for animations
  clock = new THREE.Clock();
  
  // Create particle system for background
  createParticleSystem();
  
  // Add grid
  createGrid();
  
  // Position camera
  camera.position.z = 30;
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
}

// Create particle system for background
function createParticleSystem() {
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  const color = new THREE.Color();
  
  for (let i = 0; i < particleCount; i++) {
    // Position
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    
    // Color - use the holographic gradient colors
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      color.setStyle('#00f6ff'); // Cyan
    } else if (colorChoice < 0.66) {
      color.setStyle('#ff36ab'); // Magenta
    } else {
      color.setStyle('#4d5eff'); // Blue
    }
    
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    // Size
    sizes[i] = Math.random() * 2 + 0.5;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create shader material using our custom shaders
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 }
    },
    vertexShader: window.shaders.particleVertex,
    fragmentShader: window.shaders.particleFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  // Create the particle system
  particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);
}

// Create grid for background
function createGrid() {
  const gridGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
  const gridMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x00f6ff) },
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: window.shaders.gridVertex,
    fragmentShader: window.shaders.gridFragment,
    transparent: true,
    depthWrite: false
  });
  
  const grid = new THREE.Mesh(gridGeometry, gridMaterial);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -30;
  scene.add(grid);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  
  // Rotate particle system
  if (particleSystem) {
    particleSystem.rotation.y = elapsedTime * 0.05;
    
    // Update particle positions for floating effect
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(elapsedTime + positions[i] * 0.1) * 0.01;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
  }
  
  // Update all shader uniforms
  scene.traverse((child) => {
    if (child.material && child.material.uniforms && child.material.uniforms.uTime) {
      child.material.uniforms.uTime.value = elapsedTime;
    }
  });
  
  renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Update resolution uniform for shaders
  scene.traverse((child) => {
    if (child.material && child.material.uniforms && child.material.uniforms.uResolution) {
      child.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }
  });
}

// Initialize Intersection Observers for sections
function initSectionObservers() {
  const sections = document.querySelectorAll('section');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        
        // Initialize 3D elements for specific sections
        switch(sectionId) {
          case 'about':
            initAbout3D();
            break;
          case 'skills':
            initSkillsGlobe();
            break;
          case 'experience':
            initExperienceTimeline();
            break;
          case 'education':
            initEducation3D();
            break;
          case 'ai-assistant':
            initAIModel();
            break;
        }
        
        // Add active class for animations
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.2 });
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

// Initialize 3D avatar for About section
function initAbout3D() {
  const container = document.getElementById('avatar-container');
  if (!container || container.querySelector('canvas')) return;
  
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
  
  // Create geometric avatar
  const geometry = new THREE.IcosahedronGeometry(1, 1);
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
  
  const avatar = new THREE.Mesh(geometry, material);
  scene.add(avatar);
  
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
    
    // Rotate avatar
    avatar.rotation.y = elapsedTime * 0.5;
    avatar.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
    
    // Update shader uniforms
    material.uniforms.uTime.value = elapsedTime;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Add controls
  document.getElementById('rotate-model').addEventListener('click', () => {
    gsap.to(avatar.rotation, {
      y: avatar.rotation.y + Math.PI * 2,
      duration: 2,
      ease: 'power2.inOut'
    });
  });
  
  document.getElementById('zoom-model').addEventListener('click', () => {
    gsap.to(camera.position, {
      z: camera.position.z > 3 ? 2 : 5,
      duration: 1,
      ease: 'power2.inOut'
    });
  });
}

// Initialize 3D Skills Globe
function initSkillsGlobe() {
  const container = document.getElementById('skills-globe');
  if (!container || container.querySelector('canvas')) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 15;
  
  // Skills data
  const skills = [
    { name: 'Java', category: 'programming', level: 0.9, color: '#00f6ff' },
    { name: 'Python', category: 'programming', level: 0.85, color: '#00f6ff' },
    { name: 'JavaScript', category: 'programming', level: 0.8, color: '#00f6ff' },
    { name: 'TypeScript', category: 'programming', level: 0.75, color: '#00f6ff' },
    { name: 'C#', category: 'programming', level: 0.7, color: '#00f6ff' },
    { name: 'Docker', category: 'devops', level: 0.9, color: '#ff36ab' },
    { name: 'Kubernetes', category: 'devops', level: 0.85, color: '#ff36ab' },
    { name: 'Jenkins', category: 'devops', level: 0.8, color: '#ff36ab' },
    { name: 'Terraform', category: 'devops', level: 0.8, color: '#ff36ab' },
    { name: 'AWS', category: 'devops', level: 0.75, color: '#ff36ab' },
    { name: 'GCP', category: 'devops', level: 0.7, color: '#ff36ab' },
    { name: 'Spring Boot', category: 'frameworks', level: 0.85, color: '#4d5eff' },
    { name: 'React', category: 'frameworks', level: 0.8, color: '#4d5eff' },
    { name: 'Node.js', category: 'frameworks', level: 0.75, color: '#4d5eff' },
    { name: 'Angular', category: 'frameworks', level: 0.7, color: '#4d5eff' },
    { name: 'PostgreSQL', category: 'databases', level: 0.85, color: '#b967ff' },
    { name: 'MongoDB', category: 'databases', level: 0.8, color: '#b967ff' },
    { name: 'MySQL', category: 'databases', level: 0.75, color: '#b967ff' }
  ];
  
  // Create particles for skills
  const particleCount = skills.length;
  const particles = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const alphas = new Float32Array(particleCount);
  
  // Distribute skills in a sphere
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    
    const radius = 5 + skills[i].level * 2;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Set color based on skill category
    const color = new THREE.Color(skills[i].color);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    // Size based on skill level
    sizes[i] = skills[i].level * 5 + 2;
    
    // Alpha
    alphas[i] = 0.7 + skills[i].level * 0.3;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  particles.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  
  // Create shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 }
    },
    vertexShader: window.shaders.globeVertex,
    fragmentShader: window.shaders.globeFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  // Create the particle system
  const skillsParticles = new THREE.Points(particles, material);
  scene.add(skillsParticles);
  
  // Add connections between related skills
  const connections = [];
  
  for (let i = 0; i < skills.length; i++) {
    for (let j = i + 1; j < skills.length; j++) {
      if (skills[i].category === skills[j].category) {
        const startPos = new THREE.Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        
        const endPos = new THREE.Vector3(
          positions[j * 3],
          positions[j * 3 + 1],
          positions[j * 3 + 2]
        );
        
        const distance = startPos.distanceTo(endPos);
        
        // Only connect if they're close enough
        if (distance < 8) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(skills[i].color),
            transparent: true,
            opacity: 0.3
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
          connections.push(line);
        }
      }
    }
  }
  
  // Add text labels for skills
  const textLabels = [];
  const fontLoader = new THREE.FontLoader();
  
  // Animation
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate skills globe
    skillsParticles.rotation.y = elapsedTime * 0.1;
    
    // Rotate connections
    connections.forEach(line => {
      line.rotation.y = elapsedTime * 0.1;
    });
    
    // Update text labels
    textLabels.forEach(label => {
      label.rotation.y = elapsedTime * 0.1;
    });
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Make the globe interactive
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
      
      skillsParticles.rotation.y += deltaMove.x * 0.01;
      skillsParticles.rotation.x += deltaMove.y * 0.01;
      
      connections.forEach(line => {
        line.rotation.y += deltaMove.x * 0.01;
        line.rotation.x += deltaMove.y * 0.01;
      });
      
      textLabels.forEach(label => {
        label.rotation.y += deltaMove.x * 0.01;
        label.rotation.x += deltaMove.y * 0.01;
      });
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
}

// Initialize 3D Experience Timeline
function initExperienceTimeline() {
  const container = document.getElementById('experience-timeline');
  if (!container || container.querySelector('canvas')) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 10;
  camera.position.y = 2;
  
  // Experience data
  const experiences = [
    { 
      company: 'Ericsson', 
      role: 'Software Developer', 
      period: 'Aug 2023 - Oct 2024',
      position: -5
    },
    { 
      company: 'Eötvös Loránd University', 
      role: 'Teaching Assistant', 
      period: 'Feb 2025 - Present',
      position: 5
    }
  ];
  
  // Create timeline
  const timelineGeometry = new THREE.BoxGeometry(1
(Content truncated due to size limit. Use line ranges to read in chunks)