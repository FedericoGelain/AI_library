// this function allows to write a prompt and ask the llm for a response
document.getElementById('chatBtn').addEventListener('click', async () => {
  const input = document.getElementById('chatInput').value;
  
  // check for empty prompt
  if (!input)
    return;
  
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

// this allows to submit the prompt by just hitting the enter key and not having to click the send button
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('chatBtn').click();
});

// ask for llm suggestions based on genre written on the prompt
document.getElementById('chatGenreBtn').addEventListener('click', async () => {
  const input = document.getElementById('chatInput').value;
  
  // check that the genre was written in the form
  if (!input) {
    document.getElementById("missingGenre").innerText = "Remember to type the genre above :)"
    return;
  }
  
  document.getElementById("missingGenre").innerText = '';
  
  // retrieve all the books from the database table
  const response = await fetch('http://localhost:3000/queries/getBooks');
  const res = await response.json();
  
  // and write them in a list so that the llm can easily interpret them
  var booksList = 'books list: '

  // here it will only consider their title (assuming it can understand what book it is based only on that)
  res.forEach(book => {
    booksList = booksList + book.title + ', ';  
  });


  // write the final prompt to send to the llm
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

/* TO DO (free suggestion from llm)
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