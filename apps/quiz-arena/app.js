/* ==========================================================================
   Quiz Arena — Game Logic
   Vanilla JS, no dependencies. Persistence: localStorage.
   ========================================================================== */

(() => {
  'use strict';

  // ============================ Built-in Templates ============================
  const TEMPLATES = [
    {
      id: 'tpl-basic-vocab',
      name: 'Basic Vocabulary',
      description: '日常基本語彙 (色・果物・動物)',
      questions: [
        { type: 'multiple', question: 'What color is the sun? / 太陽は何色?', options: ['Red', 'Yellow', 'Blue', 'Green'], answer: 1, timeLimit: 15 },
        { type: 'multiple', question: 'Which one is a fruit?', options: ['Carrot', 'Cabbage', 'Apple', 'Onion'], answer: 2, timeLimit: 15 },
        { type: 'multiple', question: 'Which animal says "meow"?', options: ['Dog', 'Cat', 'Cow', 'Pig'], answer: 1, timeLimit: 15 },
        { type: 'truefalse', question: 'A "banana" is yellow.', answer: true, timeLimit: 10 },
        { type: 'typed', question: 'What do you call this color: 🟦 (one word, in English)', answer: 'blue', timeLimit: 20 },
        { type: 'multiple', question: 'How many days are in a week?', options: ['Five', 'Six', 'Seven', 'Eight'], answer: 2, timeLimit: 12 },
        { type: 'multiple', question: 'Which is a vegetable?', options: ['Strawberry', 'Banana', 'Spinach', 'Mango'], answer: 2, timeLimit: 15 },
        { type: 'truefalse', question: 'A "kitten" is a baby cat.', answer: true, timeLimit: 10 },
      ],
    },
    {
      id: 'tpl-past-tense',
      name: 'Past Tense Practice',
      description: '不規則動詞・規則動詞の過去形',
      questions: [
        { type: 'multiple', question: 'Past tense of "go"?', options: ['goed', 'went', 'gone', 'going'], answer: 1, timeLimit: 12 },
        { type: 'multiple', question: 'Past tense of "eat"?', options: ['eated', 'ate', 'eaten', 'eating'], answer: 1, timeLimit: 12 },
        { type: 'multiple', question: 'Past tense of "see"?', options: ['seed', 'saw', 'seen', 'sawed'], answer: 1, timeLimit: 12 },
        { type: 'typed', question: 'Past tense of "run" (one word)', answer: 'ran', timeLimit: 15 },
        { type: 'typed', question: 'Past tense of "buy" (one word)', answer: 'bought', timeLimit: 15 },
        { type: 'truefalse', question: '"Walked" is the past tense of "walk".', answer: true, timeLimit: 10 },
        { type: 'truefalse', question: 'The past tense of "swim" is "swimmed".', answer: false, timeLimit: 12 },
        { type: 'order', question: 'Make a sentence: (yesterday / I / school / went / to)', tokens: ['I', 'went', 'to', 'school', 'yesterday'], answer: ['I', 'went', 'to', 'school', 'yesterday'], timeLimit: 25 },
        { type: 'multiple', question: 'Choose the correct sentence:', options: ['She go to Tokyo last week.', 'She went to Tokyo last week.', 'She gone to Tokyo last week.', 'She going to Tokyo last week.'], answer: 1, timeLimit: 18 },
      ],
    },
    {
      id: 'tpl-greetings',
      name: 'Greetings & Phrases',
      description: 'あいさつ・基本表現',
      questions: [
        { type: 'multiple', question: 'How do you reply to "How are you?"', options: ['Goodbye!', "I'm fine, thank you.", 'You\'re welcome.', 'Nice to meet you.'], answer: 1, timeLimit: 15 },
        { type: 'multiple', question: 'What do you say when someone helps you?', options: ['Sorry.', 'Hello.', 'Thank you.', 'Goodbye.'], answer: 2, timeLimit: 12 },
        { type: 'truefalse', question: '"Good morning" is used in the afternoon.', answer: false, timeLimit: 10 },
        { type: 'multiple', question: 'Which is a polite request?', options: ['Give me water!', 'Water.', 'Could I have some water, please?', 'I want water now!'], answer: 2, timeLimit: 18 },
        { type: 'order', question: 'Reorder: (you / nice / meet / it\'s / to)', tokens: ["it's", 'nice', 'to', 'meet', 'you'], answer: ["it's", 'nice', 'to', 'meet', 'you'], timeLimit: 25 },
        { type: 'typed', question: 'What word fills the blank? "____ name is Tom."', answer: 'my', timeLimit: 15 },
      ],
    },
    {
      id: 'tpl-grammar',
      name: 'Grammar Essentials',
      description: 'be動詞・助動詞・前置詞',
      questions: [
        { type: 'multiple', question: 'I ___ a teacher.', options: ['am', 'is', 'are', 'be'], answer: 0, timeLimit: 12 },
        { type: 'multiple', question: 'They ___ from Canada.', options: ['is', 'am', 'are', 'be'], answer: 2, timeLimit: 12 },
        { type: 'multiple', question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1, timeLimit: 14 },
        { type: 'multiple', question: 'The book is ___ the table.', options: ['in', 'on', 'at', 'between'], answer: 1, timeLimit: 12 },
        { type: 'multiple', question: 'I will see you ___ Monday.', options: ['in', 'at', 'on', 'by'], answer: 2, timeLimit: 12 },
        { type: 'truefalse', question: '"Can" is used to express ability.', answer: true, timeLimit: 12 },
        { type: 'typed', question: 'Fill the blank: "He ___ play soccer." (means: he is able to)', answer: 'can', timeLimit: 15 },
        { type: 'order', question: 'Reorder: (do / what / you / hobbies / have)', tokens: ['what', 'hobbies', 'do', 'you', 'have'], answer: ['what', 'hobbies', 'do', 'you', 'have'], timeLimit: 25 },
      ],
    },
  ];

  // ============================ Storage ============================
  const STORAGE_KEY = 'quiz_arena_quizzes_v1';

  function loadCustomQuizzes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveCustomQuizzes(quizzes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  }

  // ============================ State ============================
  const state = {
    customQuizzes: loadCustomQuizzes(),
    selectedQuiz: null,
    players: [],
    currentScreen: 'home',
    game: null,
    editingQuiz: null,
    muted: false,
  };

  const PLAYER_COLORS = [
    'linear-gradient(135deg,#ff3d8a,#a855f7)',
    'linear-gradient(135deg,#22d3ee,#3b82f6)',
    'linear-gradient(135deg,#facc15,#f97316)',
    'linear-gradient(135deg,#22c55e,#10b981)',
    'linear-gradient(135deg,#ef4444,#dc2626)',
    'linear-gradient(135deg,#8b5cf6,#6366f1)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#14b8a6,#06b6d4)',
  ];

  // ============================ Sound (Web Audio API) ============================
  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { audioCtx = null; }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playTone(freq, duration = 0.15, type = 'sine', vol = 0.18, attack = 0.005) {
    if (state.muted || !audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  const sfx = {
    click: () => playTone(660, 0.08, 'square', 0.10),
    tick:  () => playTone(880, 0.04, 'square', 0.08),
    correct: () => {
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.18, 'triangle', 0.18), i * 70));
    },
    wrong: () => {
      [349.23, 277.18].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.30, 'sawtooth', 0.16), i * 90));
    },
    combo: () => {
      [659.25, 783.99, 987.77, 1318.51].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.10, 'triangle', 0.18), i * 50));
    },
    powerup: () => {
      [880, 1108.73, 1318.51, 1760].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.08, 'sine', 0.18), i * 40));
    },
    countdown: () => playTone(440, 0.10, 'square', 0.14),
    win: () => {
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.30, 'triangle', 0.20), i * 130));
    },
  };

  // ============================ Screen routing ============================
  const screenEls = {};
  document.querySelectorAll('.qa-screen').forEach((el) => {
    const id = el.id.replace('screen-', '');
    screenEls[id] = el;
  });

  function goTo(screen) {
    Object.values(screenEls).forEach((el) => el.classList.remove('is-active'));
    if (screenEls[screen]) screenEls[screen].classList.add('is-active');
    state.currentScreen = screen;
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (screen === 'select') renderSelectScreen();
    if (screen === 'players') renderPlayersScreen();
    if (screen === 'editor') renderEditor();
  }

  // Wire up basic navigation
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('[data-goto]');
    if (el) { ensureAudio(); sfx.click(); goTo(el.dataset.goto); }
  });

  // ============================ Home Screen ============================
  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ensureAudio();
      sfx.click();
      const action = btn.dataset.action;
      if (action === 'play') goTo('select');
      else if (action === 'create') {
        state.editingQuiz = { id: 'q-' + Date.now(), name: '', description: '', questions: [] };
        goTo('editor');
      }
      else if (action === 'library') goTo('select');
      else if (action === 'how') goTo('how');
    });
  });

  // ============================ Quiz Select Screen ============================
  function renderSelectScreen() {
    const tplList = document.getElementById('templateList');
    const cstList = document.getElementById('customList');

    tplList.innerHTML = TEMPLATES.map((q) => quizCardHtml(q, false)).join('');
    cstList.innerHTML = state.customQuizzes.length
      ? state.customQuizzes.map((q) => quizCardHtml(q, true)).join('')
      : '<div class="qa-empty">まだ自作クイズはありません。「クイズ作成」から作りましょう。</div>';

    // Wire up quiz selection / edit / delete
    document.querySelectorAll('.qa-quiz-item').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.qa-mini-btn')) return;
        const id = el.dataset.id;
        const isTemplate = el.dataset.template === 'true';
        const quiz = isTemplate ? TEMPLATES.find((q) => q.id === id) : state.customQuizzes.find((q) => q.id === id);
        if (quiz) {
          ensureAudio();
          sfx.click();
          state.selectedQuiz = quiz;
          goTo('players');
        }
      });
    });

    document.querySelectorAll('.qa-quiz-item .qa-mini-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.miniAction;
        const id = btn.closest('.qa-quiz-item').dataset.id;
        if (action === 'edit') {
          const quiz = state.customQuizzes.find((q) => q.id === id);
          if (quiz) {
            state.editingQuiz = JSON.parse(JSON.stringify(quiz));
            goTo('editor');
          }
        } else if (action === 'delete') {
          if (confirm('このクイズを削除しますか?')) {
            state.customQuizzes = state.customQuizzes.filter((q) => q.id !== id);
            saveCustomQuizzes(state.customQuizzes);
            renderSelectScreen();
          }
        }
      });
    });
  }

  function quizCardHtml(quiz, isCustom) {
    const desc = escapeHtml(quiz.description || '');
    const actions = isCustom
      ? `<div class="qa-quiz-item-actions"><button class="qa-mini-btn" data-mini-action="edit">編集</button><button class="qa-mini-btn danger" data-mini-action="delete">削除</button></div>`
      : '';
    return `
      <div class="qa-quiz-item" data-id="${quiz.id}" data-template="${!isCustom}">
        <div class="qa-quiz-item-name">${escapeHtml(quiz.name)}</div>
        <div class="qa-quiz-item-desc">${desc}</div>
        <div class="qa-quiz-item-meta"><span>📝 ${quiz.questions.length}問</span></div>
        ${actions}
      </div>`;
  }

  // ============================ Player Setup ============================
  function renderPlayersScreen() {
    if (!state.selectedQuiz) { goTo('select'); return; }
    document.getElementById('selectedQuizName').textContent = state.selectedQuiz.name;
    document.getElementById('selectedQuizCount').textContent = state.selectedQuiz.questions.length + '問';
    renderPlayerList();
    updateStartGameBtn();
  }

  function renderPlayerList() {
    const list = document.getElementById('playerList');
    if (state.players.length === 0) {
      list.innerHTML = '<div class="qa-empty">プレイヤーを追加してください (1人以上)</div>';
      return;
    }
    list.innerHTML = state.players.map((p, i) => `
      <div class="qa-player-chip">
        <div class="qa-player-avatar" style="background:${p.color}">${initialsOf(p.name)}</div>
        <div class="qa-player-name">${escapeHtml(p.name)}</div>
        <button class="qa-player-remove" data-idx="${i}" title="削除">×</button>
      </div>`).join('');
    list.querySelectorAll('.qa-player-remove').forEach((b) => {
      b.addEventListener('click', () => {
        state.players.splice(parseInt(b.dataset.idx, 10), 1);
        renderPlayerList();
        updateStartGameBtn();
      });
    });
  }

  function updateStartGameBtn() {
    document.getElementById('startGameBtn').disabled = state.players.length < 1;
  }

  document.getElementById('addPlayerBtn').addEventListener('click', addPlayer);
  document.getElementById('playerNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addPlayer();
  });

  function addPlayer() {
    const inp = document.getElementById('playerNameInput');
    const name = inp.value.trim();
    if (!name) return;
    if (state.players.length >= 8) { alert('プレイヤーは最大8人までです'); return; }
    state.players.push({
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name,
      color: PLAYER_COLORS[state.players.length % PLAYER_COLORS.length],
      score: 0,
      correctCount: 0,
      bestCombo: 0,
      powerups: { fiftyfifty: true, freeze: true, double: true },
      doubleNext: false,
    });
    inp.value = '';
    inp.focus();
    ensureAudio();
    sfx.click();
    renderPlayerList();
    updateStartGameBtn();
  }

  // ============================ Game Logic ============================
  document.getElementById('startGameBtn').addEventListener('click', () => {
    if (!state.selectedQuiz || state.players.length < 1) return;
    ensureAudio();
    state.players.forEach((p) => {
      p.score = 0;
      p.correctCount = 0;
      p.bestCombo = 0;
      p.combo = 0;
      p.powerups = { fiftyfifty: true, freeze: true, double: true };
      p.doubleNext = false;
    });
    state.game = {
      qIndex: 0,
      currentPlayerIndex: 0,
      timer: null,
      timeLeft: 0,
      timeLimit: 0,
      frozen: false,
      answered: false,
      startTime: 0,
    };
    goTo('game');
    nextQuestion();
  });

  function nextQuestion() {
    if (!state.game) return;
    if (state.game.qIndex >= state.selectedQuiz.questions.length) {
      finishGame();
      return;
    }
    const q = state.selectedQuiz.questions[state.game.qIndex];
    state.game.answered = false;
    state.game.frozen = false;
    state.game.timeLimit = q.timeLimit || 20;
    state.game.timeLeft = state.game.timeLimit;
    state.game.startTime = performance.now();
    renderQuestion(q);
    startTimer();
  }

  function renderQuestion(q) {
    const cur = state.players[state.game.currentPlayerIndex];
    document.getElementById('qNow').textContent = state.game.qIndex + 1;
    document.getElementById('qTotal').textContent = state.selectedQuiz.questions.length;
    document.getElementById('currentPlayerName').textContent =
      `${cur.name}${state.players.length > 1 ? ` (P${state.game.currentPlayerIndex + 1}/${state.players.length})` : ''}`;
    document.getElementById('questionType').textContent = typeLabel(q.type);
    document.getElementById('questionText').textContent = q.question;

    renderPowerups();
    renderAnswers(q);
    renderScoreboard();

    document.getElementById('feedbackOverlay').classList.remove('show');
  }

  function typeLabel(type) {
    return ({ multiple: 'MULTIPLE CHOICE', truefalse: 'TRUE / FALSE', typed: 'TYPE THE ANSWER', order: 'WORD ORDER' })[type] || '';
  }

  function renderPowerups() {
    const cur = state.players[state.game.currentPlayerIndex];
    const bar = document.getElementById('powerupBar');
    const items = [
      { k: 'fiftyfifty', icon: '✂️', label: '50/50' },
      { k: 'freeze', icon: '⏱', label: 'Time Freeze' },
      { k: 'double', icon: '×2', label: 'Double Points' },
    ];
    bar.innerHTML = items.map((it) => `
      <button class="qa-powerup" data-pu="${it.k}" ${cur.powerups[it.k] ? '' : 'disabled'}>
        <span class="qa-powerup-icon">${it.icon}</span>${it.label}
      </button>`).join('');

    bar.querySelectorAll('.qa-powerup').forEach((btn) => {
      btn.addEventListener('click', () => usePowerup(btn.dataset.pu));
    });
  }

  function usePowerup(kind) {
    const cur = state.players[state.game.currentPlayerIndex];
    if (!cur.powerups[kind] || state.game.answered) return;
    const q = state.selectedQuiz.questions[state.game.qIndex];

    if (kind === 'fiftyfifty') {
      if (q.type !== 'multiple') { alert('50/50 は4択問題でのみ使えます'); return; }
      cur.powerups.fiftyfifty = false;
      const buttons = document.querySelectorAll('.qa-answer');
      const wrongIdx = [];
      buttons.forEach((b, i) => { if (i !== q.answer) wrongIdx.push(i); });
      // Eliminate two random wrongs
      shuffle(wrongIdx);
      wrongIdx.slice(0, 2).forEach((i) => { buttons[i].classList.add('eliminated'); buttons[i].disabled = true; });
      sfx.powerup();
    } else if (kind === 'freeze') {
      cur.powerups.freeze = false;
      state.game.frozen = true;
      document.querySelector('.qa-timer').classList.add('frozen');
      sfx.powerup();
      setTimeout(() => {
        state.game.frozen = false;
        document.querySelector('.qa-timer').classList.remove('frozen');
      }, 5000);
    } else if (kind === 'double') {
      cur.powerups.double = false;
      cur.doubleNext = true;
      sfx.powerup();
      // Visual indicator
      const btn = document.querySelector(`.qa-powerup[data-pu="double"]`);
      if (btn) btn.style.background = 'linear-gradient(135deg, #facc15, #f97316)';
    }
    renderPowerups();
    if (cur.doubleNext) {
      const btn = document.querySelector(`.qa-powerup[data-pu="double"]`);
      if (btn) { btn.style.background = 'linear-gradient(135deg, #facc15, #f97316)'; btn.style.color = '#0d0b2e'; btn.disabled = true; }
    }
  }

  function renderAnswers(q) {
    const c = document.getElementById('answersContainer');
    c.classList.remove('tf');
    c.innerHTML = '';

    if (q.type === 'multiple') {
      c.innerHTML = q.options.map((opt, i) => `
        <button class="qa-answer qa-answer-${i}" data-i="${i}">
          <div class="qa-answer-shape">${'◆■▲●'[i] || ''}</div>
          <div class="qa-answer-text">${escapeHtml(opt)}</div>
        </button>`).join('');
      c.querySelectorAll('.qa-answer').forEach((btn) => {
        btn.addEventListener('click', () => submitAnswer(parseInt(btn.dataset.i, 10)));
      });

    } else if (q.type === 'truefalse') {
      c.classList.add('tf');
      c.innerHTML = `
        <button class="qa-answer qa-answer-3" data-i="true">⭕ True</button>
        <button class="qa-answer qa-answer-0" data-i="false">❌ False</button>`;
      c.querySelectorAll('.qa-answer').forEach((btn) => {
        btn.addEventListener('click', () => submitAnswer(btn.dataset.i === 'true'));
      });

    } else if (q.type === 'typed') {
      c.innerHTML = `
        <input type="text" class="qa-typed-input" id="typedInput" placeholder="Type your answer / 答えを入力" autocomplete="off" />
        <button class="qa-typed-submit" id="typedSubmit">回答する</button>`;
      const input = document.getElementById('typedInput');
      const submit = document.getElementById('typedSubmit');
      setTimeout(() => input.focus(), 50);
      const fire = () => submitAnswer(input.value.trim());
      submit.addEventListener('click', fire);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') fire(); });

    } else if (q.type === 'order') {
      const tokens = shuffle([...q.tokens]);
      c.innerHTML = `
        <div class="qa-order-area">
          <div class="qa-order-target" id="orderTarget"></div>
          <div class="qa-order-pool" id="orderPool">
            ${tokens.map((t, i) => `<button class="qa-order-token" data-token="${escapeHtml(t)}" data-i="${i}">${escapeHtml(t)}</button>`).join('')}
          </div>
          <button class="qa-order-submit" id="orderSubmit">回答する</button>
        </div>`;
      const target = document.getElementById('orderTarget');
      const pool = document.getElementById('orderPool');
      const placed = [];

      pool.querySelectorAll('.qa-order-token').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (btn.classList.contains('placed')) return;
          btn.classList.add('placed');
          const clone = btn.cloneNode(true);
          clone.classList.remove('placed');
          target.appendChild(clone);
          placed.push({ orig: btn, clone, token: btn.dataset.token });
          clone.addEventListener('click', () => {
            const idx = placed.findIndex((p) => p.clone === clone);
            if (idx >= 0) {
              placed[idx].orig.classList.remove('placed');
              placed.splice(idx, 1);
              target.removeChild(clone);
            }
          });
        });
      });

      document.getElementById('orderSubmit').addEventListener('click', () => {
        const arr = placed.map((p) => p.token);
        submitAnswer(arr);
      });
    }
  }

  function submitAnswer(value) {
    if (state.game.answered) return;
    state.game.answered = true;
    stopTimer();

    const q = state.selectedQuiz.questions[state.game.qIndex];
    const cur = state.players[state.game.currentPlayerIndex];
    const elapsed = (performance.now() - state.game.startTime) / 1000;

    let isCorrect = false;
    let correctText = '';

    if (q.type === 'multiple') {
      isCorrect = value === q.answer;
      correctText = q.options[q.answer];
      // visualize
      document.querySelectorAll('.qa-answer').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        else if (i === value && !isCorrect) btn.classList.add('wrong');
      });

    } else if (q.type === 'truefalse') {
      isCorrect = value === q.answer;
      correctText = q.answer ? 'True' : 'False';
      document.querySelectorAll('.qa-answer').forEach((btn) => {
        btn.disabled = true;
        const v = btn.dataset.i === 'true';
        if (v === q.answer) btn.classList.add('correct');
        else if (v === value && !isCorrect) btn.classList.add('wrong');
      });

    } else if (q.type === 'typed') {
      const accepted = Array.isArray(q.answer) ? q.answer : [q.answer];
      isCorrect = accepted.some((a) => normalize(a) === normalize(value));
      correctText = accepted[0];

    } else if (q.type === 'order') {
      isCorrect = JSON.stringify(value) === JSON.stringify(q.answer);
      correctText = q.answer.join(' ');
    }

    // Scoring
    let pointsAwarded = 0;
    if (isCorrect) {
      const base = 500;
      const speedBonus = Math.round(500 * Math.max(0, 1 - elapsed / state.game.timeLimit));
      cur.combo = (cur.combo || 0) + 1;
      if (cur.combo > cur.bestCombo) cur.bestCombo = cur.combo;
      const multiplier = comboMultiplier(cur.combo);
      pointsAwarded = Math.round((base + speedBonus) * multiplier);
      if (cur.doubleNext) { pointsAwarded *= 2; cur.doubleNext = false; }
      cur.score += pointsAwarded;
      cur.correctCount++;

      if (cur.combo >= 2) showCombo(cur.combo);
      sfx.correct();
      burstConfetti(60);
    } else {
      cur.combo = 0;
      sfx.wrong();
    }

    setTimeout(() => showFeedback(isCorrect, pointsAwarded, correctText, cur.combo), 800);
  }

  function comboMultiplier(combo) {
    if (combo >= 5) return 3;
    if (combo >= 4) return 2.5;
    if (combo >= 3) return 2;
    if (combo >= 2) return 1.5;
    return 1;
  }

  function showCombo(n) {
    const el = document.getElementById('comboDisplay');
    el.textContent = `${n}× COMBO!`;
    el.classList.remove('show');
    void el.offsetWidth; // restart animation
    el.classList.add('show');
    sfx.combo();
  }

  function showFeedback(correct, points, correctAnswer, combo) {
    const ovr = document.getElementById('feedbackOverlay');
    const icon = document.getElementById('feedbackIcon');
    const title = document.getElementById('feedbackTitle');
    const ptsEl = document.getElementById('feedbackPoints');
    const corr = document.getElementById('feedbackCorrect');

    if (correct) {
      icon.textContent = combo >= 3 ? '🔥' : combo >= 2 ? '⚡' : '✅';
      title.textContent = combo >= 3 ? 'ON FIRE!' : combo >= 2 ? 'GREAT!' : 'CORRECT!';
      title.className = 'qa-feedback-title correct';
      const mult = comboMultiplier(combo);
      ptsEl.innerHTML = `+${points.toLocaleString()} pt${mult > 1 ? ` <span style="color:#facc15">(×${mult} combo)</span>` : ''}`;
      corr.innerHTML = '';
    } else {
      icon.textContent = '❌';
      title.textContent = 'INCORRECT';
      title.className = 'qa-feedback-title wrong';
      ptsEl.innerHTML = '+0 pt';
      corr.innerHTML = `Correct answer: <strong>${escapeHtml(correctAnswer)}</strong>`;
    }
    ovr.classList.add('show');
  }

  let nextBtnMode = 'feedback'; // 'feedback' | 'handoff'

  document.getElementById('nextQuestionBtn').addEventListener('click', () => {
    const ovr = document.getElementById('feedbackOverlay');
    ovr.classList.remove('show');
    const btn = document.getElementById('nextQuestionBtn');
    btn.textContent = '次の問題 →';
    if (nextBtnMode === 'handoff') {
      nextBtnMode = 'feedback';
      // restore styles
      const title = document.getElementById('feedbackTitle');
      title.style.color = '';
      title.style.background = '';
      title.style.webkitTextFillColor = '';
      nextQuestion();
    } else {
      advanceTurn();
    }
  });

  function advanceTurn() {
    // Round-robin: each player answers each question in turn.
    // Order: Q1→P1, Q1→P2, ..., Q2→P1, ...
    state.game.currentPlayerIndex++;
    if (state.game.currentPlayerIndex >= state.players.length) {
      state.game.currentPlayerIndex = 0;
      state.game.qIndex++;
    }
    if (state.game.qIndex >= state.selectedQuiz.questions.length) {
      finishGame();
      return;
    }
    if (state.players.length > 1) {
      showHandoff();
    } else {
      nextQuestion();
    }
  }

  function showHandoff() {
    const cur = state.players[state.game.currentPlayerIndex];
    const ovr = document.getElementById('feedbackOverlay');
    document.getElementById('feedbackIcon').textContent = '🎯';
    const title = document.getElementById('feedbackTitle');
    title.textContent = `次は ${cur.name} の番`;
    title.className = 'qa-feedback-title';
    title.style.color = 'white';
    title.style.background = 'none';
    title.style.webkitTextFillColor = 'currentColor';
    document.getElementById('feedbackPoints').innerHTML =
      `<span class="qa-player-avatar" style="background:${cur.color};width:64px;height:64px;font-size:24px;display:inline-flex">${initialsOf(cur.name)}</span>`;
    document.getElementById('feedbackCorrect').innerHTML = '準備ができたら開始してください';
    document.getElementById('nextQuestionBtn').textContent = 'スタート →';
    nextBtnMode = 'handoff';
    ovr.classList.add('show');
  }

  // ============================ Timer ============================
  function startTimer() {
    stopTimer();
    updateTimerUI(state.game.timeLeft);
    state.game.timer = setInterval(() => {
      if (state.game.frozen) return;
      state.game.timeLeft -= 0.1;
      if (state.game.timeLeft <= 0) {
        state.game.timeLeft = 0;
        updateTimerUI(0);
        if (!state.game.answered) {
          // Time out → submit empty/wrong
          submitAnswer(null);
        }
        stopTimer();
        return;
      }
      updateTimerUI(state.game.timeLeft);
    }, 100);
  }

  function stopTimer() {
    if (state.game && state.game.timer) {
      clearInterval(state.game.timer);
      state.game.timer = null;
    }
  }

  function updateTimerUI(time) {
    const text = document.getElementById('timerText');
    const circle = document.getElementById('timerCircle');
    const wrap = document.querySelector('.qa-timer');
    text.textContent = Math.ceil(time);
    const ratio = state.game.timeLimit > 0 ? time / state.game.timeLimit : 0;
    circle.style.strokeDashoffset = (1 - ratio) * 283;

    wrap.classList.remove('warning', 'danger');
    if (!state.game.frozen) {
      if (time <= 5) wrap.classList.add('danger');
      else if (time <= 10) wrap.classList.add('warning');
    }

    if (time > 0 && time <= 5 && Math.abs(time - Math.floor(time)) < 0.05) {
      sfx.tick();
    }
  }

  // ============================ Scoreboard ============================
  function renderScoreboard() {
    const board = document.getElementById('scoreboard');
    board.innerHTML = state.players.map((p, i) => `
      <div class="qa-score-cell ${i === state.game.currentPlayerIndex ? 'is-current' : ''}">
        <div class="qa-player-avatar" style="background:${p.color}">${initialsOf(p.name)}</div>
        <div class="qa-score-name">${escapeHtml(p.name)}</div>
        <div class="qa-score-points">${p.score.toLocaleString()}</div>
      </div>`).join('');
  }

  // ============================ Finish ============================
  function finishGame() {
    stopTimer();
    state.game = null;
    sfx.win();

    const sorted = [...state.players].sort((a, b) => b.score - a.score);

    // Podium for top 3
    const podium = document.getElementById('podium');
    const layout = sorted.length >= 3 ? [1, 0, 2] : (sorted.length === 2 ? [1, 0] : [0]); // 2nd, 1st, 3rd
    podium.innerHTML = layout.map((i) => {
      const p = sorted[i];
      if (!p) return '';
      const rank = i + 1;
      return `
        <div class="qa-podium-spot qa-podium-rank-${rank}">
          <div class="qa-podium-avatar" style="background:${p.color}">${initialsOf(p.name)}</div>
          <div class="qa-podium-name">${escapeHtml(p.name)}</div>
          <div class="qa-podium-score">${p.score.toLocaleString()} pt</div>
          <div class="qa-podium-bar">${rank}</div>
        </div>`;
    }).join('');

    const list = document.getElementById('resultsList');
    list.innerHTML = sorted.map((p, idx) => `
      <div class="qa-result-row">
        <div class="qa-result-rank">#${idx + 1}</div>
        <div class="qa-player-avatar" style="background:${p.color}">${initialsOf(p.name)}</div>
        <div class="qa-result-name">${escapeHtml(p.name)}</div>
        <div class="qa-result-stats">
          <span>✅ ${p.correctCount}/${state.selectedQuiz.questions.length}</span>
          <span>🔥 best ×${p.bestCombo}</span>
        </div>
        <div class="qa-result-points">${p.score.toLocaleString()}</div>
      </div>`).join('');

    goTo('results');
    setTimeout(() => burstConfetti(180), 400);
  }

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    goTo('players');
  });

  // ============================ Editor ============================
  function renderEditor() {
    if (!state.editingQuiz) {
      state.editingQuiz = { id: 'q-' + Date.now(), name: '', description: '', questions: [] };
    }
    document.getElementById('editQuizName').value = state.editingQuiz.name || '';
    document.getElementById('editQuizDesc').value = state.editingQuiz.description || '';
    renderEditorQuestions();
  }

  function renderEditorQuestions() {
    const list = document.getElementById('editorQuestions');
    if (state.editingQuiz.questions.length === 0) {
      list.innerHTML = '<div class="qa-empty">下のボタンから問題を追加 →</div>';
      return;
    }
    list.innerHTML = state.editingQuiz.questions.map((q, i) => editorQuestionHtml(q, i)).join('');
    wireEditor();
  }

  function editorQuestionHtml(q, i) {
    const questionField = `<label class="qa-field"><span>問題文</span><input type="text" data-eq="question" data-i="${i}" value="${escapeHtml(q.question || '')}" placeholder="質問を入力" /></label>`;
    const timeField = `<label class="qa-field"><span>制限時間 (秒)</span><input type="number" data-eq="timeLimit" data-i="${i}" value="${q.timeLimit || 20}" min="5" max="120" /></label>`;
    let body = '';

    if (q.type === 'multiple') {
      body = `
        <div class="qa-q-options">
          ${[0,1,2,3].map((idx) => `
            <div class="qa-q-option-row">
              <input type="radio" name="ans-${i}" data-eq="answer" data-i="${i}" data-v="${idx}" ${q.answer === idx ? 'checked' : ''} />
              <input type="text" data-eq="option" data-i="${i}" data-idx="${idx}" value="${escapeHtml((q.options || [])[idx] || '')}" placeholder="選択肢 ${idx + 1}" />
            </div>`).join('')}
        </div>`;
    } else if (q.type === 'truefalse') {
      body = `
        <div class="qa-q-options" style="grid-template-columns:1fr 1fr">
          <div class="qa-q-option-row"><input type="radio" name="ans-${i}" data-eq="tfanswer" data-i="${i}" data-v="true" ${q.answer === true ? 'checked' : ''} /><span>True (正)</span></div>
          <div class="qa-q-option-row"><input type="radio" name="ans-${i}" data-eq="tfanswer" data-i="${i}" data-v="false" ${q.answer === false ? 'checked' : ''} /><span>False (誤)</span></div>
        </div>`;
    } else if (q.type === 'typed') {
      body = `<label class="qa-field"><span>正解 (大文字小文字・スペースは無視されます)</span><input type="text" data-eq="typedanswer" data-i="${i}" value="${escapeHtml(Array.isArray(q.answer) ? q.answer.join(' / ') : (q.answer || ''))}" placeholder="例: ran  または  ran / runned (複数許容は / 区切り)" /></label>`;
    } else if (q.type === 'order') {
      body = `<label class="qa-field"><span>正解の単語列 (スペース区切り。これを並べ替えとして出題)</span><input type="text" data-eq="ordertokens" data-i="${i}" value="${escapeHtml((q.answer || []).join(' '))}" placeholder="例: I went to school yesterday" /></label>`;
    }

    return `
      <div class="qa-q-card">
        <div class="qa-q-card-head">
          <span class="qa-q-num">問題 ${i + 1}</span>
          <span class="qa-q-type-pill">${typeLabel(q.type)}</span>
          <button class="qa-q-remove" data-eq="remove" data-i="${i}">削除</button>
        </div>
        ${questionField}
        ${body}
        ${timeField}
      </div>`;
  }

  function wireEditor() {
    document.querySelectorAll('[data-eq]').forEach((el) => {
      const handler = () => {
        const i = parseInt(el.dataset.i, 10);
        const q = state.editingQuiz.questions[i];
        if (!q) return;
        const kind = el.dataset.eq;
        if (kind === 'question') q.question = el.value;
        else if (kind === 'timeLimit') q.timeLimit = parseInt(el.value, 10) || 20;
        else if (kind === 'option') {
          q.options = q.options || ['', '', '', ''];
          q.options[parseInt(el.dataset.idx, 10)] = el.value;
        }
        else if (kind === 'answer') q.answer = parseInt(el.dataset.v, 10);
        else if (kind === 'tfanswer') q.answer = el.dataset.v === 'true';
        else if (kind === 'typedanswer') {
          const v = el.value.trim();
          q.answer = v.includes('/') ? v.split('/').map((s) => s.trim()).filter(Boolean) : v;
        }
        else if (kind === 'ordertokens') {
          const tokens = el.value.split(/\s+/).filter(Boolean);
          q.answer = tokens;
          q.tokens = tokens;
        }
        else if (kind === 'remove') {
          state.editingQuiz.questions.splice(i, 1);
          renderEditorQuestions();
        }
      };
      const event = (el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox')) ? 'change' :
                    (el.tagName === 'BUTTON') ? 'click' : 'input';
      el.addEventListener(event, handler);
    });
  }

  document.querySelectorAll('[data-add-type]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ensureAudio();
      sfx.click();
      const type = btn.dataset.addType;
      const newQ = { type, question: '', timeLimit: 20 };
      if (type === 'multiple') { newQ.options = ['', '', '', '']; newQ.answer = 0; }
      else if (type === 'truefalse') { newQ.answer = true; }
      else if (type === 'typed') { newQ.answer = ''; }
      else if (type === 'order') { newQ.answer = []; newQ.tokens = []; }
      state.editingQuiz.questions.push(newQ);
      renderEditorQuestions();
      // Focus the new card
      requestAnimationFrame(() => {
        const cards = document.querySelectorAll('.qa-q-card');
        const last = cards[cards.length - 1];
        if (last) {
          last.scrollIntoView({ behavior: 'smooth', block: 'center' });
          last.querySelector('input[data-eq="question"]')?.focus();
        }
      });
    });
  });

  document.getElementById('editQuizName').addEventListener('input', (e) => {
    state.editingQuiz.name = e.target.value;
  });
  document.getElementById('editQuizDesc').addEventListener('input', (e) => {
    state.editingQuiz.description = e.target.value;
  });

  document.getElementById('saveQuizBtn').addEventListener('click', () => {
    const q = state.editingQuiz;
    if (!q.name.trim()) { alert('クイズ名を入力してください'); return; }
    if (q.questions.length === 0) { alert('1問以上追加してください'); return; }

    // Validate questions
    for (let i = 0; i < q.questions.length; i++) {
      const x = q.questions[i];
      if (!x.question || !x.question.trim()) { alert(`問題 ${i + 1}: 問題文を入力してください`); return; }
      if (x.type === 'multiple' && (!x.options || x.options.some((o) => !o.trim()))) { alert(`問題 ${i + 1}: 4つの選択肢すべて入力`); return; }
      if (x.type === 'typed' && (!x.answer || (Array.isArray(x.answer) ? x.answer.length === 0 : !x.answer.trim()))) { alert(`問題 ${i + 1}: 正解を入力`); return; }
      if (x.type === 'order' && (!x.answer || x.answer.length < 2)) { alert(`問題 ${i + 1}: 並べ替え単語を2つ以上入力`); return; }
    }

    const idx = state.customQuizzes.findIndex((c) => c.id === q.id);
    if (idx >= 0) state.customQuizzes[idx] = q;
    else state.customQuizzes.push(q);
    saveCustomQuizzes(state.customQuizzes);
    sfx.correct();
    alert('クイズを保存しました!');
    state.editingQuiz = null;
    goTo('select');
  });

  // ============================ Mute Toggle ============================
  document.getElementById('muteBtn').addEventListener('click', () => {
    state.muted = !state.muted;
    document.getElementById('muteIconOn').style.display = state.muted ? 'none' : '';
    document.getElementById('muteIconOff').style.display = state.muted ? '' : 'none';
  });

  // ============================ Confetti ============================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiAnim = null;

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
    confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
    confettiCanvas.style.width = window.innerWidth + 'px';
    confettiCanvas.style.height = window.innerHeight + 'px';
    confettiCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function burstConfetti(count = 80) {
    const colors = ['#ff3d8a', '#a855f7', '#22d3ee', '#facc15', '#22c55e', '#f97316'];
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() * -1 - 0.5) * 14,
        g: 0.30 + Math.random() * 0.20,
        r: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1.0,
      });
    }
    if (!confettiAnim) animateConfetti();
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter((p) => p.life > 0);
    if (confettiPieces.length === 0) { confettiAnim = null; return; }

    confettiPieces.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.008;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.globalAlpha = Math.max(0, p.life);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
      confettiCtx.restore();
    });

    confettiAnim = requestAnimationFrame(animateConfetti);
  }

  // ============================ Helpers ============================
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function normalize(s) {
    return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:]/g, '');
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function initialsOf(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.trim().slice(0, 2).toUpperCase();
  }

  // Init
  goTo('home');
})();
