// Define interface for Note
interface Note {
    title: string;
    category: string;
    notes: string;
}
// Define global variables
let notes1: Note[] = []; // Initialize an empty array of type Note

// Define global variables
const addButton: HTMLElement = document.getElementById('addBtn')!;
const titleInput: HTMLInputElement = document.getElementById('addTitle') as HTMLInputElement;
const tableBody: HTMLTableSectionElement = document.getElementById('tableBody') as HTMLTableSectionElement;

// Load notes from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateTable();
});

// Function to add a new note
function addNote(): any {
    const title: string = titleInput.value.trim();
    const category: string = (document.getElementById('noteCate') as HTMLSelectElement).value; // Get the selected category

    if (title !== '') {
        if (category === 'default') {
            alert('Please select a category before proceeding.');
            return;
        }

         notes1= JSON.parse(localStorage.getItem('notes') || '[]');
        const isDuplicate: boolean = notes1.some((note: Note) => note.title === title);

        if (isDuplicate) {
            alert('Note with the same title already exists.');
        } else {
            notes1.push({ title, category, notes: ''});
            localStorage.setItem('notes', JSON.stringify(notes1));
            titleInput.value = '';
            window.location.href = 'notes.html'; // Navigate to the next page
        }
    } else {
        alert('Please enter a title before proceeding.');
    }
}

// Add a click event listener to the add button
addButton.addEventListener('click', addNote);

// Function to update the table with notes
function updateTable(): void {
    // Clear the table body
    tableBody.innerHTML = '';

    // Retrieve notes from localStorage
    const notes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');

    // Update the table with stored notes
    notes.forEach((note, index) => {
        const row: HTMLTableRowElement = tableBody.insertRow();
        const snoCell: HTMLTableCellElement = row.insertCell(0);
        const titleCell: HTMLTableCellElement = row.insertCell(1);
        const actionsCell: HTMLTableCellElement = row.insertCell(2);

        snoCell.textContent = String(index + 1);
        titleCell.textContent = note.title;

        // Create view button
        const viewButton: HTMLButtonElement = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.setAttribute('data-title', note.title);
        viewButton.addEventListener('click', function() {
            const title: string | null  = this.getAttribute('data-title')!;
            const noteIndex: number = notes.findIndex(note => note.title === title);

            if (noteIndex !== -1) {
                window.location.href = `notes.html?id=${noteIndex}`;
            } else {
                alert('Note not found!');
            }
        });

        // Create delete button
        const deleteButton: HTMLButtonElement = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            const index: number = parseInt((this.parentElement!.parentElement! as HTMLTableRowElement).cells[0].textContent!) - 1
            showDelete(index);
            updateTable(); // Update the table after deleting a note
        });

        // Append buttons to actions cell
        actionsCell.appendChild(viewButton);
        actionsCell.appendChild(deleteButton);
    });
}

// Function to display filtered contacts based on title
function filterTitle(title: string): Note[] {
    const allNotes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');

    if (!title) {
        return allNotes; // Return all notes if search term is empty
    }

    const searchTerm: string = title.toLowerCase();
    return allNotes.filter(note => note.title.toLowerCase().includes(searchTerm));
}

// Function to filter notes by category
function filterByCategory(category: string): Note[] {
    const allNotes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');

    if (!category || category === 'all') {
        return allNotes; // Return all notes if category is empty or 'all'
    }

    return allNotes.filter(note => note.category === category);
}

// Function to handle search input change event
const searchInput: HTMLInputElement = document.getElementById('searchInput') as HTMLInputElement;
searchInput.addEventListener('input', () => {
    const searchTerm: string = searchInput.value.toLowerCase();
    displayContacts(filterTitle(searchTerm)); // Filter notes by title and display
});

// Function to handle radio button change event
const radioButtons: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="category"]');
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
        const category: string = (document.querySelector('input[name="category"]:checked') as HTMLInputElement).value;
        if (category === 'default') {
            const allNotes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
            displayContacts(allNotes); // Display all notes if "default" category is selected
        } else {
            displayContacts(filterByCategory(category)); // Filter notes by category and display
        }
    });
});

// Function to display filtered contacts
function displayContacts(contacts: Note[]): void {
    tableBody.innerHTML = ''; // Clear the existing table body

    if (contacts.length === 0) {
        tableBody.textContent = 'No matching contacts found.';
        return; // Exit the function if there are no notes to display
    }

    // Update the table with filtered notes
    contacts.forEach((note, index) => {
        const row: HTMLTableRowElement = tableBody.insertRow();
        const snoCell: HTMLTableCellElement = row.insertCell(0);
        const titleCell: HTMLTableCellElement = row.insertCell(1);
        const actionsCell: HTMLTableCellElement = row.insertCell(2);

        snoCell.textContent = String(index + 1);
        titleCell.textContent = note.title;

        // Create view button
        const viewButton: HTMLButtonElement = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.setAttribute('data-title', note.title);
        viewButton.addEventListener('click', function() {
            const title: string = this.getAttribute('data-title')!;
            const noteIndex: number = contacts.findIndex(note => note.title === title);

            if (noteIndex !== -1) {
                window.location.href = `notes.html?id=${noteIndex}`;
            } else {
                alert('Note not found!');
            }
        });

        // Create delete button
        const deleteButton: HTMLButtonElement = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            const index: number = parseInt((this.parentElement!.parentElement! as HTMLTableRowElement).cells[0].textContent!) - 1
            showDelete(index);
            updateTable(); // Update the table after deleting a note
        });

        // Append buttons to actions cell
        actionsCell.appendChild(viewButton);
        actionsCell.appendChild(deleteButton);
    });
}

// Function to display delete confirmation popup
// Function to display delete confirmation popup
function showDelete(index: number): void {
    const modal: HTMLElement = document.getElementById('deletePopup')!;
    const closeButton: HTMLButtonElement = document.getElementsByClassName('close')[0] as HTMLButtonElement;
    const confirmDeleteBtn: HTMLButtonElement = document.getElementById('confirmDeleteBtn') as HTMLButtonElement;
    
    modal.style.display = 'block'; // Display the modal

    closeButton.onclick = () => {
        modal.style.display = 'none'; // Close the modal on close button click
    };

    confirmDeleteBtn.onclick = () => {
        const notes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');

        if (index >= 0 && index < notes.length) {
            notes.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(notes)); // Remove note from localStorage
            updateTable(); // Update the table after deleting a note
            modal.style.display = 'none'; // Close the modal after confirmation
        } else {
            alert('Invalid note index.');
        }
    };

    // Close the modal when clicking outside of it
    window.onclick = (event: MouseEvent) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

