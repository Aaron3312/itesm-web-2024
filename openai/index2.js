const OpenAI = require('openai');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const fs = require('fs/promises');  // Import fs/promises para manejar archivos de forma asíncrona
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/test', async (req, res) => {
    try {
        const response = await main();  // Call main() and wait for the Promise to resolve
        console.log(response);
        res.json({ greeting: `Hello, ${response}!` });
    } catch (error) {
        console.error('Failed to retrieve data from OpenAI:', error);
        res.status(500).send('Failed to retrieve data');
    }
});

app.post('/api/CustomGreeting', async(req, res) => {
    const name = req.body.name;
    const response = await main(name);
    res.json({ greeting: `Hello, ${response}!` });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function main(userResponse) {
    let messages = await readMessages();  // Leer mensajes del archivo JSON
    messages.push({ role: 'user', content: userResponse });  // Agregar la nueva pregunta del usuario

    let completion;  // Asegúrate de declarar 'completion' fuera de cualquier bloque condicional
    try {
        completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        // Asegurarse de que la variable 'completion' se ha inicializado correctamente antes de usarla
        if (completion && completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
            messages.push({ role: 'assistant', content: completion.choices[0].message.content }); // Agregar la respuesta del asistente
            await writeMessages(messages);  // Guardar los mensajes actualizados en el archivo JSON
            console.log(completion.choices[0].message);
            return completion.choices[0].message.content;
        } else {
            throw new Error("Invalid completion structure.");
        }
    } catch (error) {
        console.error("Error during OpenAI API call:", error);
        throw error;  // Propagar el error para manejarlo en la función que llama
    }
}




async function readMessages() {
    const data = await fs.readFile('messages.json', 'utf8');
    return JSON.parse(data);
}

async function writeMessages(messages) {
    await fs.writeFile('messages.json', JSON.stringify(messages, null, 2), 'utf8');
}
