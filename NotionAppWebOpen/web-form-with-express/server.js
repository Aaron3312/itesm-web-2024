require("dotenv").config();
const express = require("express");
const app = express();
const OpenAI = require("openai");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 443;
const fs = require("fs/promises"); // Import fs/promises para manejar archivos de forma asíncrona

//manejo de la hora y fecha
const { DateTime } = require("luxon");

//manejo de cors y bodyparser para el manejo de datos
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

//manejo de la respuesta del asistente
let response = "";
let time1 = DateTime.now().toFormat('dd-MM-yyyy');

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
app.post("/fd", async (req, res) => {
	const name = req.body.name;
	const response1 = await main(name);
	res.json(response1);
});

// async function main(response1) {
// 	let userResponse = response1;
// 	let messages = await readMessages(); // Leer mensajes del archivo JSON
// 	messages.push({ role: "user", content: userResponse }); // Agregar la nueva pregunta del usuario
// 	const completion = await openai.chat.completions.create({
// 		model: "gpt-3.5-turbo",
// 		messages: messages,
// 	});

// 	messages.push({
// 		role: "assistant",
// 		content: completion.choices[0].message.content,
// 	}); // Agregar la respuesta del asistente
// 	//await writeMessages(messages); // Guardar los mensajes actualizados en el archivo JSON

// 	console.log(completion.choices[0].message);
// 	return completion.choices[0];
// }

// async function readMessages() {
// 	const data = await fs.readFile("messages.json", "utf8");
// 	return JSON.parse(data);
// }

// async function writeMessages(messages) {
// 	await fs.writeFile(
// 		"messages.json",
// 		JSON.stringify(messages, null, 2),
// 		"utf8"
// 	);
// }

// Create new database. The page ID is set in the environment variables.
app.post("/databases", async function (req, res) {

	const pageId = process.env.NOTION_PAGE_ID;
	//const title = request.body.dbName;
	//necesitamos añadir un proceso para pedir el pageId ###
	const name = req.body.name;
  console.log((time1.toString()));
  //formato para generar la base de datos
  let messages = [
    {
      "role": "system",
      "content": "eres un asistente que planifica y acomoda eventos o gestiona proyectos en la agenda el dia de hoy es " + time1 + " haz todo para que dure 1 semana a no ser que se te indique lo contrario y da lo que se te solicite sobre el contexto para el siguiente proyecto: " + name + "lo que no sepas imaginalo o generalo!"
    }
  ];
  await writeMessages(messages);


  var prompts = "Genera y dime unica y exclusivamente el titulo del proyecto resumido sin otras cosas ni nada de contexto extra o preguntas, UNICAMENTE el titulo del proyecto que te propongo acontinuacion: ";
	const response1 = await DBsd(name , prompts);
  const responseFromDB = await dbGenerator(response1, pageId);
  //console.log(ded.data.id); //this is the id of the database
  var database_id = responseFromDB.data.id;
  //formato para generar paginas en la base de datos con las tareas del proyecto respectivas
  //var promptsPages = "Genera y dime unica y exclusivamente el nombre de la primera tarea sin otras cosas ni nada de contexto extra o preguntas, UNICAMENTE el nombre de la primer tarea para llevar a cabo ese proyecto!";
  //const response2 = await DBsd(name, promptsPages);
  //console.log(response2);
  //const ded2 = await pageGenerator(response2, database_id);
  //res.json(ded2);
  var promptNumberOfTasks = "Genera y dime cuantas tareas tiene el proyecto unicamente genera el numero de tareas nada mas, generalo en formato numerico sin otra palabra!";
  NumberOfTasks = await DBsd((readMessages()), promptNumberOfTasks);
  var promptsPages = "Genera y dime unica y exclusivamente el nombre de la primera tarea sin otras cosas ni nada de contexto extra o preguntas, UNICAMENTE el nombre de la primer tarea para llevar a cabo ese proyecto y el numero 1!";
  response2 = await DBsd((readMessages()), promptsPages);
  response_T1 = await DBsd((readMessages()), "Genera o imagina o investiga, pero hazlo! y dime los pasos a seguir para hacer la primer tarea del proyecto: " + name + "!"); 
  response_dueDate = await DBsd((readMessages()), "Genera y dime la fecha de vencimiento de la tarea numero 1 del proyecto en formato AAAA-MM-DD!");
  var page1 = pageGenerator(response2, database_id, response_T1, response_dueDate);



  //for (let i = 2; i <= NumberOfTasks; i++) {
  for (let i = 2; i <= NumberOfTasks; i++) {
    var promptsPages = "Genera y dime unica y exclusivamente el nombre de la tarea numero " + i + " sin otras cosas ni nada de contexto extra o preguntas, UNICAMENTE el nombre de la tarea para llevar a cabo ese proyecto y sin verbos como realizar o hacer!";
    response2 = await DBsd((readMessages()), promptsPages);
    response_T1 = await DBsd((readMessages()), "Genera o imagina para que me digas los pasos a seguir para hacer la tarea numero " + i + " del proyecto: " + name + "!" ); 
    response_dueDate = await DBsd((readMessages()), "Genera y dime la fecha de vencimiento de la tarea numero " + i + " del proyecto en formato AAAA-MM-DD!");
    var page1 = pageGenerator(response2, database_id, response_T1, response_dueDate);
  }
  console.log("fin de la creacion de la base de datos y las paginas de las tareas");
  database_id_whitout_dash = database_id.replace(/-/g, "");
  console.log("https://www.notion.so/" + database_id_whitout_dash);

  sortedRows1 = await sortedRows(database_id);

  sorts = await sorts1(database_id);

  res.json(responseFromDB);

});

const sortedRows = async (database_id) => {
	const response = await notion.databases.query({
	  database_id: database_id,
	  sorts: [
	    {
	      property: "Name",
	      direction: "ascending"
		  }
	  ],
	});
  return response;
}

async function sorts1(database_id1) {
  const response = await notion.databases.query({
	  database_id: database_id1,
	  sorts: [
	    {
	      property: "DueDate",
	      direction: "ascending"
		  }
	  ],
	});
  console.log(response);
  return response;
}


//funcion para generar la base de datos
async function dbGenerator(response1, pageId, ded) {
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
            content: response1,
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        DueDate: {
          date: {},
        },
        Completed: {
          checkbox: {},
        },
      },
      sorts: [
        {
          property: 'DueDate',
          direction: 'ascending',
        }
      ],
    });
    return ({ message: "success!", data: newDb });
  } catch (error) {
    return ({ message: "error", error });
  }
}


//funcion para generar las paginas de las tareas
async function pageGenerator(response2, pageId, response_T1, dueDate) {
  try {
    const newPage = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: pageId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: response2,
              },
            },
          ],
        },
        DueDate: {
          date: {
            start: dueDate,  // Formato esperado "AAAA-MM-DD"
          }
        }
      },
      children: [
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: response_T1,
                },
              },
            ],
          },
        },
      ],
    });
    return ({ message: "success!", data: newPage });
  } catch (error) {
    return ({ message: "error", error });
  }
}


	







async function DBsd(response1, prompts) { //funcion para generar el nombre de la base de datos a partir de la respuesta del usuario
  let messages = await readMessages(); // Leer mensajes del archivo JSON
  let userQuestion = response1 || messages;

  //generate the response with the user question
  messages.push({ role: "user", content: prompts + userQuestion
  }); // Agregar la nueva pregunta del usuario
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  messages.push({
    role: "assistant",
    content: completion.choices[0].message.content,
  }); // Agregar la respuesta del asistente
  //await writeMessages(messages); // Guardar los mensajes actualizados en el archivo JSON
	await writeMessages(messages); // Guardar los mensajes actualizados en el archivo JSON

  console.log(completion.choices[0].message);
  return completion.choices[0].message.content;
}

async function readMessages() {
	const data = await fs.readFile("messages.json", "utf8");
	return JSON.parse(data);
}


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
const listener = app.listen(port, function () {
	console.log("Your app is listening on port " + listener.address().port);
});


async function writeMessages(messages) {
	await fs.writeFile(
		"messages.json",
		JSON.stringify(messages, null, 2),
		"utf8"
	);
}
