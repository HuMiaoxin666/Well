var mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const poSchema = new Schema({
    id: String,
    latlng: Array,
    basic_attr: Array
}, {
    collection: 'SamplesLoc_r2'
});

var BDModel = mongoose.model('SamplesLoc_r2', poSchema);
BDModel.createIndexes({"id":1});

module.exports = BDModel;