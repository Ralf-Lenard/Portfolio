// Enhanced Portfolio Script with Advanced Animations
const gsap = window.gsap // Declare gsap variable
const ScrollTrigger = window.ScrollTrigger // Declare ScrollTrigger variable
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// DOM Elements
const loadingScreen = document.getElementById("loading-screen")
const themeToggle = document.getElementById("theme-toggle")
const navToggle = document.getElementById("nav-toggle")
const fullscreenMenu = document.getElementById("fullscreen-menu")
const customCursor = document.querySelector(".custom-cursor")
const cursorFollower = document.querySelector(".cursor-follower")
const mainNav = document.querySelector(".main-nav")
const scrollProgress = document.querySelector(".scroll-progress")

// Global Variables
let isLoading = true
const currentSection = "home"
let isMenuOpen = false
let mouseX = 0
let mouseY = 0

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeParticles()
  initializeLoadingScreen()
  initializeCursor()
  initializeNavigation()
  initializeScrollAnimations()
  initializeMagneticElements()
  initializeTypewriter()
  initializeCounters()
  initializeTheme()
  initializeScrollProgress()
})

// ===== PARTICLE BACKGROUND =====
function initializeParticles() {
  const canvas = document.getElementById("particle-canvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  let particles = []

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? "#ff3c00" : "#3d5af1",
    }
  }

  function initParticles() {
    particles = []
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }
  }

  function updateParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      // Mouse interaction
      const dx = mouseX - particle.x
      const dy = mouseY - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        particle.x -= dx * 0.01
        particle.y -= dy * 0.01
      }
    })
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle =
        particle.color +
        Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")
      ctx.fill()

      // Draw connections
      particles.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.strokeStyle = `rgba(255, 60, 0, ${0.1 * (1 - distance / 100)})`
          ctx.stroke()
        }
      })
    })
  }

  function animate() {
    updateParticles()
    drawParticles()
    requestAnimationFrame(animate)
  }

  resizeCanvas()
  initParticles()
  animate()

  window.addEventListener("resize", () => {
    resizeCanvas()
    initParticles()
  })
}

// ===== ENHANCED LOADING SCREEN =====
function initializeLoadingScreen() {
  let progress = 0
  const progressBar = document.querySelector(".loading-progress")
  const percentage = document.querySelector(".loading-percentage")

  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress > 100) progress = 100

    if (progressBar) progressBar.style.width = progress + "%"
    if (percentage) percentage.textContent = Math.floor(progress) + "%"

    if (progress >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add("hidden")
          isLoading = false
          document.body.style.overflow = "auto"
          initializeRevealAnimations()
        }
      }, 500)
    }
  }, 100)
}

// ===== ENHANCED CURSOR =====
function initializeCursor() {
  if (!customCursor || !cursorFollower) return

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    customCursor.style.left = e.clientX + "px"
    customCursor.style.top = e.clientY + "px"

    setTimeout(() => {
      cursorFollower.style.left = e.clientX + "px"
      cursorFollower.style.top = e.clientY + "px"
    }, 100)
  })

  // Enhanced cursor effects
  const interactiveElements = document.querySelectorAll("a, button, .tilt-card, .magnetic")

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      customCursor.style.width = "20px"
      customCursor.style.height = "20px"
      cursorFollower.style.width = "60px"
      cursorFollower.style.height = "60px"
      cursorFollower.style.borderColor = "#ff3c00"
    })

    el.addEventListener("mouseleave", () => {
      customCursor.style.width = "8px"
      customCursor.style.height = "8px"
      cursorFollower.style.width = "40px"
      cursorFollower.style.height = "40px"
      cursorFollower.style.borderColor = "#ff3c00"
    })
  })
}

// ===== ENHANCED NAVIGATION =====
function initializeNavigation() {
  // Smooth scrolling for all navigation links
  const navLinks = document.querySelectorAll('.nav-link, .footer-links a, a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const href = link.getAttribute("href")
      if (!href || href === "#") return

      const targetId = href.substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        // Calculate offset for fixed header
        const headerHeight = 100
        const targetPosition = targetSection.offsetTop - headerHeight

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Update active nav link
        updateActiveNavLink(targetId)
      }
    })
  })

  // Mobile menu toggle (for responsive)
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen
      navToggle.classList.toggle("active")
      // Add mobile menu functionality here if needed
    })
  }

  // Scroll effects
  window.addEventListener(
    "scroll",
    throttle(() => {
      updateNavBackground()
      updateActiveNavLinkOnScroll()
      updateScrollProgress()
    }, 16),
  )
}

function updateActiveNavLink(targetId) {
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${targetId}`) {
      link.classList.add("active")
    }
  })
}

function updateActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll(".section")
  const navLinks = document.querySelectorAll(".nav-link")

  let currentSection = ""
  const scrollPosition = window.pageYOffset + 150

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })
}

function updateNavBackground() {
  const scrollTop = window.pageYOffset
  if (mainNav) {
    if (scrollTop > 50) {
      mainNav.classList.add("scrolled")
    } else {
      mainNav.classList.remove("scrolled")
    }
  }
}

// ===== SCROLL PROGRESS =====
function initializeScrollProgress() {
  window.addEventListener("scroll", updateScrollProgress)
}

function updateScrollProgress() {
  const scrollTop = window.pageYOffset
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100
  if (scrollProgress) {
    scrollProgress.style.width = Math.min(scrollPercentage, 100) + "%"
  }
}

// ===== SCROLL ANIMATIONS WITH GSAP =====
function initializeScrollAnimations() {
  // Reveal animations
  gsap.utils.toArray(".reveal-text").forEach((element, index) => {
    gsap.fromTo(
      element,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    )
  })

  // Card animations
  gsap.utils.toArray(".reveal-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 80, opacity: 0, rotationX: 45 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.2,
        delay: index * 0.2,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      },
    )
  })

  // Timeline animations
  gsap.utils.toArray(".timeline-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.3,
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    )
  })

  // Parallax effects
  gsap.utils.toArray(".floating-shape").forEach((shape) => {
    gsap.to(shape, {
      y: -100,
      rotation: 360,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: shape,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
  })

  // Section number animations
  gsap.utils.toArray(".section-number").forEach((number) => {
    gsap.fromTo(
      number,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 0.1,
        duration: 1,
        scrollTrigger: {
          trigger: number.parentElement,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )
  })
}

// ===== MAGNETIC ELEMENTS =====
function initializeMagneticElements() {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      })
    })

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      })
    })
  })
}

// ===== TYPEWRITER EFFECT =====
function initializeTypewriter() {
  const typewriterElements = document.querySelectorAll(".typewriter")

  typewriterElements.forEach((element) => {
    const text = element.getAttribute("data-text") || element.textContent
    element.textContent = ""

    let i = 0
    const timer = setInterval(() => {
      element.textContent += text.charAt(i)
      i++
      if (i > text.length) {
        clearInterval(timer)
        element.style.borderRight = "none"
      }
    }, 100)
  })
}

// ===== SPLIT TEXT ANIMATION =====
function initializeSplitText() {
  document.querySelectorAll(".split-text").forEach((element) => {
    const text = element.textContent
    element.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span style="display: inline-block; opacity: 0; transform: translateY(50px);">${char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("")

    const chars = element.querySelectorAll("span")

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.05,
          stagger: 0.02,
          ease: "back.out(1.7)",
        })
      },
    })
  })
}

// ===== COUNTER ANIMATIONS =====
function initializeCounters() {
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))

    ScrollTrigger.create({
      trigger: counter,
      start: "top 80%",
      onEnter: () => {
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          onUpdate: () => {
            counter.innerHTML = Math.ceil(counter.innerHTML)
          },
        })
      },
    })
  })
}

// ===== THEME TOGGLE =====
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    document.body.classList.add("light-mode")
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode")
      const isLight = document.body.classList.contains("light-mode")
      localStorage.setItem("theme", isLight ? "light" : "dark")

      // Animate theme transition
      gsap.to(document.body, {
        duration: 0.5,
        ease: "power2.inOut",
      })

      // Update 3D scene theme if available
      if (window.threeScene) {
        window.threeScene.updateTheme(!isLight)
      }
    })
  }
}

// ===== REVEAL ANIMATIONS =====
function initializeRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0
          setTimeout(() => {
            entry.target.classList.add("revealed")
          }, delay)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  document.querySelectorAll(".reveal-text, .reveal-image, .reveal-card, .reveal-timeline").forEach((el) => {
    observer.observe(el)
  })
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contact-form")
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const name = formData.get("name")
    const email = formData.get("email")
    const message = formData.get("message")

    if (name && email && message) {
      const submitBtn = contactForm.querySelector(".btn")
      const btnText = submitBtn.querySelector(".btn-text")
      const btnIcon = submitBtn.querySelector(".btn-icon")
      const originalText = btnText.textContent

      // Animate button
      gsap.to(submitBtn, { scale: 0.95, duration: 0.1 })
      btnText.textContent = "Sending..."
      btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
      submitBtn.disabled = true

      setTimeout(() => {
        btnText.textContent = "Message Sent!"
        btnIcon.innerHTML = '<i class="fas fa-check"></i>'
        gsap.to(submitBtn, { scale: 1, duration: 0.3, ease: "back.out(1.7)" })

        setTimeout(() => {
          btnText.textContent = originalText
          btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>'
          submitBtn.disabled = false
          contactForm.reset()

          // Reset form labels
          contactForm.querySelectorAll("label").forEach((label) => {
            label.style.transform = ""
            label.style.fontSize = ""
            label.style.color = ""
          })
        }, 2000)
      }, 1500)
    }
  })
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// ===== 3D TILT EFFECTS =====
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    })
  })

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    })
  })
})

// Initialize split text after DOM load
setTimeout(() => {
  initializeSplitText()
}, 1000)
