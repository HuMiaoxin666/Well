var mongoose = require("mongoose")
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const poSchema = new Schema({
    id: String,
    latlng: Array,
    basic_attr: Array
}, {
    collection: 'basicData'
});

var BDModel = mongoose.model('SamplesLoc_r2_v_p_all', poSchema);
BDModel.createIndexes({"id":1});

module.exports = BDModel;