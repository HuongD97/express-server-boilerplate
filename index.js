const express = require('express');

const PORT = 8080;
const app = express();

app.get('/', (req, res) => {
    res.send(JSON.stringify({ Hello: `World`}));
});

app.get('/hello', (req, res) => {
    res.send(JSON.stringify({ whoot: `hoot!`}));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
