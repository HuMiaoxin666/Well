var mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const poSchema = new Schema({
    id: String,
    latlng: Array,
    basic_attr: Array
}, {
    collection: 'SamplesLoc'
});

var BDModel = mongoose.model('SamplesLoc', poSchema);
BDModel.createIndexes({"id":1});

module.exports = BDModel;