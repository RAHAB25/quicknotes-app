// ---------- Select elements ----------
const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all");

const MAX_CHARS = 200;

// ----------  load saved notes  ----------
let notes = [];
try {
  const saved = localStorage.getItem("notes");
  if (saved) {
    notes = JSON.parse(saved);
  }
} catch (error) {
  notes = [];
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// ---------- Task 4: count message ----------
function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = "You have " + notes.length + " notes.";
  }
}

// ---------- Task 3: render the list from the array ----------
function render() {
  notesList.textContent = ""; // empty the list

  const searchTerm = searchInput.value.trim().toLowerCase();
  const visibleNotes = notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchTerm);
  });

  // Task 5: message when a search finds nothing
  if (notes.length > 0 && visibleNotes.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-message";
    li.textContent = "No notes match your search.";
    notesList.appendChild(li);
  }

  visibleNotes.forEach(function (note) {
    const li = document.createElement("li");
    li.className = "note category-" + note.category.toLowerCase();

    const text = document.createElement("p");
    text.textContent = note.text;

    const meta = document.createElement("div");
    meta.className = "note-meta";

    const category = document.createElement("span");
    category.className = "note-category";
    category.textContent = note.category;

    const date = document.createElement("span");
    date.textContent = note.createdAt;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteNote(note.id);
    });

    meta.appendChild(category);
    meta.appendChild(date);
    meta.appendChild(deleteBtn);

    li.appendChild(text);
    li.appendChild(meta);
    notesList.appendChild(li);
  });

  updateCount();
}

// ----------  delete ----------
function deleteNote(id) {
  notes = notes.filter(function (note) {
    return note.id !== id;
  });
  saveNotes();
  render();
}
// ----------  add a note with validation ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > MAX_CHARS) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  const note = {
    id: Date.now(),
    text: text,
    category: categorySelect.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);
  saveNotes();
  noteInput.value = "";
  render();
});