var Typing = require('../models/typing');
var Pokemon = require('../models/pokemon')
var async = require('async');
var {body, validationResult} = require('express-validator');


// Display list of all Typings.
exports.typing_list = function(req, res) {
    Typing.find().sort().exec(function(err, list) {
        if(err) { return next(err); }
        res.render('type_list', {title: 'Typing List', list: list });
    })
};

// Display detail page for a specific Typing.
exports.typing_detail = function(req, res) {
    async.parallel( {
        typing: function(callback) {
            Typing.findById(req.params.id).exec(callback)
        },
        pokemon: function(callback) {
            Pokemon.find( {'type': req.params.id}).exec(callback)
        }
    }, function(err, results) {
        if(err) { return next(err); }
        if (results.typing === null) {
            var err = new Error('Generation not found');
            err.status = 404;
            return next(err);
        }
        res.render('type_detail', {title: 'Typing ', typing: results.typing, pokemon: results.pokemon })
    })
};

// Display Typing create form on GET.
exports.typing_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Typing create GET');
};

// Handle Typing create on POST.
exports.typing_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Typing create POST');
};

// Display Typing delete form on GET.
exports.typing_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Typing delete GET');
};

// Handle Typing delete on POST.
exports.typing_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Typing delete POST');
};

// Display Typing update form on GET.
exports.typing_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Typing update GET');
};

// Handle Typing update on POST.
exports.typing_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Typing update POST');
};