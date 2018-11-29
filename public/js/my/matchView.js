var matchView = (function () {

    var svg_match = d3.select("#matchSvg");
    var svg_match_width = $("#matchSvg").width();
    var svg_match_height = $("#matchSvg").height();
    function drawMatch(well_arr, attr) {
        d3.select("#matchSvg").selectAll("*").remove();
        console.log('well_arr: ', well_arr);
        let arr = MatchCal.CalMatchValue(well_arr, attr);
        let matchResult = arr[0];
        let layerMatch = matchResult.layerpairs;
        console.log('layerMatch: ', layerMatch);
        let wbdatas = [arr[1], arr[2]];
        console.log('wbdatas: ', wbdatas);
        let depth_arr = []; //匹配层的深度数组
        for (let i = 0; i < layerMatch.length; i++) {
            let tmp_arr_1 = [wbdatas[0].bdata[layerMatch[i][0]].th, wbdatas[0].bdata[layerMatch[i][0]].bh];
            let tmp_arr_2 = [wbdatas[1].bdata[layerMatch[i][1]].th, wbdatas[1].bdata[layerMatch[i][1]].bh];
            depth_arr.push([tmp_arr_1, tmp_arr_2]);
        }
        console.log("depth_arr: ", depth_arr);


        //井的代表线
        let wellLine_arr = [];
        let tmp_arr = [0.2, 0.8]
        for (let i = 0; i < tmp_arr.length; i++) {
            wellLine_arr.push([
                [tmp_arr[i] * svg_match_width, 0.2 * svg_match_height],
                [tmp_arr[i] * svg_match_width, 0.95 * svg_match_height]
            ]);
        }
        let lineFun_well = d3.line()
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; })

        svg_match.append("g").selectAll("path").data(wellLine_arr).enter()
            .append("path")
            .attr("d", function (d) {
                return lineFun_well(d);
            })
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("id", function (d, i) {
                return well_arr[i].id;
            })

        //*****层的匹配*****
        //设置深度比例尺
        let depthScale = d3.scaleLinear().domain([1000, 1400]).range([0.2 * svg_match_height, 0.95 * svg_match_height]);
        let layerLine_arr = [];

        for (let i = 0; i < depth_arr.length; i++) {
            let tmp_line = [];
            tmp_line.push([tmp_arr[0] * svg_match_width, depthScale(depth_arr[i][0][0])]);
            tmp_line.push([tmp_arr[0] * svg_match_width, depthScale(depth_arr[i][0][1])]);
            tmp_line.push([tmp_arr[1] * svg_match_width, depthScale(depth_arr[i][1][1])]);
            tmp_line.push([tmp_arr[1] * svg_match_width, depthScale(depth_arr[i][1][0])]);
            tmp_line.push([tmp_arr[0] * svg_match_width, depthScale(depth_arr[i][0][0])]);
            console.log('tmp_line: ', tmp_line);

            layerLine_arr.push(tmp_line);
        }

        let lineFun_layer = d3.line()
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; })

        svg_match.append("g").selectAll("path").data(layerLine_arr).enter()
            .append("path")
            .attr("d", function (d) {
                return lineFun_layer(d);
            })
            .attr("stroke", "none")
            .attr("fill", "#B5B5B5")

    }

    return {
        drawMatch,
        svg_match
    }
})()