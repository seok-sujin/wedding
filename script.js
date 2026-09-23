
// 🔻날짜 기입 (현재 2027년 1월 1일 12시 30분으로 설정되어있음)
const WEDDING_YEAR = 2027; // 년도
const WEDDING_MONTH = 1; // 월
const WEDDING_DAY = 1;  // 일

const WEDDING_HOUR = 12; //시
const WEDDING_MINUTE = 30;  //분
const WEDDING_DATE = new Date(
  WEDDING_YEAR,
  WEDDING_MONTH - 1,
  WEDDING_DAY,
  WEDDING_HOUR,
  WEDDING_MINUTE,
  0
).getTime();
document.addEventListener("DOMContentLoaded", function () {
  renderCalendar();
  startCountdown();
});

function renderCalendar() {
  const monthTitle = document.getElementById("calendar-month");
  const calendarDays = document.getElementById("calendar-days");
  if (!monthTitle || !calendarDays) return;
  monthTitle.innerText = `${WEDDING_YEAR}. ${String(WEDDING_MONTH).padStart(2, "0")}`;
  calendarDays.innerHTML = "";
  const firstDay = new Date(WEDDING_YEAR, WEDDING_MONTH - 1, 1).getDay();
  const lastDate = new Date(WEDDING_YEAR, WEDDING_MONTH, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const emptySpan = document.createElement("span");
    calendarDays.appendChild(emptySpan);
  }
  for (let day = 1; day <= lastDate; day++) {
    const daySpan = document.createElement("span");
    daySpan.innerText = day;
    if (day === WEDDING_DAY) {
      daySpan.classList.add("wedding-day");
    }
    calendarDays.appendChild(daySpan);
  }
}

function openEnvelope() {
  const overlay = document.getElementById("intro-overlay");
  const mainContent = document.getElementById("main-content");
  const bgm = document.getElementById("bgm");
  if (!overlay || !mainContent) return;
  overlay.style.transition = "opacity 0.8s ease";
  overlay.style.opacity = "0";
  setTimeout(function () {
    overlay.style.display = "none";
    mainContent.style.display = "block";
    mainContent.classList.add("fade-in");
    window.scrollTo(0, 0);
    renderKakaoMap();
    if (bgm) {
      bgm.play().catch(function () {});
    }
  }, 800);
}
function toggleBgm() {
  const bgm = document.getElementById("bgm");
  const btn = document.getElementById("bgm-btn");
  if (!bgm || !btn) return;
  if (bgm.paused) {
    bgm.play().catch(function () {});
    btn.innerText = "🎵 Music On";
  } else {
    bgm.pause();
    btn.innerText = "🔇 Music Off";
  }
}
function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}
function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;
  const ddayBadge = document.getElementById("dday-counter");
  const daysEl = document.getElementById("timer-days");
  const hoursEl = document.getElementById("timer-hours");
  const minEl = document.getElementById("timer-min");
  const secEl = document.getElementById("timer-sec");
  if (!ddayBadge || !daysEl || !hoursEl || !minEl || !secEl) return;
  if (distance < 0) {
    ddayBadge.innerText = " ♡ 축하해주셔서 감사합니다 ♡ ";
    daysEl.innerText = "00";
    hoursEl.innerText = "00";
    minEl.innerText = "00";
    secEl.innerText = "00";
    return;
  }
  const today = new Date();
const todayDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

const weddingDateOnly = new Date(
  WEDDING_YEAR,
  WEDDING_MONTH - 1,
  WEDDING_DAY
);

const days = Math.ceil(
  (weddingDateOnly - todayDate) / (1000 * 60 * 60 * 24)
);

const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
const minutes = Math.floor((distance / (1000 * 60)) % 60);
const seconds = Math.floor((distance / 1000) % 60);

// D-Day 표시
if (days === 0) {
  ddayBadge.innerText = "D-DAY";
} else {
  ddayBadge.innerText = `D-${days}`;
}

daysEl.innerText = String(days).padStart(2, "0");
hoursEl.innerText = String(hours).padStart(2, "0");
minEl.innerText = String(minutes).padStart(2, "0");
secEl.innerText = String(seconds).padStart(2, "0");
}

let currentIndex = 0;


// 🔻현재 사진 9장으로 되어있음
const galleryImages = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg",
  "images/photo6.jpg",
  "images/photo7.jpg",
  "images/photo8.jpg",


// 🔻사진 추가시 jpg" 끝에 , 찍고 복사 붙여넣기
  "images/photo9.jpg"


// 🔻아래에 복사 붙여넣기 하고 마지막 번호는 , 뺴기


];

function openModal(index){
    currentIndex = index;

    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");

    modalImg.src = galleryImages[currentIndex];

  document.getElementById("modal-counter").innerText =
  (currentIndex + 1) + " / " + galleryImages.length;

    modal.style.display = "flex";

  document.body.style.overflow = "hidden";
}
function closeModal() {
  const modal = document.getElementById("image-modal");
  if (modal) {
    modal.style.display = "none";

    document.body.style.overflow = "";
  }
}
function changePhoto(direction) {
    currentIndex = currentIndex + direction;

    if (currentIndex < 0) {
        currentIndex = galleryImages.length - 1;
    }

    if (currentIndex >= galleryImages.length) {
        currentIndex = 0;
    }

    document.getElementById("modal-img").src = galleryImages[currentIndex];

    document.getElementById("modal-counter").innerText =
        (currentIndex + 1) + " / " + galleryImages.length;
}

let startX = 0;

document.getElementById("modal-img").addEventListener("touchstart", function(e){
    startX = e.touches[0].clientX;
});

document.getElementById("modal-img").addEventListener("touchend", function(e){
    const endX = e.changedTouches[0].clientX;

    if(startX - endX > 50){
        changePhoto(1);
    }

    if(endX - startX > 50){
        changePhoto(-1);
    }
});

function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const arrow = button.querySelector(".arrow");
  if (!content || !arrow) return;
  const isOpen = content.style.display === "block";
  content.style.display = isOpen ? "none" : "block";
  arrow.innerText = isOpen ? "▼" : "▲";
  if (isOpen) {
    button.classList.remove("active");
  } else {
    button.classList.add("active");
  }
}
function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(function () {
      alert("계좌번호가 클립보드에 복사되었습니다.");
    })
    .catch(function () {
      alert("복사 실패! 계좌번호를 길게 눌러 직접 복사해주세요.");
    });
}
let kakaoMapRendered = false;
function renderKakaoMap() {
  if (kakaoMapRendered) return;
  if (typeof daum === "undefined" || !daum.roughmap || !daum.roughmap.Lander) return;
  new daum.roughmap.Lander({

// 🔻네비게이션 설정 : 카카오맵에서 소스생성하기 진행(현재 웨딩시그니처로 되어있음, 가이드북 참고)
    timestamp: "1781420580863",
    key: "2qxf2rzqqciv",

    mapWidth: "100%",
    mapHeight: "280"
  }).render();
  kakaoMapRendered = true;
}

window.addEventListener("load", function () {
  const intro = document.getElementById("intro-overlay");

  if (intro) {
    setTimeout(function () {
      intro.classList.remove("loading");
    }, 300);
  }
});

// 1. Supabase 클라이언트 초기화 (본인의 URL과 ANON KEY 입력)
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_uWOLpctq1a3M4elXZa-5Aw_Yuim-LUA';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('guestbook-form');
  const listContainer = document.getElementById('guestbook-list');

  // 방명록 목록 불러오기
  async function fetchGuestbook() {
    listContainer.innerHTML = '<p style="text-align:center; color:#888;">로딩 중...</p>';

    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('방명록 불러오기 실패:', error);
      listContainer.innerHTML = '<p style="text-align:center; color:#888;">메시지를 불러오지 못했습니다.</p>';
      return;
    }

    renderGuestbook(data);
  }

  // 방명록 화면에 렌더링
  function renderGuestbook(messages) {
    if (!messages || messages.length === 0) {
      listContainer.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">첫 축하 메시지를 남겨주세요!</p>';
      return;
    }

    listContainer.innerHTML = messages.map(item => {
      const date = new Date(item.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      return `
        <div class="guestbook-card" data-id="${item.id}">
          <div class="card-header">
            <span class="card-author">${escapeHtml(item.name)}</span>
            <span class="card-date">${date}</span>
          </div>
          <div class="card-text">${escapeHtml(item.message)}</div>
        </div>
      `;
    }).join('');
  }

  // 새 방명록 작성 제출
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('gb-name');
    const passwordInput = document.getElementById('gb-password');
    const messageInput = document.getElementById('gb-message');

    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      alert('이름과 메시지를 입력해 주세요.');
      return;
    }

    const { error } = await supabase
      .from('guestbook')
      .insert([{ name, password, message }]);

    if (error) {
      alert('등록 중 오류가 발생했습니다.');
      console.error(error);
    } else {
      alert('축하 메시지가 등록되었습니다!');
      form.reset();
      fetchGuestbook(); // 목록 새로고침
    }
  });

  // XSS 방지용 HTML 이스케이프 함수
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 초기 로드 시 목록 불러오기
  fetchGuestbook();
});
