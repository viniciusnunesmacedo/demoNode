const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {eAdmin} = require("../helpers/eAdmin");
require("../models/Categoria");
require("../models/Postagem");

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");

router.get('/', eAdmin, (req, res) => {
    //res.render(__dirname +'/views/layouts/admin/index');
    res.render("layouts/admin/index");
});

// Categoria listagem
router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('layouts/admin/categorias',{categorias: categorias});
    }).catch((err) =>{
        req.flash("error_msg", "Erro ao listar: " + err);
        res.redirect("/admin");
    });
   
});
// Categoria Adicionar GET
router.get('/categorias/adicionar', eAdmin, (req, res) => {
    res.render('layouts/admin/categoriaAdicionar');
});

// Categoria Editar GET
router.get('/categorias/editar/:id', eAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        res.render('layouts/admin/categoriaEditar', {categoria: categoria});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias");
    });
});

// Categoria Editar POST
router.post('/categorias/editar', eAdmin, (req, res) => {
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

// Categoria Excluir POST
router.post('/categorias/excluir', eAdmin, (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {

        req.flash("success_msg", "Categoria excluida com sucesso");
        res.redirect("/admin/categorias");

    }).catch((err) => {
        
        req.flash("error_msg", "Erro ao Excluir: " + err);
        res.redirect("/admin/categorias");
    });;
})

// Categoria Nova POST
router.post('/categorias/novo', eAdmin, (req, res) => {
    
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

// Postagem listagem
router.get('/postagens', eAdmin, (req, res) => {
    
    Postagem.find().sort({date: 'desc'}).then((postagens) => {
        res.render('layouts/admin/postagens',{postagens: postagens});
    }).catch((err) =>{
        req.flash("error_msg", "Erro ao listar: " + err);
        res.redirect("/admin");
    });
    
    //res.render("layouts/admin/postagens");
});

// Postagem Adicionar
router.get('/postagens/adicionar', eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("layouts/admin/postagemAdicionar", {categorias: categorias});
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar o formulário: " + err);
        res.redirect("/admin");
    });
});

//Postagem Nova
router.post('/postagens/novo', eAdmin, (req, res) => {
    
    const erros = [];
    
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Titulo inválido"});
    }
    
    if(req.body.titulo.length < 2){
        erros.push({texto: "Nome do Titulo muito pequeno"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição inválida"});
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Selecione uma categoria"});
    }

    if(erros.length > 0){
        res.render("layouts/admin/postagemAdicionar", {erros: erros});
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            categoria: req.body.categoria,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo
        };

        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar: " + err);
            res.redirect("/admin");
        });
    }
});

// Postagem Editar GET
router.get('/postagens/editar/:id', eAdmin, (req, res) => {
    Postagem.findOne({_id:req.params.id}).then((postagem) =>{

        let select_filter = []

        Categoria.find().sort({date: 'desc'}).then((categoria) => {

            categoria.forEach(cat => {

                console.log();

                if (cat.id !== String(postagem.categoria)) {
                    select_filter.push({
                        id: cat.id,
                        nome: cat.nome,
                        selected: false
                    });
                } else {
                    select_filter.push({
                        id: cat.id,
                        nome: cat.nome,
                        selected: true
                    });
                }
            });

            res.render('layouts/admin/postagemEditar',{select_filter: select_filter, postagem: postagem});
        }).catch((err) =>{
            req.flash("error_msg", "Erro ao listar categorias: " + err);
            res.redirect("/adminp/ostagens");
        });

    }).catch((err) => {
        req.flash("error_msg", "Esta postagem não existe");
        res.redirect("/admin/postagens");
    });
});

// Postagem Editar POST
router.post('/postagens/editar', eAdmin, (req, res) => {
    Postagem.findOne({_id:req.body.id}).then((postagem) => {
        
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.categoria = req.body.categoria;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;

        postagem.save().then(() => {

            req.flash("success_msg", "Postagem editada com sucesso");
            res.redirect("/admin/postagens");

        }).catch((err) => {
            
            req.flash("error_msg", "Erro ao Editar: " + err);
            res.redirect("/admin/postagens");
        });
    }).catch((err) => {
        req.flash("error_msg", "Erro ao Editar: " + err);
        res.redirect("/admin/postagens");
    });
});

// Postagens Excluir POST
router.post('/postagens/excluir', eAdmin, (req, res) => {
    Postagem.remove({_id: req.body.id}).then(() => {

        req.flash("success_msg", "Postagem excluida com sucesso");
        res.redirect("/admin/postagens");

    }).catch((err) => {
        
        req.flash("error_msg", "Erro ao Excluir: " + err);
        res.redirect("/admin/postagens");
    });;
})

module.exports = router