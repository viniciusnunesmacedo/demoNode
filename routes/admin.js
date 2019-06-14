const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    //res.render(__dirname +'/views/layouts/admin/index');
    res.render("layouts/admin/index");
});

router.get('/posts', (req, res) => {
    res.send('');
});

router.get('/categorias', (req, res) => {
    res.render('layouts/admin/categorias');
});

router.get('/categorias/adicionar', (req, res) => {
    res.render('layouts/admin/categoriasAdicionar');
});

module.exports = router