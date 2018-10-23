const express = require('express');

const PORT = 8080;
const app = express();

app.get('/hello', (req, res) => {
    res.send({ "hello": "world"});
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
