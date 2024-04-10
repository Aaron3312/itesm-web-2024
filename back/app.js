const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());


app.get('/api/test', (req, res) => {
    res.json({ gretting: 'Hello, World!' });
});

app.post('/api/CustomGreeting', (req, res) => {
    const name = req.body.name;
    res.json({ greeting: `Hello, ${name}!` });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
