// Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const db = require("./config/db");

require("./config/auth")(passport)

require("./models/Postagem");
const Postagem = mongoose.model("postagens");

require("./models/Categoria");
const Categoria = mongoose.model("categorias");

// Referencias das rotas da aplicação
const admin = require('./routes/admin');
const usuario = require("./routes/usuario");

// configurações

    // Sessão
    app.use(session({
        secret: "nodedemo",
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // Midlleware
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next();
    });

    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    
    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    // Mongoose
    mongoose.connect(db.mongoURI).then(() => {
        console.log("Conectado ao servidor MongoDB.");
    }).catch((err) => {
        console.log("Erro ao se conectar ao banco: " + err);
    });

    // Public 
    app.use(express.static(path.join(__dirname, "public")));
    
// Rotas
app.get('/', (req, res) =>{
    
    Postagem.find().populate("categoria").sort({data: 'desc'}).then((postagens)=>{
        res.render("index",{postagens: postagens});
    }).catch((err)=>{
        res.flash("error_msg","Erro ao listar postegens");
        res.redirect("/404");
    });
});

app.get("/404",(req, res) => {
    res.send("Erro 404");
});

app.get("/postagem/:slug",(req, res) => {
    Postagem.findOne({slug:req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem});
        }else{
            req.flash("error_msg","Esta postagem não existe");
            res.redirect("/");
        }
    }).catch((err)=>{
        req.flash("error_msg","Problema ao buscar a postagem: " + err);
            res.redirect("/");
    });
});

app.get("/categoria",(req, res) => {
    Categoria.find().then((categorias)=>{
        res.render("categoria/index",{categorias: categorias});
    }).catch((err)=>{
        req.flash("error_msg","Problema ao listar categorias: " + err);
        res.redirect("/");
    });
});

app.get("/categoria/:slug",(req, res) => {
    Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens) => {
                res.render("categoria/postagens",{postagens: postagens, categoria: categoria});
            }).catch((err)=>{
                req.flash("error_msg","Problema ao buscar a categoria: " + err);
                res.redirect("/");
            });            
        }else{
            req.flash("error_msg","Esta categoria não existe");
            res.redirect("/");
        }
    }).catch((err)=>{
        req.flash("error_msg","Problema ao buscar a categoria: " + err);
        res.redirect("/");
    });
});

app.use("/admin", admin);
app.use("/usuarios", usuario);

// Outros
const PORT = process.env.PORT || 8083
app.listen(PORT, () => {
    console.log('Servidor inicializado');
});