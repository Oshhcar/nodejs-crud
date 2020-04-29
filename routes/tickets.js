var express = require('express');
var router = express.Router();
var client = require('../lib/db');
var LocalDate = require('js-joda').LocalDate;

// display tickets page
router.get('/', function (req, res, next) {
    let fechaI = req.body.fechaI;
    let fechaF = req.body.fechaF;
    let usuario = req.body.usuario;

    client.execute('SELECT * FROM tickets_por_rango', function (err, rows) {
        if (err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('tickets', {
                data: '',
                id: '',
                fecha: '',
                correo: '',
                titulo: '',
                descripcion: '',
                fechaI: '',
                fechaF: '',
                usuario: ''
            });
        } else {
            // render to views/books/index.ejs
            //req.flash('success', 'Tickets encontrados.')

            var fec = LocalDate.parse("2020-05-01");
            const d = rows['rows'].filter((row) => {
                var fec2 = LocalDate.parse(row['fecha'].toString());
                //console.log(row['fecha'].toString());
                return fec2.isAfter(fec);
            });

            res.render('tickets', {
                data: rows['rows'],
                id: '',
                fecha: '',
                correo: '',
                titulo: '',
                descripcion: '',
                fechaI: '',
                fechaF: '',
                usuario: ''
            });
        }
    });
});

router.post('/', function (req, res, next) {
    let fechaI = req.body.fechaI;
    let fechaF = req.body.fechaF;
    let usuario = req.body.usuario;

    let errors = false;

    if (fechaI.length === 0 || fechaF.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Por favor, escriba por lo menos un rango de fechas.");
        // render to add.ejs with flash message
        res.redirect('/tickets');
    }

    if (!errors) {

        try {
            var fe1 = LocalDate.parse(fechaI.toString());
            var fe2 = LocalDate.parse(fechaF.toString());

            client.execute('SELECT * FROM tickets_por_rango', function (err, rows) {
                if (err) {
                    req.flash('error', err);
                    // render to views/books/index.ejs
                    res.render('tickets', {
                        data: '',
                        id: '',
                        fecha: '',
                        correo: '',
                        titulo: '',
                        descripcion: '',
                        fechaI: '',
                        fechaF: '',
                        usuario: ''
                    });
                } else {
    
                    const dat = rows['rows'].filter((row) => {
                        var fe3 = LocalDate.parse(row['fecha'].toString());
    
                        if (usuario.length === 0) {
                            return (fe3.isAfter(fe1) || fe3.equals(fe1)) && (fe3.isBefore(fe2) || fe3.equals(fe2));
                        } else {
                            var usr = row['correo'].toString();
                            return (fe3.isAfter(fe1) || fe3.equals(fe1)) && (fe3.isBefore(fe2) || fe3.equals(fe2)) && usr === usuario.toString();
                        }
    
                    });
    
                    res.render('tickets', {
                        data: dat,
                        id: '',
                        fecha: '',
                        correo: '',
                        titulo: '',
                        descripcion: '',
                        fechaI: fechaI,
                        fechaF: fechaF,
                        usuario: usuario
                    });
                }
            });
        } catch (error) {
            // set flash message
            req.flash('error', "Por favor, escriba las fechas en formato YYYY-MM-DD.");
            // render to add.ejs with flash message
            res.redirect('/tickets');
        }
    } else {
        res.render('tickets', {
            data: '',
            id: '',
            fecha: '',
            correo: '',
            titulo: '',
            descripcion: '',
            fechaI: '',
            fechaF: '',
            usuario: ''
        });
    }
});

// display add ticket page
router.get('/add', function (req, res, next) {
    // render to add.ejs
    res.render('tickets/add', {
        id: '',
        fecha: '',
        correo: '',
        titulo: '',
        descripcion: ''
    });
});

// add a new ticket
router.post('/add', function (req, res, next) {

    let id = req.body.id;
    let fecha = req.body.fecha;
    let correo = req.body.correo;
    let titulo = req.body.titulo;
    let descripcion = req.body.descripcion;

    let errors = false;

    if (id.length === 0 || fecha.length === 0 || correo.length === 0 || titulo.length === 0 || descripcion.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Por favor, escriba en todos los campos.");
        // render to add.ejs with flash message
        res.redirect('/tickets');
    }

    // if no error
    if (!errors) {

        var values = id + ', \'' + fecha + '\', \'' + correo + '\', \'' + titulo + '\', \'' + descripcion + '\'';

        // insert query
        client.execute('INSERT INTO tickets.tickets_por_rango(id, fecha, correo, titulo, descripcion) VALUES(' + values + ');', function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.redirect('/tickets');

            } else {
                req.flash('success', 'Ticket agregado correctamente');
                res.redirect('/tickets');
            }
        })
    }
});


module.exports = router;
