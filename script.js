window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('gone'),1400);
});
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('on',scrollY>60));

// HERO SLIDESHOW
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dot');
let current  = 0;
let timer;

function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function next() { goTo(current + 1); }

function startAuto() {
  clearInterval(timer);
  timer = setInterval(next, 6000);
}

dots.forEach(dot => dot.addEventListener('click', () => {
  goTo(parseInt(dot.dataset.idx));
  startAuto();
}));

startAuto();

// ABOUT SLIDESHOW
const abSlides = document.querySelectorAll('.ab-slide');
const abDots   = document.querySelectorAll('.ab-dot');
let abCurrent  = 0;
let abTimer;

function abGoTo(idx) {
  abSlides[abCurrent].classList.remove('active');
  abDots[abCurrent].classList.remove('active');
  abCurrent = (idx + abSlides.length) % abSlides.length;
  // モバイルでportraitスライドはスキップ
  if (window.innerWidth <= 800 && abSlides[abCurrent].classList.contains('portrait')) {
    abCurrent = (abCurrent + 1) % abSlides.length;
  }
  abSlides[abCurrent].classList.add('active');
  abDots[abCurrent].classList.add('active');
}

function abStartAuto() {
  clearInterval(abTimer);
  abTimer = setInterval(() => abGoTo(abCurrent + 1), 5000);
}

abDots.forEach(dot => dot.addEventListener('click', () => {
  abGoTo(parseInt(dot.dataset.ab));
  abStartAuto();
}));

abStartAuto();

// INTERSECTION OBSERVER
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('vis');
      if(e.target.id==='imgbreak') e.target.classList.add('vis');
      obs.unobserve(e.target);
    }
  });
},{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
}));

// HAMBURGER MENU
const burger = document.getElementById('burger');
const navDrawer = document.getElementById('navDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  burger.classList.add('open');
  navDrawer.classList.add('open');
  drawerOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  burger.classList.remove('open');
  navDrawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  burger.classList.contains('open') ? closeDrawer() : openDrawer();
});

drawerOverlay.addEventListener('click', closeDrawer);

// ドロワー内リンクをクリックしたら閉じる
navDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));