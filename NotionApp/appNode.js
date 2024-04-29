// Importamos el cliente de Notion
const { Client } = require('@notionhq/client');

// Inicializando un cliente de Notion
const notion = new Client({
  auth: 'tu_integration_token_aquí', // Reemplaza 'tu_integration_token_aquí' con tu Integration Token
});

// ID de tu base de datos
const databaseId = 'tu_database_id_aquí'; // Reemplaza 'tu_database_id_aquí' con el ID de tu base de datos

// Función asíncrona para agregar una nueva página a la base de datos
async function addItem(title) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Name': { // Suponiendo que 'Name' es el nombre de una propiedad en tu base de datos
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    });
    console.log('Página añadida con ID:', response.id);
  } catch (error) {
    console.error('Error al añadir página:', error.body);
  }
}

// Llamada a la función con el título que deseas añadir
addItem('Nuevo Registro en Notion');
