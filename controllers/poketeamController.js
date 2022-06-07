var Poketeam = require('../models/poketeam');
var Pokemon = require('../models/pokemon')
const { body,validationResult } = require('express-validator');
var async = require('async');

// Display list of all PokeTeams.
exports.poketeam_list = function(req, res, next) {
    Poketeam.find()
        .populate('pokemon')
        .exec(function(err, list){
            if (err) { return next(err); }
            res.render('poketeam_list', {title: 'PokeTeam List ', list: list})
        })
        
};

// Display detail page for a specific PokeTeam.
exports.poketeam_detail = function(req, res) {
    Poketeam.findById(req.params.id)
        .populate('pokemon')
        .exec(function(err, list){
            if (err) { return next(err); }
            res.render('poketeam_detail', {title: 'PokeTeam ', list: list})
        })
};

// Display PokeTeam create form on GET.
exports.poketeam_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: PokeTeam create GET');
};

// Handle PokeTeam create on POST.
exports.poketeam_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: PokeTeam create POST');
};

// Display PokeTeam delete form on GET.
exports.poketeam_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: PokeTeam delete GET');
};

// Handle PokeTeam delete on POST.
exports.poketeam_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: PokeTeam delete POST');
};

// Display PokeTeam update form on GET.
exports.poketeam_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: PokeTeam update GET');
};

// Handle PokeTeam update on POST.
exports.poketeam_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: PokeTeam update POST');
};