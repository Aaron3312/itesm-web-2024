// This file is run by the browser each time your view template is loaded

/**
 * Define variables that reference elements included in /views/index.html:
 */

// Forms
const dbForm = document.getElementById("databaseForm") //important, this is the form that we gonna use to create the database



const pageForm = document.getElementById("pageForm")
const blocksForm = document.getElementById("blocksForm")
const commentForm = document.getElementById("commentForm")

// Table cells where API responses will be appended
const dbResponseEl = document.getElementById("dbResponse") //this is where we gonna do the append in our code
//the nexts doestn care, but i will let it here for reference


const pageResponseEl = document.getElementById("pageResponse")
const blocksResponseEl = document.getElementById("blocksResponse")
const commentResponseEl = document.getElementById("commentResponse")

/**
 * Functions to handle appending new content to /views/index.html
 */

// Appends the API response to the UI
const appendApiResponse = function (apiResponse, el) {
  console.log(apiResponse)

  // Add success message to UI
  const newParagraphSuccessMsg = document.createElement("p")
  newParagraphSuccessMsg.textContent = "Result: " + apiResponse.message
  el.appendChild(newParagraphSuccessMsg)
  // See browser console for more information
  if (apiResponse.message === "error") return

  // Add ID of Notion item (db, page, comment) to UI
  const newParagraphId = document.createElement("p")
  newParagraphId.textContent = "ID: " + apiResponse.data.id
  el.appendChild(newParagraphId)

  // Add URL of Notion item (db, page) to UI
  // if (apiResponse.data.url) {
  //   const newAnchorTag = document.createElement("a")
  //   newAnchorTag.setAttribute("href", apiResponse.data.url)
  //   newAnchorTag.innerText = apiResponse.data.url
  //   el.appendChild(newAnchorTag)
  // }
  if (apiResponse.data.url) {
    const newAnchorTag = document.createElement("a")
    idurlOfNotionItem = apiResponse.data.id.replace(/-/g, "");
    urlofNotionItem = "http://aaronproject1.notion.site/" + idurlOfNotionItem;
    newAnchorTag.setAttribute("href", urlofNotionItem )
    newAnchorTag.innerText = urlofNotionItem;
    el.appendChild(newAnchorTag)

  }

}

// Appends the blocks API response to the UI
const appendBlocksResponse = function (apiResponse, el) {
  console.log(apiResponse)

  // Add success message to UI
  const newParagraphSuccessMsg = document.createElement("p")
  newParagraphSuccessMsg.textContent = "Result: " + apiResponse.message
  el.appendChild(newParagraphSuccessMsg)

  // Add block ID to UI
  const newParagraphId = document.createElement("p")
  newParagraphId.textContent = "ID: " + apiResponse.data.results[0].id
  el.appendChild(newParagraphId)
}

/**
 * Attach submit event handlers to each form included in /views/index.html
 */

// Attach submit event to each form
// dbForm.onsubmit = async function (event) { //this is the function that will be called when the form is submitted
//   event.preventDefault()

//   const dbName = event.target.dbName.value
//   const body = JSON.stringify({ dbName })

//   const newDBResponse = await fetch("/databases", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body,
//   })
//   const newDBData = await newDBResponse.json()

//   appendApiResponse(newDBData, dbResponseEl)
// }

// client.js
document.addEventListener('DOMContentLoaded', function() {

});


dbForm.onsubmit = async function (event) {
  event.preventDefault()
  const name = event.target.dbName.value
  const body = JSON.stringify({ dbName })
  console.log("que carajo?")
  const newAnchorTag1 = document.createElement("a")
  newAnchorTag1.setAttribute("href", "http://aaronproject1.notion.site/" )
  newAnchorTag1.innerText = "CARGANDO!!!!";
  dbResponseEl.appendChild(newAnchorTag1)

  

  const newDBResponse = await fetch("/databases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name })
  })
  const newDBData = await newDBResponse.json()

  appendApiResponse(newDBData, dbResponseEl)
  dbResponseEl.removeChild(newAnchorTag1)
}



pageForm.onsubmit = async function (event) {
  event.preventDefault()

  const dbID = event.target.newPageDB.value
  const pageName = event.target.newPageName.value
  const header = event.target.header.value
  const body = JSON.stringify({ dbID, pageName, header })
//  const dueDate = event.target.dueDate.value


  const newPageResponse = await fetch("/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })

  const newPageData = await newPageResponse.json()
  appendApiResponse(newPageData, pageResponseEl)
}

blocksForm.onsubmit = async function (event) {
  event.preventDefault()

  const pageID = event.target.pageID.value
  const content = event.target.content.value
  const body = JSON.stringify({ pageID, content })

  const newBlockResponse = await fetch("/blocks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })

  const newBlockData = await newBlockResponse.json()
  appendBlocksResponse(newBlockData, blocksResponseEl)
}

commentForm.onsubmit = async function (event) {
  event.preventDefault()

  const pageID = event.target.pageIDComment.value
  const comment = event.target.comment.value
  const body = JSON.stringify({ pageID, comment })
      // Selecciona el elemento main y aplica la clase de transformación


  const newCommentResponse = await fetch("/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })

  const newCommentData = await newCommentResponse.json()
  appendApiResponse(newCommentData, commentResponseEl)
}


  
