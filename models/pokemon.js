var mongoose = require('mongoose')
// const { schema } = require('./pokemon')
var Schema = mongoose.Schema; 

var PokemonSchema = new Schema(
    {
        name: {type: String, required: true},
        type: [{type: Schema.Types.ObjectId,  ref: 'Type'}],
        gen: {type: Schema.Types.ObjectId,  ref: 'Gen'},
        description: {type: String},
        height: {type: Number},
        weight: {type: Number}
    }
)

PokemonSchema.virtual('gen_name').get(function() {
    return this.gen.url
})

PokemonSchema.virtual('url').get(function() {
    return '/pokedex/pokemon/' + this._id;
});

module.exports = mongoose.model('Pokemon', PokemonSchema)