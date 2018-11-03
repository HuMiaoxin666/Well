var lineChart = (function () {
    function drawLineChart(data, sampleStatus) {
        console.log('data: ', data);
      
        console.log('data[0].basic_attr: ', data.basic_attr);
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
        console.log(min_arr, max_arr);



        //设置坐标轴
        let yScale = d3.scaleLinear().domain([min_arr[0], max_arr[0]]).range([0, svg_height * 0.85])
        let y_axis = d3.axisLeft(yScale).tickPadding(5).tickSize(5);
        if (sampleStatus == true) {
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
        let colorScale;
        if (sampleStatus == true) {
            colorScale =["black","#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", '#9467bd'];
        } else {
            colorScale = ["#AAACB2", "#AAACB2", "#AAACB2", "#AAACB2", "#AAACB2", "#AAACB2"];
        }

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
        if(sampleStatus ==true){
            mapView.svg_lineChart.append("a").selectAll("text").data(text_loc)
            .enter().append("text")
            .attr("transform", function (d) {
                return "translate(" + d[0] + ',' + d[1] + ")";
            }).attr("font-size", 10)
            .style("stroke", function (d, i) {
                // console.log(colorScale[i + 1]);
                return colorScale[i + 1];
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
            console.log(i);
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
                .attr("stroke", colorScale[i])
                .attr("stroke-width", 0.5)
                .attr("fill", 'none')
                .attr("id", data.basic_attr[i]);
        }
        // console.log(text_loc);


    }

    function drawLineChart_2(data) {
        console.log('data: ', data);
        mapView.svg_lineChart.selectAll("*").remove();
        console.log('data[0].basic_attr: ', data.basic_attr);
        var svg_width = $("#lineChart")[0].scrollWidth;
        var svg_height = $("#lineChart")[0].scrollHeight;
        // 求出一些基本值
        var max_arr = [],
            min_arr = [];
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
        console.log(min_arr, max_arr);

        //测试值
        var test_data = [];
        for (let t = 0; t < 5; t++) {
            let tmp_arr = [];
            for (var i = 0; i < 39; i++) {
                tmp_arr.push([i * 2.5, Math.random() * 20 * (t + 1)]);
            }
            tmp_arr.push([i * 2.5, 10 * t + 10]);
            test_data.push(tmp_arr);
        }

        //设置坐标轴
        let xScale = d3.scaleLinear().domain([min_arr[0], max_arr[0]]).range([0, svg_width * 0.85])
        let x_axis = d3.axisBottom(xScale).ticks(5).tickPadding(5).tickSize(5);
        mapView.svg_lineChart.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(40," + svg_height * 0.45 + ")")
            .call(x_axis)
        let yScale_arr = [], yAxis_arr = [];
        for (let i = 1; i < min_arr.length; i++) {
            if (max_arr[i] < 0) {
                let tmp_ys = d3.scaleLinear().domain([-max_arr[i] * 1.5, max_arr[i] * 1.5]).range([0, svg_height * 0.7])
                yScale_arr.push(tmp_ys);
                yAxis_arr.push(d3.axisLeft(tmp_ys).ticks(5).tickPadding(5).tickSize(5));
            } else if (max_arr[i] > 0) {
                let tmp_ys = d3.scaleLinear().domain([max_arr[i] * 1.5, -max_arr[i] * 1.5]).range([0, svg_height * 0.7])
                yScale_arr.push(tmp_ys);
                yAxis_arr.push(d3.axisLeft(tmp_ys).ticks(5).tickPadding(5).tickSize(5));
            } else if (max_arr[i] == min_arr[i] && max_arr[i] == 0) {
                let tmp_ys = d3.scaleLinear().domain([-50, 50]).range([0, svg_height * 0.7]);
                yScale_arr.push(tmp_ys);
                yAxis_arr.push(d3.axisLeft(tmp_ys).ticks(5).tickPadding(5).tickSize(5));
            }
        }
        // let yScale = d3.scaleLinear().domain([100, 0]).range([0, svg_height * 0.7])
        mapView.svg_lineChart.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(40," + svg_height * 0.1 + ")")
            .attr("id", 'y_axis')
            .call(yAxis_arr[0])


        let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        var text_loc = [];
        for (let i = 1; i < 6; i++) {
            let tmp_loc = [svg_width * 0.1 * i, svg_height * 0.9];
            text_loc.push(tmp_loc);
        }

        for (let i = 1; i < 6; i++) {
            console.log(i);
            let lineFun = d3.line()
                .x(function (d) {
                    return xScale(d[0]) + 40;
                })
                .y(function (d) {
                    let tmp_y = yScale_arr[i - 1](d[i]) + svg_height * 0.1;
                    if (tmp_y > svg_height * 0.8)
                        tmp_y = svg_height * 0.83;
                    return tmp_y;
                })
                .curve(d3.curveBasis);
            mapView.svg_lineChart.append("path")
                .attr("d", lineFun(data.value))
                .attr("stroke", colorScale(i))
                .attr("stroke-width", 0.5)
                .attr("fill", 'none')
                .attr("id", data.basic_attr[i]);
        }
        console.log(text_loc);
        
        mapView.svg_lineChart.append("a").selectAll("text").data(text_loc)
            .enter().append("text")
            .attr("transform", function (d) {
                return "translate(" + d[0] + ',' + d[1] + ")";
            }).attr("font-size", 10)
            .style("stroke", function (d, i) {
                return colorScale(i + 1);
            })
            .text(function (d, i) {
                console.log();
                return data.basic_attr[i + 1];
            }).on("click", function (d, i) {
                for (let i = 0; i < 5; i++) {
                    d3.select("#" + data.basic_attr[i + 1]).attr("stroke-width", 0.5).attr("opacity", 0.5);
                }
                d3.select("#" + data.basic_attr[i + 1]).attr("stroke-width", 2).attr("opacity", 1.0);
                d3.select("#y_axis").call(yAxis_arr[i]);
            })

    }
    return {
        drawLineChart: drawLineChart,
        drawLineChart_2: drawLineChart_2
    }
})()