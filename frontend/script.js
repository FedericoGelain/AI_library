// Definition of all buttons click and search bar typing events listeners
document.addEventListener('DOMContentLoaded', () => {
  // creates and shows a table with all available books
  document.getElementById('loadBtn').addEventListener('click', () => {
    if (searchInput.style.display === 'none')
      searchInput.style.display = 'block';

    loadBooks(); // No filter initially
  });

  //this is to filter books each time something is written in the search bar
  document.getElementById('searchInput').addEventListener('input', (e) => {
    loadBooks(e.target.value);
  });
  
  // makes the form to add a book visible
  document.getElementById('toggleFormBtn').addEventListener('click', toggleForm);

  // to add/edit a book after filling the form
  document.getElementById('submitBtn').addEventListener('click', addEditFromForm);
});

// helper function to show a message after each REST operation
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}

// function to create a table with all books available (the filter parameter filters in real time based on what's written in the search bar)
async function loadBooks(filter = '') {
  try {
    // retrieve all books in the database table in JSON format
    const response = await fetch('http://localhost:3000/queries/getBooks');
    const res = await response.json();
    data = {};

    // if the search bar isn't visible or the user hasn't typed anything
    // without getComputedStyle you only check inline style, so not the actual visibility that also the user can see
    if(getComputedStyle(document.getElementById('searchInput')).display === 'none' || String(filter || '').trim() === '') {
      document.getElementById('searchInput').style.display = 'block'; // makes the search bar visible
      data = res; // use all book entries
    }
    else {
      // Filter results based on either title or author
      data = res.filter(book => book.title.toLowerCase().includes(filter.toLowerCase()) || book.author.toLowerCase().includes(filter.toLowerCase()));
    }
  
    // get the container for the table and clear anything that was present before
    const container = document.getElementById('booksList');
    container.innerHTML = '';

    // if there are no books, just warn the user and return
    if (!data.length) {
      container.textContent = 'No books found.';
      return;
    }
  
    // create the table
    const table = document.createElement('table');
    table.classList.add('book-table');
  
    // table headers
    const thead = document.createElement('thead');
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');

    headers.forEach(key => {
      const th = document.createElement('th');

      // just to write the key with the first letter capitalized
      th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      headerRow.appendChild(th);
    });

    // column with edit button
    const editTh = document.createElement('th');
    editTh.textContent = 'Edit';
    headerRow.appendChild(editTh);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // column with delete button
    const deleteTh = document.createElement('th');
    deleteTh.textContent = 'Delete';
    headerRow.appendChild(deleteTh);

    thead.appendChild(headerRow);

    // add the header row to the table
    table.appendChild(thead);
      
    // table body
    const tbody = document.createElement('tbody');

    // iterate through each book found
    data.forEach(book => {
      const row = document.createElement('tr');
    
      // using each key written in the headers (title, author, ...)
      // retrieve and write the corresponding values for this book
      headers.forEach(key => {
        const td = document.createElement('td');
        td.textContent = book[key];
        row.appendChild(td);
      });

      // add the edit button for this book
      const editTd = document.createElement('td');
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('btn');
      editBtn.onclick = () => openEditForm(book); // function called when the button is clicked
      editTd.appendChild(editBtn);
      row.appendChild(editTd);

      // add the delete button for this book
      const deleteTd = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('btn');
      deleteBtn.onclick = () => deleteBookRecord(book.id); // function called when the button is clicked
      deleteTd.appendChild(deleteBtn);
      row.appendChild(deleteTd);

      // add the entire row to the table
      tbody.appendChild(row);
    });
  
    // add all the books records to the table
    table.appendChild(tbody);

    // add the table to the container
    container.appendChild(table);
  } catch (error) {
    console.error('Error loading books:', error);
  }
}

// add or edit a book depending on the interactions of the user
async function addEditFromForm() {
  // all books information written by the user in the form
  const title = document.getElementById('titleInput').value;
  const author = document.getElementById('authorInput').value;
  const year = document.getElementById('yearInput').value;
  const price = document.getElementById('priceInput').value;

  // if the user has clicked the edit button, retrieve the id to update the table
  const id = document.getElementById('bookForm').dataset.editing;

  // check that all fields were filled
  if (!title || !author || !year || !price) {
    showToast('⚠️ All fields have to be filled.');
    return;
  }

  // if editing book info
  if(id) {
    // try to update the book info
    try {
      const response = await fetch(`http://localhost:3000/queries/updateBook/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, year, price }),
      });

      const data = await response.json();
      showToast('✅ Book successfully edited!');

      // update the books list
      loadBooks();

      // empty the form fields and hide the form after submitting
      document.getElementById('titleInput').value = '';
      document.getElementById('authorInput').value = '';
      document.getElementById('yearInput').value = '';
      document.getElementById('priceInput').value = '';
      document.getElementById('bookForm').style.display = 'none';

    } catch (error) {
      console.error('Error updating book:', error);
      showToast('⚠️ Failed to update book.');
    }
  }
  else {
    // otherwise the user is trying to add a book
    try {
      const response = await fetch('http://localhost:3000/queries/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, year, price })
      });

      const data = await response.json();
      showToast('✅ Book successfully added!');
    
      loadBooks();

      document.getElementById('titleInput').value = '';
      document.getElementById('authorInput').value = '';
      document.getElementById('yearInput').value = '';
      document.getElementById('priceInput').value = '';
      document.getElementById('bookForm').style.display = 'none';
    } catch (error) {
      console.error('Error adding book:', error);
      showToast('⚠️ Failed to add book.');
    }
  }
  document.getElementById('toggleFormBtn').style.display = 'block';
}

// makes the form visible if it wasn't before
function toggleForm() {
    const form = document.getElementById('bookForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// this function opens the form with all book info and prefills it
function openEditForm(book) {
  const form = document.getElementById('bookForm');
  const titleInput = document.getElementById('titleInput');
  const authorInput = document.getElementById('authorInput');
  const yearInput = document.getElementById('yearInput');
  const priceInput = document.getElementById('priceInput');

  form.dataset.editing = book.id; // book ID to use for the update query
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  priceInput.value = book.price;

  form.style.display = 'block';
  document.getElementById('toggleFormBtn').style.display = 'none';
}

// create a small box that asks for confirmation when trying to delete a book record
function deleteBookRecord(bookId) {
  const confirmBox = document.createElement('div');
  confirmBox.classList.add('confirm-box');

  confirmBox.innerHTML = `
    <div class="confirm-content">
      <p>Are you sure you want to delete this book?</p>
      <button class="btn confirm-yes">Yes</button>
      <button class="btn confirm-no">Cancel</button>
    </div>
  `;

  document.body.appendChild(confirmBox);

  confirmBox.querySelector('.confirm-yes').onclick = async () => {
    await deleteBook(bookId);
    document.body.removeChild(confirmBox);
    loadBooks();
  };

  confirmBox.querySelector('.confirm-no').onclick = () => {
    document.body.removeChild(confirmBox);
  };
}

// allows to delete a book
async function deleteBook(id) {
  try {
    const res = await fetch(`http://localhost:3000/queries/deleteBook/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    
  } catch (error) {
    console.error('Error deleting book:', error);
  }
}