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
    var svg_lineChart = d3.select("#ChartSvg").attr("width",'100%').attr("height",'100%');
    getWellData().then(function(data){
        variable.allData = data;
        drawPoint.draw(data,20);
        lineChart.drawLineChart(data[0]);
    })

    function getWellData() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "get",
                url: "/well_data",
                data: {},
                success: function (data) {
                    resolve(data);
                },
                error: function () {

                }
            });
        });
    }
    return {
        map: map,
        svg_lineChart:svg_lineChart,
        getWellData:getWellData
    }
})()