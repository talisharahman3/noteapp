// DOM Elements
const noteInput = document.getElementById('noteInput');
const notesList = document.getElementById('notesList');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const showNotesBtn = document.getElementById('showNotesBtn');
const closeNotesBtn = document.getElementById('closeNotesBtn');
const notesContainer = document.getElementById('notesContainer');
const darkModeToggle = document.getElementById('darkModeToggle');

// Initialize the app
function init() {
  loadTheme();
  loadDraft();

  saveNoteBtn.addEventListener('click', saveNote);
  showNotesBtn.addEventListener('click', showSavedNotes);
  closeNotesBtn.addEventListener('click', hideSavedNotes);
  darkModeToggle.addEventListener('change', toggleDarkMode);

  // Auto-save draft
  noteInput.addEventListener('input', () => {
    localStorage.setItem('currentDraft', noteInput.value);
  });
}

// Save a new note
function saveNote() {
  const noteText = noteInput.value.trim();
  if (!noteText) {
    showNotification("Please write something before saving!");
    return;
  }

  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(noteText);
  localStorage.setItem('notes', JSON.stringify(notes));

  noteInput.value = '';
  localStorage.removeItem('currentDraft');

  showNotification('Note saved successfully!');
}

// Show saved notes
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
        <div class="note-content">${note}</div>
        <button class="delete-btn" onclick="deleteNote(${index})">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      </div>
    `).join('');
  }

  notesContainer.classList.remove('hidden');
}

// Hide saved notes
function hideSavedNotes() {
  notesContainer.classList.add('hidden');
}

// Delete a note
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  if (index >= 0 && index < notes.length) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    showSavedNotes();
    showNotification('Note deleted');
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Load saved theme
function loadTheme() {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark');
    darkModeToggle.checked = true;
  }
}

// Load saved draft
function loadDraft() {
  const draft = localStorage.getItem('currentDraft');
  if (draft) {
    noteInput.value = draft;
  }
}

// Show toast notification
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
