var rectView = (function () {
    var SpSvg = d3.select("#SpSvg");
    var CondSvg = d3.select("#CondSvg");
    var Ml1Svg = d3.select("#Ml1Svg");
    var Ml2Svg = d3.select("#Ml2Svg");
    var AcSvg = d3.select("#AcSvg");

    var svgTuli = d3.select("#tuli");
    let svgTuli_height = $("#tuli").height();
    console.log('svgTuli_height: ', svgTuli_height);
    let svgTuli_width = $("#tuli").width();
    let tmp_width = 0;
    let x_arr = [500, 550, 620, 675, 730];
    svgTuli.append("a").selectAll("text").data(variable.value_attrs).enter()
        .append("text")
        .attr("x", function (d, i) {
            return x_arr[i];
        }).attr("y", svgTuli_height * 3 / 4)
        .text(function (d) {
            return d;
        })

    function drawRect(tmp_aroundids) {
        d3.select("#rectView").selectAll("svg").selectAll("*").remove();
        let rate_index = parseInt(variable.rate / 10);
        // console.log('well_id: ', well_id);
        let svg_height = $("#SpSvg").height();
        let svg_width = $("#SpSvg").width();
        let rectHeight = svg_height / (tmp_aroundids.length + 2);
        let rectWidth = svg_width / (tmp_aroundids.length + 2);
        let matchValue_arr = [];

        for (let i = 0; i < tmp_aroundids.length; i++) {
            for (let j = 0; j < tmp_aroundids.length; j++) {
                tmp_dict = {};
                let tmp_key = tmp_aroundids[i] + "&" + tmp_aroundids[j];
                // console.log('tmp_key:', tmp_key);
                tmp_dict['well_1'] = tmp_aroundids[i];
                tmp_dict['well_2'] = tmp_aroundids[j];
                tmp_dict['x'] = i;
                tmp_dict['y'] = j;
                // console.log(i,j)
                if (i != j) {
                    tmp_dict['value'] = [];
                    // console.log(variable.match_value[tmp_key]['value']);
                    // console.log('variable.match_value[key]: ', variable.match_value[key]);
                    for (let j = 0; j < 5; j++) {
                        tmp_dict['value'].push(variable.match_value[tmp_key]['value'][j]);
                    }
                }
                else {
                    tmp_dict['value'] = [0, 0, 0, 0, 0];
                };
                matchValue_arr.push(tmp_dict);
            }
        }

        for (let i = 0; i < tmp_aroundids.length; i++) {
            let tmp_index = i * tmp_aroundids.length + i;
            for (let j = 0; j < tmp_aroundids.length; j++) {
                if (i != j) {
                    for (let a = 0; a < 5; a++) {
                        matchValue_arr[tmp_index]['value'][a] += matchValue_arr[i * tmp_aroundids.length + j]['value'][a];
                    }
                }
            }
        }
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
            let tmp_max = d3.max(matchValue_arr, function (d) { return d['value'][i] });
            let tmp_min = d3.min(matchValue_arr, function (d) { return d['value'][i] });
            min_arr.push(Islog(tmp_min));
            max_arr.push(Islog(tmp_max));
        }
        // console.log("max： ", max_arr);
        // console.log("min： ", min_arr);
        // console.log('matchValue_arr: ', matchValue_arr);

        //设置颜色比例尺
        let colorScale_arr = [];
        let compute_arr = [];
        let max_color = ["#76FFA5", '#FFEF58', '#FFAD7D', '#F270FF', '#70AAFF'];
        let min_color = ["#F3FFF3", '#FFFDDD', '#FFE3D3', '#FADEFF', '#D7E9FF'];
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
            let rect_sp = selection.append("g").selectAll("rect")
                .data(matchValue_arr).enter().append("rect")
                .attr("x", function (d) {
                    let tmp_x = d.x * rectWidth + rectWidth * 1.5;
                    return tmp_x;
                }).attr("y", function (d) {
                    let tmp_y = d.y * rectHeight + rectHeight * 1.5;
                    return tmp_y;
                }).attr("width", rectWidth - 0.5)
                .attr("height", rectHeight - 0.5)
                .attr("stroke", 'white')
                .attr("stroke-width", 0.5)
                .attr("id", function (d) {
                    return d['well_1'] + '_' + d['well_2'] + '_' + variable.value_attrs[attr_index];
                })
                .style("fill", function (d) {
                    let tmp_value = Islog(d['value'][attr_index]);
                    let tmp_color = compute_arr[attr_index](colorScale_arr[attr_index](tmp_value));
                    return tmp_color;
                }).on("click", function (d) {
                    mapView.getChosenData(d['well_1']).then(function (well_1) {
                        mapView.getChosenData(d['well_2']).then(function (well_2) {
                            matchView.drawMatch([well_1[0], well_2[0]], variable.value_attrs[attr_index]);

                        })
                    })
                });

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
        }
        renderSvg(SpSvg, 0);
        renderSvg(CondSvg, 1);
        renderSvg(Ml1Svg, 2);
        renderSvg(Ml2Svg, 3);
        renderSvg(AcSvg, 4);


    }
    return {
        drawRect,
    }

})()