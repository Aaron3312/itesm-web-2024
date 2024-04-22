const OpenAI = require('openai');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());



/*app.get('/api/test', (req, res) => {
    res.json({ gretting: `Hello, ${main()}!` });
});*/
app.get('/api/test', async (req, res) => {
    try {
        const response = await main();  // Call main() and wait for the Promise to resolve
        console.log(response);          // Log the response from OpenAI
        res.json({ greeting: `Hello, ${response}!` });  // Send the response as part of the JSON
    } catch (error) {
        console.error('Failed to retrieve data from OpenAI:', error);
        res.status(500).send('Failed to retrieve data');
    }
});

app.post('/api/CustomGreeting', (req, res) => {
    const name = req.body.name;
    res.json({ greeting: `Hello, ${main()}!` });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function main() {
let messages = [
    {role: 'system', content: 'you are an excellent professor of web development'},
    {role: 'user', content: 'what is an API?'},
    {role: 'assistant', content: 'An API is a set of rules and protocols that allows one software application to communicate with another. It defines the methods for requesting and sending data between different software applications.'}
];

let userResponse = 'what is an API again?';

messages.push({role: 'user', content: userResponse});

const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
});

console.log(completion.choices[0].message);
return completion.choices[0].message.content;



};

