const express = require("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));//подключение css/js и source файлов

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/views/main.html");
});
app.get("/repository", function (request, response) {
    response.sendFile(__dirname + "/views/repos.html");
});

app.listen(3000);