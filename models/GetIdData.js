var mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const allSchema = new Schema({
    id: String,
    latlng: Array,
    basic_attr: Array,
    value: Array,
}, {
    collection: 'range_dept'
});

var ADModel = mongoose.model('range_dept', allSchema);
ADModel.createIndexes({"id":1});
module.exports = ADModel;