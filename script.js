/* ===========================
   QUIZ MASTER — script.js
   =========================== */

// ──────────────────────────────
// คำถามทั้งหมด — แก้ไขได้ที่นี่
// ──────────────────────────────
const questions = [
  {
    question: 'การพัฒนาเว็บสนุกไหม?',
    answers: [
      { text: 'สนุกมาก!!!', correct: true },
      { text: 'ไม่เลย', correct: false },
      { text: 'พอได้', correct: false },
      { text: 'ไม่รู้', correct: false }
    ]
  },

  {
    question: 'HTML ใช้สำหรับอะไร?',
    answers: [
      { text: 'โครงสร้างเว็บ', correct: true },
      { text: 'แต่งสีเว็บ', correct: false },
      { text: 'เก็บข้อมูล', correct: false },
      { text: 'ตัดต่อวิดีโอ', correct: false }
    ]
  },

  {
    question: 'CSS มีหน้าที่อะไร?',
    answers: [
      { text: 'ตกแต่งหน้าเว็บ', correct: true },
      { text: 'สร้างฐานข้อมูล', correct: false },
      { text: 'เขียน AI', correct: false },
      { text: 'ทำเสียงเพลง', correct: false }
    ]
  },

  {
    question: 'JavaScript ใช้ทำอะไร?',
    answers: [
      { text: 'เพิ่มความโต้ตอบให้เว็บ', correct: true },
      { text: 'ทำอาหาร', correct: false },
      { text: 'วาดรูป', correct: false },
      { text: 'สร้างเอกสาร', correct: false }
    ]
  },

  {
    question: 'ชอบเขียนโค้ดช่วงเวลาไหน?',
    answers: [
      { text: 'ตอนดึก', correct: true },
      { text: 'ตอนง่วง', correct: false },
      { text: 'ตอนรถติด', correct: false },
      { text: 'ไม่เคยเขียน', correct: false }
    ]
  },

  {
    question: 'Debug โค้ดเป็นเรื่องแบบไหน?',
    answers: [
      { text: 'ท้าทายและสนุก', correct: true },
      { text: 'ง่ายมาก', correct: false },
      { text: 'ไม่จำเป็น', correct: false },
      { text: 'น่าเบื่อที่สุด', correct: false }
    ]
  },

  {
    question: 'Framework ที่นิยมใช้กับเว็บคืออะไร?',
    answers: [
      { text: 'React', correct: true },
      { text: 'Photoshop', correct: false },
      { text: 'Excel', correct: false },
      { text: 'Word', correct: false }
    ]
  },

  {
    question: 'การเขียนเว็บต้องใช้อินเทอร์เน็ตไหม?',
    answers: [
      { text: 'ไม่เสมอไป', correct: true },
      { text: 'ต้องใช้ตลอด', correct: false },
      { text: 'ใช้ไม่ได้เลย', correct: false },
      { text: 'เฉพาะมือถือ', correct: false }
    ]
  },

  {
    question: 'สีที่นิยมใช้ใน UI Modern คือ?',
    answers: [
      { text: 'Pastel และ Gradient', correct: true },
      { text: 'สีมืดทั้งหมด', correct: false },
      { text: 'สีสะท้อนแสง', correct: false },
      { text: 'ไม่มีสี', correct: false }
    ]
  },

  {
    question: 'อยากเป็น Frontend Developer ไหม?',
    answers: [
      { text: 'อยากมาก!', correct: true },
      { text: 'ไม่สนใจ', correct: false },
      { text: 'ยังไม่แน่ใจ', correct: false },
      { text: 'คืออะไร?', correct: false }
    ]
  }
];

// ──────────────────────────────
// ค่าคงที่
// ──────────────────────────────
const TIMER_MAX    = 10;         // วินาทีต่อข้อ
const CIRCUMFERENCE = 2 * Math.PI * 18; // เส้นรอบวง SVG (r=18)
const LABELS        = ['A', 'B', 'C', 'D'];

// ──────────────────────────────
// DOM References
// ──────────────────────────────
const $ = id => document.getElementById(id);

const el = {
  streakToast:   $('streakToast'),
  startBtn:      $('startBtn'),
  highscoreBox:  $('highscoreBox'),
  highscoreVal:  $('highscoreVal'),
  totalQCount:   $('totalQCount'),
  qProgress:     $('qProgress'),
  scoreDisplay:  $('scoreDisplay'),
  timerCircle:   $('timerCircle'),
  timerText:     $('timerText'),
  progressFill:  $('progressFill'),
  questionText:  $('questionText'),
  answersGrid:   $('answersGrid'),
  nextBtn:       $('nextBtn'),
  resultEmoji:   $('resultEmoji'),
  resultTitle:   $('resultTitle'),
  resultScore:   $('resultScore'),
  resultSub:     $('resultSub'),
  resultGrid:    $('resultGrid'),
  reviewList:    $('reviewList'),
  restartBtn:    $('restartBtn'),
};

// ──────────────────────────────
// State
// ──────────────────────────────
let shuffled, currentIdx, score, streak, timer, timeLeft, answered, history, highscore;

// ──────────────────────────────
// Utilities
// ──────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function saveHighscore(s) {
  try { localStorage.setItem('quizmaster_hs', s); } catch(e) {}
}

function loadHighscore() {
  try { return parseInt(localStorage.getItem('quizmaster_hs')) || 0; } catch(e) { return 0; }
}

// ──────────────────────────────
// Start Screen Setup
// ──────────────────────────────
function initStartScreen() {
  el.totalQCount.textContent = questions.length;
  highscore = loadHighscore();
  if (highscore > 0) {
    el.highscoreBox.style.display = 'flex';
    el.highscoreVal.textContent   = highscore;
  }
}

// ──────────────────────────────
// Start Game
// ──────────────────────────────
function startGame() {
  shuffled    = shuffleArray(questions);
  currentIdx  = 0;
  score       = 0;
  streak      = 0;
  history     = [];
  el.scoreDisplay.textContent = '0';
  showScreen('screen-quiz');
  showQuestion();
}

// ──────────────────────────────
// Show Question
// ──────────────────────────────
function showQuestion() {
  answered = false;
  const q  = shuffled[currentIdx];

  el.qProgress.textContent   = `ข้อ ${currentIdx + 1} / ${shuffled.length}`;
  el.progressFill.style.width = `${(currentIdx / shuffled.length) * 100}%`;
  el.questionText.textContent = q.question;
  el.nextBtn.classList.remove('show');

  // Clear & build answer buttons
  el.answersGrid.innerHTML = '';
  const shuffledAnswers = shuffleArray(q.answers);

  shuffledAnswers.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn-answer';
    btn.innerHTML = `<span class="ans-label">${LABELS[i]}</span><span>${ans.text}</span>`;
    btn.dataset.correct = ans.correct;
    btn.dataset.text    = ans.text;
    btn.addEventListener('click', () => selectAnswer(btn));
    el.answersGrid.appendChild(btn);
  });

  startTimer();
}

// ──────────────────────────────
// Timer
// ──────────────────────────────
function startTimer() {
  clearInterval(timer);
  timeLeft = TIMER_MAX;
  updateTimerUI(timeLeft);

  timer = setInterval(() => {
    timeLeft--;
    updateTimerUI(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!answered) timeUp();
    }
  }, 1000);
}

function updateTimerUI(t) {
  el.timerText.textContent = t;

  const offset = CIRCUMFERENCE * (1 - t / TIMER_MAX);
  el.timerCircle.style.strokeDashoffset = offset;

  // สีเปลี่ยนตามเวลาที่เหลือ
  if (t > 8) {
    el.timerCircle.style.stroke = '#7F77DD';
    el.timerText.style.color    = '';
  } else if (t > 4) {
    el.timerCircle.style.stroke = '#EF9F27';
    el.timerText.style.color    = '#BA7517';
  } else {
    el.timerCircle.style.stroke = '#E24B4A';
    el.timerText.style.color    = '#E24B4A';
  }
}

function timeUp() {
  answered = true;
  streak   = 0;
  const correctAns = shuffled[currentIdx].answers.find(a => a.correct);
  history.push({
    q: shuffled[currentIdx].question,
    userAns: 'หมดเวลา ⏱',
    correctAns: correctAns.text,
    isCorrect: false
  });
  revealAnswers(null);
  el.nextBtn.classList.add('show');
}

// ──────────────────────────────
// Select Answer
// ──────────────────────────────
function selectAnswer(btn) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const isCorrect  = btn.dataset.correct === 'true';
  const correctAns = shuffled[currentIdx].answers.find(a => a.correct);

  history.push({
    q: shuffled[currentIdx].question,
    userAns: btn.dataset.text,
    correctAns: correctAns.text,
    isCorrect
  });

  if (isCorrect) {
    // คะแนนโบนัสตามความเร็ว: 50 base + สูงสุด 50 bonus
    
    score += 1;
    streak++;
    el.scoreDisplay.textContent = score;
    if (streak >= 2) showStreak();
  } else {
    streak = 0;
  }

  revealAnswers(btn);
  el.nextBtn.classList.add('show');
}

// ──────────────────────────────
// Reveal Correct / Wrong
// ──────────────────────────────
function revealAnswers(selected) {
  document.querySelectorAll('.btn-answer').forEach(btn => {
    btn.classList.add('revealed');
    const label = btn.querySelector('.ans-label');
    if (btn.dataset.correct === 'true') {
      btn.classList.add('correct-ans');
      label.textContent = '✓';
    } else if (btn === selected) {
      btn.classList.add('wrong-ans');
      label.textContent = '✗';
    }
  });
}

// ──────────────────────────────
// Streak Toast
// ──────────────────────────────
function showStreak() {
  const msgs = {
    2: '🔥 2 ข้อติด! +Streak',
    3: '⚡ 3 ข้อติด! กำลังมาแรง!',
    4: '🌟 4 ข้อติด! เหลือเชื่อ!',
    5: '🚀 5 ข้อติด! ยอดเยี่ยมมาก!',
  };
  el.streakToast.textContent = msgs[streak] || `🔥 ${streak} ข้อติด! ไม่หยุดเลย!`;
  el.streakToast.classList.add('show');
  setTimeout(() => el.streakToast.classList.remove('show'), 2000);
}

// ──────────────────────────────
// Next Question
// ──────────────────────────────
function nextQuestion() {
  currentIdx++;
  if (currentIdx < shuffled.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// ──────────────────────────────
// Show Result
// ──────────────────────────────
function showResult() {
  clearInterval(timer);
  el.progressFill.style.width = '100%';

  const correct = history.filter(h => h.isCorrect).length;
  const total   = shuffled.length;
  const pct     = Math.round((correct / total) * 100);

  // บันทึกสถิติสูงสุด
  if (score > highscore) {
    highscore = score;
    saveHighscore(score);
  }

  // เลือก Emoji และข้อความตามผลลัพธ์
  const tiers = [
    { min: 0,   emoji: '😅', title: 'ลองใหม่อีกครั้งนะ!' },
    { min: 1,   emoji: '😐', title: 'พอใช้ได้!' },
    { min: 2,   emoji: '😊', title: 'เก่งมาก!' },
    { min: 3,   emoji: '🎉', title: 'ยอดเยี่ยม!' },
    { min: 4,   emoji: '🏆', title: 'สมบูรณ์แบบ!' },
  ];
  const tier = tiers.filter(t => correct >= t.min).pop();

  el.resultEmoji.textContent = tier.emoji;
  el.resultTitle.textContent = tier.title;
  el.resultScore.textContent = score;
  el.resultSub.textContent   = `คะแนนจาก ${total} ข้อ`;

  // Stats grid
  el.resultGrid.innerHTML = `
    <div class="result-stat">
      <div class="result-stat-n">${correct}/${total}</div>
      <div class="result-stat-l">ตอบถูก</div>
    </div>
    <div class="result-stat">
      <div class="result-stat-n">${pct}%</div>
      <div class="result-stat-l">ความแม่นยำ</div>
    </div>
    <div class="result-stat">
      <div class="result-stat-n">${highscore}</div>
      <div class="result-stat-l">สถิติสูงสุด</div>
    </div>
  `;

  // Review list
  el.reviewList.innerHTML = '<div class="review-header">สรุปคำตอบ</div>';
  history.forEach(h => {
    const div = document.createElement('div');
    div.className = `review-item ${h.isCorrect ? 'r-correct' : 'r-wrong'}`;
    div.innerHTML = `
      <span class="review-icon">${h.isCorrect ? '✓' : '✗'}</span>
      <div>
        <div class="review-q">${h.q}</div>
        <div class="review-a">
          ${h.isCorrect
            ? `คุณตอบ: ${h.userAns}`
            : `คุณตอบ: ${h.userAns} &nbsp;•&nbsp; เฉลย: ${h.correctAns}`}
        </div>
      </div>
    `;
    el.reviewList.appendChild(div);
  });

  showScreen('screen-result');
}

// ──────────────────────────────
// Event Listeners
// ──────────────────────────────
el.startBtn.addEventListener('click', startGame);
el.nextBtn.addEventListener('click', nextQuestion);
el.restartBtn.addEventListener('click', startGame);

// ──────────────────────────────
// Init
// ──────────────────────────────
initStartScreen();
