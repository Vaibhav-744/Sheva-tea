/* ============================================================
   SHEVA TEA — Shared JS
   Handles:
   1. Auto-slider pause/resume (IntersectionObserver + hover/touch)
   2. Scroll-reveal for section cards
   3. Navbar scroll darkening
   4. Parallax star field on mouse-move (desktop only)
   5. Smooth anchor scroll with fixed-header offset
   6. Toast notification helper (used by custom sections)
============================================================ */

(function () {
  'use strict';

  /* ── 1. Auto-slider pause/resume ── */
  function initAutoSliders() {
    var sliders = document.querySelectorAll('.js-sheva-auto-slider');
    if (!sliders.length) return;

    sliders.forEach(function (slider) {
      var track = slider.querySelector(
        '.sheva-ing-track, .sheva-reviews-track, .sheva-shop-track, .sheva-mq-track'
      );
      if (!track) return;

      /* Pause when scrolled off-screen */
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          track.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
        });
      }, { threshold: 0.05 });
      vo.observe(slider);

      var pause  = function () { track.style.animationPlayState = 'paused';  };
      var resume = function () { track.style.animationPlayState = 'running'; };

      slider.addEventListener('mouseenter', pause);
      slider.addEventListener('mouseleave', resume);
      slider.addEventListener('touchstart', pause,  { passive: true });
      slider.addEventListener('touchend',   function () { setTimeout(resume, 1500); });
    });
  }

  /* ── 2. Scroll-reveal (IntersectionObserver) ── */
  function initReveal() {
    var els = document.querySelectorAll(
      '.sheva-b-card, .sheva-ing-card, .sheva-review-card, ' +
      '.sheva-fp__info, .sheva-fp__gallery, ' +
      '.sheva-sec-head, .sheva-bundle, .sheva-strip__img'
    );
    if (!els.length) return;

    els.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity .8s, transform .8s';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity   = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target); /* fire once */
        }
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── 3. Navbar scroll effect ── */
  function initNavbar() {
    var nav = document.querySelector('.sheva-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.style.background = window.scrollY > 60
        ? 'rgba(5,0,20,.95)'
        : 'rgba(5,0,20,.65)';
    }, { passive: true });
  }

  /* ── 4. Parallax star field ── */
  function initParallax() {
    if ('ontouchstart' in window) return;
    var s1 = document.querySelector('.sheva-stars');
    var s2 = document.querySelector('.sheva-stars2');
    if (!s1 || !s2) return;

    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth  - 0.5) * 20;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;
      s1.style.transform = 'translate(' +  x + 'px, ' +  y + 'px)';
      s2.style.transform = 'translate(' + -x + 'px, ' + -y + 'px)';
    });
  }

  /* ── 5. Smooth anchor scroll with 80px header offset ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Init all ── */
  function init() {
    initAutoSliders();
    initReveal();
    initNavbar();
    initParallax();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Toast helper (global, used by theme editor previews) ── */
  window.shevaToast = function (msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = [
      'position:fixed', 'bottom:30px', 'right:30px', 'z-index:9999',
      'background:linear-gradient(90deg,#ff4db8,#8b5cf6)',
      'color:#fff', 'padding:14px 24px', 'border-radius:999px',
      "font-family:'Orbitron',sans-serif", 'letter-spacing:2px',
      'font-size:12px', 'box-shadow:0 10px 40px rgba(255,77,184,.5)',
      'animation:shevaSlidein .4s ease', 'max-width:90vw', 'pointer-events:none'
    ].join(';');

    /* inject keyframes once */
    if (!document.getElementById('sheva-toast-kf')) {
      var style = document.createElement('style');
      style.id = 'sheva-toast-kf';
      style.textContent = '@keyframes shevaSlidein{from{transform:translateX(120%)}to{transform:translateX(0)}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .4s';
      t.style.opacity = '0';
    }, 2500);
    setTimeout(function () { t.remove(); }, 3000);
  };

})();
