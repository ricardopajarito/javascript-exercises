const express = require("express");
const loaders = require("./src/loaders");

const startServer = () => {
    const app = express();
    loaders(app);
}

startServer();