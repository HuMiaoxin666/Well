var mapView = (function () {
    //黑色地图
    //https://api.mapbox.com/styles/v1/keypro/cjjibvxa20ljx2slnphxjle4b/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ
    //白色
    //https://api.mapbox.com/styles/v1/keypro/cjjs6cawt25iq2snp6kqxu3r3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ
    //地图设置
    //初始化界面
  

    var winHeight = $(window).height();
    console.log('winHeight: ', winHeight);
    
    var map = L.map('map', {
        renderer:L.svg()
    }).setView([37.8497143321911, 118.767564643314], 13)
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
    // map.on("click", function(e){
    //     console.log(e.latlng);
    // });
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
        let oriId = variable.basicData[1500].id;
        getChosenData(oriId).then(function (data_ori) {
            variable.chosenData = data_ori;
        })
    })

    d3.json('data/tmp_all.json', function (data) {
        variable.match_value = data;
        // rectView.drawRect("GD1-6-315");
        // console.log(data["GD1-6N15&GD1-6-515"]);
    });
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
        getWellData,
        getChosenData,
    }
})()