/* AVR Estates — shared site behaviour */
(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* Reveal-on-scroll (subtle, respects reduced motion) */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !prefersReduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) {
      // Only hide once we know JS + the observer can bring it back.
      el.classList.add('will-animate');
      io.observe(el);
    });
  }
  /* If reduced motion or no IntersectionObserver, elements simply
     stay in their default visible state — nothing further to do. */

  /* ---------------------------------------------------------
     Enquiry form submission
     Connect to Formspree: create a free form at https://formspree.io
     using avrestatesofficial@gmail.com, then replace YOUR_FORM_ID
     in the form's action attribute (data-endpoint) across the site.
     --------------------------------------------------------- */
  var forms = document.querySelectorAll('.enquiry-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msgEl = form.querySelector('.form-msg');
      var submitBtn = form.querySelector('button[type="submit"]');
      var endpoint = form.getAttribute('action');
      var placeholder = endpoint && endpoint.indexOf('YOUR_FORM_ID') !== -1;

      if (placeholder) {
        msgEl.textContent = 'Form is almost ready — connect your Formspree endpoint to start receiving enquiries at avrestatesofficial@gmail.com. Meanwhile, please call or WhatsApp us directly.';
        msgEl.className = 'form-msg error';
        return;
      }

      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            msgEl.textContent = 'Thank you. Your enquiry has been received — our team will contact you shortly.';
            msgEl.className = 'form-msg success';
          } else {
            msgEl.textContent = 'Something went wrong sending your enquiry. Please call or WhatsApp us directly.';
            msgEl.className = 'form-msg error';
          }
        })
        .catch(function () {
          msgEl.textContent = 'Something went wrong sending your enquiry. Please call or WhatsApp us directly.';
          msgEl.className = 'form-msg error';
        })
        .finally(function () {
          submitBtn.textContent = originalLabel;
          submitBtn.disabled = false;
        });
    });
  });
})();
