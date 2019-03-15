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
            variable.rate = sam_rate;
            $("#sample_rate").val(cur_val);
        }
    })
    $("#sample_rate").val(10);


    $("#sample").click(function () {

        // var blob = new Blob([JSON.stringify(variable.vsample)], { type: "" });
        // saveAs(blob, "hello_10.json");
        // drawPoint.calVariance(); //两篇论文的匹配度
        // drawPoint.count();//统计所有情况的值
        // variable.rate = sam_rate;//采样率
        // heatView.drawHeat(sam_rate);
        if (variable.heatStatus == false)
            drawPoint.drawP(variable.basicData, sam_rate, false);//重画地图上的点
        console.log('sam_rate: ', sam_rate);
        if (variable.heatStatus == true)
            heatView.drawHeat(variable.rate);
        // console.log('variable.basicData: ', variable.basicData);
        // mapView.getWellData().then(function(data){
        //     lineChart.drawLineChart(data);
        // })
    })

    $("#Optimize").click(function () {
        lineChart.svg_lineChart.selectAll("*").remove();
        histogram.svg_histogram.selectAll("*").remove();
        d3.select("#matchSvg").selectAll("*").remove();
        d3.select("#rectView").selectAll("svg").selectAll("*").remove();
        if (variable.lastPieSvgArr.length > 0)
            for (let i = 0; i < variable.lastPieSvgArr.length; i++)
                variable.lastPieSvgArr[i].remove();
        drawPoint.drawP(variable.basicData, variable.rate, true);
        variable.test += 1;
        // console.log(variable.basicData[variable.index_dict['GD1-0-617']]);
        // MatchCal.CalMatchValue(variable.chosenArr);
        // variable.chosenArr = [];
    })

    var attr_status = ['sp', 'cond', 'ml1', 'ml2', 'r4', 'ac'];

    $("#regression").click(function () {
        variable.regression += 1;
        AttrValue.updataValue(variable.regression);
    })
    $("#customCheck1").click(function () {
        variable.reCalB = this.checked;
        console.log('variable.reCalB: ', variable.reCalB);
    })
    $("#heatcheck_input").click(function () {
        d3.select("#map").selectAll("path").remove();
        variable.heatStatus = this.checked;
        if (this.checked == true)
            heatView.drawHeat(variable.rate);
        else {
            let container = $("#map").find("canvas");
            container.remove();
        }

    })
    $("#updata").click(function () {
        //清空当前页面上可能存在的各种图层
        lineChart.svg_lineChart.selectAll("*").remove();
        histogram.svg_histogram.selectAll("*").remove();
        d3.select("#matchSvg").selectAll("*").remove();
        d3.select("#rectView").selectAll("svg").selectAll("*").remove();
        if (variable.lastPieSvgArr.length > 0)
            for (let i = 0; i < variable.lastPieSvgArr.length; i++)
                variable.lastPieSvgArr[i].remove();
        //更新绘图数据
        variable.basicData = variable.basicData_2;

        for (let i = 0; i < variable.basicData.length; i++) {
            variable.index_dict[variable.basicData[i].id] = i;

        }
        // console.log(variable.index_dict);
        drawPoint.drawP(variable.basicData, 10, false);

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