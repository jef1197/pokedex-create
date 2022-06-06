var express = require('express');
var router = express.Router();

//Require controller modules.
var gen_controller = require('../controllers/genController');
var pokemon_controller = require('../controllers/pokemonController');
var poketeam_controller = require('../controllers/poketeamController');
var typing_controller = require('../controllers/typingController');

// Pokemon Route //

// Get home page
router.get('/', pokemon_controller.index)

// Get for creating new pokemon
router.get('/pokemon/create', pokemon_controller.pokemon_create_get);

// POST request for creating new pokemon.
router.post('/pokemon/create', pokemon_controller.pokemon_create_post);

// GET request to delete Book.
router.get('/pokemon/:id/delete', pokemon_controller.pokemon_delete_get);

// POST request to delete Book.
router.post('/pokemon/:id/delete', pokemon_controller.pokemon_delete_post);

// GET request to update Book.
router.get('/pokemon/:id/update', pokemon_controller.pokemon_update_get);

// POST request to update Book.
router.post('/pokemon/:id/update', pokemon_controller.pokemon_update_post);

// GET request for one Book.
router.get('/pokemon/:id', pokemon_controller.pokemon_detail);

// GET request for list of all Book items.
router.get('/pokemons', pokemon_controller.pokemon_list);

// Generation Route //

// Get for creating new Generation
router.get('/gen/create', gen_controller.gen_create_get);

// POST request for creating new pokemon.
router.post('/gen/create', gen_controller.gen_create_post);

// GET request to delete Generation.
router.get('/gen/:id/delete', gen_controller.gen_delete_get);

// POST request to delete Generation.
router.post('/gen/:id/delete', gen_controller.gen_delete_post);

// GET request to update Generation.
router.get('/gen/:id/update', gen_controller.gen_update_get);

// POST request to update Generation.
router.post('/gen/:id/update', gen_controller.gen_update_post);

// GET request for one Generation.
router.get('/gen/:id', gen_controller.gen_detail);

// GET request for list of all Generation items.
router.get('/gens', gen_controller.gen_list);

// Poke Team Route //

// Get for creating new poketeam
router.get('/poketeam/create', poketeam_controller.poketeam_create_get);

// POST request for creating new poketeam.
router.post('/poketeam/create', poketeam_controller.poketeam_create_post);

// GET request to delete poketeam.
router.get('/poketeam/:id/delete', poketeam_controller.poketeam_delete_get);

// POST request to delete poketeam.
router.post('/poketeam/:id/delete', poketeam_controller.poketeam_delete_post);

// GET request to update poketeam.
router.get('/poketeam/:id/update', poketeam_controller.poketeam_update_get);

// POST request to update poketeam.
router.post('/poketeam/:id/update', poketeam_controller.poketeam_update_post);

// GET request for one poketeam.
router.get('/poketeam/:id', poketeam_controller.poketeam_detail);

// GET request for list of all poketeam items.
router.get('/poketeams', poketeam_controller.poketeam_list);

// Typing Route //

// Get for creating new poketeam
router.get('/typing/create', typing_controller.typing_create_get);

// POST request for creating new poketeam.
router.post('/typing/create', typing_controller.typing_create_post);

// GET request to delete poketeam.
router.get('/typing/:id/delete', typing_controller.typing_delete_get);

// POST request to delete poketeam.
router.post('/typing/:id/delete', typing_controller.typing_delete_post);

// GET request to update poketeam.
router.get('/typing/:id/update', typing_controller.typing_update_get);

// POST request to update poketeam.
router.post('/typing/:id/update', typing_controller.typing_update_post);

// GET request for one poketeam.
router.get('/typing/:id', typing_controller.typing_detail);

// GET request for list of all poketeam items.
router.get('/typings', typing_controller.typing_list);

module.exports = router;
