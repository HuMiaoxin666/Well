var mapView = (function () {
    //黑色地图
    //https://api.mapbox.com/styles/v1/keypro/cjjibvxa20ljx2slnphxjle4b/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ
    //白色
    //https://api.mapbox.com/styles/v1/keypro/cjjs6cawt25iq2snp6kqxu3r3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ
    //地图设置
    //初始化界面
    var winHeight = $(window).height();
    console.log('winHeight: ', winHeight);

    $("#main").css("height", winHeight - 61);

    var map = L.map('map', {}).setView([37.8497143321911, 118.767564643314], 13)
    var osmUrl = 'https://api.mapbox.com/styles/v1/keypro/cjjs6cawt25iq2snp6kqxu3r3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ',
        layer = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
    L.tileLayer(osmUrl, {

        minZoom: 1,
        maxZoom: 17,
        //用了mapbox的图层
        attribution: layer
        //访问令牌
    }).addTo(map);
    //初始化各svg
    var svg_lineChart = d3.select("#ChartSvg").attr("width", '100%').attr("height", '100%');
    // pieChart.drawPie();
    // function test(){
    //     return [1, 2];
    // }
    // let [a,b] = test();
    // console.log(a,b);
    //数组转置
    // let arr = [[1, 2, 3], [4, 5, 6], [1, 2, 3]];
    // var newArray = arr[0].map(function(col, i) {
    //     return arr.map(function(row) {
    //     return row[i];
    //    })
    // });
    // console.log(arr, newArray);

    //画出初始地图点
    getWellData().then(function (data) {

        variable.basicData = data;
        console.log('data: ', data);
        for (let i = 0; i < data.length; i++) {
            variable.index_dict[data[i].id] = i;
        }
        // console.log(variable.index_dict);
        drawPoint.draw(data, 10);
        let oriId = variable.basicData[200].id;
        getChosenData(oriId).then(function (data_in) {
            variable.chosenData = data_in;
            lineChart.drawLineChart(data_in[0], 1, "#1f77b4");
        })
    })
    //设置初始选中井及相关View

    function getWellData() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "get",
                url: "/well_data",
                async: false,
                data: {},
                success: function (data) {
                    resolve(data);
                },
                error: function () {

                }
            });
        });
    }

    // function postData(data) {
    //     $.ajax({
    //         type: "POST",
    //         url: "/insert/test",
    //         data: {
    //             value: data.value,
    //             well_1: data.well_1,
    //             well_2: data.well_2
    //         },
    //         error: function () { }
    //     });
    // }

    // $.ajax({
    //     type: "get",
    //     url: "getMatchValue",
    //     async: false,
    //     data: {
    //         'well_1': 'GD1-0-503',
    //         'well_2': "GD1-0N4"
    //     },
    //     success: function (tmp_data) {
    //         if (tmp_data.length > 0) {
    //             console.log('tmp_data: ', tmp_data);
    //         }
    //         // console.log('tmp_data: ', tmp_data);
    //     },
    //     error: function () { }
    // });
    // let t = {'id':0, 'name':'hmx'};
    // for( key in t){
    //     console.log('key: ', key);

    // }
    d3.json('data/sample_10&20.json', function (data) {
        variable.sample_10 = data;
        // console.log('data: ', data);
    });


  
    function getChosenData(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "get",
                url: "/id/ChosenId",
                async:false,
                data: {
                    'id': id
                },
                success: function (data) {
                    resolve(data);
                },
                error: function () { }
            });
        });
    }
    return {
        map,
        svg_lineChart,
        getWellData,
        getChosenData,
    }
})()