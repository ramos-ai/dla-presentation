/**
 * Data Labelling App — Apresentação didático-técnica
 * Animações ao scroll e navegação ativa.
 */

(function () {
  'use strict';

  // ----- Reveal ao scroll (Intersection Observer) -----
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.05
      }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ----- Link ativo na navegação -----
  var navLinks = document.querySelectorAll('.nav a');
  var sections = [];

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      var id = href.slice(1);
      var section = document.getElementById(id);
      if (section) sections.push({ id: id, section: section, link: link });
    }
  });

  function updateActiveLink() {
    var scrollY = window.scrollY || window.pageYOffset;
    var viewportMid = scrollY + window.innerHeight * 0.35;
    var current = null;

    for (var i = 0; i < sections.length; i++) {
      var s = sections[i].section;
      var top = s.offsetTop;
      var bottom = top + s.offsetHeight;
      if (viewportMid >= top && viewportMid <= bottom) {
        current = sections[i];
        break;
      }
    }
    if (!current && sections.length) {
      if (scrollY < sections[0].section.offsetTop) current = sections[0];
      else current = sections[sections.length - 1];
    }

    sections.forEach(function (item) {
      item.link.classList.remove('is-active');
      if (current && item.id === current.id) item.link.classList.add('is-active');
    });
  }

  if (sections.length) {
    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateActiveLink);
    });
    updateActiveLink();
  }
})();
