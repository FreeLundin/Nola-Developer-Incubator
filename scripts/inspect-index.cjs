const http = require('http');
http.get('http://127.0.0.1:5000/', res => {
  let s = '';
  res.on('data', d => s += d);
  res.on('end', () => {
    console.log('LEN', s.length);
    console.log('OPEN-SHOP', s.indexOf('data-testid="open-shop"') !== -1);
    console.log('START-GAME', s.indexOf('Start Game') !== -1);
  });
}).on('error', e => console.error('ERR', e.message));

