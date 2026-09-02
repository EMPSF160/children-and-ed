/* ==========================================================================
   Children & Education Foundation - Main Application Controller
   Lenis, GSAP ScrollTrigger, Swiper, Lightbox, Calculator & Counters
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Lenis Smooth Scrolling Setup
  // --------------------------------------------------------------------------
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // --------------------------------------------------------------------------
  // 2. Header Sticky & Scroll Effect
  // --------------------------------------------------------------------------
  const headerWrapper = document.querySelector('.header-wrapper');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerWrapper?.classList.add('scrolled');
    } else {
      headerWrapper?.classList.remove('scrolled');
    }
  });

  // Mobile Menu Drawer Handler (<= 1024px)
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-drawer-nav a');

  const openDrawer = () => {
    mobileDrawer?.classList.add('active');
    mobileDrawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('active');
    mobileDrawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggleBtn?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', closeDrawer);
  mobileDrawerOverlay?.addEventListener('click', closeDrawer);
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --------------------------------------------------------------------------
  // 3. GSAP & ScrollTrigger Animations
  // --------------------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Entry Animation
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    heroTl.from('.hero-tag', { y: -20, opacity: 0, delay: 0.2 })
          .from('.hero-title', { y: 30, opacity: 0 }, '-=0.6')
          .from('.hero-desc', { y: 30, opacity: 0 }, '-=0.7')
          .from('.hero-buttons', { y: 20, opacity: 0 }, '-=0.7')
          .from('.hero-interactive-card', { x: 40, opacity: 0 }, '-=0.8')
          .from('.stats-card-container', { y: 40, opacity: 0, scale: 0.96 }, '-=0.5');

    // Fade-in Stagger for Sections
    const fadeElements = document.querySelectorAll('.fade-up-element');
    fadeElements.forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Stagger Cards
    const staggerContainers = document.querySelectorAll('.stagger-container');
    staggerContainers.forEach((container) => {
      gsap.from(container.children, {
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Animated Number Counters
  // --------------------------------------------------------------------------
  const counters = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.ceil(target / 80);
      const isDecimal = counter.getAttribute('data-decimal') === 'true';

      const updateCount = () => {
        count += step;
        if (count < target) {
          counter.innerText = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = isDecimal ? (target / 10).toFixed(1) : target.toLocaleString();
        }
      };
      updateCount();
    });
  };

  const statsSection = document.querySelector('.impact-stats-bar');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        runCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // State Map Interactive Hover Tooltip
  // --------------------------------------------------------------------------
  const mapPaths = document.querySelectorAll('.map-state-path');
  const tooltip = document.getElementById('mapStateTooltip');
  const tooltipTitle = document.getElementById('mapTooltipTitle');
  const tooltipDesc = document.getElementById('mapTooltipDesc');

  const stateDetails = {
    'Uttar Pradesh': { schools: '45,000+ Schools', children: '58,00,000+ Children', teachers: '1,10,000+ Teachers' },
    'Haryana': { schools: '14,200+ Schools', children: '18,50,000+ Children', teachers: '38,000+ Teachers' },
    'Rajasthan': { schools: '32,500+ Schools', children: '34,00,000+ Children', teachers: '72,000+ Teachers' },
    'Uttarakhand': { schools: '11,400+ Schools', children: '9,20,000+ Children', teachers: '24,000+ Teachers' },
    'Chhattisgarh': { schools: '21,800+ Schools', children: '22,40,000+ Children', teachers: '48,000+ Teachers' },
    'Himachal Pradesh': { schools: '9,600+ Schools', children: '6,80,000+ Children', teachers: '18,500+ Teachers' },
    'Jharkhand': { schools: '18,300+ Schools', children: '19,50,000+ Children', teachers: '36,000+ Teachers' },
    'Maharashtra': { schools: '16,700+ Schools', children: '21,00,000+ Children', teachers: '42,000+ Teachers' }
  };

  mapPaths.forEach(path => {
    path.addEventListener('mouseenter', (e) => {
      const stateRaw = path.getAttribute('data-state') || '';
      const stateName = stateRaw.split(':')[0].trim();
      if (tooltipTitle) tooltipTitle.innerText = stateName;
      if (stateDetails[stateName]) {
        if (tooltipDesc) tooltipDesc.innerText = `${stateDetails[stateName].schools} | ${stateDetails[stateName].children} Benefited`;
      } else {
        if (tooltipDesc) tooltipDesc.innerText = stateRaw || 'Expanding Smart Shala Programs';
      }
      if (tooltip) tooltip.style.opacity = '1';
    });
  });

  // --------------------------------------------------------------------------
  // 5. Swiper Carousels Initialization
  // --------------------------------------------------------------------------
  if (typeof Swiper !== 'undefined') {
    // Innovations Slider
    new Swiper('.innovations-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.innovations-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.innovations-next',
        prevEl: '.innovations-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      }
    });

    // Stories Slider
    new Swiper('.stories-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.stories-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.stories-next',
        prevEl: '.stories-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28,
        },
      }
    });
  }

  // --------------------------------------------------------------------------
  // Hero Video Showcase Player Controls
  // --------------------------------------------------------------------------
  const heroVideo = document.getElementById('heroMainVideoPlayer');
  const heroMuteBtn = document.getElementById('heroMuteToggleBtn');
  const heroMuteIcon = document.getElementById('heroMuteIcon');
  const heroPlayBtn = document.getElementById('heroPlayPauseBtn');
  const heroPlayIcon = document.getElementById('heroPlayIcon');
  const heroFullscreenBtn = document.getElementById('heroFullscreenBtn');
  const heroVideoTitle = document.getElementById('heroVideoTitleBadge');
  const heroPlaylistThumbs = document.querySelectorAll('.hero-playlist-thumb');

  if (heroVideo) {
    // Mute / Unmute Toggle
    heroMuteBtn?.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.muted) {
        heroMuteIcon?.classList.replace('fa-volume-high', 'fa-volume-xmark');
      } else {
        heroMuteIcon?.classList.replace('fa-volume-xmark', 'fa-volume-high');
      }
    });

    // Play / Pause Toggle
    heroPlayBtn?.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        heroPlayIcon?.classList.replace('fa-play', 'fa-pause');
      } else {
        heroVideo.pause();
        heroPlayIcon?.classList.replace('fa-pause', 'fa-play');
      }
    });

    // Fullscreen / Modal Trigger
    heroFullscreenBtn?.addEventListener('click', () => {
      const currentSrc = heroVideo.currentSrc || heroVideo.querySelector('source')?.src;
      if (videoModal && modalVideo && currentSrc) {
        modalVideo.src = currentSrc;
        videoModal.classList.add('active');
        modalVideo.play();
      }
    });

    // Playlist Item Switching
    heroPlaylistThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        heroPlaylistThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        const newVideoSrc = thumb.getAttribute('data-hero-video');
        const newTitle = thumb.getAttribute('data-title');

        if (heroVideo && newVideoSrc) {
          heroVideo.src = newVideoSrc;
          if (heroVideoTitle) heroVideoTitle.innerText = newTitle || 'Classroom Story';
          heroVideo.play();
          heroPlayIcon?.classList.replace('fa-play', 'fa-pause');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 360° Classroom Sandbox Interactive Tabs
  // --------------------------------------------------------------------------
  const sandboxTabs = document.querySelectorAll('.sandbox-tab-btn');
  const sandboxPanels = document.querySelectorAll('.sandbox-panel');

  sandboxTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sandboxTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-sandbox-tab');
      sandboxPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Interactive Video Modal Lightbox
  // --------------------------------------------------------------------------
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideoPlayer');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const playButtons = document.querySelectorAll('[data-video-src]');

  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = btn.getAttribute('data-video-src');
      if (videoModal && modalVideo && videoSrc) {
        modalVideo.src = videoSrc;
        videoModal.classList.add('active');
        modalVideo.play();
      }
    });
  });

  const closeModal = () => {
    if (videoModal && modalVideo) {
      videoModal.classList.remove('active');
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.src = '';
    }
  };

  modalCloseBtn?.addEventListener('click', closeModal);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeModal();
  });

  // --------------------------------------------------------------------------
  // 7. Interactive Donation & Classroom Calculator
  // --------------------------------------------------------------------------
  const classSlider = document.getElementById('classRangeSlider');
  const classValBadge = document.getElementById('classCountDisplay');
  const calcStudents = document.getElementById('calcStudentsReachable');
  const calcKits = document.getElementById('calcKitsDeployable');
  const calcCost = document.getElementById('calcTotalContribution');
  const quickBtns = document.querySelectorAll('.qab-btn');

  const updateCalculator = (classrooms) => {
    const studentsPerClass = 35;
    const kitsPerClass = 2;
    const costPerClass = 15000; // INR 15,000 to equip 1 smart class for 1 full year

    const totalStudents = classrooms * studentsPerClass;
    const totalKits = classrooms * kitsPerClass;
    const totalAmount = classrooms * costPerClass;

    if (classValBadge) classValBadge.innerText = `${classrooms} Classroom${classrooms > 1 ? 's' : ''}`;
    if (calcStudents) calcStudents.innerText = totalStudents.toLocaleString('en-IN') + '+';
    if (calcKits) calcKits.innerText = totalKits.toLocaleString('en-IN') + ' Kits';
    if (calcCost) calcCost.innerText = '₹' + totalAmount.toLocaleString('en-IN');
  };

  if (classSlider) {
    classSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      updateCalculator(val);
      quickBtns.forEach(b => b.classList.remove('active'));
    });
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quickBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = parseInt(btn.getAttribute('data-classes'));
      if (classSlider) classSlider.value = val;
      updateCalculator(val);
    });
  });

  // Simulated Donation Submission Modal
  const donateSubmitBtn = document.getElementById('btnSubmitDonation');
  const donationSuccessModal = document.getElementById('donationSuccessModal');
  const successModalClose = document.querySelector('.success-modal-close');

  donateSubmitBtn?.addEventListener('click', () => {
    if (donationSuccessModal) {
      donationSuccessModal.classList.add('active');
    }
  });

  successModalClose?.addEventListener('click', () => {
    if (donationSuccessModal) {
      donationSuccessModal.classList.remove('active');
    }
  });

  donationSuccessModal?.addEventListener('click', (e) => {
    if (e.target === donationSuccessModal) {
      donationSuccessModal.classList.remove('active');
    }
  });

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -70 });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });
});
