var Pokemon = require('../models/pokemon');

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
    res.send('NOT IMPLEMENTED: Pokemon create GET');
};

// Handle Pokemon create on POST.
exports.pokemon_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Pokemon create POST');
};

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