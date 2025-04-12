const express = require('express');
const router = express.Router();
const db = require('./database');
const ask_llm = require('./llm');

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await ask_llm(prompt);
    res.json({ reply: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM error' });
  }
});

// if the client makes a request with fetch() to a URL that ends with /getBooks
router.get('/getBooks', (req, res) => {
  // launch this query and send the result to the client
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
        return res.status(500).send(err);
    }

    // query was successful: send the result in JSON format to the client
    res.json(results);
  });
});

// if the client makes a request with fetch() to a URL that ends with /addBook
router.post('/addBook', (req, res) => {
  // Dummy example, replace with the request data
  title = 'Ciao';
  author = 'io';
  year = 1925;
  price = 12.50;

  db.query('INSERT INTO books (title, author, year, price) VALUES (?, ?, ?, ?);', [title, author, year, price], (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }

    res.status(201).send({message : 'Book successfully created!'})
  });

});

router.post('/addBookFromForm', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }
  
    db.query('INSERT INTO books (title, author, year, price) VALUES (?, ?, ?, ?)', [title, author, 2000, 1.5], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Book added successfully' });
    });
  });
  
module.exports = router;