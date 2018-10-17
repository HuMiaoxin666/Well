var mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const poSchema = new Schema({
    id: String,
    latlng: Array,
    basic_attr: Array,
    value: Array,
}, {
    collection: '100row'
});

var OIModel = mongoose.model('100row', poSchema);
OIModel.createIndexes({"id":1});

module.exports = OIModel;