const express = require('express');

const app = express();
const port = 3000;

app.post('/api/test', (req, res) => {
    res.json({ gretting: 'Hello, World!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
