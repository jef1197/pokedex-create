#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
// var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Gen = require('./models/gen')
var Pokemon = require('./models/pokemon')
var Poketeam = require('./models/poketeam')
var Typing = require('./models/typing')


var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://jef00:yRH31jdEef7vmDZa@cluster0.3pzgn.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var gens = []
var pokemons = []
var poketeams = []
var typings = []

function genCreate(name, cb) {
  var gen = new Gen({ name: name });

  gen.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Gen: ' + gen);
    gens.push(gen)
    cb(null, gen);
  }   );
}

function TypingCreate(name, cb) {
  typeDetail = { name: name }
    
  var type = new Typing(typeDetail);    
  type.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New type: ' + type);
    typings.push(type)
    cb(null, type)
  }  );
}


function poketeamCreate(title, pokemon, cb) {
  poketeamDetail = { 
    title: title,
  }    
  if( pokemon != false) poketeamDetail.type = pokemon

  var poketeam = new Poketeam(poketeamDetail);    
  poketeam.save(function (err) {
    if (err) {
      console.log('ERROR CREATING poketeam: ' + poketeam);
      cb(err, null)
      return
    }
    console.log('New poketeam: ' + poketeam);
    poketeams.push(poketeam)
    cb(null, poketeam)
  }  );
}


function pokemonCreate(name, type, gen, cb) {
  pokemondetail = { name: name }
  if( gen != false) pokemondetail.gen = gen
  if( type != false) pokemondetail.type = type
  
  var pokemon = new Pokemon(pokemondetail);
    
  pokemon.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Pokemon: ' + pokemon);
    pokemons.push(pokemon)
    cb(null, pokemon)
  }  );
}


function createGenTyping(cb) {
    async.series([
        function(callback) {
          TypingCreate('Fire', callback);
        },
        function(callback) {
          TypingCreate('Water', callback);
        },
        function(callback) {
          TypingCreate('Grass', callback);
        },
        function(callback) {
          TypingCreate('Normal', callback);
        },
        function(callback) {
          TypingCreate('Flying', callback);
        },
        function(callback) {
          genCreate("1st", callback);
        },
        function(callback) {
          genCreate("2nd", callback);
        },
        function(callback) {
          genCreate("3rd", callback);
        },
        ],
        // optional callback
        cb);
}


function createPokemon(cb) {
    async.parallel([
        function(callback) {
          pokemonCreate('Charizard', [typings[0], typings[4]], gens[0] ,callback);
        },
        function(callback) {
          pokemonCreate('Blastoise', [typings[1]], gens[0], callback);
        },
        function(callback) {
          pokemonCreate('Treeko', [typings[2]], gens[2], callback);
        },
        function(callback) {
          pokemonCreate('Starly', [typings[3], typings[4]], gens[2], callback);
        },
        function(callback) {
          pokemonCreate('Test Pokemon 3', [typings[0], typings[4]], gens[0],  callback);
        },
        function(callback) {
          pokemonCreate('Test Pokemon 1', [typings[2], typings[3]], gens[2],  callback);
        },
        function(callback) {
          pokemonCreate('Test Pokemon 2', [typings[2], typings[0]], gens[1],  callback)
        }
        ],
        // optional callback
        cb);
}


function createPoketeam(cb) {
    async.parallel([
        function(callback) {
          poketeamCreate('team 1', [pokemons[0], pokemons[2]], callback)
        },
        function(callback) {
          poketeamCreate('team 2', [pokemons[3], pokemons[4]], callback)
        },
        function(callback) {
          poketeamCreate('team 3', [pokemons[1], pokemons[5]], callback)
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createGenTyping,
    createPokemon,
    createPoketeam
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('PokeTeams: '+ poketeams);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});