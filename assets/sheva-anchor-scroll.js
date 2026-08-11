/**
 * SHEVA TEA — Universal Smooth Anchor & Cross-Page Hash Scroll Handler
 * Handles both same-page (#id) and cross-page (/pages/about-us#mission) links,
 * smoothly scrolling to the target section with sticky header offset subtraction.
 */

(function () {
  'use strict';

  // Get fixed/sticky header height offset (default ~90px)
  function getHeaderOffset() {
    const header = document.querySelector('.header-nav-plain, .section-header-navigation, header');
    if (header) {
      return header.getBoundingClientRect().height + 15;
    }
    return 90;
  }

  // Find target element by hash string (e.g. "mission" or "#mission")
  function findTargetElement(hash) {
    if (!hash) return null;
    const cleanHash = hash.replace(/^#/, '');
    if (!cleanHash) return null;

    // 1. Direct ID match
    let target = document.getElementById(cleanHash);
    if (target) return target;

    // 2. Query selector by ID or name
    try {
      target = document.querySelector('#' + CSS.escape(cleanHash));
      if (target) return target;
    } catch (e) {}

    // 3. Fallback: search for elements with partial ID, data-anchor, or section class
    target = document.querySelector('[id*="' + cleanHash + '"]') ||
             document.querySelector('[data-anchor="' + cleanHash + '"]') ||
             document.querySelector('.abt-' + cleanHash) ||
             document.querySelector('.sheva-' + cleanHash);

    return target;
  }

  // Perform smooth scroll to target element with header offset
  function scrollToElement(target, smooth) {
    if (!target) return;
    const offset = getHeaderOffset();

    // If target is an anchor div, resolve parent section for precision if needed
    let elem = target;
    if ((elem.offsetHeight === 0 || elem.children.length === 0) && elem.parentElement) {
      const parentSec = elem.closest('section, [class*="sheva-"], [class*="contact-"], [class*="abt-"]');
      if (parentSec) {
        elem = parentSec;
      }
    }

    const rect = elem.getBoundingClientRect();
    const targetTop = rect.top + window.pageYOffset - offset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: smooth !== false ? 'smooth' : 'auto'
    });
  }

  // Handle hash on initial page load (e.g. user comes from home page to /pages/about-us#mission)
  function handleInitialHash() {
    if (!window.location.hash) return;
    const hash = window.location.hash;
    const target = findTargetElement(hash);

    if (target) {
      setTimeout(function () {
        scrollToElement(target, true);
      }, 100);
      // Re-scroll after dynamic images/fonts load
      setTimeout(function () {
        scrollToElement(target, true);
      }, 500);
    }
  }

  // Handle click on links containing hash (#)
  function handleAnchorClick(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)') return;

    // Extract pathname and hash from href
    let url;
    try {
      url = new URL(link.href, window.location.origin);
    } catch (err) {
      return;
    }

    const hash = url.hash;
    if (!hash) return;

    // Normalize pathnames (e.g. "/" -> "/", "/pages/about-us" -> "/pages/about-us")
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const targetPath = url.pathname.replace(/\/$/, '') || '/';

    const isSamePage = (targetPath === currentPath);
    const targetElement = findTargetElement(hash);

    if (isSamePage) {
      if (targetElement) {
        e.preventDefault();

        // Close mobile drawer if open
        const mobileCloseBtn = document.querySelector('[data-menu-close-sidebar], .halo-sidebar-close');
        if (mobileCloseBtn && document.body.classList.contains('menu_open')) {
          mobileCloseBtn.click();
        }

        // Smooth scroll to target
        scrollToElement(targetElement, true);

        // Update URL hash without standard hard jump
        if (history.pushState) {
          history.pushState(null, null, url.pathname + url.search + hash);
        } else {
          window.location.hash = hash;
        }
      } else if (href.startsWith('#')) {
        // If link is relative "#shop" but target doesn't exist on current page (e.g. on About page), redirect to homepage with hash!
        e.preventDefault();
        window.location.href = '/' + hash;
      }
    }
    // If targetPath is DIFFERENT (e.g. currentPath is "/pages/about-us" and targetPath is "/" for "/#shop"):
    // Do NOT call e.preventDefault()! Allow natural browser navigation to "/#shop".
    // When the homepage loads, handleInitialHash() will trigger and scroll smoothly to #shop!
  }

  // Listen for hashchange events
  window.addEventListener('hashchange', function () {
    const target = findTargetElement(window.location.hash);
    if (target) {
      scrollToElement(target, true);
    }
  });

  // Attach event listeners
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleInitialHash);
  } else {
    handleInitialHash();
  }

  window.addEventListener('load', handleInitialHash);
  document.addEventListener('click', handleAnchorClick, true);

})();
