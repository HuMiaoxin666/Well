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
        let min_variance = d3.min(variance_arr);
        let max_variance = d3.max(variance_arr);
        let yScale = d3.scaleLinear().domain([0, max_variance]).range([svg_height * 0.8, 0])
        let xScale = d3.scaleBand().domain(variable.value_attrs).range([0, svg_width * 0.8])
        let x_axis = d3.axisBottom(xScale).tickPadding(5).tickSize(3);
        let y_axis = d3.axisLeft(yScale).ticks(5).tickPadding(5).tickSize(3);
        svg_histogram.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(40," + svg_height * 0.05 + ")")
            .call(y_axis)
        svg_histogram.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(40," + svg_height * 0.85 + ")")
            .call(x_axis)
        svg_histogram.append('g').selectAll("rect").data(variance_arr).enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(variable.value_attrs[i]) + 40 + 0.025 * svg_width * 0.8;
            })
            .attr("y", function (d) {
                return yScale(d) + svg_height * 0.05;
            })
            .attr("width",function(){
                return 0.15 * svg_width * 0.8;
            }).attr("height",function(d){
                return svg_height * 0.8 - yScale(d);
            })
            .style("fill", function (d, i) {
                return variable.attr_color[i];
            });
    }
    return {
        drawHistogram
    }
})()