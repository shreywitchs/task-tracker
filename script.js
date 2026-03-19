// Task Tracker — script.js

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const emptyMsg = document.getElementById('empty-msg');

  /** @type {{ id: number, text: string, done: boolean }[]} */
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateEmptyState() {
    if (tasks.length === 0) {
      emptyMsg.classList.add('visible');
    } else {
      emptyMsg.classList.remove('visible');
    }
  }

  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, idx) => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.done;
      checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'incomplete' : 'complete'}`);
      checkbox.onchange = () => {
        tasks[idx].done = checkbox.checked; // use checkbox.checked directly — no double-flip
        saveTasks();
        renderTasks();
      };

      // Task text
      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;

      // Task content wrapper
      const contentDiv = document.createElement('div');
      contentDiv.className = 'task-content';
      contentDiv.appendChild(checkbox);
      contentDiv.appendChild(textSpan);

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.title = 'Delete Task';
      deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
      deleteBtn.innerHTML = '🗑️';
      deleteBtn.onclick = () => {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
      };

      li.appendChild(contentDiv);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });

    updateEmptyState();
  }

  taskForm.onsubmit = (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ id: Date.now(), text, done: false });
      saveTasks();
      renderTasks();
      taskInput.value = '';
      taskInput.focus();
    }
  };

  renderTasks();
});
