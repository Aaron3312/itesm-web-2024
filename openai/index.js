const OpenAI = require("openai");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;
const fs = require("fs/promises"); // Import fs/promises para manejar archivos de forma asíncrona

app.use(cors());
app.use(bodyParser.json());

let response = "";

/*app.get('/api/test', (req, res) => {
    res.json({ gretting: `Hello, ${main()}!` });
});*/

app.get("/api/test", async (req, res) => {
	try {
		const response = await main(response1); // Call main() and wait for the Promise to resolve
		console.log(response); // Log the response from OpenAI
		res.json({ greeting: `Hello, ${response}!` }); // Send the response as part of the JSON
	} catch (error) {
		console.error("Failed to retrieve data from OpenAI:", error);
		res.status(500).send("Failed to retrieve data");
	}
});

app.post("/api/CustomGreeting", async (req, res) => {
	const name = req.body.name;
	const response1 = await main(name);
	res.json({response1});
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function main(response1) {
    
    let userResponse = response1;
	let messages = await readMessages(); // Leer mensajes del archivo JSON
	messages.push({ role: "user", content: userResponse }); // Agregar la nueva pregunta del usuario
    const completion = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: messages,
	});

    messages.push({role: 'assistant', content: completion.choices[0].message.content}); // Agregar la respuesta del asistente
    await writeMessages(messages);  // Guardar los mensajes actualizados en el archivo JSON



	console.log(completion.choices[0].message);
	return completion.choices[0].message.content;
}

async function readMessages() {
    const data = await fs.readFile('messages.json', 'utf8');
    return JSON.parse(data);
}

async function writeMessages(messages) {
    await fs.writeFile('messages.json', JSON.stringify(messages, null, 2), 'utf8');
}