const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const indexController = require('./controllers/indexController');

require("dotenv").config();

const middlewares = require("./middlewares");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", indexController.index);
app.get("/recipe", indexController.new);
app.get("/recipe/:recipeId", indexController.showRecipe);
app.get("/categories", indexController.categories);
app.get("/categories/:categoryId", indexController.showCategory);
app.get("/search", indexController.search);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
