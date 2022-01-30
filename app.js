require("dotenv").config();
const express = require("express");


const app = express();

// swagger 
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));



// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//routes
const user = require("./routes/user");

//routes middleware
app.use("/api/v1",user);

module.exports = app;