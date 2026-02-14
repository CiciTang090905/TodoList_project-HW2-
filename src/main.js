import "./style.css";

//task: {id:, text:, active:}
let taskList = [];
let nextId = 1;
const getTextArea = document.getElementById("new-note");
const getNoteWall = document.getElementById("notes-wall");

// a div -> a button for deleting, task text, another textarea for edit and transforming effect
function createButton() {
    const button = document.createElement("button");
    button.classList.add(
        "absolute",
        "w-5",
        "h-5",
        "leading-5",
        "text-center",
        "transition-opacity",
        "opacity-0",
        "cursor-pointer",
        "delete-btn",
        "top-1",
        "right-1",
        "hover:opacity-100",
    );
    button.textContent = "🗑";
    return button;
}

function createText(task) {
    const div = document.createElement("div");
    div.classList.add("p-4", "note-text");
    div.textContent = task.text;
    return div;
}

function createNoteEdit(task) {
    const editText = document.createElement("textarea");
    editText.classList.add(
        "absolute",
        "top-0",
        "left-0",
        "hidden",
        "w-full",
        "h-full",
        "p-4",
        "transition-transform",
        "transform",
        "bg-yellow-300",
        "shadow-xl",
        "resize-none",
        "outline-rose-700",
        "outline-offset-0",
        "note-edit",
        "note",
        "hover:scale-105",
    );
    editText.value = task.text;
    return editText;
}

function createNote(task) {
    const note = document.createElement("div");
    note.classList.add(
        "relative",
        "w-40",
        "h-40",
        "p-0",
        "m-2",
        "overflow-y-auto",
        "transition-transform",
        "transform",
        "bg-yellow-200",
        "shadow-lg",
        "note",
        "hover:scale-105",
    );
    note.setAttribute("id", `note-task-${task.id}`);
    note.append(createButton(), createText(task), createNoteEdit(task));
    return note;
}

function findOpenEditor() {
    return document.querySelector(".note-edit:not(.hidden)");
}

function saveAndExit(note) {
    const noteText = note.querySelector(".note-text");
    const noteEdit = note.querySelector(".note-edit");
    const editID = parseTodoId(note);

    let getInputText = noteEdit.value.trim();

    if (getInputText === "") {
        taskList = taskList.filter((task) => task.id !== editID);
        renderNoteWall();
        return;
    }

    taskList = taskList.map((task) =>
        task.id === editID ? { ...task, text: getInputText } : task,
    );

    noteText.textContent = getInputText;
    noteEdit.classList.add("hidden");
    noteText.classList.remove("hidden");

    noteEdit.blur();
}

function closeAllEditors() {
    const openEdit = findOpenEditor();
    if (!openEdit) return;

    const note = openEdit.closest('div.note[id^="note-task-"]');
    if (!note) return;

    saveAndExit(note);
}

//getNoteWall.addEventListener("dblclick", toggleText);
function toggleText(event) {
    closeAllEditors();
    //only when click the button
    const note = event.target.closest('div.note[id^="note-task-"]');
    if (!note) return;
    //when click the delete button, remove from the list
    const noteText = note.querySelector(".note-text");
    const noteEdit = note.querySelector(".note-edit");
    noteText.classList.add("hidden");
    noteEdit.classList.remove("hidden");
    noteEdit.focus();
    noteEdit.setSelectionRange(noteEdit.value.length, noteEdit.value.length);
}

function handleEditKeydown(event) {
    const noteEdit = event.target.closest(".note-edit");
    if (!noteEdit) return;
    if (event.key === "Enter" && event.shiftKey) return;
    if (event.key !== "Enter" && event.key !== "Escape") return;

    event.preventDefault();
    const note = noteEdit.closest('div.note[id^="note-task-"]');
    if (!note) return;
    saveAndExit(note);
}

function renderNoteWall() {
    getNoteWall.innerHTML = "";
    for (const task of taskList) {
        getNoteWall.appendChild(createNote(task));
    }
}

function handleDeleteTask(event) {
    const deleteBtn = event.target.closest(".delete-btn");
    if (!deleteBtn) return;

    const deleteNote = deleteBtn.closest('div.note[id^="note-task-"]');
    const deleteID = parseTodoId(deleteNote);

    taskList = taskList.filter((task) => task.id !== deleteID);
    renderNoteWall();
}

const parseTodoId = (element) => (element ? Number(element.id.split("-").pop()) : -1);

function handleEnterInput(event) {
    let getInputText = getTextArea.value;
    if (event.key === "Enter" && event.shiftKey) {
        return;
    }
    else if (event.key === "Enter") {
        event.preventDefault();
        getInputText = getInputText.trim();
        if (getInputText === "") { //typing space is not valid, retype, back to placeholder
            event.target.value = "";
            return;
        }
        taskList.push({ id: nextId++, text: getInputText, active: true });
        event.target.value = "";

        renderNoteWall();
    }
}

document.addEventListener('DOMContentLoaded', renderNoteWall);

getNoteWall.addEventListener("dblclick", toggleText);
getNoteWall.addEventListener("click", handleDeleteTask);
getTextArea.addEventListener("keydown", handleEnterInput);
getNoteWall.addEventListener("keydown", handleEditKeydown);

document.addEventListener("click", (event) => {
    const openEdit = findOpenEditor();
    if (!openEdit) return;
    if (event.target.closest(".note-edit")) return;
    const note = openEdit.closest('div.note[id^="note-task-"]');
    if (!note) return;
    saveAndExit(note);
});
