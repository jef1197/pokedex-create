var mongoose = require('mongoose')
var Schema = mongoose.Schema; 

var PokeTeamSchema = new Schema(
    {
        title: {type: String, required: true},
        pokemon: {type: Schema.Types.ObjectId, required: true, },
    }
)

PokeTeamSchema.virtual('url').get(function() {
    return '/pokedex/teams/' + this._id;
});

module.exports = mongoose.model('Poke Team', PokeTeamSchema)