var drawPoint = (function(){
    function draw(rate){
        d3.selectAll("path").remove();
        d3.csv("/data/sample_0.csv", function (error, data_0) {
            d3.csv("/data/sample_10.csv", function (error, data_10) {
                d3.csv("/data/sample_20.csv", function (error, data_20) {
                 d3.csv("/data/sample_30.csv", function (error, data_30) {
            d3.csv("/data/sample_40.csv", function (error, data_40) {
        d3.csv("/data/sample_50.csv", function (error, data_50) {
            var data_arr = [data_0,data_10,data_20,data_30,data_40,data_50];
            let data = data_arr[rate/10];
            console.log('data: ', data);
            var color = "black";
            for (var i = 0; i < data.length; i++) {
                data[i].lat = parseFloat(data[i].lat);
                data[i].lng = parseFloat(data[i].lng);
                if(data[i].status == 1)
                    color = "red";
                else
                    color = "blue";
                L.circle([data[i].lat, data[i].lng], {
                    radius: 5,
                    color: color
                }).addTo(mapView.map);
            }
        }); }); }); }); }); });

    }
    return{
        draw:draw
    }    
})()