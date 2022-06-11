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
    res.render('type_form', {title: 'Create Type'})
};

// Handle Typing create on POST.
exports.typing_create_post = [
    body('name', 'Type name required and uppercase').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        // string.charAt(0).toUpperCase() + string.slice(1);

        var type = new Typing(
            { name: req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1) }
        );
        
        if(!errors.isEmpty()) {
            res.render('type_form', {title: 'Create Type', typing: type, errors: errors.array});
            return;
        } else {
            Typing.findOne( {'name': req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1) }).exec(function(err, found_type) {
                if (err) { return next(err); }
                if (found_type) {
                    res.redirect(found_type.url);
                } else {
                    type.save(function(err) {
                        if (err) { return next(err); }
                        res.redirect(type.url)
                    });
                }
            })
        }
    }
];

// Display Typing delete form on GET.
exports.typing_delete_get = function(req, res, next) {
    async.parallel({
        typing: function(callback) {
            Typing.findById(req.params.id).exec(callback)
        },
        type_pokemon: function(callback) {
            Pokemon.find({ 'type': req.params.id}).exec(callback);
        }
    }, function( err, results ) {
        if (err) {return next(err)}
        //Successful, so render
        res.render('type_delete', {title: 'Delete Type', typing: results.typing, type_pokemon: results.type_pokemon});
    })
};

// Handle Typing delete on POST.
exports.typing_delete_post = function(req, res, next) {
    async.parallel({
        typing: function(callback) {
            Typing.findById(req.body.typeid).exec(callback)
        },
        type_pokemon: function(callback) {
            Pokemon.find({ 'type': req.body.typeid}).exec(callback);
        }
    }, function( err, results ) {
        if (err) {return next(err)}
        if (results.type_pokemon.length > 0) {
            res.render('type_delete', {title: 'Delete Type', typing: results.typing, type_pokemon: results.type_pokemon});
            return;
        } else {
            Typing.findByIdAndRemove(req.body.typeid, function deleteType(err){
                if (err) { return next(err); }
                res.redirect('/pokedex/typings')
            })
        }
    })
};

// Display Typing update form on GET.
exports.typing_update_get = function(req, res) {
    async.parallel({
        typing: function(callback) {
            Typing.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.typing==null){
            var err = new Error('typing not found');
            err.status = 404;
            return next(err);
        }
        res.render('type_form', {title: 'Update Type', typing: results.typing });
    });
};

// Handle Typing update on POST.
exports.typing_update_post =  [

    body('name', 'Type name required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var typing = new Typing(
            { 
                name: req.body.name,
                _id: req.params.id
            }
        );
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('type_form', {title: 'Update Type', typing: results.typing, errors: errors.array() });
            return;
        } else {
            Typing.findByIdAndUpdate(req.params.id, typing, {}, function(err, theType) {
                if (err) { return next(err) }
                // Successful - redirect to book detail page.
                res.redirect(theType.url);
            })
        }
    }
]