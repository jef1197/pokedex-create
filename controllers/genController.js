var Generation = require('../models/gen');
var Pokemon = require('../models/pokemon')
var async = require('async');
var {body, validationResult} = require('express-validator');

// Display list of all Generations.
exports.gen_list = function(req, res, next) {
    Generation.find().sort().exec(function(err, list) {
        if(err) { return next(err); }
        res.render('gen_list', {title: 'Generation List', list: list });
    })
};

// Display detail page for a specific Generation.
exports.gen_detail = function(req, res, next) {
    async.parallel( {
        gen: function(callback) {
            Generation.findById(req.params.id).exec(callback)
        },
        pokemon: function(callback) {
            Pokemon.find( {'gen': req.params.id}).exec(callback)
        }
    }, function(err, results) {
        if(err) { return next(err); }
        if (results.gen === null) {
            var err = new Error('Generation not found');
            err.status = 404;
            return next(err);
        }
        res.render('gen_detail', {title: 'Generation ', gen: results.gen, pokemon: results.pokemon })
    })
};

// Display Generation create form on GET.
exports.gen_create_get = function(req, res) {
    res.render('gen_form', {title: 'Create Generation'})
};

// Handle Generation create on POST.
exports.gen_create_post = [
    body('name', 'Generation name required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var gen = new Generation(
            { name: req.body.name }
        );
        
        if(!errors.isEmpty()) {
            res.render('gen_form', {title: 'Create Generation', gen: gen, errors: errors.array});
            return;
        } else {
            Generation.findOne( {'name': req.body.name }).exec(function(err, found_gen) {
                if (err) { return next(err); }
                if (found_gen) {
                    res.redirect(found_gen.url);
                } else {
                    gen.save(function(err) {
                        if (err) { return next(err); }
                        res.redirect(gen.url)
                    });
                }
            })
        }
    }
];

// Display Generation delete form on GET.
exports.gen_delete_get = function(req, res) {
    async.parallel({
        gen: function(callback) {
            Generation.findById(req.params.id).exec(callback)
        },
        gen_pokemon: function(callback) {
            Pokemon.find({ 'gen': req.params.id}).exec(callback);
        }
    }, function( err, results ) {
        if (err) {return next(err)}
        //Successful, so render
        res.render('gen_delete', {title: 'Generation Delete', gen: results.gen, gen_pokemon: results.gen_pokemon});
    })
};

// Handle Generation delete on POST.
exports.gen_delete_post = function(req, res) {
    async.parallel({
        gen: function(callback) {
            Generation.findById(req.body.genid).exec(callback)
        },
        gen_pokemon: function(callback) {
            Pokemon.find({ 'type': req.body.genid}).exec(callback);
        }
    }, function( err, results ) {
        if (err) {return next(err)}
        if (results.gen_pokemon.length > 0) {
            res.render('gen_delete', {title: 'Delete Type', gen: results.gen, gen_pokemon: results.gen_pokemon});
            return;
        } else {
            Generation.findByIdAndRemove(req.body.genid, function deleteGeneration(err){
                if (err) { return next(err); }
                res.redirect('/pokedex/gens')
            })
        }
    })
};

// Display Generation update form on GET.
exports.gen_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Generation update GET');
};

// Handle Generation update on POST.
exports.gen_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Generation update POST');
};