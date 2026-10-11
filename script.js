const AR_LETTERS = [
  { l: 'أ', w: 'أسد', e: '🦁' }, { l: 'ب', w: 'بطة', e: '🦆' },
  { l: 'ت', w: 'تفاحة', e: '🍎' }, { l: 'ث', w: 'ثعلب', e: '🦊' },
  { l: 'ج', w: 'جمل', e: '🐪' }, { l: 'ح', w: 'حصان', e: '🐴' },
  { l: 'خ', w: 'خروف', e: '🐑' }, { l: 'د', w: 'دجاجة', e: '🐔' },
  { l: 'ذ', w: 'ذئب', e: '🐺' }, { l: 'ر', w: 'ريشة', e: '🪶' },
  { l: 'ز', w: 'زرافة', e: '🦒' }, { l: 'س', w: 'سمكة', e: '🐟' },
  { l: 'ش', w: 'شمس', e: '☀️' }, { l: 'ص', w: 'صقر', e: '🦅' },
  { l: 'ض', w: 'ضفدع', e: '🐸' }, { l: 'ط', w: 'طائرة', e: '✈️' },
  { l: 'ظ', w: 'ظرف', e: '✉️' }, { l: 'ع', w: 'عين', e: '👁️' },
  { l: 'غ', w: 'غزال', e: '🦌' }, { l: 'ف', w: 'فيل', e: '🐘' },
  { l: 'ق', w: 'قمر', e: '🌙' }, { l: 'ك', w: 'كتاب', e: '📚' },
  { l: 'ل', w: 'ليمون', e: '🍋' }, { l: 'م', w: 'موز', e: '🍌' },
  { l: 'ن', w: 'نحلة', e: '🐝' }, { l: 'ه', w: 'هدية', e: '🎁' },
  { l: 'و', w: 'وردة', e: '🌹' }, { l: 'ي', w: 'يد', e: '✋' }
];

const EN_LETTERS = [
  { l: 'A', w: 'Apple', e: '🍎' }, { l: 'B', w: 'Ball', e: '⚽' },
  { l: 'C', w: 'Cat', e: '🐱' }, { l: 'D', w: 'Dog', e: '🐶' },
  { l: 'E', w: 'Elephant', e: '🐘' }, { l: 'F', w: 'Fish', e: '🐟' },
  { l: 'G', w: 'Grapes', e: '🍇' }, { l: 'H', w: 'Horse', e: '🐴' },
  { l: 'I', w: 'Ice Cream', e: '🍦' }, { l: 'J', w: 'Juice', e: '🧃' },
  { l: 'K', w: 'Key', e: '🔑' }, { l: 'L', w: 'Lion', e: '🦁' },
  { l: 'M', w: 'Monkey', e: '🐵' }, { l: 'N', w: 'Nose', e: '👃' },
  { l: 'O', w: 'Orange', e: '🍊' }, { l: 'P', w: 'Panda', e: '🐼' },
  { l: 'Q', w: 'Queen', e: '👑' }, { l: 'R', w: 'Rabbit', e: '🐰' },
  { l: 'S', w: 'Sun', e: '☀️' }, { l: 'T', w: 'Tiger', e: '🐯' },
  { l: 'U', w: 'Umbrella', e: '☂️' }, { l: 'V', w: 'Violin', e: '🎻' },
  { l: 'W', w: 'Watermelon', e: '🍉' }, { l: 'X', w: 'Xylophone', e: '🎹' },
  { l: 'Y', w: 'Yo-Yo', e: '🪀' }, { l: 'Z', w: 'Zebra', e: '🦓' }
];

const TOTAL_QUIZ_QUESTIONS = 10;

const state = {
  lang: 'ar', mode: 'practice', letterIndex: 0, score: 0,
  qNum: 0, totalQ: TOTAL_QUIZ_QUESTIONS, currentQ: null,
  answered: false, locked: false
};

function currentLetters() { return state.lang === 'ar' ? AR_LETTERS : EN_LETTERS; }
function langCode() { return state.lang === 'ar' ? 'ar-SA' : 'en-US'; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function randInt(n) { return Math.floor(Math.random() * n); }
function pickRandom(arr) { return arr[randInt(arr.length)]; }
function $(id) { return document.getElementById(id); }

let voices = [];
function loadVoices() { if ('speechSynthesis' in window) voices = window.speechSynthesis.getVoices() || []; }
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 300);
  setTimeout(loadVoices, 1200);
}
function stopSpeaking() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
function speak(text, code) {
  if (!('speechSynthesis' in window) || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    const lang = code || langCode();
    u.lang = lang; u.rate = 0.82; u.pitch = 1.08; u.volume = 1;
    const prefix = lang.slice(0, 2).toLowerCase();
    const v = voices.find(x => (x.lang || '').replace('_', '-').toLowerCase().startsWith(prefix) && x.localService)
           || voices.find(x => (x.lang || '').replace('_', '-').toLowerCase().startsWith(prefix));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch (err) {}
}

let audioCtx = null;
function beep(freq, duration, type) {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    o.connect(g); g.connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.start(t); o.stop(t + duration + 0.02);
  } catch (err) {}
}
function soundCorrect() {
  beep(680, 0.12); setTimeout(() => beep(900, 0.16), 110); setTimeout(() => beep(1150, 0.2), 230);
}
function soundWrong() { beep(220, 0.22, 'sawtooth'); setTimeout(() => beep(160, 0.28, 'sawtooth'), 160); }
function soundClick() { beep(520, 0.06, 'triangle'); }

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $('screen-' + name);
  if (el) el.classList.add('active');
}

function startLang(lang) {
  soundClick();
  state.lang = lang; state.score = 0; state.letterIndex = 0;
  $('menu-lang').textContent = lang === 'ar' ? '🇸🇦 العربية' : '🇬🇧 English';
  $('menu-title').textContent = lang === 'ar' ? 'اختر النشاط' : 'Choose an Activity';
  $('menu-sub').textContent = lang === 'ar' ? 'ماذا تريد أن تتعلم اليوم؟' : 'What do you want to learn today?';
  showScreen('menu');
  speak(lang === 'ar' ? 'هيا نتعلم الحروف العربية' : 'Let us learn English letters', langCode());
}

function startLearn() {
  soundClick();
  state.mode = 'learn'; state.letterIndex = 0;
  renderLetter(true);
  showScreen('learn');
}

function renderLetter(autoSpeak) {
  const letters = currentLetters();
  const item = letters[state.letterIndex];
  $('learn-letter').textContent = item.l;
  $('learn-emoji').textContent = item.e;
  const wordEl = $('learn-word');
  wordEl.textContent = item.w;
  wordEl.classList.toggle('en', state.lang === 'en');
  $('learn-progress').textContent = (state.letterIndex + 1) + ' / ' + letters.length;
  $('prev-btn').disabled = (state.letterIndex === 0);
  $('next-btn').disabled = (state.letterIndex === letters.length - 1);
  if (autoSpeak) {
    stopSpeaking();
    setTimeout(() => speak(item.l, langCode()), 180);
    setTimeout(() => speak(item.w, langCode()), 1150);
  }
}
function speakCurrentLetter() {
  const item = currentLetters()[state.letterIndex];
  soundClick(); speak(item.l, langCode());
}
function speakCurrentWord() {
  const item = currentLetters()[state.letterIndex];
  soundClick(); speak(item.w, langCode());
}
function nextLetter() {
  const letters = currentLetters();
  if (state.letterIndex < letters.length - 1) { state.letterIndex++; soundClick(); renderLetter(true); }
}
function prevLetter() {
  if (state.letterIndex > 0) { state.letterIndex--; soundClick(); renderLetter(true); }
}

function pickOptions(correctObj, key, count) {
  const pool = currentLetters();
  const opts = [correctObj];
  const used = new Set([correctObj[key]]);
  let guard = 0;
  while (opts.length < count && guard < 800) {
    guard++;
    const cand = pool[randInt(pool.length)];
    if (!used.has(cand[key])) { used.add(cand[key]); opts.push(cand); }
  }
  return shuffle(opts);
}

function buildQuestion() {
  const letters = currentLetters();
  const correct = letters[randInt(letters.length)];
  const type = Math.random() < 0.5 ? 'letter' : 'word';
  if (type === 'letter') {
    return { type: 'letter', correct, textAr: 'ما هو الحرف الأول من هذه الكلمة؟',
      textEn: 'What is the first letter of this word?', options: pickOptions(correct, 'l', 4) };
  } else {
    return { type: 'word', correct, textAr: 'اختر الكلمة التي تبدأ بهذا الحرف',
      textEn: 'Choose the word that starts with this letter', options: pickOptions(correct, 'w', 4) };
  }
}

function startGame(mode) {
  soundClick();
  state.mode = mode; state.score = 0; state.qNum = 0;
  state.answered = false; state.locked = false;
  state.totalQ = TOTAL_QUIZ_QUESTIONS;
  showScreen('game');
  nextQuestion();
}

function nextQuestion() {
  state.answered = false; state.locked = false;
  state.currentQ = buildQuestion();
  renderQuestion();
  updateHud();
}

function updateHud() {
  const hud = $('game-hud');
  if (state.mode === 'quiz') {
    const current = Math.min(state.qNum + 1, state.totalQ);
    hud.textContent = (state.lang === 'ar' ? 'سؤال ' : 'Q ') + current + '/' + state.totalQ + '  ⭐ ' + state.score;
  } else {
    hud.textContent = '✅ ' + state.score;
  }
}

function renderQuestion() {
  const q = state.currentQ;
  const isAr = state.lang === 'ar';
  const c = q.correct;

  const qt = $('question-text');
  qt.textContent = '';
  const main = document.createElement('span');
  main.textContent = isAr ? q.textAr : q.textEn;
  qt.appendChild(main);
  if (isAr) {
    const en = document.createElement('span');
    en.className = 'en-line';
    en.textContent = q.textEn;
    qt.appendChild(en);
  }

  const prompt = $('prompt-area');
  prompt.textContent = '';
  if (q.type === 'letter') {
    const emoji = document.createElement('div');
    emoji.className = 'prompt-emoji';
    emoji.textContent = c.e;
    const word = document.createElement('div');
    word.className = 'prompt-word' + (isAr ? '' : ' en');
    word.textContent = c.w;
    prompt.append(emoji, word);
    prompt.onclick = () => { soundClick(); speak(c.w, langCode()); };
  } else {
    const letter = document.createElement('div');
    letter.className = 'prompt-letter';
    letter.textContent = c.l;
    prompt.appendChild(letter);
    prompt.onclick = () => { soundClick(); speak(c.l, langCode()); };
  }

  const area = $('options-area');
  area.textContent = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    if (q.type === 'letter') {
      btn.className = 'opt letter-opt';
      btn.textContent = opt.l;
    } else {
      btn.className = 'opt word-opt';
      const em = document.createElement('span');
      em.className = 'opt-emoji';
      em.textContent = opt.e;
      const wd = document.createElement('span');
      wd.className = 'opt-word';
      wd.textContent = opt.w;
      if (!isAr) wd.style.direction = 'ltr';
      btn.append(em, wd);
    }
    btn.addEventListener('click', () => handleAnswer(opt, btn));
    area.appendChild(btn);
  });

  const fb = $('feedback');
  fb.textContent = '';
  fb.className = 'feedback';

  setTimeout(() => {
    if (state.currentQ === q && !state.answered) {
      speak(q.type === 'letter' ? c.w : c.l, langCode());
    }
  }, 250);
}

function handleAnswer(opt, btn) {
  if (state.locked) return;
  state.locked = true;
  state.answered = true;

  const q = state.currentQ;
  const isAr = state.lang === 'ar';
  const key = q.type === 'letter' ? 'l' : 'w';
  const isCorrect = opt[key] === q.correct[key];
  const buttons = Array.from($('options-area').children);
  const fb = $('feedback');

  buttons.forEach(b => { b.disabled = true; });

  if (isCorrect) {
    btn.classList.add('correct');
    state.score++;
    soundCorrect();
    fb.textContent = pickRandom(isAr
      ? ['أحسنت! 🌟', 'رائع! 👏', 'ممتاز! 🎉', 'برافو! 🥳']
      : ['Great job! 🌟', 'Awesome! 👏', 'Excellent! 🎉', 'Bravo! 🥳']);
    fb.className = 'feedback ok';
    speak(isAr ? 'أحسنت' : 'Great job', langCode());
  } else {
    btn.classList.add('wrong');
    const idx = q.options.findIndex(o => o[key] === q.correct[key]);
    if (buttons[idx]) buttons[idx].classList.add('correct');
    soundWrong();
    fb.textContent = isAr ? 'حاول مرة أخرى 💪' : 'Try again 💪';
    fb.className = 'feedback no';
    speak(q.correct[key], langCode());
  }

  updateHud();

  setTimeout(() => {
    if (state.mode === 'quiz') {
      state.qNum++;
      if (state.qNum >= state.totalQ) { finishQuiz(); return; }
    }
    nextQuestion();
  }, isCorrect ? 1300 : 2000);
}

function finishQuiz() {
  const isAr = state.lang === 'ar';
  const ratio = state.score / state.totalQ;
  const starCount = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0;

  $('result-title').textContent = isAr ? 'انتهى الاختبار! 🎉' : 'Quiz finished! 🎉';
  $('result-stars').textContent = '⭐'.repeat(starCount) + '☆'.repeat(3 - starCount);
  $('result-score').textContent = state.score + ' / ' + state.totalQ;

  let msg;
  if (starCount === 3) msg = isAr ? 'أنت بطل الحروف! 🏆' : 'You are a letters champion! 🏆';
  else if (starCount === 2) msg = isAr ? 'عمل رائع، استمر! 👏' : 'Great work, keep going! 👏';
  else msg = isAr ? 'حاول مرة أخرى وستتحسن! 💪' : 'Try again, you will improve! 💪';
  $('result-msg').textContent = msg;

  showScreen('result');
  if (starCount > 0) soundCorrect(); else soundWrong();
  speak(msg.replace(/[^\p{L}\p{N}\s!]/gu, ''), langCode());
}

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
