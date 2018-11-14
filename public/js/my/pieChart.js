var pieChart = (function () {
    let pieHeight = $("#pieChart")[0].scrollHeight;
    let pieWidth = $("#pieChart")[0].scrollWidth;
    var svg_pieChart = d3.select("#pieSvg").attr("width", '100%').attr("height", '100%')
        .append("g")
        .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

    function drawPie() {

        let radius = Math.min(pieWidth, pieHeight) / 3;
        let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        let pie = d3.pie()
            .value(function (d) { return d; })
            .sort(null);

        let arc = d3.arc()
            .innerRadius(radius - 21)
            .outerRadius(radius - 20)
        let tmp_data = [10];

        var path = svg_pieChart.datum(tmp_data).selectAll("path")
            .data(pie)
            .enter().append("path")
            .attr("fill", function (d, i) { return colorScale(i); })
            .attr("d", arc)
        let total = path.node().getTotalLength();
        let rect_data = [];
        let len = 10;
        for (let i = 0; i < len; i++) {
            rect_data.push({ "value": 0.03 * total * i });
        }
        let rect_height = 30;
        let rect_width = 5;

        svg_pieChart.append("g").selectAll("rect").data(rect_data).enter()
            .append("rect")
            .attr("x", function (d) {
                let tmp_pos = path.node().getPointAtLength(d.value);
                d.x = tmp_pos.x;
                d.y = tmp_pos.y;
                let end_pos = path.node().getPointAtLength(d.value - rect_width);
                d.a = (Math.atan2(end_pos.y, end_pos.x) * 180 / Math.PI) - 90; //angle at the spiral position

            }).attr("y", function (d) {
                return d.y;
            }).attr("width", rect_width)
            .attr("height", rect_height)
            .attr("color", function (d, i) {
                return colorScale(i);
            })
            .attr("transform", function (d) {
                return "rotate(" + d.a + "," + d.x + "," + d.y + ")"; // rotate the bar
            });
    }

    return {
        drawPie
    }
})()