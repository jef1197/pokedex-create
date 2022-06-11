var Pokemon = require('../models/pokemon');
var Generation = require('../models/gen');
var Typing = require('../models/typing');
var Poketeam = require('../models/poketeam');

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
exports.pokemon_delete_get = function(req, res, next) {
    async.parallel({
        pokemon: function(callback) {
            Pokemon.findById(req.params.id).exec(callback)
        },
        poke_team: function(callback) {
            Poketeam.find({ 'pokemon' : req.params.id }).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if(results.pokemon === null ) {
            res.redirect('/pokedex/pokemons')
        }

        res.render('pokemon_delete', {title: 'Delete Pokemon', pokemon: results.pokemon, poke_team: results.poke_team})
    })
};

// Handle Pokemon delete on POST.
exports.pokemon_delete_post = function(req, res) {
    async.parallel({
        pokemon: function(callback) {
            Pokemon.findById(req.body.pokemonid).exec(callback)
        },
        poke_team: function(callback) {
            Poketeam.find({ 'pokemon' : req.body.pokemonid }).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if(results.poke_team.length > 0 ) {
            res.render('pokemon_delete', {title: 'Delete Pokemon', pokemon: results.pokemon, poke_team: results.poke_team})
            return;
        } else {
            Pokemon.findByIdAndDelete(req.body.pokemonid, function deletePokemon(err) {
                if (err) { return next(err); }
                res.redirect('/pokedex/pokemons')
            })
        }

        
    })
};

// Display Pokemon update form on GET.
exports.pokemon_update_get = function(req, res, next) {
    async.parallel({
        pokemon: function(callback){
            Pokemon.findById(req.params.id).populate('type').exec(callback);
        },
        typings: function(callback){
            Typing.find(callback);
        },
        generations: function(callback){
            Generation.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.pokemon === null) {
            var err = new Error('Pokemon not found');
            err.status = 404;
            return next(err);
        }
        for (var all_t_iter = 0; all_t_iter < results.typings.length; all_t_iter++) {
            for (let pokemon_t_iter = 0; pokemon_t_iter < results.pokemon.type.length; pokemon_t_iter++) {
                if (results.typings[all_t_iter]._id.toString() === results.pokemon.type[pokemon_t_iter]._id.toString()) {
                    results.typings[all_t_iter].checked = 'true';
                }
            }
        }
        res.render('pokemon_form', {title: 'Create Pokemon', generations: results.generations, typings: results.typings, pokemon: results.pokemon})
    })
};

// Handle Pokemon update on POST.
exports.pokemon_update_post = [
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
            _id: req.params.id
        });

        if(!errors.isEmpty()) {

        } else {
            Pokemon.findByIdAndUpdate(req.params.id, pokemon, {}, function (err, thePokemon) {
                if (err) { return next(err) }
                // Successful - redirect to book detail page.
                res.redirect(thePokemon.url);
            });
        }
    }
]
