// Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

// Referencias das rotas da aplicação
const admin = require('./routes/admin');
//const post = require('./routes/post');
//const categoria = require('./routes/categoria');

// configurações

    // Sessão
    app.use(session({
        secret: "nodedemo",
        resave: true,
        saveUninitialized: true
    }));
    app.use(flash());

    // Midlleware
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        next();
    });

    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    
    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    // Mongoose
    mongoose.connect("mongodb://localhost/mongoblog").then(() => {
        console.log("Conectado ao servidor MongoDB.");
    }).catch((err) => {
        console.log("Erro ao se conectar ao banco: " + err);
    });

    // Public 
    app.use(express.static(path.join(__dirname, "public")));
    
// Rotas
app.use('/admin', admin);
//app.use('/post', post);
//app.use('/categoria', categoria);

// Outros
const PORT = 8083
app.listen(PORT, () => {
    console.log('Servidor inicializado');
});