document.addEventListener('DOMContentLoaded', () => {

  /* ==================== PRELOADER ==================== */
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';

        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }
    }, 2500);
  });

  /* ==================== MOBILE MENU (ULTIMATE FIX) ==================== */
  const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
  const navbar = document.querySelector('.navbar');
  const iconElement = mobileMenuIcon ? mobileMenuIcon.querySelector('i') : null;

  if (mobileMenuIcon && navbar && iconElement) {
    mobileMenuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        
        // Toggle the icon for visual feedback
        if (navbar.classList.contains('active')) {
            iconElement.classList.remove('fa-bars');
            iconElement.classList.add('fa-times');
        } else {
            iconElement.classList.remove('fa-times');
            iconElement.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when a standard link is clicked
    document.querySelectorAll('.navbar .nav-list > li > a:not(.dropdown > a)').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                iconElement.classList.remove('fa-times');
                iconElement.classList.add('fa-bars');
            }
        });
    });
  }

  /* ==================== MOBILE DROPDOWN TOGGLE FIX (NEW LOGIC) ==================== */
  document.querySelectorAll('.navbar .dropdown > a').forEach(dropdownLink => {
      dropdownLink.addEventListener('click', function(e) {
          // Assuming mobile breakpoint is 992px or less (based on common design practices)
          if (window.innerWidth <= 992) {
              
              // 1. Prevent default navigation (THIS STOPS PAGE RELOAD)
              e.preventDefault();
  
              const dropdownMenu = this.nextElementSibling;
              
              if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                  
                  // 2. Close any other open dropdowns first
                  document.querySelectorAll('.navbar .dropdown-menu').forEach(menu => {
                      if (menu !== dropdownMenu) {
                           menu.classList.remove('visible-on-mobile');
                      }
                  });
                  
                  // 3. Toggle the visibility class for the clicked dropdown
                  dropdownMenu.classList.toggle('visible-on-mobile');
              }
          }
      });
  });
  // NOTE: You must also add the necessary CSS (visible-on-mobile) to your stylesheet 
  // for this dropdown to display correctly on mobile screens.


  /* ==================== HERO VIDEO SLIDER ==================== */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
      const videos = document.querySelectorAll('.slider-video');
      const contents = document.querySelectorAll('.hero-content');
      const dots = document.querySelectorAll('.dot');
    
      let currentSlide = 0;
      let sliderTimer;
    
      function showSlide(index) {
        videos.forEach((video, i) => {
          video.classList.toggle('active', i === index);
          video.pause();
        });
    
        contents.forEach((content, i) => {
          content.classList.toggle('active', i === index);
        });
    
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
    
        videos[index].currentTime = 0;
        videos[index].play().catch(() => {});
        currentSlide = index;
      }
    
      function nextSlide() {
        let next = (currentSlide + 1) % videos.length;
        showSlide(next);
      }
    
      function startSlider() {
        sliderTimer = setInterval(nextSlide, 8000);
      }
    
      function resetSlider() {
        clearInterval(sliderTimer);
        startSlider();
      }
    
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const slideIndex = parseInt(dot.dataset.slide);
          showSlide(slideIndex);
          resetSlider();
        });
      });
    
      if (videos.length > 0) {
        showSlide(0);
        startSlider();
      }
  }


  /* ==================== SCROLL REVEAL (Improved Intersection Observer) ==================== */
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null, 
    rootMargin: '0px',
    threshold: 0.1 
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        setTimeout(() => {
          entry.target.classList.add('active');
        }, delay);
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    if (!el.classList.contains('active')) {
        scrollObserver.observe(el);
    }
  });


  /* ==================== ACTIVE NAV LINK (Cleanup) ==================== */
  const navLinks = document.querySelectorAll('.nav-list a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html'; 

  // Reset all active classes first (important for multi-page behavior)
  navLinks.forEach(link => {
      link.classList.remove('active');
      const linkHref = link.getAttribute('href').split('/').pop() || 'index.html';
      
      if (linkHref === currentPath) {
        link.classList.add('active');
      }
      
      // Handle parent dropdown active class if a sub-link is active
      if (link.parentElement.classList.contains('dropdown')) {
          const subLinks = link.parentElement.querySelectorAll('.dropdown-menu a');
          subLinks.forEach(subLink => {
              const subLinkHref = subLink.getAttribute('href').split('/').pop();
              if (subLinkHref === currentPath) {
                  link.classList.add('active'); // Activate the parent link
              }
          });
      }
  });
  
  
  /* ==================== STATS LOOP COUNTER LOGIC (Happy Client) ==================== */
    const statsSection = document.querySelector('.stats');
    
    const startCounter = (counter) => {
        const max = +counter.dataset.max;
        let count = 0;
        const increment = Math.ceil(max / 80); 

        const interval = setInterval(() => {
            count += increment;
            if (count >= max) {
                count = max;
                clearInterval(interval);
            }
            counter.innerText = count.toLocaleString('en-IN'); 
        }, 50);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.dataset.counted !== 'true') { 
                entry.target.querySelectorAll('.loop-count').forEach(counter => {
                    startCounter(counter);
                });
                entry.target.dataset.counted = 'true';
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.8 }); 

    if (statsSection) {
        statsSection.dataset.counted = 'false';
        counterObserver.observe(statsSection); 
    }
    
    
    /* ==================== SPECIAL BOOKING SLIDER JS (Smooth Scroll) ==================== */
    const slider = document.querySelector('.booking-slider');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    if (slider && prevBtn && nextBtn) {
        
        let autoSlideInterval;
        const slideIntervalTime = 4000;
        
        const scrollSlider = (direction) => {
            const firstCard = slider.querySelector('.slider-card');
            if (!firstCard) return; 
            
            const cardWidth = firstCard.offsetWidth;
            const gap = 25; 
            const scrollDistance = cardWidth + gap; 

            if (direction === 'next') {
                slider.scrollBy({
                    left: scrollDistance,
                    behavior: 'smooth'
                });
            } else {
                slider.scrollBy({
                    left: -scrollDistance,
                    behavior: 'smooth'
                });
            }
            resetInterval();
        };
        
        const checkArrowsVisibility = () => {
            if (!slider || !prevBtn || !nextBtn) return;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            
            if (maxScroll <= 5) { 
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                clearInterval(autoSlideInterval); 
                autoSlideInterval = null;
            } else {
                 prevBtn.style.display = 'block';
                 nextBtn.style.display = 'block';
                 if (!autoSlideInterval) startAutoSlide();
            }
        };

        const startAutoSlide = () => {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            
            autoSlideInterval = setInterval(() => {
                const isNearEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;
                
                if (isNearEnd) {
                    slider.style.scrollBehavior = 'auto';
                    slider.scrollLeft = 0;
                    
                    setTimeout(() => {
                        slider.style.scrollBehavior = 'smooth';
                        scrollSlider('next');
                    }, 50);
                } else {
                    scrollSlider('next');
                }
            }, slideIntervalTime);
        };
        
        const resetInterval = () => {
            clearInterval(autoSlideInterval);
            // Ensure auto slide restarts only if it was supposed to run (i.e., not disabled by checkArrowsVisibility)
            if (slider.scrollWidth > slider.clientWidth) {
                 startAutoSlide();
            }
        };


        nextBtn.addEventListener('click', () => scrollSlider('next'));
        prevBtn.addEventListener('click', () => scrollSlider('prev'));
        
        window.addEventListener('load', checkArrowsVisibility);
        window.addEventListener('resize', checkArrowsVisibility);
        // Added passive scroll listener to avoid blocking main thread
        slider.addEventListener('scroll', () => resetInterval(), { passive: true }); 
        
        checkArrowsVisibility(); 
    }

});