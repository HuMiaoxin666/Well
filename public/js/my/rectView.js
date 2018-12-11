var rectView = (function () {
    var SpSvg = d3.select("#SpSvg");
    var CondSvg = d3.select("#CondSvg");
    var Ml1Svg = d3.select("#Ml1Svg");
    var Ml2Svg = d3.select("#Ml2Svg");
    var AcSvg = d3.select("#AcSvg");

    var svgTuli = d3.select("#tuli_rect");
    let svgTuli_height = $("#tuli_rect").height();
    console.log('svgTuli_height: ', svgTuli_height);
    let svgTuli_width = $("#tuli_rect").width();
    let tmp_width = 0;
    let x_arr = [500, 550, 620, 675, 730];
    svgTuli.append("a").selectAll("text").data(variable.value_attrs).enter()
        .append("text")
        .attr("x", function (d, i) {
            return x_arr[i];
        }).attr("y", svgTuli_height * 3 / 4)
        .style('fill','white')
        .text(function (d) {
            return d;
        })

    function drawRect(tmp_aroundids, vstd_id) {
        //清空排名列表
        variable.matchValueSort_arr = [];
        //清空矩形svg
        d3.select("#rectView").selectAll("svg").selectAll("*").remove();
        let rate_index = parseInt(variable.rate / 10);
        // console.log('well_id: ', well_id);
        let svg_height = $("#SpSvg").height();
        let svg_width = $("#SpSvg").width();
        let rectHeight = svg_height / (tmp_aroundids.length + 2);
        let rectWidth = svg_width / (tmp_aroundids.length + 2);
        let tmp_matchArr = [];
        let tmpId_indexDict = {};
        for (let i = 0; i < tmp_aroundids.length; i++) {
            tmpId_indexDict[tmp_aroundids[i]] = i;
            let tmp_arr = [];
            for (let j = 0; j < tmp_aroundids.length; j++) {
                tmp_dict = {};
                let tmp_key = tmp_aroundids[i] + "&" + tmp_aroundids[j];
                // console.log('tmp_key:', tmp_key);
                tmp_dict['well_1'] = tmp_aroundids[i];
                tmp_dict['well_2'] = tmp_aroundids[j];
                tmp_dict['x'] = j;
                tmp_dict['y'] = i;
                // console.log(i, j)
                if (i != j) {
                    tmp_dict['value'] = [];
                    // console.log('variable.match_value[key]: ', variable.match_value[key]);
                    for (let a = 0; a < 5; a++) {
                        tmp_dict['value'].push(variable.match_value[tmp_key]['value'][a]);
                    }
                }
                else {
                    tmp_dict['value'] = [0, 0, 0, 0, 0];
                };
                tmp_arr.push(tmp_dict);
            }
            tmp_matchArr.push(tmp_arr);
        }
        console.log('tmp_matchArr: ', tmp_matchArr);
        let well_sum_arr = [[], [], [], [], []];
        for (let i = 0; i < tmp_matchArr.length; i++) {
            for (let j = 0; j < tmp_matchArr[i].length; j++) {
                if (i != j) {
                    for (let a = 0; a < 5; a++) {
                        tmp_matchArr[i][i]['value'][a] += tmp_matchArr[i][j]['value'][a];
                    }
                }
            }
            for (let a = 0; a < 5; a++) {
                let tmp_dict = { value: tmp_matchArr[i][i]['value'][a], id: tmp_matchArr[i][i]['well_1'] };
                well_sum_arr[a].push(tmp_dict);
            }
        }

        function sortNumber(a, b) {
            return a.value - b.value;
        };
        //将每种属性下每口井的匹配总值进行排序
        for (let a = 0; a < 5; a++) {
            well_sum_arr[a] = well_sum_arr[a].sort(sortNumber);
        }
        console.log('well_sum_arr: ', well_sum_arr);
        //最终数组赋值
        let matchValue_arr = [];
        for (let a = 0; a < well_sum_arr.length; a++) {
            variable.matchValueSort_arr.push([]);
            matchValue_arr.push([]);
            for (let i = 0; i < well_sum_arr[a].length; i++) {
                variable.matchValueSort_arr[a].push(well_sum_arr[a][i]['id']);
                let tmp_dataArr = MatchCal.deepCopy(tmp_matchArr[tmpId_indexDict[well_sum_arr[a][i]['id']]]);
                for (let j = 0; j < tmp_dataArr.length; j++) {
                    let tmp_dict = tmp_dataArr[tmpId_indexDict[well_sum_arr[a][j]['id']]];
                    // console.log('tmp_dict: ', tmp_dict);
                    tmp_dict['value'] = tmp_dict['value'][a];
                    tmp_dict['x'] = j;
                    tmp_dict['y'] = i;
                    matchValue_arr[a].push(tmp_dict);
                }
            }
        }
        console.log('matchValue_arr: ', matchValue_arr);
        // console.log(matchValue_arr);
        function Islog(value) {
            if (value > 0)
                return Math.log2(value);
            else if (value == 0)
                return 0;
            else
                return - Math.log2(Math.abs(value));
        }

        let max_arr = [], min_arr = [];
        for (let i = 0; i < 5; i++) {
            let tmp_max = d3.max(matchValue_arr[i], function (d) { return d['value'] });
            let tmp_min = d3.min(matchValue_arr[i], function (d) { return d['value'] });
            min_arr.push(Islog(tmp_min));
            max_arr.push(Islog(tmp_max));
        }
        // console.log("max： ", max_arr);
        // console.log("min： ", min_arr);
        // console.log('matchValue_arr: ', matchValue_arr);

        //设置颜色比例尺["#1DFF74", '#FFFF00', '#FFAB7C', '#EE89FF', '#00D8FF'];
        let colorScale_arr = [];
        let compute_arr = [];
        let max_color = ["#76FFA5", '#FFFF00', '#FFAB7C', '#F270FF', '#00D8FF'];
        let min_color = ["#F3FFF3", '#FFFDDD', '#FFE3D3', '#FADEFF', '#DDF7FF'];
        for (let i = 0; i < max_arr.length; i++) {
            // console.log(max_arr[i]);
            let tmp_sacle = d3.scaleLinear().domain([min_arr[i], max_arr[i]]).range([0, 1]);
            let tmp_compute = d3.interpolate(min_color[i], max_color[i]);
            colorScale_arr.push(tmp_sacle);
            compute_arr.push(tmp_compute);
        }

        //设置系数矩形长度比例尺
        let tmp_max_b = d3.max(variable.importance_arr);
        let tmp_min_b = d3.min(variable.importance_arr);
        let bSacle = d3.scaleLinear().domain([tmp_min_b, tmp_max_b]).range([rectWidth * 2, rectWidth * (tmp_aroundids.length - 4)])
        // console.log('rectWidth * (tmp_aroundids.length - 4): ', rectWidth * (tmp_aroundids.length - 4));

        function renderSvg(selection, attr_index) {
            //画矩形
            let rect_sp = selection.append("g").selectAll("rect")
                .data(matchValue_arr[attr_index]).enter().append("rect")
                .attr("x", function (d) {
                    let tmp_x = d.x * rectWidth + rectWidth * 1.5;
                    return tmp_x;
                }).attr("y", function (d) {
                    let tmp_y = d.y * rectHeight + rectHeight * 1.5;
                    return tmp_y;
                }).attr("width", rectWidth - 0.5)
                .attr("height", rectHeight - 0.5)
                .attr("stroke", 'white')
                .attr("stroke-width", 1)
                .attr("id", function (d) {
                    return d['well_1'] + '_' + d['well_2'] + '_' + variable.value_attrs[attr_index];
                }).attr('rx', 3)
                .attr('ry', 3)
                .style("fill", function (d) {
                    let tmp_value = Islog(d['value']);
                    let tmp_color = compute_arr[attr_index](colorScale_arr[attr_index](tmp_value));
                    return tmp_color;
                }).on("click", function (d) {
                    mapView.getChosenData(d['well_1']).then(function (well_1) {
                        mapView.getChosenData(d['well_2']).then(function (well_2) {
                            matchView.drawMatch([well_1[0], well_2[0]], variable.value_attrs[attr_index], attr_index);
                        });
                    });
                }).on('mouseover', function (d, i) {
                    d3.select('#tooltip_div')
                        .style('z-index', 1)
                        .style('display', 'block')
                        .transition()
                        .duration(1000)
                        .style('left', function () {
                            return d3.event.pageX + 'px';
                        })
                        .style('top', d3.event.pageY + 'px');
                    d3.select('#tooltip_text').text('(' + d['well_1'] + ',' + d['well_2'] + ')' + ': ' + d['value']);
                }).on('mousemove', function (d, i) {
                    d3.select('#tooltip_div')
                        .style('z-index', 1)
                        .style('display', 'block')
                        .transition()
                        .duration(1000)
                        .style('left', d3.event.pageX + 'px')
                        .style('top', d3.event.pageY + 'px');
                    d3.select('#tooltip_text').text('(' + d['well_1'] + ',' + d['well_2'] + ')' + ': ' + d['value']);
                }).on('mouseout', function (d) {
                    d3.select('#tooltip_div').style('z-index', -1).style('display', 'none')
                        ;
                });

            //画标准井矩形区域
            let tmp_std_order;
            for (let i = 0; i < well_sum_arr[attr_index].length; i++) {
                if (well_sum_arr[attr_index][i]['id'] == vstd_id) {
                    tmp_std_order = i;
                }
            }
            let x_arr = [], y_arr = [], tmp_len = tmp_aroundids.length;
            x_arr = [rectWidth * 1.5, tmp_std_order * rectWidth + rectWidth * 1.5];
            y_arr = [rectHeight * 1.5, tmp_std_order * rectHeight + rectHeight * 1.5];

            let areaRect = [{ type: 'std_row', loc: [x_arr[0], y_arr[1]], width: rectWidth * tmp_len, height: rectHeight },
            { type: 'std_col', loc: [x_arr[1], y_arr[0]], width: rectWidth, height: rectHeight * tmp_len },
            { type: 'ard_row', loc: [x_arr[0], y_arr[1]], width: rectWidth * tmp_len, height: rectHeight },
            { type: 'ard_col', loc: [x_arr[1], y_arr[0]], width: rectWidth, height: rectHeight * tmp_len }
            ];

            selection.append('g').selectAll('rect').data(areaRect).enter()
                .append('rect')
                .attr('x', function (d) { return d.loc[0]; })
                .attr('y', function (d) { return d.loc[1]; })
                .attr('width', function (d) { return d.width; })
                .attr('height', function (d) { return d.height; })
                .attr("fill", 'none')
                .attr('stroke', function (d, i) {
                    if (i == 0 || i == 1)
                        return 'red';
                    else
                        return 'none';
                })
                .attr('stroke-width', 1)
                .attr('rx', 3)
                .attr('ry', 3)
                .attr('opacity', function (d, i) {
                    if (i == 0 || i == 1)
                        return 1.0;
                    else
                        return 1.0;
                })
                .attr('id', function (d) { return d.type + '_' + attr_index; });
            // selection.append("a").selectAll("text").data([variable.value_attrs[attr_index]])
            //     .enter().append("text")
            //     .attr("transform", function (d) {
            //         let tmp_x = 1.5 * rectWidth;
            //         return "translate(" + tmp_x + ',' + 10 + ")";
            //     }).attr("font-size", 10)
            //     .style("stroke", function () {
            //         return variable.attr_color[attr_index];
            //     })
            //     .text(function (d, i) {
            //         return variable.value_attrs[attr_index];
            //     });

            // selection.append("g").selectAll("rect")
            //     .data([variable.importance_arr[attr_index]]).enter().append("rect")
            //     .attr("x", function (d) {
            //         return 1.5 * rectWidth + 8 * variable.value_attrs[attr_index].length;
            //     }).attr("y", 0)
            //     .attr("width", function (d) {
            //         // console.log(d);
            //         // console.log(bSacle(d));
            //         return bSacle(d);
            //     })
            //     .attr("height", rectHeight - 0.5)
            //     .attr("stroke", 'white')
            //     .attr("stroke-width", 0.5)
            //     .style("fill", function () {
            //         return variable.attr_color[attr_index];
            //     });
        };
        renderSvg(SpSvg, 0);
        renderSvg(CondSvg, 1);
        renderSvg(Ml1Svg, 2);
        renderSvg(Ml2Svg, 3);
        renderSvg(AcSvg, 4);
    }
    function drawSelect() {

    }

    return {
        drawRect,
    }

})()