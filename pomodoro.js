(() => {
  // ———————————————————————————————————————————————
  // ELEMENTS
  // ———————————————————————————————————————————————
  const sel        = document.getElementById('session-duration');
  const custom     = document.getElementById('custom-duration');
  const startBtn   = document.getElementById('start-btn');
  const pauseBtn   = document.getElementById('pause-btn');
  const endBtn     = document.getElementById('end-btn');
  const display    = document.getElementById('timer-display');
  const msg        = document.getElementById('message');
  const historyT   = document.querySelector('#session-history tbody');
  const autoStart  = document.getElementById('auto-start');       // ← new
  const lockToggle = document.getElementById('lockin-toggle');    // ← new
  const todoPanel  = document.querySelector('.todo-container');   // ← new
  const pomPanel   = document.getElementById('pomodoro-container');

  // ———————————————————————————————————————————————
  // STATE
  // ———————————————————————————————————————————————
  let sessionCount = 0;
  let timerInt, remainingSecs, initialSecs;
  let isPaused = false;

  // ———————————————————————————————————————————————
  // HELPERS
  // ———————————————————————————————————————————————
  const fmt = s => {
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  };

  const disableCtrls = startEnabled => {
    startBtn.disabled = !startEnabled;
    pauseBtn.disabled = startEnabled;
    endBtn.disabled   = startEnabled;
  };

  const recordSession = secs => {
    const mins = Math.ceil(secs/60);
    const task = prompt('Which task did you complete?') || '—';
    sessionCount++;
    const row = document.createElement('tr');
    row.innerHTML = `<td>${sessionCount}</td><td>${mins}</td><td>${task}</td>`;
    historyT.appendChild(row);
  };

  // ———————————————————————————————————————————————
  // CORE TIMER
  // ———————————————————————————————————————————————
  function startTimer(duration, onComplete) {
    clearInterval(timerInt);
    remainingSecs = duration;
    display.textContent = fmt(remainingSecs);
    timerInt = setInterval(() => {
      if (!isPaused) {
        remainingSecs--;
        display.textContent = fmt(remainingSecs);
        if (remainingSecs <= 0) {
          clearInterval(timerInt);
          onComplete();
        }
      }
    }, 1000);
  }

  function takeBreak() {
    msg.textContent = '🎉 Session complete! Take a 10-min brisk walk.';
    disableCtrls(true);

    startTimer(10*60, () => {
      msg.textContent = '🔔 Break over!';
      display.textContent = '00:00';
      disableCtrls(false);

      // ——————————————————————————
      // AUTO-START NEXT SESSION
      // ——————————————————————————
      if (autoStart.checked) {
        startBtn.click();
      }
    });
  }

  // ———————————————————————————————————————————————
  // EVENT BINDINGS
  // ———————————————————————————————————————————————

  // show/hide custom input
  sel.addEventListener('change', () => {
    custom.style.display = sel.value === 'custom' ? 'inline-block' : 'none';
  });

  startBtn.addEventListener('click', () => {
    let mins = parseInt(sel.value, 10);
    if (sel.value === 'custom') {
      mins = parseInt(custom.value, 10);
      if (isNaN(mins) || mins < 1) {
        return alert('Enter a valid custom duration.');
      }
    }
    initialSecs = mins * 60;
    isPaused = false;
    disableCtrls(false);
    msg.textContent = '';
    startTimer(initialSecs, () => {
      recordSession(initialSecs);
      takeBreak();
    });
  });

  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
  });

  endBtn.addEventListener('click', () => {
    clearInterval(timerInt);
    const elapsed = initialSecs - remainingSecs;
    recordSession(elapsed);
    takeBreak();
  });

  // ———————————————————————————————————————————————
  // FULL-SCREEN LOCK-IN MODE
  // ———————————————————————————————————————————————
  lockToggle.addEventListener('click', () => {
    // hide the To-Do panel
    if (todoPanel.style.display === 'none') {
      todoPanel.style.display = '';
      lockToggle.textContent = '🔒 Lock-In';
      document.exitFullscreen?.();
    } else {
      todoPanel.style.display = 'none';
      lockToggle.textContent = '🔓 Exit Lock-In';
      // optional: actually go fullscreen
      document.documentElement.requestFullscreen?.();
    }
  });

  // ———————————————————————————————————————————————
  // KEYBOARD SHORTCUTS
  // ———————————————————————————————————————————————
  document.addEventListener('keydown', e => {
    // ignore typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':       // Space bar → Pause/Resume
        if (!pauseBtn.disabled) pauseBtn.click();
        e.preventDefault();
        break;
      case 'KeyE':        // E → End session
        if (!endBtn.disabled) endBtn.click();
        break;
      case 'KeyN':        // N → Focus new task input
        document.getElementById('input').focus();
        break;
      case 'Enter':       // Enter → Add task from input
        if (document.activeElement.id === 'input') {
          document.getElementById('addTask').click();
        }
        break;
    }
  });

  // ———————————————————————————————————————————————
  // INITIAL SETUP
  // ———————————————————————————————————————————————
  disableCtrls(true);
})();
