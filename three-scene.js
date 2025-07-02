// 3D Scene Setup - Browser Compatible Version
import * as THREE from 'three';

class ThreeScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometries = [];
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    // Check if THREE.js is loaded
    if (typeof THREE === 'undefined') {
      console.log('Three.js not loaded, skipping 3D effects');
      return;
    }

    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer setup
    const canvas = document.getElementById("three-canvas");
    if (canvas) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 0);
    }

    this.createGeometries();
    this.setupLights();
    this.setupEventListeners();
    this.animate();
  }

  createGeometries() {
    // Create floating geometric shapes
    const shapes = [
      {
        geometry: new THREE.BoxGeometry(0.5, 0.5, 0.5),
        material: new THREE.MeshPhongMaterial({
          color: 0xff3c00,
          transparent: true,
          opacity: 0.7,
          wireframe: false,
        }),
        position: { x: 2, y: 1, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      {
        geometry: new THREE.SphereGeometry(0.3, 32, 32),
        material: new THREE.MeshPhongMaterial({
          color: 0x3d5af1,
          transparent: true,
          opacity: 0.6,
          wireframe: false,
        }),
        position: { x: -2, y: -1, z: -1 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      {
        geometry: new THREE.ConeGeometry(0.3, 0.8, 8),
        material: new THREE.MeshPhongMaterial({
          color: 0x22e2ff,
          transparent: true,
          opacity: 0.5,
          wireframe: false,
        }),
        position: { x: -1, y: 2, z: -3 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      {
        geometry: new THREE.OctahedronGeometry(0.4),
        material: new THREE.MeshPhongMaterial({
          color: 0xff8e53,
          transparent: true,
          opacity: 0.6,
          wireframe: true,
        }),
        position: { x: 1.5, y: -2, z: -2.5 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      {
        geometry: new THREE.TorusGeometry(0.3, 0.1, 16, 100),
        material: new THREE.MeshPhongMaterial({
          color: 0x8c7aff,
          transparent: true,
          opacity: 0.7,
          wireframe: false,
        }),
        position: { x: -1.5, y: 0.5, z: -1.5 },
        rotation: { x: 0, y: 0, z: 0 },
      },
    ];

    shapes.forEach((shape) => {
      const mesh = new THREE.Mesh(shape.geometry, shape.material);
      mesh.position.set(shape.position.x, shape.position.y, shape.position.z);
      mesh.rotation.set(shape.rotation.x, shape.rotation.y, shape.rotation.z);
      this.scene.add(mesh);
      this.geometries.push(mesh);
    });
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Point light that follows mouse
    this.pointLight = new THREE.PointLight(0xff3c00, 1, 100);
    this.pointLight.position.set(0, 0, 2);
    this.scene.add(this.pointLight);
  }

  setupEventListeners() {
    // Mouse movement
    document.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Window resize
    window.addEventListener("resize", () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    // Scroll effect
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      this.geometries.forEach((mesh, index) => {
        mesh.rotation.y = scrollY * 0.001 * (index + 1);
        mesh.rotation.x = scrollY * 0.0005 * (index + 1);
      });
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate geometries
    this.geometries.forEach((mesh, index) => {
      mesh.rotation.x += 0.005 * (index + 1);
      mesh.rotation.y += 0.01 * (index + 1);

      // Float up and down
      mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;

      // Mouse interaction
      const mouseInfluence = 0.1;
      mesh.rotation.x += this.mouse.y * mouseInfluence * 0.01;
      mesh.rotation.y += this.mouse.x * mouseInfluence * 0.01;
    });

    // Update point light position based on mouse
    if (this.pointLight) {
      this.pointLight.position.x = this.mouse.x * 3;
      this.pointLight.position.y = this.mouse.y * 3;
    }

    // Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Initialize 3D scene when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for Three.js to load
  setTimeout(() => {
    if (typeof THREE !== "undefined") {
      new ThreeScene();
    } else {
      console.log("Three.js not loaded, skipping 3D effects");
    }
  }, 1000);
});
