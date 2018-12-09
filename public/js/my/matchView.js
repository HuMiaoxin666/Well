var matchView = (function () {

    let svg_match = d3.select("#matchSvg");
    let svg_match_width = $("#matchSvg").width();
    let svg_match_height = $("#matchSvg").height();


    function drawMatch(well_arr, attr, attr_index) {
        d3.select("#matchSvg").selectAll("*").remove();
        console.log('well_arr: ', well_arr);
        let arr = MatchCal.CalMatchValue(well_arr, attr);
        let matchResult = arr[0];
        let layerMatch = matchResult.layerpairs;
        let matchLine_left = 0.25;
        let matchLine_right = 0.75;
        let rect_height = 0.75;//矩形的高度占比
        let rect_width = 0.2;
        let rect_top = 0.2;
        let rect_bottom = 0.95;
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

        //画两个矩形
        let x_arr = [(matchLine_left - rect_width) * svg_match_width, matchLine_right * svg_match_width];
        svg_match.append("g").selectAll("rect").data(x_arr).enter()
            .append("rect")
            .attr("x", function (d, i) {
                return d;
            }).attr("y", function (d, i) {
                return rect_top * svg_match_height;
            }).attr("width", rect_width * svg_match_width)
            .attr('height', rect_height * svg_match_height)
            .attr('stroke', 'gray')
            .attr("stroke-width", 2)
            .attr("fill", "none");
        //添加井id text
        let id_arr = [well_arr[0].id, well_arr[1].id];
        console.log(well_arr[0].id.length * 2);
        let x_arr_text = [(matchLine_left - rect_width / 2) * svg_match_width - well_arr[0].id.length*2, (matchLine_right + rect_width / 3) * svg_match_width - well_arr[1].id.length*3]
        console.log(' matchLine_right + rect_width / 2 - well_arr[1].id.length: ', matchLine_right + rect_width / 2 - well_arr[1].id.length);
        svg_match.append("a").selectAll("text").data(id_arr)
            .enter().append("text")
            .attr("transform", function (d, i) {
                return "translate(" + x_arr_text[i] + ',' + (0.1 * svg_match_height) + ")";
            }).attr("font-size", 12)
            .style("color", function (d, i) {
                return "gray";
            })
            .text(function (d, i) {
                //console.log(data.basic_attr);
                return d;
            });
        //******画原始数据曲线******
        // 求出一些基本值
        for (let w = 0; w < 2; w++) {
            let index_arr = [0, attr_index + 1];
            console.log('attr_index: ', attr_index);
            let max_arr = [], min_arr = [];
            min_arr.push(1000);
            min_arr.push(d3.min(well_arr[w].value, function (d) { return d[attr_index + 1] }));
            max_arr.push(1400);
            max_arr.push(d3.max(well_arr[w].value, function (d) { return d[attr_index + 1] }));

            console.log(max_arr, min_arr);
            //设置比例尺
            //设置坐标轴

            let yScale = d3.scaleLinear().domain([min_arr[0], 1400]).range([0, svg_match_height * rect_height])
            let xScale = d3.scaleLinear().domain([min_arr[1], max_arr[1]]).range([0, svg_match_width * (rect_width - 0.02)])

            let lineFun = d3.line()
                .x(function (d) {
                    if (d[attr_index + 1] < -700) {
                        let tmp_x = xScale(min_arr[1]) + (matchLine_left - rect_width + 0.01) * (1 - w) * svg_match_width + w * matchLine_right * svg_match_width;
                        return tmp_x;
                    }
                    else if (d[attr_index + 1] > 9999) {
                        let tmp_x = xScale(max_arr[1]) + (matchLine_left - rect_width + 0.01) * (1 - w) * svg_match_width + w * matchLine_right * svg_match_width;
                        return tmp_x;
                    }
                    else {
                        let tmp_x = xScale(d[attr_index + 1]) + (matchLine_left - rect_width + 0.01) * (1 - w) * svg_match_width + w * matchLine_right * svg_match_width;
                        // console.log('tmp_x: ', tmp_x);
                        return tmp_x;
                    }
                })
                .y(function (d) {
                    let tmp_y = yScale(d[0]) + svg_match_height * rect_top;
                    return tmp_y;
                })
                .curve(d3.curveBasis);
            console.log('well_arr[w].value: ', well_arr[w].value);
            svg_match.append("g").selectAll('path').data([well_arr[w].value]).enter()
                .append('path')
                .attr("d", function (d) {
                    return lineFun(d);
                })
                .attr("stroke", function (d) {
                    return 'gray';
                })
                .attr("stroke-width", 1)
                .attr("fill", 'none')
                .attr("opacity", function () {
                    //console.log(stroke_opacity);
                    return 1;
                })
                .attr("id", well_arr[w].basic_attr[attr_index] + '_' + well_arr[w].id);
        }


        //匹配线
        function drawDashLine(y_arr) {
            console.log('y_arr: ', y_arr);
            let wellLine_arr = [];
            let tmp_arr = [[matchLine_left - rect_width, matchLine_left], [matchLine_right, matchLine_right + rect_width]];
            for (let i = 0; i < y_arr.length; i++) {
                for (let j = 0; j < y_arr[i].length; j++) {
                    wellLine_arr.push([
                        [tmp_arr[i][0] * svg_match_width, y_arr[i][j]],
                        [tmp_arr[i][1] * svg_match_width, y_arr[i][j]]
                    ]);
                }

            };
            let lineFun_well = d3.line()
                .x(function (d) { return d[0]; })
                .y(function (d) { return d[1]; })

            svg_match.append("g").selectAll("path").data(wellLine_arr).enter()
                .append("path")
                .attr("d", function (d) {
                    return lineFun_well(d);
                })
                .attr("stroke", "#C78448")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", 0.03 * svg_match_width)
                .attr("fill", "none");

        }


        //*****层的匹配*****
        //设置深度比例尺
        let depthScale = d3.scaleLinear().domain([1000, 1400]).range([0.2 * svg_match_height, rect_bottom * svg_match_height]);
        let layerLine_arr = [];
        let tmp_arr_match = [matchLine_left, matchLine_right];
        let y_arr = [];//用于记录匹配线两端四个点的y坐标
        for (let i = 0; i < depth_arr.length; i++) {
            let tmp_line = [];
            tmp_line.push([tmp_arr_match[0] * svg_match_width, depthScale(depth_arr[i][0][0])]);
            tmp_line.push([tmp_arr_match[0] * svg_match_width, depthScale(depth_arr[i][0][1])]);
            tmp_line.push([tmp_arr_match[1] * svg_match_width, depthScale(depth_arr[i][1][1])]);
            tmp_line.push([tmp_arr_match[1] * svg_match_width, depthScale(depth_arr[i][1][0])]);
            tmp_line.push([tmp_arr_match[0] * svg_match_width, depthScale(depth_arr[i][0][0])]);
            y_arr.push([[depthScale(depth_arr[i][0][0]), depthScale(depth_arr[i][0][1])],
            [depthScale(depth_arr[i][1][0]), depthScale(depth_arr[i][1][1])]])
            layerLine_arr.push(tmp_line);
        }

        let lineFun_layer = d3.line()
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; })

        svg_match.append("g").selectAll("path").data(layerLine_arr).enter()
            .append("path")
            .attr("d", function (d) {
                d.click = false;
                return lineFun_layer(d);
            })
            .attr("stroke", "none")
            .attr("fill", "#B5B5B5")
            .attr('id', 'path_match')
            .on('mouseover', function () {
                d3.select(this).attr("fill", '#C78448');
            }).on('mouseout', function (d) {
                if (d.click == false)
                    d3.select(this).attr('fill', '#B5B5B5')
            })
            .on("click", function (d, i) {
                d.click = true;
                drawDashLine(y_arr[i]);
            })

    }

    return {
        drawMatch,
        svg_match
    }
})()