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

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

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
}

async function addBook() {
    try {
        const response = await fetch('http://localhost:3000/queries/addBook');
        const data = await response.json();

        console.log(data.message)

    } catch (error) {
        console.error('Error adding books:', error);
    }
}

async function addBookFromForm() {
    const title = document.getElementById('titleInput').value;
    const author = document.getElementById('authorInput').value;

    if (!title || !author) {
        showToast('⚠️ Please enter both title and author.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/queries/addBookFromForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author })
        });

        const data = await response.json();
        //showToast('✅ Book added!');
        showToast(data.message);
        document.getElementById('titleInput').value = '';
        document.getElementById('authorInput').value = '';
        loadBooks();

        // Hide the form after submit
        document.getElementById('bookForm').style.display = 'none';

    } catch (error) {
        console.error('Error adding book:', error);
        showToast('⚠️ Failed to add book.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadBtn').addEventListener('click', loadBooks);
    document.getElementById('submitBtn').addEventListener('click', addBookFromForm);
    document.getElementById('toggleFormBtn').addEventListener('click', toggleForm);
});

function toggleForm() {
    const form = document.getElementById('bookForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('chatBtn').addEventListener('click', async () => {
    const input = document.getElementById('chatInput').value;
    if (!input) return;
  
    try {
      const res = await fetch('http://localhost:3000/queries/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: input })
      });
  
      const data = await res.json();
      document.getElementById('chatResponse').innerText = data.reply;
  
    } catch (err) {
      console.error('Chat error:', err);
      document.getElementById('chatResponse').innerText = 'Error getting response.';
    }
  });