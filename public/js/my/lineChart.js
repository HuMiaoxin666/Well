var lineChart = (function () {
    var svg_lineChart = d3.select("#ChartSvg").attr("width", '100%').attr("height", '100%');
    // console.log('svg_lineChart: ', svg_lineChart);
    function drawLineChart(data, sampleStatus) {
        // console.log('data: ', data);
        // //console.log('data[0].basic_attr: ', data.basic_attr);
        var svg_width = $("#lineChart")[0].scrollWidth;
        var svg_height = $("#lineChart")[0].scrollHeight;
        let tmp_color = ['#B5B5B5', '#B5B5B5', '#B5B5B5', '#B5B5B5', '#B5B5B5'];
        //根据显得颜色来判断采样种类并对线宽和透明度做改变
        let stroke_width = 0.5, stroke_opacity = 0.3;
        if (sampleStatus != 0) {
            stroke_width = 1;
            stroke_opacity = 0.7;
            tmp_color = variable.attr_color;
        }
        // 求出一些基本值
        var max_arr = [],
            min_arr = [];
        //console.log()
        for (let i = 0; i < data.value[0].length; i++) {
            max_arr.push(data.value[0][i]);
            min_arr.push(data.value[0][i]);
        }
        for (let i = 0; i < data.value.length; i++) {
            for (let j = 0; j < data.value[i].length; j++) {
                if (data.value[i][j] > max_arr[j] && data.value[i][j] < 10000)
                    max_arr[j] = data.value[i][j];
                if (data.value[i][j] < min_arr[j] && data.value[i][j] > -700) {
                    min_arr[j] = data.value[i][j];
                }
            }
        }

        //console.log(min_arr, max_arr);

        // //console.log('max_arr[0]: ', max_arr[0]);
        //设置坐标轴
        let yScale = d3.scaleLinear().domain([min_arr[0], 1400]).range([0, svg_height * 0.9])

        let y_axis = d3.axisLeft(yScale).tickPadding(5).tickSize(5);
        if (sampleStatus == 1) {
            svg_lineChart.append('g')
                .attr("class", "axis")
                .attr("transform", "translate(40," + svg_height * 0.05 + ")")
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
            [35, svg_height * 0.05],
            [40 + svg_width * 0.8, svg_height * 0.05]
        ];
        var text_loc = [];

        svg_lineChart.append("path")
            .attr("d", areaLine(line_arr))
            .attr("stroke", "#B5B8B6")
            .attr("stroke-width", 1)
            .attr("fill", 'none')
            .attr("id", "x_axis");
        for (let i = 0; i < variable.importance_arr.length; i++) {
            let tmp_loc = [35 + svg_width * 0.05 + svg_width * 0.16 * (i), svg_height * 0.03];
            text_loc.push(tmp_loc);
            let tmp_sp = [40 + svg_width * 0.16 * (i + 1), svg_height * 0.05],
                tmp_ep = [40 + svg_width * 0.16 * (i + 1), svg_height * 0.95];
            let tmp_line = [tmp_sp, tmp_ep];
            svg_lineChart.append("path")
                .attr("d", areaLine(tmp_line))
                .attr("stroke", "#B5B8B6")
                .attr("stroke-width", 1)
                .attr("fill", 'none')
                .attr("id", "x_axis");
        } //console.log('text_loc: ', text_loc);
        //属性标识
        if (sampleStatus == 1) {
            svg_lineChart.append("a").selectAll("text").data(text_loc)
                .enter().append("text")
                .attr("transform", function (d) {
                    return "translate(" + d[0] + ',' + d[1] + ")";
                }).attr("font-size", 10)
                .style("stroke", function (d, i) {
                    return "gray";
                })
                .text(function (d, i) {
                    //console.log(data.basic_attr);
                    return data.basic_attr[i];
                }).on("click", function (d, i) {
                    for (let i = 0; i < variable.importance_arr.length; i++) {
                        d3.select("#" + data.basic_attr[i]).attr("stroke-width", 0.5).attr("opacity", 0.5);
                    }
                    d3.select("#" + data.basic_attr[i]).attr("stroke-width", 2).attr("opacity", 1.0);
                    // d3.select("#y_axis").call(yAxis_arr[i]);
                })
        }


        for (let i = 0; i < variable.importance_arr.length; i++) {
            // //console.log(i);
            let lineFun = d3.line()
                .x(function (d) {
                    // if(i == 1)
                    if (d[i + 1] < -700) {
                        let tmp_x = xScale_arr[i](min_arr[i + 1]) + 40 + (svg_width * 0.16) * (i);
                        return tmp_x;
                    }
                    else if (d[i + 1] > 9999) {
                        let tmp_x = xScale_arr[i](max_arr[i + 1]) + 40 + (svg_width * 0.16) * (i);
                        return tmp_x;
                    }
                    else {
                        let tmp_x = xScale_arr[i](d[i + 1]) + 40 + (svg_width * 0.16) * (i);
                        // //console.log(tmp_x);
                        return tmp_x;
                    }

                })
                .y(function (d) {
                    let tmp_y = yScale(d[0]) + svg_height * 0.05;
                    // if(tmp_y > svg_width*0.8)
                    //     tmp_y = svg_height*0.83;
                    return tmp_y;
                })
                .curve(d3.curveBasis);
            svg_lineChart.append("path")
                .attr("d", lineFun(data.value))
                .attr("stroke", function (d) {
                    return tmp_color[i];
                })
                .attr("stroke-width", stroke_width)
                .attr("fill", 'none')
                .attr("opacity", function () {
                    //console.log(stroke_opacity);
                    return stroke_opacity;
                })
                .attr("id", data.basic_attr[i] + '_' + data.id);
        }
        // //console.log(text_loc);
    }


    return {
        drawLineChart,
        svg_lineChart,
    }
})()