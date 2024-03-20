"use strict";
const urlParams = new URLSearchParams(window.location.search);
const indexParam = urlParams.get('id');
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let index = notes.length - 1;
// Check if the index is valid
if (indexParam) {
    index = parseInt(indexParam);
}
$(document).ready(function () {
    const saveButton = $('#saveNoteBtn');
    saveButton.on('click', function () {
        // Retrieve the value of the Summernote textarea
        const textareaValue = $('#summernote').summernote('code');
        // If no notes are found, initialize an empty array
        if (!notes) {
            notes = [];
        }
        // get notes last element
        notes[index].notes = textareaValue;
        console.log(notes[index]);
        // Store the updated notes back into localStorage
        localStorage.setItem('notes', JSON.stringify(notes));
        alert("Saved successfully");
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Function to display note by index
    function displayNoteByIndex(index) {
        // Retrieve notes from localStorage
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        // Check if the index is valid
        if (index >= 0 && index < notes.length) {
            // Display the note corresponding to the index
            const note = notes[index];
            // Display the title
            document.getElementById('titles-container').innerHTML = '<h1>' + note.title + '</h1>';
            // Display the notes
            document.getElementById('summernote').innerHTML = note.notes;
            document.getElementById("indicator").innerHTML = `<p> ! Click the save button again when you edit the Note </p>`;
        }
        else {
            alert('Invalid note index.');
        }
    }
    displayNoteByIndex(index);
});
document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
});
