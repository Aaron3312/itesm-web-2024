const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();


const app = express();

let port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/rick/:id", async (req, res) => {
    const END_POINT = `https://rickandmortyapi.com/api/character/${req.params.id}`;

    axios.get(END_POINT)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
            send.send(error);
        });
        
});
    


