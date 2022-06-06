var mongoose = require('mongoose')
var Schema = mongoose.Schema; 

var GenSchema = new Schema(
    {
        name: {type: String, required: true},
    }
)

GenSchema.virtual('url').get(function() {
    return '/pokedex/Generation/' + this._id;
});

module.exports = mongoose.model('Generation', GenSchema)