// Enhanced 3D Scene with Advanced Effects
class EnhancedThreeScene {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.geometries = []
    this.mouse = { x: 0, y: 0 }
    this.raycaster = new window.THREE.Raycaster()
    this.mouseVector = new window.THREE.Vector2()
    this.init()
  }

  init() {
    if (typeof window.THREE === "undefined") {
      console.log("Three.js not loaded, skipping 3D effects")
      return
    }

    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.createGeometries()
    this.setupLights()
    this.setupPostProcessing()
    this.setupEventListeners()
    this.animate()
  }

  setupScene() {
    this.scene = new window.THREE.Scene()
    this.scene.fog = new window.THREE.Fog(0x000000, 1, 1000)
  }

  setupCamera() {
    this.camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5
  }

  setupRenderer() {
    const canvas = document.getElementById("three-canvas")
    if (!canvas) return

    this.renderer = new window.THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = window.THREE.PCFSoftShadowMap
  }

  createGeometries() {
    const shapes = [
      {
        geometry: new window.THREE.BoxGeometry(0.5, 0.5, 0.5),
        material: new window.THREE.MeshPhongMaterial({
          color: 0xff3c00,
          transparent: true,
          opacity: 0.8,
          shininess: 100,
        }),
        position: { x: 2, y: 1, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: "rotate",
      },
      {
        geometry: new window.THREE.SphereGeometry(0.3, 32, 32),
        material: new window.THREE.MeshPhongMaterial({
          color: 0x3d5af1,
          transparent: true,
          opacity: 0.7,
          shininess: 100,
        }),
        position: { x: -2, y: -1, z: -1 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: "float",
      },
      {
        geometry: new window.THREE.ConeGeometry(0.3, 0.8, 8),
        material: new window.THREE.MeshPhongMaterial({
          color: 0x22e2ff,
          transparent: true,
          opacity: 0.6,
          shininess: 100,
        }),
        position: { x: -1, y: 2, z: -3 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: "spin",
      },
      {
        geometry: new window.THREE.OctahedronGeometry(0.4),
        material: new window.THREE.MeshPhongMaterial({
          color: 0xff8e53,
          transparent: true,
          opacity: 0.7,
          wireframe: true,
        }),
        position: { x: 1.5, y: -2, z: -2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: "pulse",
      },
      {
        geometry: new window.THREE.TorusGeometry(0.3, 0.1, 16, 100),
        material: new window.THREE.MeshPhongMaterial({
          color: 0x8c7aff,
          transparent: true,
          opacity: 0.8,
          shininess: 100,
        }),
        position: { x: -1.5, y: 0.5, z: -1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        animation: "orbit",
      },
    ]

    shapes.forEach((shape, index) => {
      const mesh = new window.THREE.Mesh(shape.geometry, shape.material)
      mesh.position.set(shape.position.x, shape.position.y, shape.position.z)
      mesh.rotation.set(shape.rotation.x, shape.rotation.y, shape.rotation.z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = {
        animation: shape.animation,
        originalPosition: { ...shape.position },
        time: Math.random() * Math.PI * 2,
      }

      this.scene.add(mesh)
      this.geometries.push(mesh)
    })
  }

  setupLights() {
    // Ambient light
    const ambientLight = new window.THREE.AmbientLight(0x404040, 0.4)
    this.scene.add(ambientLight)

    // Directional light
    const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.scene.add(directionalLight)

    // Point lights
    const pointLight1 = new window.THREE.PointLight(0xff3c00, 1, 100)
    pointLight1.position.set(0, 0, 2)
    this.scene.add(pointLight1)
    this.pointLight1 = pointLight1

    const pointLight2 = new window.THREE.PointLight(0x3d5af1, 0.8, 100)
    pointLight2.position.set(-2, 2, 1)
    this.scene.add(pointLight2)

    const pointLight3 = new window.THREE.PointLight(0x22e2ff, 0.6, 100)
    pointLight3.position.set(2, -2, 1)
    this.scene.add(pointLight3)
  }

  setupPostProcessing() {
    // Add bloom effect if available
    if (typeof window.THREE.EffectComposer !== "undefined") {
      this.composer = new window.THREE.EffectComposer(this.renderer)
      const renderPass = new window.THREE.RenderPass(this.scene, this.camera)
      this.composer.addPass(renderPass)

      const bloomPass = new window.THREE.UnrealBloomPass(
        new window.THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85,
      )
      this.composer.addPass(bloomPass)
    }
  }

  setupEventListeners() {
    // Mouse movement
    document.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      this.mouseVector.x = this.mouse.x
      this.mouseVector.y = this.mouse.y
    })

    // Window resize
    window.addEventListener("resize", () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        if (this.composer) {
          this.composer.setSize(window.innerWidth, window.innerHeight)
        }
      }
    })

    // Scroll interaction
    window.addEventListener("scroll", () => {
      const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)
      if (this.camera) {
        this.camera.position.z = 5 + scrollPercent * 2
        this.camera.rotation.x = scrollPercent * 0.1
      }
    })
  }

  animate() {
    if (!this.renderer || !this.scene || !this.camera) return

    requestAnimationFrame(() => this.animate())

    const time = Date.now() * 0.001

    // Animate geometries
    this.geometries.forEach((mesh, index) => {
      const userData = mesh.userData
      const originalPos = userData.originalPosition

      switch (userData.animation) {
        case "rotate":
          mesh.rotation.x += 0.01
          mesh.rotation.y += 0.01
          mesh.rotation.z += 0.005
          break

        case "float":
          mesh.position.y = originalPos.y + Math.sin(time + userData.time) * 0.5
          mesh.rotation.y += 0.02
          break

        case "spin":
          mesh.rotation.y += 0.03
          mesh.rotation.z += 0.01
          mesh.position.x = originalPos.x + Math.cos(time + userData.time) * 0.3
          break

        case "pulse":
          const scale = 1 + Math.sin(time * 2 + userData.time) * 0.2
          mesh.scale.set(scale, scale, scale)
          mesh.rotation.x += 0.02
          mesh.rotation.y += 0.02
          break

        case "orbit":
          mesh.position.x = originalPos.x + Math.cos(time + userData.time) * 0.5
          mesh.position.z = originalPos.z + Math.sin(time + userData.time) * 0.5
          mesh.rotation.x += 0.03
          mesh.rotation.y += 0.02
          break
      }

      // Mouse interaction
      const distance = mesh.position.distanceTo(this.camera.position)
      if (distance < 10) {
        mesh.position.x += this.mouse.x * 0.01
        mesh.position.y += this.mouse.y * 0.01
      }
    })

    // Animate lights
    if (this.pointLight1) {
      this.pointLight1.position.x = Math.sin(time) * 3
      this.pointLight1.position.y = Math.cos(time * 0.7) * 2
      this.pointLight1.intensity = 0.5 + Math.sin(time * 2) * 0.3
    }

    // Camera movement based on mouse
    if (this.camera) {
      this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05
      this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.05
      this.camera.lookAt(this.scene.position)
    }

    // Render
    if (this.composer) {
      this.composer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  // Method to add interactive elements
  addInteractiveElement(geometry, material, position) {
    const mesh = new window.THREE.Mesh(geometry, material)
    mesh.position.set(position.x, position.y, position.z)
    mesh.userData = { interactive: true }
    this.scene.add(mesh)
    this.geometries.push(mesh)
    return mesh
  }

  // Method to remove elements
  removeElement(mesh) {
    this.scene.remove(mesh)
    const index = this.geometries.indexOf(mesh)
    if (index > -1) {
      this.geometries.splice(index, 1)
    }
  }

  // Method to update colors based on theme
  updateTheme(isDark) {
    this.geometries.forEach((mesh) => {
      if (mesh.material) {
        mesh.material.opacity = isDark ? 0.8 : 0.6
      }
    })
  }
}

// Initialize the 3D scene when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.THREE !== "undefined") {
    window.threeScene = new EnhancedThreeScene()

    // Listen for theme changes
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("light-mode")
        if (window.threeScene) {
          window.threeScene.updateTheme(isDark)
        }
      })
    }
  }
})

// Export for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = EnhancedThreeScene
}
