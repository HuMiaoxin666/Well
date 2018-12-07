var express = require("express");
var router = express.Router();
var OIModel = require("../models/getCollectionData");
var ADModel = require("../models/GetIdData");
var OIModel_2 = require("../models/getvSample_2");

// var InsertModel = require("../models/test_co");
/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "E-commerce"
    });
});


router.get("/well_data", function (req, res) {
    OIModel.find({}, function (err, data) {
        if (err) console.log(err);
        else {
            res.json(data);
        }
    });
});

router.get("/well_data_2", function (req, res) {
    OIModel_2.find({}, function (err, data) {
        if (err) console.log(err);
        else {
            res.json(data);
        }
    });
});

router.get("/(:Id)?/ChosenId", function (req, res) {
    let id = req.query.id;
    console.log('id: ', id);
    ADModel.find({ 'id': id }, function (err, data) {
        if (err) console.log(err);
        else {
            res.json(data);
        }
    });
});


module.exports = router;