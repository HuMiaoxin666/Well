var option = (function () {
    var sam_rate = 20;

    var slider = $("#rate_slider").slider({
        orientation: "horizontal",
        range: "min",
        max: 100,
        value: 20,
        slide: function (event, ui) {
            let cur_val = ui.value;
            sam_rate = ui.value;
            $("#sample_rate").val(cur_val);
        }
    })
    $("#sample_rate").val(20);


    $("#sample").click(function () {
        drawPoint.draw(variable.allData, sam_rate);
        console.log('variable.allData: ', variable.allData);
        // mapView.getWellData().then(function(data){
        //     lineChart.drawLineChart(data);
        // })
    })
    $("#Switch").click(function () {
        variable.type = !variable.type;
        if(variable.type == false){
            lineChart.drawLineChart_2(variable.chosenData);
            console.log('variable.chosenData: ', variable.chosenData);
        }else{
            lineChart.drawLineChart(variable.chosenData);
            console.log('variable.chosenData: ', variable.chosenData);
        }
     
    })
    return {

    }
})()