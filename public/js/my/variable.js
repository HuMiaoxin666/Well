var variable = (function () {
    let basicData;
    let chosenData;
    let chosenArr = [];
    let type = true;
    let match = false;
    let attrs = [];
    let rate = 10;
    let circle_arr = [];
    let around_circle = [];
    let allData = {};
    let importance_arr = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
    let sample_10;
    let ReSampleData;
    let index_dict = {};
    return {
        basicData,
        chosenData,
        type,
        chosenArr,
        match,
        attrs,
        rate,
        circle_arr,
        around_circle,
        allData,
        importance_arr,
        sample_10,
        ReSampleData,
        index_dict
    }
})()