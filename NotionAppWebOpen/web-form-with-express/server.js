require("dotenv").config();
const express = require("express");
const app = express();
const OpenAI = require("openai");

const bodyParser = require("body-parser");
const cors = require("cors");
const port = 443;
const fs = require("fs/promises"); // Import fs/promises para manejar archivos de forma asíncrona

//manejo de cors y bodyparser para el manejo de datos
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

//manejo de la respuesta del asistente
let response = "";

//funcion pre definida notion
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public")); //para que se pueda acceder a los archivos de la carpeta public
app.use(express.json()); // for parsing application/json

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
	response.sendFile(__dirname + "/views/index.html");
});

//OpenAI API
app.post("/databases", async (req, res) => {
	const name = req.body.name;
	const response1 = await main(name);
	res.json(response1);
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
	//await writeMessages(messages); // Guardar los mensajes actualizados en el archivo JSON

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

// Create new database. The page ID is set in the environment variables.
app.post("/dat", async function (request, response) {
	const pageId = process.env.NOTION_PAGE_ID;
	const title = request.body.dbName;

	try {
		const newDb = await notion.databases.create({
			parent: {
				type: "page_id",
				page_id: pageId,
			},
			title: [
				{
					type: "text",
					text: {
						content: title,
					},
				},
			],
			properties: {
				Name: {
					title: {},
				},
				DueDate: {
					// Adding a due date column
					date: {},
				},
				Completed: {
					// Adding a checkbox to mark if the task is done
					checkbox: {},
				},
			},
		});

		response.json({ message: "success!", data: newDb });
	} catch (error) {
		response.json({ message: "error", error });
	}
});

// Create new page. The database ID is provided in the web form.
app.post("/pages", async function (request, response) {
	const { dbID, pageName, header } = request.body;

	try {
		const newPage = await notion.pages.create({
			parent: {
				type: "database_id",
				database_id: dbID,
			},
			properties: {
				Name: {
					title: [
						{
							text: {
								content: pageName,
							},
						},
					],
				},
			},
			children: [
				{
					object: "block",
					heading_2: {
						rich_text: [
							{
								text: {
									content: header,
								},
							},
						],
					},
				},
			],
		});
		response.json({ message: "success!", data: newPage });
	} catch (error) {
		response.json({ message: "error", error });
	}
});

// Create new block (page content). The page ID is provided in the web form.
app.post("/blocks", async function (request, response) {
	const { pageID, content } = request.body;

	try {
		const newBlock = await notion.blocks.children.append({
			block_id: pageID, // a block ID can be a page ID
			children: [
				{
					// Use a paragraph as a default but the form or request can be updated to allow for other block types: https://developers.notion.com/reference/block#keys
					paragraph: {
						rich_text: [
							{
								text: {
									content: content,
								},
							},
						],
					},
				},
			],
		});
		response.json({ message: "success!", data: newBlock });
	} catch (error) {
		response.json({ message: "error", error });
	}
});

// Create new page comments. The page ID is provided in the web form.
app.post("/comments", async function (request, response) {
	const { pageID, comment } = request.body;

	try {
		const newComment = await notion.comments.create({
			parent: {
				page_id: pageID,
			},
			rich_text: [
				{
					text: {
						content: comment,
					},
				},
			],
		});
		response.json({ message: "success!", data: newComment });
	} catch (error) {
		response.json({ message: "error", error });
	}
});

// listen for requests :)
const listener = app.listen(8080, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
