var Pokemon = require('../models/pokemon');
var Generation = require('../models/gen');
var Typing = require('../models/typing');
var async = require('async');
var {body, validationResult} = require('express-validator');


// Display list of all Pokemons.
exports.index = function(req, res) {
    res.render('index', {title: 'PokeDex Home'});
};

// Display list of all Pokemons.
exports.pokemon_list = function(req, res, next) {
    Pokemon.find({}, 'name type')
        .sort({name: 1})
        .populate('type')
        .exec(function(err, list) {
        if(err) { return next(err); }
        res.render('pokemon_list', {title: 'Pokemon List', list: list})
    })
};

// Display detail page for a specific Pokemon.
exports.pokemon_detail = function(req, res, next) {
    Pokemon.findById(req.params.id)
    .populate('type')
    .exec(function(err, pokemon) {
    if(err) { return next(err); }
    res.render('pokemon_detail', {title: 'Pokemon List', pokemon: pokemon})
})
};

// Display Pokemon create form on GET.
exports.pokemon_create_get = function(req, res) {
    async.parallel({
        generations: function(callback){
            Generation.find(callback);
        },
        typings: function(callback){
            Typing.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('pokemon_form', {title: 'Create Pokemon', generations: results.generations, typings: results.typings})
    })
};

// Handle Pokemon create on POST.
exports.pokemon_create_post = [
    (req, res, next) => {
        if ( !(req.body.typing instanceof Array ) ) {
            if (typeof req.body.typing === 'undefined') {
                req.body.typing = [];
            } else {
                req.body.typing = new Array(req.body.typing);
            }
        }
        next();
    },

    body('name', 'Name Must not be Empty').trim().isLength({min:1}).escape(),
    body('generation', 'Generation must not be empty').trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty').trim().isLength({min:1}).escape(),
    body('height', 'Height must not be empty').trim().isLength({min:1}).escape(),
    body('weight', 'Weight must not be empty').trim().isLength({min:1}).escape(),
    body('typing.*').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var pokemon = new Pokemon({
            name: req.body.name,
            gen: req.body.generation,
            description: req.body.description,
            height: req.body.height,
            weight: req.body.weight,
            type: req.body.typing,
        });

        if(!errors.isEmpty()) {

        } else {
            pokemon.save(function(err) {
                if (err) { return next(err); }
                res.redirect(pokemon.url);
            })
        }
    }
]

// Display Pokemon delete form on GET.
exports.pokemon_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Pokemon delete GET');
};

// Handle Pokemon delete on POST.
exports.pokemon_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pokemon delete POST');
};

// Display Pokemon update form on GET.
exports.pokemon_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Pokemon update GET');
};

// Handle Pokemon update on POST.
exports.pokemon_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pokemon update POST');
};