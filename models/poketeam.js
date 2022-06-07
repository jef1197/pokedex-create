var mongoose = require('mongoose')
var Schema = mongoose.Schema; 

var PokeTeamSchema = new Schema(
    {
        title: {type: String, required: true},
        pokemon: [{type: Schema.Types.ObjectId, re: 'Pokemon' }],
    }
)

PokeTeamSchema.virtual('url').get(function() {
    return '/pokedex/poketeam/' + this._id;
});

module.exports = mongoose.model('Poke Team', PokeTeamSchema)