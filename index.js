const noteTitle = document.getElementById('noteTitle');
const noteBody = document.getElementById('noteBody');
const notesList = document.getElementById('notesList');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const showNotesBtn = document.getElementById('showNotesBtn');
const closeNotesBtn = document.getElementById('closeNotesBtn');
const notesContainer = document.getElementById('notesContainer');
const darkModeToggle = document.getElementById('darkModeToggle');

function init() {
  loadTheme();
  loadDraft();

  saveNoteBtn.addEventListener('click', saveNote);
  showNotesBtn.addEventListener('click', showSavedNotes);
  closeNotesBtn.addEventListener('click', hideSavedNotes);
  darkModeToggle.addEventListener('change', toggleDarkMode);

  // Auto-save draft
  noteBody.addEventListener('input', () => {
    localStorage.setItem('currentDraftBody', noteBody.value);
  });
  noteTitle.addEventListener('input', () => {
    localStorage.setItem('currentDraftTitle', noteTitle.value);
  });
}

function saveNote() {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if (!title || !body) {
    showNotification("Please fill in both the title and body!");
    return;
  }

  const note = { title, body };
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));

  noteTitle.value = '';
  noteBody.value = '';
  localStorage.removeItem('currentDraftTitle');
  localStorage.removeItem('currentDraftBody');

  showNotification('Note saved successfully!');
}

function showSavedNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];

  if (notes.length === 0) {
    notesList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book"></i>
        <p>You haven't saved any notes yet!</p>
      </div>
    `;
  } else {
    notesList.innerHTML = notes.map((note, index) => `
      <div class="note">
        <div class="note-content">
          <strong>${note.title}</strong>
          <p>${note.body}</p>
        </div>
        <button class="delete-btn" onclick="deleteNote(${index})">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      </div>
    `).join('');
  }

  notesContainer.classList.remove('hidden');
}

function hideSavedNotes() {
  notesContainer.classList.add('hidden');
}

function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  if (index >= 0 && index < notes.length) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    showSavedNotes();
    showNotification('Note deleted');
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

function loadTheme() {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark');
    darkModeToggle.checked = true;
  }
}

function loadDraft() {
  noteTitle.value = localStorage.getItem('currentDraftTitle') || '';
  noteBody.value = localStorage.getItem('currentDraftBody') || '';
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', init);
