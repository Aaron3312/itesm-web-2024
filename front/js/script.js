document.getElementById('changeGreeting').addEventListener('click', function() {
  document.getElementById('greeting').innerHTML = 'Hello, World!';
});


let counterValue = 0;

document.getElementById('changeGreeting').addEventListener('click', function() {
    counterValue++;
    document.getElementById('greeting').innerHTML = counterValue;
    });

let counterClikc = 0;

document.getElementById('countMyClick').addEventListener('click', function() {
    counterClikc++;
    document.getElementById('counter').innerHTML = counterClikc;
    });


//form function to send the name to the api server
document.getElementById('nameForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;

  fetch('http://localhost:3000/api/CustomGreeting', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({ name: name})
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('serverResponse').innerHTML = data.greeting;
  });
});