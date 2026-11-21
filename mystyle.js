// En-tête qui change au scroll + barre de progression
const header = document.getElementById('header');
const progress = document.getElementById('progress');

function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    const hauteur = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (hauteur > 0 ? (y / hauteur) * 100 : 0) + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menu mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function fermerMenu() {
    burger.classList.remove('open');
    nav.classList.remove('open');
    header.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
    const ouvert = burger.classList.toggle('open');
    nav.classList.toggle('open', ouvert);
    header.classList.toggle('menu-open', ouvert);
    burger.setAttribute('aria-expanded', ouvert);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', fermerMenu));

// Mot qui change dans le titre
const mots = ['cheveux', 'peau', 'soins', 'accessoires', 'style'];
const rotator = document.getElementById('rotator');
let i = 0;
setInterval(() => {
    i = (i + 1) % mots.length;
    rotator.textContent = mots[i];
    rotator.classList.remove('swap');
    void rotator.offsetWidth; // relance l'animation
    rotator.classList.add('swap');
}, 2200);

// Apparition des éléments au scroll (avec léger décalage entre les cartes)
const reveals = document.querySelectorAll('.reveal');
reveals.forEach(el => {
    const freres = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', freres.indexOf(el) * 0.1 + 's');
});
const obsReveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            obsReveal.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
reveals.forEach(el => obsReveal.observe(el));

// Lien de menu actif selon la section visible
const liens = document.querySelectorAll('.nav-links a');
const sections = [...liens].map(a => document.querySelector(a.getAttribute('href')));
const obsNav = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            liens.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && obsNav.observe(s));

// Effet 3D sur les cartes produits (souris uniquement)
if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.tilt').forEach(carte => {
        carte.addEventListener('mousemove', (ev) => {
            const r = carte.getBoundingClientRect();
            const x = (ev.clientX - r.left) / r.width - 0.5;
            const y = (ev.clientY - r.top) / r.height - 0.5;
            carte.style.transition = 'border-color .3s, box-shadow .3s';
            carte.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
        });
        carte.addEventListener('mouseleave', () => {
            carte.style.transition = 'transform .5s, border-color .3s, box-shadow .3s';
            carte.style.transform = '';
        });
    });
}
