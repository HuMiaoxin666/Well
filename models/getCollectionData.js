var mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const poSchema = new Schema({
    id: String,
    latlng: Array,
    basic_attr: Array
}, {
    collection: 'test'
});

var BDModel = mongoose.model('test', poSchema);
BDModel.createIndexes({"id":1});

module.exports = BDModel;