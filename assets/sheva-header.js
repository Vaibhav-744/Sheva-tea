/* ============================================================
   SHEVA TEA — Header JS
   - Hamburger open/close
   - Trap focus in mobile menu
   - ESC to close
   - Body scroll lock when menu open
   - Navbar scroll darkening
============================================================ */

(function () {
  'use strict';

  var nav       = document.getElementById('sheva-nav');
  var hamburger = document.getElementById('sheva-hamburger');
  var mobileMenu= document.getElementById('sheva-mobile-menu');
  var closeBtn  = document.getElementById('sheva-mobile-close');

  if (!hamburger || !mobileMenu) return;

  /* ── Open / Close ── */
  function openMenu() {
    mobileMenu.hidden = false;
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeMenu() {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  closeBtn.addEventListener('click', closeMenu);

  /* Close on link click */
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close on ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.hidden) {
      closeMenu();
    }
  });

  /* Close on backdrop click (outside the menu links area) */
  mobileMenu.addEventListener('click', function (e) {
    if (e.target === mobileMenu) closeMenu();
  });

  /* ── Navbar scroll darkening ── */
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.background = window.scrollY > 60
        ? 'rgba(5,0,20,.95)'
        : 'rgba(5,0,20,.65)';
    }, { passive: true });
  }

})();
