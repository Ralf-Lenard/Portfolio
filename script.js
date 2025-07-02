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
let currentSection = "home"
let isMenuOpen = false

// Loading Screen
window.addEventListener("load", () => {
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden")
      isLoading = false
      initializeAnimations()
    }
  }, 3000)
})

// Custom Cursor
document.addEventListener("mousemove", (e) => {
  if (customCursor && cursorFollower) {
    customCursor.style.left = e.clientX + "px"
    customCursor.style.top = e.clientY + "px"

    setTimeout(() => {
      cursorFollower.style.left = e.clientX + "px"
      cursorFollower.style.top = e.clientY + "px"
    }, 100)
  }
})

// Cursor hover effects
document.querySelectorAll("a, button, .service-card, .project-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (customCursor && cursorFollower) {
      customCursor.style.width = "20px"
      customCursor.style.height = "20px"
      cursorFollower.style.width = "60px"
      cursorFollower.style.height = "60px"
    }
  })

  el.addEventListener("mouseleave", () => {
    if (customCursor && cursorFollower) {
      customCursor.style.width = "8px"
      customCursor.style.height = "8px"
      cursorFollower.style.width = "40px"
      cursorFollower.style.height = "40px"
    }
  })
})

// Fullscreen Menu Toggle
if (navToggle) {
  navToggle.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen
    navToggle.classList.toggle("active")
    if (fullscreenMenu) {
      fullscreenMenu.classList.toggle("active")
    }
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto"
  })
}

// Menu links
document.querySelectorAll(".menu-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href").substring(1)
    scrollToSection(targetId)
    closeMenu()
  })
})

function closeMenu() {
  isMenuOpen = false
  if (navToggle) {
    navToggle.classList.remove("active")
  }
  if (fullscreenMenu) {
    fullscreenMenu.classList.remove("active")
  }
  document.body.style.overflow = "auto"
}

// Theme Toggle
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode")
    const isLight = document.body.classList.contains("light-mode")
    localStorage.setItem("theme", isLight ? "light" : "dark")
  })
}

// Load saved theme
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "light") {
  document.body.classList.add("light-mode")
}

// Smooth Scrolling Function
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 100
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Scroll Progress and Active Navigation
function updateScrollProgress() {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100
  if (scrollProgress) {
    scrollProgress.style.width = scrollPercent + "%"
  }
}

function updateActiveSection() {
  const sections = document.querySelectorAll(".section")
  const scrollPosition = window.scrollY + 200

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = sectionId
    }
  })
}

function updateNavBackground() {
  const scrollTop = window.pageYOffset
  if (mainNav) {
    if (scrollTop > 100) {
      mainNav.classList.add("scrolled")
    } else {
      mainNav.classList.remove("scrolled")
    }
  }
}

// Event Listeners
window.addEventListener("scroll", () => {
  updateScrollProgress()
  updateActiveSection()
  updateNavBackground()
})

// Initialize Animations
function initializeAnimations() {
  // Initial reveal check
  const revealElements = document.querySelectorAll(".reveal-text, .reveal-image, .reveal-card")
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

  revealElements.forEach((el) => observer.observe(el))

  // Initialize 3D effects
  initialize3DEffects()
}

// Contact Form Handling
const contactForm = document.getElementById("contact-form")
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Simple validation
    if (name && email && message) {
      // Simulate form submission
      const submitBtn = contactForm.querySelector(".btn")
      const btnText = submitBtn.querySelector(".btn-text")
      const btnIcon = submitBtn.querySelector(".btn-icon")
      const originalText = btnText.textContent

      btnText.textContent = "Sending..."
      btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
      submitBtn.disabled = true

      setTimeout(() => {
        btnText.textContent = "Message Sent!"
        btnIcon.innerHTML = '<i class="fas fa-check"></i>'

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

// Magnetic Elements
document.querySelectorAll(".btn, .service-card, .project-card").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
  })

  el.addEventListener("mouseleave", () => {
    el.style.transform = ""
  })
})

// 3D Card Tilt Effects
function init3DCardEffects() {
  const cards = document.querySelectorAll(".service-card, .profile-card, .bio-card, .skills-card, .education-card, .project-card")

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(10px)
      `
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    })
  })
}

// Add parallax 3D scrolling effect
function init3DParallax() {
  const elements = document.querySelectorAll(".floating-cube, .floating-sphere, .floating-pyramid")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset

    elements.forEach((element, index) => {
      const speed = (index + 1) * 0.5
      const yPos = -(scrolled * speed * 0.1)
      const rotateY = scrolled * 0.1 * (index + 1)

      element.style.transform = `
        translateY(${yPos}px) 
        rotateY(${rotateY}deg) 
        rotateX(${rotateY * 0.5}deg)
      `
    })
  })
}

// Initialize 3D effects
function initialize3DEffects() {
  init3DCardEffects()
  init3DParallax()
}

// Preload Critical Resources
function preloadImages() {
  const images = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  ]

  images.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Initialize preloading
preloadImages()

// Accessibility Improvements
// Focus management for menu
document.addEventListener("keydown", (e) => {
  if (isMenuOpen && e.key === "Tab") {
    const focusableElements = fullscreenMenu.querySelectorAll("a, button")
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }
})

// Performance Optimizations
// Throttle scroll events
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

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    updateScrollProgress()
    updateActiveSection()
    updateNavBackground()
  }, 16),
)

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Hide loading screen initially
  document.body.style.overflow = "hidden"

  // Set initial styles for reveal elements
  const revealElements = document.querySelectorAll(".reveal-text, .reveal-image, .reveal-card")
  revealElements.forEach((element) => {
    element.style.transition = "all 0.8s ease"
  })

  // Set initial theme
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    document.body.classList.add("light-mode")
  }

  // Initialize scroll position
  updateScrollProgress()
  updateActiveSection()
  updateNavBackground()
})
