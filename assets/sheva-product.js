/* ============================================================
   SHEVA TEA — Featured Product JS
   Handles quantity stepper only.
   Add-to-cart is handled by the theme's native form submit.
============================================================ */
(function () {
  'use strict';

  function initShevaQty(section) {
    var minusBtn = section.querySelector('.sheva-fp__qty-minus');
    var plusBtn  = section.querySelector('.sheva-fp__qty-plus');
    var qvalEl   = section.querySelector('.sheva-fp__qval');
    var inputEl  = section.querySelector('.sheva-fp__qty-input');

    if (!minusBtn || !plusBtn || !qvalEl || !inputEl) return;

    var qty = 1;

    plusBtn.addEventListener('click', function () {
      qty++;
      update();
    });

    minusBtn.addEventListener('click', function () {
      if (qty > 1) { qty--; update(); }
    });

    function update() {
      qvalEl.textContent  = qty;
      inputEl.value       = qty;
    }
  }

  document.querySelectorAll('.sheva-fp').forEach(initShevaQty);
})();
