var option = (function () {
    var sam_rate = 10;

    var slider = $("#rate_slider").slider({
        orientation: "horizontal",
        range: "min",
        max: 100,
        value: 10,
        slide: function (event, ui) {
            let cur_val = ui.value;
            sam_rate = ui.value;
            $("#sample_rate").val(cur_val);
        }
    })
    $("#sample_rate").val(10);


    $("#sample").click(function () {
        var blob = new Blob([JSON.stringify(variable.vsample)], { type: "" });
        saveAs(blob, "hello_10.json");
        // drawPoint.calVariance(); //两篇论文的匹配度
        // drawPoint.count();//统计所有情况的值
        // variable.rate = sam_rate;//采样率
        // drawPoint.draw(variable.basicData, sam_rate);//重画地图上的点
        // console.log('variable.basicData: ', variable.basicData);
        // mapView.getWellData().then(function(data){
        //     lineChart.drawLineChart(data);
        // })
    })
   
    $("#match").click(function () {
        MatchCal.ReSample();
        // MatchCal.CalMatchValue(variable.chosenArr);
        variable.chosenArr = [];
    })

    var attr_status = ['sp', 'cond', 'ml1', 'ml2', 'r4', 'ac'];

    $("#inlineCheckbox1").click(function () {
        variable.reCalB = this.checked;
    })

    for (let i = 0; i < attr_status.length; i++) {
        // $("#" + attr_status[i] + 'Status').attr("disabled", true);

        $("#" + attr_status[i] + 'Status').click(function () {
            let tmp_attr = String(attr_status[i]);
            if (this.checked == true) {
                variable.chosen_attrs.push(tmp_attr.toUpperCase());
            } else {
                let tmp_index = variable.chosen_attrs.indexOf(tmp_attr.toUpperCase());
                variable.chosen_attrs.splice(tmp_index, 1);
            }
        })
    }

    function getAroundPoints(id, rate_index) {
        console.log('rate_index: ', rate_index);
        let tmp_data = variable.basicData;
        for (let i = 0; i < tmp_data.length; i++) {
            if (tmp_data[i].id == id)
                return tmp_data[i].around_points[rate_index];
            else {
                continue;
            }
        }
    }

    return {
        getAroundPoints
    }
})()