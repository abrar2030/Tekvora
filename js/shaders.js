// Shader Definitions
const shaders = {
  // Vertex shader for particles
  particleVertex: `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  
  // Fragment shader for particles
  particleFragment: `
    varying vec3 vColor;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5, 0.5));
      if (dist > 0.5) discard;
      
      gl_FragColor = vec4(vColor, 1.0 - (dist * 2.0));
    }
  `,
  
  // Vertex shader for holographic effects
  hologramVertex: `
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      float elevation = sin(modelPosition.x * 10.0) * 0.1;
      elevation += sin(modelPosition.y * 10.0) * 0.1;
      
      modelPosition.z += elevation;
      vElevation = elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
    }
  `,
  
  // Fragment shader for holographic effects
  hologramFragment: `
    uniform vec3 uColor;
    uniform float uTime;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      float scanLine = sin(vUv.y * 100.0 + uTime) * 0.1 + 0.9;
      float edge = smoothstep(0.1, 0.2, vUv.y) * smoothstep(0.1, 0.2, 1.0 - vUv.y);
      edge *= smoothstep(0.1, 0.2, vUv.x) * smoothstep(0.1, 0.2, 1.0 - vUv.x);
      
      vec3 finalColor = uColor;
      finalColor += vElevation * 2.0;
      
      float alpha = edge * scanLine;
      alpha = clamp(alpha, 0.0, 1.0);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  
  // Vertex shader for background grid
  gridVertex: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  // Fragment shader for background grid
  gridFragment: `
    uniform vec3 uColor;
    uniform float uTime;
    uniform vec2 uResolution;
    
    varying vec2 vUv;
    
    float grid(vec2 uv, float size) {
      vec2 grid = fract(uv * size);
      return (step(0.98, grid.x) + step(0.98, grid.y)) * 0.5;
    }
    
    void main() {
      vec2 uv = vUv;
      uv.y += uTime * 0.1;
      
      float g1 = grid(uv, 10.0);
      float g2 = grid(uv, 50.0) * 0.5;
      
      float g = g1 + g2;
      
      vec3 color = uColor * g;
      
      // Add glow
      float dist = length(vUv - vec2(0.5));
      float glow = 1.0 - dist * 1.5;
      glow = max(0.0, glow);
      
      color += uColor * glow * 0.1;
      
      gl_FragColor = vec4(color, g * 0.8 + glow * 0.1);
    }
  `,
  
  // Vertex shader for 3D text
  textVertex: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  // Fragment shader for 3D text
  textFragment: `
    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      float noise = sin(vUv.y * 100.0 + uTime) * 0.05 + 0.95;
      
      vec3 color = uColor * noise;
      float alpha = texColor.a;
      
      // Add glow
      float glow = smoothstep(0.1, 0.5, texColor.a) * 0.5;
      color += uColor * glow;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
  
  // Vertex shader for skill globe
  globeVertex: `
    attribute float size;
    attribute vec3 color;
    attribute float alpha;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      vColor = color;
      vAlpha = alpha;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  
  // Fragment shader for skill globe
  globeFragment: `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5, 0.5));
      if (dist > 0.5) discard;
      
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
      gl_FragColor = vec4(vColor, alpha);
    }
  `
};

// Export the shaders
window.shaders = shaders;
