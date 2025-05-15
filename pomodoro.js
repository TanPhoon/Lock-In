(() => {
    const sel = document.getElementById('session-duration');
    const customInput = document.getElementById('custom-duration');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const endBtn   = document.getElementById('end-btn');
    const display  = document.getElementById('timer-display');
    const msg      = document.getElementById('message');
    const historyT = document.querySelector('#session-history tbody');
  
    let sessionCount = 0;
    let timerInterval, remainingSecs, initialSecs;
    let isPaused = false;
  
    // Show/hide custom input
    sel.addEventListener('change', () => {
      customInput.style.display = (sel.value === 'custom') ? 'inline-block' : 'none';
    });
  
    function formatTime(s) {
      const m = Math.floor(s/60).toString().padStart(2,'0');
      const sec = (s%60).toString().padStart(2,'0');
      return `${m}:${sec}`;
    }
  
    function startTimer(durationSecs, onComplete) {
      clearInterval(timerInterval);
      remainingSecs = durationSecs;
      display.textContent = formatTime(remainingSecs);
      timerInterval = setInterval(() => {
        if (!isPaused) {
          remainingSecs--;
          display.textContent = formatTime(remainingSecs);
          if (remainingSecs <= 0) {
            clearInterval(timerInterval);
            onComplete();
          }
        }
      }, 1000);
    }
  
    function disableControls(startEnabled) {
      startBtn.disabled = !startEnabled;
      pauseBtn.disabled = startEnabled;
      endBtn.disabled   = startEnabled;
    }
  
    function recordSession(actualSecs) {
      const mins = Math.ceil(actualSecs/60);
      const task = prompt('Which task did you complete?') || '—';
      sessionCount++;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${sessionCount}</td>
        <td>${mins}</td>
        <td>${task}</td>
      `;
      historyT.appendChild(row);
    }
  
    function takeBreak() {
      msg.textContent = '🎉 Session complete! Now, take a 10 min brisk walk to boost blood flow and reset focus.';
      // Scientifically, short walks elevate heart rate and improve cognitive performance.
      disableControls(true);
      startTimer(10*60, () => {
        msg.textContent = '🔔 Break over! Ready for your next deep-work session?';
        display.textContent = '00:00';
        disableControls(false);
      });
    }
  
    startBtn.addEventListener('click', () => {
      let mins = parseInt(sel.value, 10);
      if (sel.value === 'custom') {
        mins = parseInt(customInput.value, 10);
        if (isNaN(mins) || mins < 1) return alert('Enter a valid custom duration.');
      }
      initialSecs = mins * 60;
      isPaused = false;
      disableControls(false);
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
      clearInterval(timerInterval);
      const elapsed = initialSecs - remainingSecs;
      recordSession(elapsed);
      takeBreak();
    });
  })();
  