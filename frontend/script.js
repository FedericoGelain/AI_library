/*fetch('http://localhost:3000/api/books')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('booksList');
    data.forEach(book => {
      const li = document.createElement('li');
      li.textContent = book.title;
      list.appendChild(li);
    });
  })
  .catch(err => console.error(err));*/

// add all events listeners tied to the buttons click
document.addEventListener('DOMContentLoaded', () => {
   //this is to filter books
    document.getElementById('searchInput').addEventListener('input', (e) => {
      loadBooks(e.target.value);
    });

    // to make the book table visible (the line commented passes the event object instead of an empty string parameter)
    //document.getElementById('loadBtn').addEventListener('click', loadBooks);

    document.getElementById('toggleFormBtn').addEventListener('click', toggleForm);


    // makes the form to add/edit a book appear
    document.getElementById('loadBtn').addEventListener('click', () => {
      if (searchInput.style.display === 'none') {
        searchInput.style.display = 'block';
      }
      loadBooks(); // No filter initially
    });

    // to add/edit a book after filling the form
    document.getElementById('submitBtn').addEventListener('click', addEditFromForm);
});
  
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

/*
async function loadBooks() {
    try {
        const response = await fetch('http://localhost:3000/queries/getBooks');
        const data = await response.json();

        const list = document.getElementById('booksList');
        list.innerHTML = ''; // refresh the list, otherwise the same items are added over and over again

        data.forEach(book => {
        const li = document.createElement('li');
        li.textContent = book.title;
        list.appendChild(li);
        });

    } catch (error) {
        console.error('Error loading books:', error);
    }
}*/
async function loadBooks(filter = '') {
    try {
      const response = await fetch('http://localhost:3000/queries/getBooks');
      const res = await response.json();
      data = {};

      //console.log(String(filter || ''))
      // without getComputedStyle you only check inline style, so not the actual visibility that also the user can see
      if(getComputedStyle(document.getElementById('searchInput')).display === 'none' || String(filter || '').trim() === '') {
        document.getElementById('searchInput').style.display = 'block';
        data = res;
      }
      else {
        // 🔍 Apply search filtering
data = res.filter(book =>
  book.title.toLowerCase().includes(filter.toLowerCase()) ||
  book.author.toLowerCase().includes(filter.toLowerCase())
);
      }
  
      const container = document.getElementById('booksList');
      container.innerHTML = ''; // Clear previous content

      if (!data.length) {
        container.textContent = 'No books found.';
        return;
      }
  
      // Create table
      const table = document.createElement('table');
      table.classList.add('book-table');
  
      // Table headers
      const thead = document.createElement('thead');
      const headers = Object.keys(data[0]);
      const headerRow = document.createElement('tr');
      headers.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        headerRow.appendChild(th);
      });

      const actionTh = document.createElement('th');
      actionTh.textContent = 'Edit';
      headerRow.appendChild(actionTh);

      thead.appendChild(headerRow);
      table.appendChild(thead);

      const deleteTh = document.createElement('th');
      deleteTh.textContent = 'Delete';
      headerRow.appendChild(deleteTh);

      thead.appendChild(headerRow);
      table.appendChild(thead);
      
  
      // Table body
      const tbody = document.createElement('tbody');
      data.forEach(book => {
        const row = document.createElement('tr');
        headers.forEach(key => {
          const td = document.createElement('td');
          td.textContent = book[key];
          row.appendChild(td);
        });
        // Add Edit button
      const editTd = document.createElement('td');
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('btn');
      editBtn.onclick = () => openEditForm(book);
      editTd.appendChild(editBtn);
      row.appendChild(editTd);

        // Add delete button
        const deleteTd = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('btn');
      deleteBtn.onclick = () => deleteBookRecord(book.id);
      deleteTd.appendChild(deleteBtn);
      row.appendChild(deleteTd);

        tbody.appendChild(row);
      });
  
      
      
      table.appendChild(tbody);
      container.appendChild(table);
  
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  
async function testAddBook() {
    try {
        const response = await fetch('http://localhost:3000/queries/testAddBook');
        const data = await response.json();

        console.log(data.message)

    } catch (error) {
        console.error('Error adding books:', error);
    }
}

async function addEditFromForm() {
    const title = document.getElementById('titleInput').value;
    const author = document.getElementById('authorInput').value;
    const year = document.getElementById('yearInput').value;
    const price = document.getElementById('priceInput').value;

    const id = document.getElementById('bookForm').dataset.editing;

    if (!title || !author) {
        showToast('⚠️ Please enter both title and author.');
        return;
    }

    if(id) {
      try {
        const response = await fetch(`http://localhost:3000/queries/updateBook/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, author, year, price }),
        });

        const data = await response.json();
        //showToast('✅ Book added!');
        showToast(data.message);
        document.getElementById('titleInput').value = '';
        document.getElementById('authorInput').value = '';
        document.getElementById('yearInput').value = '';
        document.getElementById('priceInput').value = '';
        loadBooks();

        // Hide the form after submit
        document.getElementById('bookForm').style.display = 'none';

    } catch (error) {
        console.error('Error updating book:', error);
        showToast('⚠️ Failed to update book.');
    }
    }
    else {
      try {
        const response = await fetch('http://localhost:3000/queries/addBookFromForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, year, price })
        });

        const data = await response.json();
        //showToast('✅ Book added!');
        showToast(data.message);
        document.getElementById('titleInput').value = '';
        document.getElementById('authorInput').value = '';
        document.getElementById('yearInput').value = '';
        document.getElementById('priceInput').value = '';
        loadBooks();

        // Hide the form after submit
        document.getElementById('bookForm').style.display = 'none';

    } catch (error) {
        console.error('Error adding book:', error);
        showToast('⚠️ Failed to add book.');
    }
  }
}

async function updateBook(id, title, author, year, price) {
  try {
    const res = await fetch(`http://localhost:3000/queries/updateBook/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, author, year, price }),
    });

    const data = await res.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error updating book:', error);
  }
}


function toggleForm() {
    const form = document.getElementById('bookForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

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

async function deleteBook(id) {
  try {
    const res = await fetch(`http://localhost:3000/queries/deleteBook/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error deleting book:', error);
  }
}


function openEditForm(book) {
  const form = document.getElementById('bookForm');
  const titleInput = document.getElementById('titleInput');
  const authorInput = document.getElementById('authorInput');
  const yearInput = document.getElementById('yearInput');
  const priceInput = document.getElementById('priceInput');

  form.dataset.editing = book.id; // Store book ID for update
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  priceInput.value = book.price;

  form.style.display = 'block';
  document.getElementById('toggleFormBtn').style.display = 'none';
}
