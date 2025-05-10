document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const submenuToggle = document.querySelector('.submenu-toggle');
    const menuItem = document.querySelector('.menu-item.has-submenu');
  
    // === MENU RESPONSIVO ===
    menuToggle?.addEventListener('click', () => {
      menuOverlay?.classList.toggle('active');
    });
  
    submenuToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      menuItem?.classList.toggle('active');
      const expanded = submenuToggle.getAttribute('aria-expanded') === 'true';
      submenuToggle.setAttribute('aria-expanded', (!expanded).toString());
    });
  
    document.addEventListener('click', (e) => {
      if (!menuOverlay.contains(e.target) && !menuToggle.contains(e.target)) {
        menuOverlay?.classList.remove('active');
        menuItem?.classList.remove('active');
        submenuToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  
    // === SCROLL SUAVE PELO MENU ===
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  
    // === CARROSSEL ===
    const slidesContainer = document.querySelector('.carousel__slides');
    const slides = slidesContainer?.children;
    const totalSlides = slides?.length || 0;
    let slideIndex = 0;
    const slideDelay = 2000; // 2 segundos
  
    const showSlide = (index) => {
      if (slidesContainer) {
        slidesContainer.style.transition = 'transform 0.8s ease-in-out';
        slidesContainer.style.transform = `translateX(-${index * 100}vw)`;
      }
    };
  
    const nextSlide = () => {
      slideIndex++;
      if (slideIndex >= totalSlides) {
        // Reinicia visualmente com transição suave
        slideIndex = 0;
      }
      showSlide(slideIndex);
    };
  
    let slideInterval = setInterval(nextSlide, slideDelay);
  
    // Pausar carrossel ao passar mouse
    slidesContainer?.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slidesContainer?.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, slideDelay);
    });
  });
  