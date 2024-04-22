const OpenAI = require("openai");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3005;
const fs = require("fs/promises"); // Import fs/promises para manejar archivos de forma asíncrona

app.use(cors());
app.use(bodyParser.json());

let response = "";

/*app.get('/api/test', (req, res) => {
    res.json({ gretting: `Hello, ${main()}!` });
});*/

/*app.get("/api/test", async (req, res) => {
	const response = await main(response1); // Call main() and wait for the Promise to resolve
	console.log(response); // Log the response from OpenAI
	res.json({ greeting: `Hello, ${response}!` }); // Send the response as part of the JSON
});*/
app.get("/reset", async (req, res) => {
	// Reset the messages array to an array like
	let messages = [
		{
			role: "system",
			content:
				"eres un asistente que puede responder preguntas sobbre taqueros y tacos",
		},
		{
			role: "user",
			content: "que es un taco",
		},
		{
			role: "assistant",
			content:
				"Un taco es un platillo mexicano que consiste en una tortilla de maíz o de harina que se dobla sobre sí misma para contener algún alimento dentro de ella. Los ingredientes más comunes son carne, cebolla, cilantro, salsa y limón. Los tacos son muy populares en México y en otros países de América Latina. ¿Te gustaría saber algo más sobre los tacos?",
		},
	];

	await writeMessages(messages); // escribir los mensajes del archivo JSON
	res.json({ message: "Messages reset" });
});

app.post("/api/CustomGreeting", async (req, res) => {
	const name = req.body.name;
	const response1 = await main(name);
	res.json(response1);
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

	messages.push({
		role: "assistant",
		content: completion.choices[0].message.content,
	}); // Agregar la respuesta del asistente
	await writeMessages(messages); // Guardar los mensajes actualizados en el archivo JSON

	console.log(completion.choices[0].message);
	return completion.choices[0];
}

async function readMessages() {
	const data = await fs.readFile("messages.json", "utf8");
	return JSON.parse(data);
}

async function writeMessages(messages) {
	await fs.writeFile(
		"messages.json",
		JSON.stringify(messages, null, 2),
		"utf8"
	);
}
