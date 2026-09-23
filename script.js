// ================= 1. 인트로 봉투 열기 & 메인 전환 =================
function openEnvelope() {
  const intro = document.getElementById('intro-overlay');
  const mainContent = document.getElementById('main-content');
  const bgm = document.getElementById('bgm');

  if (intro) {
    // 인트로 봉투 열림 애니메이션 적용
    intro.classList.add('open');

    // 메인 콘텐츠 보이기
    if (mainContent) {
      mainContent.style.display = 'block';
      mainContent.classList.add('fade-in');
    }

    // BGM 자동 재생 시도
    if (bgm) {
      bgm.play().catch(function (e) {
        console.log("BGM 자동 재생 제한:", e);
      });
    }

    // 0.8초 후 인트로 레이어 완전 제거
    setTimeout(() => {
      intro.style.display = 'none';
      window.scrollTo(0, 0);
    }, 800);
  }
}

// BGM 토글 함수
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

// ================= 2. 웨딩 일정 & 달력/카운트다운 =================
const WEDDING_YEAR = 2026;
const WEDDING_MONTH = 11;
const WEDDING_DAY = 28;
const WEDDING_HOUR = 13;
const WEDDING_MINUTE = 0;

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
  fetchGuestbook(); // 방명록 목록 불러오기
});

// 달력 렌더링
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

// 카운트다운 타이머
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

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  ddayBadge.innerText = `D-${days}`;
  daysEl.innerText = String(days).padStart(2, "0");
  hoursEl.innerText = String(hours).padStart(2, "0");
  minEl.innerText = String(minutes).padStart(2, "0");
  secEl.innerText = String(seconds).padStart(2, "0");
}

// ================= 3. 갤러리 모달 =================
let currentImageIndex = 0;
const totalImages = 15; // 전체 갤러리 이미지 개수

function openModal(index) {
  currentImageIndex = index;
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const modalCounter = document.getElementById("modalCounter");

  if (modal && modalImg) {
    modal.style.display = "flex";
    modalImg.src = `images/photo${index + 1}.jpg`;
    if (modalCounter) {
      modalCounter.innerText = `${index + 1} / ${totalImages}`;
    }
  }
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  if (modal) modal.style.display = "none";
}

function changeImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) currentImageIndex = totalImages - 1;
  if (currentImageIndex >= totalImages) currentImageIndex = 0;
  openModal(currentImageIndex);
}

// ================= 4. Supabase 방명록 연동 =================
const SUPABASE_URL = 'https://afqlaropaguqopfuxcws.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_uWOLpctq1a3M4elXZa-5Aw_Yuim-LUA'; // 본인의 Supabase Anon Key를 넣어주세요.

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// 방명록 불러오기
async function fetchGuestbook() {
  const listEl = document.getElementById("guestbook-list");
  if (!listEl) return;

  if (!supabaseClient) {
    listEl.innerHTML = `<p style="text-align:center; font-size:0.8rem; color:#888;">첫 축하글의 주인공이 되어주세요! 💕</p>`;
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      listEl.innerHTML = `<p style="text-align:center; font-size:0.8rem; color:#888;">첫 축하글의 주인공이 되어주세요! 💕</p>`;
      return;
    }

    listEl.innerHTML = data.map(item => `
      <div class="guestbook-card">
        <div class="card-header">
          <span class="card-author">${escapeHtml(item.name)}</span>
          <span class="card-date">${new Date(item.created_at).toLocaleDateString()}</span>
        </div>
        <div class="card-text">${escapeHtml(item.message)}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error("방명록 로딩 실패:", err);
  }
}

// 방명록 폼 제출
const guestbookForm = document.getElementById("guestbook-form");
if (guestbookForm) {
  guestbookForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("guest-name").value.trim();
    const password = document.getElementById("guest-pw").value.trim();
    const message = document.getElementById("guest-message").value.trim();

    if (!name || !message) {
      alert("성함과 축하 메시지를 입력해 주세요.");
      return;
    }

    if (!supabaseClient) {
      alert("Supabase 설정이 완료되지 않았습니다.");
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('guestbook')
        .insert([{ name, password, message }]);

      if (error) throw error;

      alert("축하 글이 성공적으로 등록되었습니다! 💕");
      guestbookForm.reset();
      fetchGuestbook();
    } catch (err) {
      console.error("방명록 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================= 5. 계좌번호 복사 기능 =================
function copyAccount(accountNumber) {
  navigator.clipboard.writeText(accountNumber).then(() => {
    alert("계좌번호가 복사되었습니다.");
  }).catch(err => {
    // 구형 브라우저 대응
    const textarea = document.createElement("textarea");
    textarea.value = accountNumber;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("계좌번호가 복사되었습니다.");
  });
}

// ================= 6. 카카오톡 공유하기 =================
function shareKakao() {
  if (typeof Kakao !== 'undefined') {
    if (!Kakao.isInitialized()) {
      // 카카오 디벨로퍼스에서 발급받은 JavaScript 키를 입력하세요.
      Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); 
    }
    
    Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '석수진 ♡ 홍길동 결혼식에 초대합니다',
        description: '2026년 11월 28일 토요일 오후 1시\n홀리데이 인 광주 별관',
        imageUrl: window.location.origin + '/images/photo1.jpg',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '모바일 청첩장 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  } else {
    alert("카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
  }
}
