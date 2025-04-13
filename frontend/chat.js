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
  
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('chatBtn').click();
  });