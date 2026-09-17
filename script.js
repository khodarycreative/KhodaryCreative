const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');
const track = document.getElementById('worksTrack');
const cards = [...document.querySelectorAll('.work-card')];
const progress = document.getElementById('progress');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let index = 0;
let timer;

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

function visibleCount() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function maxIndex() {
  return Math.max(0, cards.length - visibleCount());
}

function updateSlider() {
  index = Math.min(index, maxIndex());
  const gap = 18;
  const cardWidth = cards[0].getBoundingClientRect().width + gap;
  // Direction is RTL, so positive translate moves toward later items visually.
  track.style.transform = `translateX(${index * cardWidth}px)`;
  progress.style.width = `${((index + visibleCount()) / cards.length) * 100}%`;
}

function goNext() {
  index = index >= maxIndex() ? 0 : index + 1;
  updateSlider();
}
function goPrev() {
  index = index <= 0 ? maxIndex() : index - 1;
  updateSlider();
}

next.addEventListener('click', () => { goNext(); restart(); });
prev.addEventListener('click', () => { goPrev(); restart(); });

function start() {
  timer = setInterval(goNext, 3200);
}
function restart() {
  clearInterval(timer);
  start();
}

const shell = document.querySelector('.works-shell');
shell.addEventListener('mouseenter', () => clearInterval(timer));
shell.addEventListener('mouseleave', start);
window.addEventListener('resize', updateSlider);

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('nav a')];

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.35 });

sections.forEach(section => observer.observe(section));

updateSlider();
start();
