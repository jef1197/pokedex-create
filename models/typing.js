var mongoose = require('mongoose')
var Schema = mongoose.Schema; 

var TypeSchema = new Schema(
    {
        name: {type: String, required: true},
    }
)

TypeSchema.virtual('url').get(function() {
    return '/pokedex/types/' + this._id;
});

module.exports = mongoose.model('Type', TypeSchema)