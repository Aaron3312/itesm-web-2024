const fetch = require('node-fetch');

const url = 'https://api.together.xyz/v1/chat/completions';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'Bearer 9361697d807f99cd5003bc94b52a4980d13780aee690083272d347e3fb1bfbc0'
  },
  body: JSON.stringify({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    stop: ['</s>'],
    frequency_penalty: 0,
    presence_penalty: 0,
    min_p: 1
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));