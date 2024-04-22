const OpenAI = require('openai');
require('dotenv').config();

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

let messages = [
    {role: 'system', content: 'you are an excellent professor of web development'},
    {role: 'user', content: 'what is an API?'}
    {role: 'assistant', content: 'An API is a set of rules and protocols that allows one software application to communicate with another. It defines the methods for requesting and sending data between different software applications.'}
];