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

  document.getElementById('chatGenreBtn').addEventListener('click', async () => {
    const input = document.getElementById('chatInput').value;
    if (!input) {
      document.getElementById("missingGenre").innerText = "Remember to type the genre above :)"
      return;
    }
  
    document.getElementById("missingGenre").innerText = '';
    
    const response = await fetch('http://localhost:3000/queries/getBooks');
    const res = await response.json();
    
    var booksList = 'books list: '

    res.forEach(book => {
      booksList = booksList + book.title + ', ';  
    });

    const promptText = 'By looking at the available books in this '+booksList+' can you suggest a book whose genre is '+input+'?';

    try {
      const res = await fetch('http://localhost:3000/queries/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptText })
      });
  
      const data = await res.json();
      document.getElementById('chatResponse').innerText = data.reply;
  
    } catch (err) {
      console.error('Chat error:', err);
      document.getElementById('chatResponse').innerText = 'Error getting response.';
    }
  });

  /* TO DO
  document.getElementById('chatSuggestBtn').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/queries/getBooks');
    const res = await response.json();
    
    var booksList = 'books list: '

    res.forEach(book => {
      booksList = booksList + book.title + ', ';  
    });

    const promptText = 'By looking at the available books in this '+booksList+' which book would you suggest?';

    try {
      const res = await fetch('http://localhost:3000/queries/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptText })
      });
  
      const data = await res.json();
      document.getElementById('chatResponse').innerText = data.reply;
  
    } catch (err) {
      console.error('Chat error:', err);
      document.getElementById('chatResponse').innerText = 'Error getting response.';
    }
  });*/
  
  // this allows to submit the prompt by just hitting the enter key and not having to click the send button
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('chatBtn').click();
  });