const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

require("../models/Categoria");

const Categoria = mongoose.model("categorias");

router.get('/', (req, res) => {
    //res.render(__dirname +'/views/layouts/admin/index');
    res.render("layouts/admin/index");
});

router.get('/posts', (req, res) => {
    res.send('');
});

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('layouts/admin/categorias',{categorias: categorias});
    }).catch((err) =>{
        req.flash("error_msg", "Erro ao listar: " + err);
        res.redirect("/admin");
    });
   
});

router.get('/categorias/adicionar', (req, res) => {
    res.render('layouts/admin/categoriaAdicionar');
});

router.get('/categorias/editar/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        res.render('layouts/admin/categoriaEditar', {categoria: categoria});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias");
    });
});

router.post('/categorias/editar', (req, res) => {
    Categoria.findOne({_id:req.body.id}).then((categoria) => {
        
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(() => {

            req.flash("success_msg", "Categoria criada com sucesso");
            res.redirect("/admin/categorias");

        }).catch((err) => {
            
            req.flash("error_msg", "Erro ao Editar: " + err);
            res.redirect("/admin/categorias");
        });
    }).catch((err) => {
        req.flash("error_msg", "Erro ao Editar: " + err);
        res.redirect("/admin/categorias");
    });
});

router.post('/categorias/excluir',(req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {

        req.flash("success_msg", "Categoria excluida com sucesso");
        res.redirect("/admin/categorias");

    }).catch((err) => {
        
        req.flash("error_msg", "Erro ao Excluir: " + err);
        res.redirect("/admin/categorias");
    });;
})

router.post('/categorias/novo', (req, res) => {
    
    const erros = [];
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"});
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da Categoria muito pequeno"});
    }

    if(erros.length > 0){
        res.render("layouts/admin/categoriasAdicionar", {erros: erros});
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };

        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar: " + err);
            res.redirect("/admin");
        });
    }
});

module.exports = router