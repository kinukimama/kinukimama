window.addEventListener('load',()=>{
  const loader = document.getElementById('loader');
  if(!loader) return;
  const skip = new URLSearchParams(location.search).get('skip');
  if(skip){
    loader.classList.add('gone');
  } else {
    setTimeout(()=>loader.classList.add('gone'),1400);
  }
});
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('on',scrollY>60));

// HERO SLIDESHOW
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dot');
let current  = 0;
let timer;

if (slides.length > 0) {
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
}

// ABOUT SLIDESHOW
const abSlides = document.querySelectorAll('.ab-slide');
const abDots   = document.querySelectorAll('.ab-dot');
let abCurrent  = 0;
let abTimer;

if (abSlides.length > 0) {
  function abGoTo(idx) {
    abSlides[abCurrent].classList.remove('active');
    abDots[abCurrent].classList.remove('active');
    abCurrent = (idx + abSlides.length) % abSlides.length;
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
}

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

// ACCORDION MENU
document.querySelectorAll('.ac-head').forEach(head => {
  head.addEventListener('click', () => {
    head.closest('.ac-item').classList.toggle('open');
  });
});

// MAP FACADE
const mapFacade = document.getElementById('mapFacade');
if (mapFacade) {
  mapFacade.addEventListener('click', () => {
    mapFacade.style.display = 'none';
    document.getElementById('mapIframeWrap').style.display = 'block';
  });
}

// CONTACT FORM VALIDATION
const cfForm = document.getElementById('cf-form');
if (cfForm) {
  const telInput = document.getElementById('cf-tel');
  const mobileInput = document.getElementById('cf-mobile');
  const telErr = document.getElementById('cf-tel-err');
  const mobileErr = document.getElementById('cf-mobile-err');
  const btn = document.getElementById('cf-submit-btn');

  const telPattern = /^0\d{9,10}$/;

  function validateTel(input, errEl) {
    const val = input.value.trim();
    if (val === '') return true;
    if (!telPattern.test(val)) {
      errEl.textContent = '0から始まる10桁または11桁の半角数字で入力してください';
      return false;
    }
    errEl.textContent = '';
    return true;
  }

  telInput.addEventListener('blur', () => validateTel(telInput, telErr));
  mobileInput.addEventListener('blur', () => validateTel(mobileInput, mobileErr));

const emailInput = document.getElementById('cf-email');
  const emailErr = document.getElementById('cf-email-err');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!emailPattern.test(val)) {
      emailErr.textContent = '正しいメールアドレスを入力してください';
      return false;
    }
    emailErr.textContent = '';
    return true;
  }

  emailInput.addEventListener('blur', validateEmail);

  btn.addEventListener('click', () => {
    let valid = true;
    if (!cfForm.reportValidity()) return;
    if (!validateEmail()) valid = false;

    const telOk = validateTel(telInput, telErr);
    const mobileOk = validateTel(mobileInput, mobileErr);
    if (!telOk || !mobileOk) valid = false;

    const telVal = telInput.value.trim();
    const mobileVal = mobileInput.value.trim();
    if (telVal === '' && mobileVal === '') {
      telErr.textContent = '電話番号または携帯番号のどちらかを入力してください';
      mobileErr.textContent = '電話番号または携帯番号のどちらかを入力してください';
      valid = false;
    }

    if (valid) {
      btn.disabled = true;
      btn.textContent = '送信中...';
      fetch(cfForm.action, {
        method: 'POST',
        body: new FormData(cfForm),
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        if (res.ok) {
          window.location.href = 'thanks.html';
        } else {
          btn.disabled = false;
          btn.textContent = '送信';
          alert('送信に失敗しました。時間をおいて再度お試しください。');
        }
      }).catch(() => {
        btn.disabled = false;
        btn.textContent = '送信';
        alert('通信エラーが発生しました。時間をおいて再度お試しください。');
      });
    }
  });
}
// THANKS PAGE COUNTDOWN
const thanksSec = document.getElementById('thanks-sec');
if (thanksSec) {
  let sec = 5;
  const t = setInterval(() => {
    sec--;
    thanksSec.textContent = sec;
    if (sec <= 0) {
      clearInterval(t);
      window.location.href = 'index.html?skip=1';
    }
  }, 1000);
}
// NEWS BANNER（index.html）
const newsBanner = document.getElementById('newsBanner');
if (newsBanner) {
  fetch('news.json')
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) return;
      const latest = data[0];
      document.getElementById('nbTag').textContent = latest.tag;
      document.getElementById('nbTitle').textContent = latest.title;
      newsBanner.style.display = 'flex';
    })
    .catch(() => {});
}

// NEWS LIST（news.html）
const newsList = document.getElementById('news-list');
if (newsList) {
  fetch('news.json')
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        newsList.innerHTML = '<p class="news-loading">現在お知らせはありません。</p>';
        return;
      }
      newsList.innerHTML = data.map(item => `
        <div class="news-card">
          <div class="news-card-head">
            <span class="news-date">${item.date}</span>
            <span class="news-tag news-tag--${item.tag}">${item.tag}</span>
          </div>
          <div class="news-title">${item.title}</div>
          <p class="news-body">${item.body}</p>
          ${item.link ? `<a href="${item.link}" target="_blank" class="news-card-link">${item.linkText || 'こちら'} →</a>` : ''}
        </div>
      `).join('');
    })
    .catch(() => {
      newsList.innerHTML = '<p class="news-loading">読み込みに失敗しました。</p>';
    });
}