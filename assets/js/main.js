/* Get Techy Wid It - mobile menu, smooth scrolling and legal dialogs.
   There is no contact form on this site: no email or phone number has been published. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Current year in the footer */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile menu */
  var menuButton = document.getElementById('menu-button');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('hidden', !open);
    var label = menuButton.querySelector('[data-menu-label]');
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    var iconOpen = menuButton.querySelector('[data-icon-open]');
    var iconClose = menuButton.querySelector('[data-icon-close]');
    if (iconOpen) iconOpen.classList.toggle('hidden', open);
    if (iconClose) iconClose.classList.toggle('hidden', !open);
  }

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* Smooth scroll for in-page links, moving focus to the target */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    setMenu(false);

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    } else {
      target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    }

    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });

    if (history.pushState) {
      history.pushState(null, '', '#' + id);
    }
  });

  /* Legal dialogs (Privacy Policy, Terms of Service) */
  var lastTrigger = null;

  document.querySelectorAll('[data-open-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = document.getElementById(btn.getAttribute('data-open-dialog'));
      if (!dialog || typeof dialog.showModal !== 'function') return;
      lastTrigger = btn;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      var body = dialog.querySelector('.legal-body');
      if (body) body.scrollTop = 0;
    });
  });

  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.querySelectorAll('[data-close-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        dialog.close();
      });
    });

    /* Close when clicking the backdrop */
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });

    /* Esc is handled natively by <dialog>; tidy up on any close */
    dialog.addEventListener('close', function () {
      document.body.classList.remove('dialog-open');
      if (lastTrigger) {
        lastTrigger.focus();
        lastTrigger = null;
      }
    });
  });
})();
