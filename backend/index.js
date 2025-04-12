const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');

// CORS stands for Cross-Origin Resource Sharing. In this case
// frontend and backend don't share the same origin (for origin we mean scheme + domain + port), so we need to use cors()
// In this scenario we have:
// backend origin: http://localhost:3000/api/books
// frontend origin: http://localhist:5500/frontend/index.html
app.use(cors());

// Middleware to parse JSON bodies (the server will basically receive the request in JSON format)
app.use(express.json());

// set every rout inside routes.js with the prefix /api
app.use('/queries', routes);

// set the server port and make it listen to requests
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});