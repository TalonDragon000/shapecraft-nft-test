require('dotenv').config({path: '../.env'});
const axios = require('axios');

const url = `https://shape-sepolia.g.alchemy.com/v2/${process.env.SHAPE_API_KEY}`;

const payload = {
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_blockNumber',
  params: []
};

axios.post(url, payload)
  .then(response => {
    console.log('Latest Block:', response.data.result);
  })
  .catch(error => {
    console.error(error);
  });
