document.getElementById("FetchRickById").addEventListener("click", function () {
    const id = document.getElementById("rickId").value;
    

    axios.get(`http://localhost:3000/rick/${id}`)
        .then((response) => {
            console.log(response.data);

            const character = response.data;
            const container = document.getElementById("output");
            container.appendChild(renderCharacter(character));
            //document.getElementById("output").innerHTML = JSON.stringify(response.data);
        })
        .catch((error) => {
            console.log(error);
        });

});

function renderCharacter(character){
    const card = document.createElement("div");
    card.className = "card col-sm-3";

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.src = character.image;


    card.appendChild(img);

    // TODO Get all info

    return card;
}