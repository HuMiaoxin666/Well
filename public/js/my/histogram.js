var histogram = (function () {
    var svg_histogram = d3.select("#histogramSvg");
    function drawHistogram(variance_arr) {
        svg_histogram.selectAll("*").remove();
        for (let i = 0; i < variance_arr.length; i++) {
            if (variance_arr[i])
                variance_arr[i] = variance_arr[i] / 10000;
            else
                variance_arr[i] = 0;
        }
        console.log('variance_arr: ', variance_arr);
        let svg_height = $("#histogramSvg").height();
        let svg_width = $("#histogramSvg").width();

        //设置坐标轴
        let max_variance = d3.max(variance_arr);
        variable.std_maxV = max_variance;

        let yScale = d3.scaleLinear().domain([0, max_variance]).range([svg_height * 0.8, 0]);
        let xScale = d3.scaleBand().domain(variable.value_attrs).range([0, svg_width * 0.8]);
        variable.rect_Xscale = xScale;
        let x_axis = d3.axisBottom(xScale).tickPadding(5).tickSize(3);
        let y_axis = d3.axisLeft(yScale).ticks(5).tickPadding(5).tickSize(3);
        svg_histogram.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(40," + svg_height * 0.05 + ")")
            .call(y_axis)
            .attr("id", "Yaxis")
        svg_histogram.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(40," + svg_height * 0.85 + ")")
            .call(x_axis)

        let tick_arr = $(".tick");
        console.log('tick_arr: ', tick_arr);
        let bg_line_row = [], bg_line_col = [];
        for (let i = 0; i < tick_arr.length - 4; i++) {
            let style = window.getComputedStyle(tick_arr[i]);
            let matrix = new WebKitCSSMatrix(style.webkitTransform);
            bg_line_row
                .push([[40, svg_height * 0.05 + matrix.m42],
                [svg_width * 0.8 + 40, svg_height * 0.05 + matrix.m42]]);
        }

        for (let i = 0; i < 5; i++) {
            let tmp_x = variable.rect_Xscale(variable.value_attrs[i]) + 40 + 0.2 * svg_width * 0.8;
            bg_line_col
                .push([[tmp_x, svg_height * 0.85],
                [tmp_x, svg_height * 0.05]]);
        }
        let bgLine = d3.line()
            .x(function (d) {
                // console.log(d);
                return d[0];
            }).y(function (d) {
                return d[1];
            })
        svg_histogram.append('g').selectAll('path').data(bg_line_row).enter()
            .append('path')
            .attr('d', bgLine).attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr("stroke-dasharray", 0.01 * svg_width)
            .style('fill', 'none')
            .attr('opacity', 0.3);

        svg_histogram.append('g').selectAll('path').data(bg_line_col).enter()
            .append('path')
            .attr('d', bgLine).attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr("stroke-dasharray", 0.01 * svg_width)
            .style('fill', 'none')
            .attr('opacity', 0.3);
        //画背景网格
        let col_count = 5, row_ocunt = 3;
        // for (let i = 0; i < )
        //画标准井矩形
        svg_histogram.append('g').selectAll("rect").data(variance_arr).enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(variable.value_attrs[i]) + 40 + 0.025 * svg_width * 0.8;
            })
            .attr("y", function (d) {
                return yScale(d) + svg_height * 0.05;
            })
            .attr("width", function () {
                return 0.15 * svg_width * 0.8;
            }).attr("height", function (d) {
                return svg_height * 0.8 - yScale(d);
            }).attr('rx', 5)
            .attr('ry', 5)
            .style("fill", function (d, i) {
                return variable.attr_color[i];
            }).attr("class", "std_rect")
            .attr('id', function (d, i) {
                return 'hist_std_' + i;
            });

        for (let i = 0; i < 5; i++) {
            $('#hist_std_' + i).tooltip({ id: "hist_std_" + i, text: variance_arr[i] });
        }

    }

    function drawAroundHist(variance_arr) {
        for (let i = 0; i < variance_arr.length; i++) {
            if (variance_arr[i])
                variance_arr[i] = variance_arr[i] / 10000;
            else
                variance_arr[i] = 0;
        }
        console.log('variance_arr: ', variance_arr);
        let svg_height = $("#histogramSvg").height();
        let svg_width = $("#histogramSvg").width();

        //设置坐标轴
        let max_variance = d3.max(variance_arr);
        if (max_variance < variable.std_maxV)
            max_variance = variable.std_maxV;
        let yScale = d3.scaleLinear().domain([0, max_variance]).range([svg_height * 0.8, 0]);
        let y_axis = d3.axisLeft(yScale).ticks(5).tickPadding(5).tickSize(3);
        d3.select("#Yaxis").call(y_axis);
        let ts = d3.transition().duration(1000).ease(d3.easeLinear);
        d3.selectAll(".std_rect").transition(ts)
            .attr("y", function (d) {
                return yScale(d) + svg_height * 0.05;
            })
            .attr("width", function (d) {
                return 0.15 * svg_width * 0.4;
            }).attr("height", function (d) {
                return svg_height * 0.8 - yScale(d)
            }).attr('rx', 5)
            .attr('ry', 5);
        if (variable.around_click == 1) {
            svg_histogram.append('g').selectAll("rect").data(variance_arr).enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return variable.rect_Xscale(variable.value_attrs[i]) + 40 + 0.1 * svg_width * 0.8;
                })
                .attr("y", function (d) {
                    return yScale(d) + svg_height * 0.05;
                })
                .attr("width", function () {
                    return 0.15 * svg_width * 0.4;
                }).attr("height", function (d) {
                    return svg_height * 0.8 - yScale(d);
                }).attr('rx', 5)
                .attr('ry', 5)
                .style("fill", "gray")
                .attr("class", "around_rect")
                .attr('id', function (d, i) {
                    return 'hist_ard_' + i;
                });
            for (let i = 0; i < 5; i++) {
                $('#hist_ard_' + i).tooltip({ id: "hist_ard_" + i, text: variance_arr[i] });
            }
        } else {
            d3.selectAll(".around_rect").transition(ts)
                .attr("y", function (d, i) {
                    return yScale(variance_arr[i]) + svg_height * 0.05;
                })
                .attr("height", function (d, i) {
                    return svg_height * 0.8 - yScale(variance_arr[i])
                })
        }

    }
    return {
        drawHistogram,
        drawAroundHist,
        svg_histogram
    }
})()