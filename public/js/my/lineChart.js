var lineChart = (function () {
    function drawLineChart(data, sampleStatus, pathColor) {
        // console.log('data: ', data);
        // console.log('data[0].basic_attr: ', data.basic_attr);
        var svg_width = $("#lineChart")[0].scrollWidth;
        var svg_height = $("#lineChart")[0].scrollHeight;
        // 求出一些基本值
        var max_arr = [],
            min_arr = [];
        console.log()
        for (let i = 0; i < data.value[0].length; i++) {
            max_arr.push(data.value[0][i]);
            min_arr.push(data.value[0][i]);
        }
        for (let i = 0; i < data.value.length; i++) {
            for (let j = 0; j < data.value[i].length; j++) {
                if (data.value[i][j] > max_arr[j])
                    max_arr[j] = data.value[i][j];
                if (data.value[i][j] < min_arr[j])
                    min_arr[j] = data.value[i][j];
            }
        }
        // console.log(min_arr, max_arr);



        //设置坐标轴
        let yScale = d3.scaleLinear().domain([min_arr[0], max_arr[0]]).range([0, svg_height * 0.85])
        let y_axis = d3.axisLeft(yScale).tickPadding(5).tickSize(5);
        if (sampleStatus == 1) {
            mapView.svg_lineChart.append('g')
                .attr("class", "axis")
                .attr("transform", "translate(40," + svg_height * 0.1 + ")")
                .call(y_axis)
        }

        let xScale_arr = [],
            xAxis_arr = [];
        for (let i = 1; i < min_arr.length; i++) {
            if (max_arr[i] > 0 && min_arr[i] <= 0) {
                let tmp_ys = d3.scaleLinear().domain([min_arr[i] * 1.2, max_arr[i] * 1.2]).range([0, svg_width * 0.16])
                xScale_arr.push(tmp_ys);
            } else if (max_arr[i] < 0 && min_arr[i] <= 0) {
                let tmp_ys = d3.scaleLinear().domain([min_arr[i] * 1.2, max_arr[i] * 0.8]).range([0, svg_width * 0.16])
                xScale_arr.push(tmp_ys);
            } else if (max_arr[i] > 0 && min_arr[i] > 0) {
                let tmp_ys = d3.scaleLinear().domain([min_arr[i] * 0.8, max_arr[i] * 1.2]).range([0, svg_width * 0.16])
                xScale_arr.push(tmp_ys);
            } else {
                let tmp_ys = d3.scaleLinear().domain([min_arr[i] * 0.8, max_arr[i] * 0.8]).range([0, svg_width * 0.16])
                xScale_arr.push(tmp_ys);
            }

        }
        //画属性分界线
        
        let areaLine = d3.line().x(function (d) {
            return d[0];
        }).y(function (d) {
            return d[1];
        })
        let line_arr = [
            [35, svg_height * 0.1],
            [40 + svg_width * 0.8, svg_height * 0.1]
        ];
        var text_loc = [];
        mapView.svg_lineChart.append("path")
            .attr("d", areaLine(line_arr))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", 'none')
            .attr("id", "x_axis");
        for (let i = 1; i < 6; i++) {
            let tmp_loc = [35 + svg_width * 0.05 + svg_width * 0.16 * (i - 1), svg_height * 0.08];
            text_loc.push(tmp_loc);
            let tmp_sp = [40 + svg_width * 0.16 * i, svg_height * 0.1],
                tmp_ep = [40 + svg_width * 0.16 * i, svg_height * 0.95];
            let tmp_line = [tmp_sp, tmp_ep];
            mapView.svg_lineChart.append("path")
                .attr("d", areaLine(tmp_line))
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", 'none')
                .attr("id", "x_axis");
        }
        //属性标识
        if(sampleStatus == 1){
            mapView.svg_lineChart.append("a").selectAll("text").data(text_loc)
            .enter().append("text")
            .attr("transform", function (d) {
                return "translate(" + d[0] + ',' + d[1] + ")";
            }).attr("font-size", 10)
            .style("stroke", function (d, i) {
                return pathColor;
            })
            .text(function (d, i) {
                return data.basic_attr[i + 1];
            }).on("click", function (d, i) {
                for (let i = 0; i < 5; i++) {
                    d3.select("#" + data.basic_attr[i + 1]).attr("stroke-width", 0.5).attr("opacity", 0.5);
                }
                d3.select("#" + data.basic_attr[i + 1]).attr("stroke-width", 2).attr("opacity", 1.0);
                // d3.select("#y_axis").call(yAxis_arr[i]);
            })
        }
        


        for (let i = 1; i < 6; i++) {
            // console.log(i);
            let lineFun = d3.line()
                .x(function (d) {
                    let tmp_x = xScale_arr[i - 1](d[i]) + 40 + (svg_width * 0.16) * (i - 1);
                    return tmp_x;
                })
                .y(function (d) {
                    let tmp_y = yScale(d[0]) + svg_height * 0.1;
                    // if(tmp_y > svg_width*0.8)
                    //     tmp_y = svg_height*0.83;
                    return tmp_y;
                })
                .curve(d3.curveBasis);
            mapView.svg_lineChart.append("path")
                .attr("d", lineFun(data.value))
                .attr("stroke", pathColor)
                .attr("stroke-width", 0.5)
                .attr("fill", 'none')
                .attr("id", data.basic_attr[i] + '_' + data.id);
        }
        // console.log(text_loc);
    }

    
    return {
        drawLineChart: drawLineChart,
    }
})()