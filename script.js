// script.js
const input = document.getElementById('input');
const addTask = document.getElementById('addTask');
const todoSpace = document.getElementById('todoSpace');
const prioritySelect = document.getElementById('prioritySelect');

// ————————————————————————————
// GLOBAL CLICK SOUND FOR ALL BUTTONS
// ————————————————————————————
const clickSound = new Audio('assets/click.mp3');
clickSound.preload = 'auto';
clickSound.volume = 0.2; // tweak between 0.0–1.0

document.addEventListener('click', e => {
  // if the clicked element is a button (or inside one)
  const btn = e.target.closest('button');
  if (btn) {
    // rewind and play
    clickSound.currentTime = 0;
    clickSound.play();
  }
});
// ————————————————————————————

function createTask() {
  let text = input.value.trim();
  if (!text) return;

  // 1) Determine priority via {1}/{2}/{3} marker or dropdown
  let priority = prioritySelect.value;
  const m = text.match(/\{([1-3])\}\s*$/);
  if (m) {
    const n = m[1];
    priority = (n==='1' ? 'high' : n==='2' ? 'medium' : 'low');
    text = text.replace(/\s*\{[1-3]\}\s*$/, '');
  }

  // 2) Build <p> with checkbox, text, delete-icon
  const task = document.createElement('p');
  task.classList.add(priority);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';

  const span = document.createElement('span');
  span.textContent = text;

  const del = document.createElement('span');
  del.className = 'delete-icon';
  del.textContent = '   (×)';

  task.append(checkbox, span, del);
  todoSpace.appendChild(task);

  // Clear 
  const clear = document.getElementById('clear');
  clear.addEventListener('click', () => {
    todoSpace.innerHTML = '';
  });

  // 3) Clear inputs
  input.value = '';
  prioritySelect.value = 'medium';

  // 4) Event listeners
  checkbox.addEventListener('change', e => {
    task.classList.toggle('completed', checkbox.checked);
  });
  del.addEventListener('click', e => {
    e.stopPropagation();
    task.remove();
  });


  task.addEventListener('click', () => {
    task.classList.toggle('completed');
    checkbox.checked = task.classList.contains('completed');
  });
  task.addEventListener('dblclick', () => task.remove());
}

// click “Add”
addTask.addEventListener('click', createTask);
// press Enter in input
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') createTask();
});

// Theme switcher
const themeSelect = document.getElementById('theme-select');

themeSelect.addEventListener('change', (e) => {
  // remove all theme- classes
  document.body.classList.remove(
    'theme-tech-bro',
    'theme-zero-dopamine',
    'theme-tech-neon'
  );
  // add the selected one
  document.body.classList.add(e.target.value);
});

// initialize to default
document.body.classList.add(themeSelect.value);
