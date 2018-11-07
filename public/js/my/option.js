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
        variable.rate = sam_rate;
        drawPoint.draw(variable.basicData, sam_rate);
        console.log('variable.basicData: ', variable.basicData);
        // mapView.getWellData().then(function(data){
        //     lineChart.drawLineChart(data);
        // })
    })
    $("#Switch").click(function () {
        variable.type = !variable.type;
        if (variable.type == false) {
            lineChart.drawLineChart_2(variable.chosenData);
            console.log('variable.chosenData: ', variable.chosenData);
        } else {
            lineChart.drawLineChart(variable.chosenData);
            console.log('variable.chosenData: ', variable.chosenData);
        }

    })
    $("#match").click(function () {
        MatchCal.ReSample();
        // MatchCal.CalMatchValue(variable.chosenArr);
        variable.chosenArr = [];
    })

    var attr_status = ['sp', 'cond', 'ml1', 'ml2', 'r4', 'ac'];

    $("#matchStatus").click(function () {
        variable.match = this.checked;
        variable.chosenArr = [];
        // if (this.checked == true)
        //     for (let i = 0; i < attr_status.length; i++)
        //         $("#" + attr_status[i] + 'Status').attr("disabled", false);
        // else
        //     for (let i = 0; i < attr_status.length; i++)
        //         $("#" + attr_status[i] + 'Status').attr("disabled", true);

    })

    for (let i = 0; i < attr_status.length; i++) {
        // $("#" + attr_status[i] + 'Status').attr("disabled", true);

        $("#" + attr_status[i] + 'Status').click(function () {
            let tmp_attr = String(attr_status[i]);
            if (this.checked == true) {
                variable.attrs.push(tmp_attr.toUpperCase());
            } else {
                let tmp_index = variable.attrs.indexOf(tmp_attr.toUpperCase());
                variable.attrs.splice(tmp_index, 1);
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