var mapView = (function () {
    //黑色地图
    //https://api.mapbox.com/styles/v1/keypro/cjjibvxa20ljx2slnphxjle4b/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ
    //白色
    //https://api.mapbox.com/styles/v1/keypro/cjjs6cawt25iq2snp6kqxu3r3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ
    //地图设置
    //初始化界面
    var svgTuli = d3.select("#tuli_map");
    let svgTuli_height = $("#tuli_map").height();
    console.log('svgTuli_height: ', svgTuli_height);
    let svgTuli_width = $("#tuli_map").width();
    let tmp_width = 0;
    let x_arr = [540, 590, 660, 715, 770];
    svgTuli.append("a").selectAll("text").data(variable.value_attrs).enter()
        .append("text")
        .attr("x", function (d, i) {
            return x_arr[i];
        }).attr("y", svgTuli_height * 3 / 4)
        .style('fill','white')
        .text(function (d) {
            return d;
        })

    function showCoordinates(e) {
        alert(e.latlng);
    }

    function centerMap(e) {
        map.panTo(e.latlng);
    }

    function zoomIn(e) {
        map.zoomIn();
    }

    function zoomOut(e) {
        map.zoomOut();
    };
    function changeStdWell() {
        variable.wait_circle.setStyle({
            color: 'yellow',
            fillColor: 'yellow'
        })
    }
    var winHeight = $(window).height();
    console.log('winHeight: ', winHeight);

    var map = L.map('map', {
        renderer: L.svg(),
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'Selected as a standard well',
            callback: changeStdWell
        }, '-', {
            text: 'Show coordinates',
            callback: showCoordinates
        }, {
            text: 'Center map here',
            callback: centerMap
        }, '-', {
            text: 'Zoom in',
            icon: 'img/zoom-in.png',
            callback: zoomIn
        }, {
            text: 'Zoom out',
            icon: 'img/zoom-out.png',
            callback: zoomOut
        }]
    }).setView([37.8497143321911, 118.767564643314], 13)
    var osmUrl = 'https://api.mapbox.com/styles/v1/keypro/cjjs6cawt25iq2snp6kqxu3r3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V5cHJvIiwiYSI6ImNqamliaTJtbjV0YTMzcG82bmthdW03OHEifQ.UBWsyfRiWMYly4gIc2H7cQ',
        layer = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'

    L.tileLayer(osmUrl, {
        minZoom: 1,
        maxZoom: 17,
        //用了mapbox的图层
        attribution: layer
        //访问令牌
    }).addTo(map);

    //画出初始地图点
    getWellData().then(function (data) {

        variable.basicData = data;
        variable.basicData_1 = data;
        console.log('data: ', data);

        for (let i = 0; i < data.length; i++) {
            variable.index_dict[data[i].id] = i;

        }
        // console.log(variable.index_dict);
        drawPoint.draw(data, 10, false);
        let oriId = variable.basicData[1500].id;
        getChosenData(oriId).then(function (data_ori) {
            variable.chosenData = data_ori;
        })

        // heatView.drawHeat(10);

    })

    d3.json('data/tmp_all.json', function (data) {
        variable.match_value = data;
        // rectView.drawRect("GD1-6-315");
        // console.log(data["GD1-6N15&GD1-6-515"]);
    });

    getWellData_2().then(function (data) {
        variable.basicData_2 = data;
    });

    function drawCircleOut(well_id, latlng, radius) {
        if (variable.reCalB == false && variable.lastPieSvgArr.length > 0) {
            for (let i = 0; i < variable.lastPieSvgArr.length; i++) {
                variable.lastPieSvgArr[i].remove();
            }
            variable.lastPieSvgArr = [];
        }
        let tmpVariance_arr = [];
        let tmpV_dict = variable.variance_dict[well_id];
        let tmp_maxV = [];
        let tmp_minV = [];
        for (let i = 0; i < 5; i++) {
            tmp_maxV.push(Number.MIN_VALUE);
            tmp_minV.push(Number.MAX_VALUE);
        };

        for (key in tmpV_dict) {
            // console.log(tmpV_dict[key]);
            tmpVariance_arr.push({ 'id': key, value: tmpV_dict[key] });
            for (i in tmpV_dict[key]) {
                if (tmp_maxV[i] < tmpV_dict[key][i])
                    tmp_maxV[i] = tmpV_dict[key][i];
                if (tmp_minV[i] > tmpV_dict[key][i])
                    tmp_minV[i] = tmpV_dict[key][i];
            }
        };
        variable.variance_extremeArr.push(tmp_minV);
        variable.variance_extremeArr.push(tmp_maxV);
        //设置各个属性的值的比例尺
        let angleScale_arr = [];
        for (let i = 0; i < 5; i++) {
            let tmp_scale = d3.scaleLinear().domain([tmp_minV[i], tmp_maxV[i]]).range([2 * i * Math.PI / 5 + Math.PI / 24, i * 2 * Math.PI / 5 + Math.PI / 5]);
            angleScale_arr.push(tmp_scale);
        };
        //添加过渡效果
        let ts = d3.transition().duration(1000);
        variable.stdPie_dataArr = tmpVariance_arr;

        var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
            //给svg添加id
            selection.attr("id", "variance_" + well_id);
            let tmp_loc = projection.latLngToLayerPoint(latlng);
            // console.log('tmpVariance_arr: ', tmpVariance_arr);
            for (let w = 0; w < tmpVariance_arr.length; w++) {
                //将pie从里到外的属性保存值variable中

                // console.log('w: ', w);
                let pie = d3.pie().value(d => d);
                let data = pie(tmpVariance_arr[w].value);
                // console.log('tmpVariance_arr[w].value: ', tmpVariance_arr[w].value);

                // console.log('data: ', data);
                for (i in data) {
                    data[i].startAngle = Math.PI / 5 * i * 2;
                    data[i].endAngle = angleScale_arr[i](data[i].value);
                    data[i].duration = 1000;
                }
                let arc = d3.arc()
                    .innerRadius(radius + 10 * w + 10)
                    .outerRadius(radius + 10 * (w + 1) + 10);
                selection.append("g").selectAll("path").data(data).enter()
                    .append("path")
                    .attr("id", function (d, i) {
                        return variable.value_attrs[i] + "_" + w + "_pie";
                    })
                    .attr("transform", 'translate(' + tmp_loc.x + ',' + tmp_loc.y + ')')
                    .transition()
                    .duration(2000)
                    .attrTween("d", function (d, j) {//过度器
                        let i = d3.interpolate(d.startAngle, d.endAngle);
                        return function (t) {
                            d.endAngle = i(t);
                            return arc(d);
                        }
                    })
                    .attr('fill', function (d, i) {
                        // console.log(d);
                        // console.log(variable.attr_color[i])
                        return variable.attr_color[i];
                    }).attr("stroke", "white")
                    .attr("stroke-width", 0.5);


                //初始比较井的pie
                let ard_data = pie([0, 0, 0, 0, 0]);
                ard_data.forEach(function (d, i) {
                    d.startAngle = Math.PI / 5 * i * 2;
                    d.endAngle = Math.PI / 5 * i * 2;
                    d.duration = 1000;
                })
                selection.append("g").selectAll("path").data(ard_data).enter()
                    .append("path")
                    .attr("id", function (d, i) {
                        return variable.value_attrs[i] + '_' + w + "_around_pie";
                    })
                    .attr("transform", 'translate(' + tmp_loc.x + ',' + tmp_loc.y + ')')
                    .transition()
                    .duration(2000)
                    .attrTween("d", function (d, j) {//过度器
                        let i = d3.interpolate(d.startAngle, d.endAngle);
                        return function (t) {
                            d.endAngle = i(t);
                            return arc(d);
                        }
                    })
                    .attr('fill', "gray")
                    .attr("stroke", "white")
                    .attr("stroke-width", 0.5);
            }
        });
        // map.addLayer(d3Overlay);
        //保存本次绘图svg
        d3Overlay.addTo(map);

        let tmp_svg = $("#variance_" + well_id).parent()[0];
        console.log('tmp_svg: ', tmp_svg);
        variable.lastPieSvgArr.push(tmp_svg);
    }

  

   
    function drawCompareCirlce(ard_id, std_id, dish_radius, latlng) {

        variable.lastPieSvgArr[variable.lastPieSvgArr.length - 1].remove();

        let tmpVariance_arr = [];
        let tmpV_dict = variable.variance_dict[ard_id];
        console.log('tmpV_dict: ', tmpV_dict);
        let tmp_maxV = [];
        let tmp_minV = [];
        for (let i = 0; i < 5; i++) {
            tmp_maxV.push(Number.MIN_VALUE);
            tmp_minV.push(Number.MAX_VALUE);
        }
        for (key in tmpV_dict) {
            // console.log(tmpV_dict[key]);
            tmpVariance_arr.push({ 'id': key, value: tmpV_dict[key] });

            for (i in tmpV_dict[key]) {
                if (tmp_maxV[i] < tmpV_dict[key][i])
                    tmp_maxV[i] = tmpV_dict[key][i];
                if (tmp_minV[i] > tmpV_dict[key][i])
                    tmp_minV[i] = tmpV_dict[key][i];
            }
        };
        //比较个属性上的最大值并重新设置各个属性的值的比例尺


        for (let i = 0; i < 5; i++) {
            if (tmp_minV[i] > variable.variance_extremeArr[0][i])
                tmp_minV[i] = variable.variance_extremeArr[0][i];
            if (tmp_maxV[i] < variable.variance_extremeArr[1][i])
                tmp_maxV[i] = variable.variance_extremeArr[1][i];
        }

        let angleScale_arr_std = [];
        let angleScale_arr_ard = [];

        for (let i = 0; i < 5; i++) {
            let tmp_scale_std = d3.scaleLinear().domain([tmp_minV[i], tmp_maxV[i]]).range([2 * i * Math.PI / 5 + Math.PI / 24, i * 2 * Math.PI / 5 + Math.PI / 5]);
            angleScale_arr_std.push(tmp_scale_std);
            let tmp_scale_ard = d3.scaleLinear().domain([tmp_minV[i], tmp_maxV[i]]).range([i * 2 * Math.PI / 5 - Math.PI / 24, 2 * i * Math.PI / 5 - Math.PI / 5]);
            angleScale_arr_ard.push(tmp_scale_ard);
        };
        console.log(' variable.stdPie_dataArr: ', variable.stdPie_dataArr);
        //修改标准井的数据顺序，与当前选中井的方差排列在最外层
        variable.stdPie_dataArr.forEach(d => {

            if (d.id == ard_id) {
                let tmp_std_ard = {};
                let len = variable.stdPie_dataArr.length;
                tmp_std_ard = d;
                d = variable.stdPie_dataArr[len - 1];
                variable.stdPie_dataArr[len - 1] = tmp_std_ard;
            }
        });
        //修改pie                     
        // for (let w = 0; w < variable.stdPie_dataArr.length; w++) {

        //     for (let i = 0; i < 5; i++) {
        //         let arc = d3.arc()
        //             .innerRadius(dish_radius + 10 * w + 10)
        //             .outerRadius(dish_radius + 10 * (w + 1) + 10);

        //         let tmp_pathId = variable.value_attrs[i] + "_" + w + "_pie";
        //         d3.select("#" + tmp_pathId)
        //             .transition()
        //             .duration(2000)
        //             .attrTween("d", function (d, j) {//过度器
        //                 d.endAngle = angleScale_arr_std[i](variable.stdPie_dataArr[w].value[i]);
        //                 let inp = d3.interpolate(d.startAngle, d.endAngle);
        //                 // console.log(d);
        //                 return function (t) {
        //                     d.endAngle = inp(t);
        //                     return arc(d);
        //                 }
        //             })
        //     }
        // }
        //修改当前周围井的数据顺序，与标准井的方差排在最外层
        // console.log('variable.stdPie_dataArr: ', variable.stdPie_dataArr);
        // console.log('tmpVariance_arr: ', tmpVariance_arr);
        tmpVariance_arr.forEach(d => {

            if (d.id == std_id) {
                let tmp_std_ard = {};
                let len = tmpVariance_arr.length;
                tmp_std_ard = d;
                d = tmpVariance_arr[len - 1];
                tmpVariance_arr[len - 1] = tmp_std_ard;
            }
        });
        // for (let w = 0; w < tmpVariance_arr.length; w++) {
        //     for (let i = 0; i < 5; i++) {
        //         let arc = d3.arc()
        //             .innerRadius(dish_radius + 10 * w + 10)
        //             .outerRadius(dish_radius + 10 * (w + 1) + 10);

        //         let tmp_pathId = variable.value_attrs[i] + '_' + w + "_around_pie";
        //         d3.select("#" + tmp_pathId)
        //             .transition()
        //             .duration(2000)
        //             .attrTween("d", function (d, j) {//过度器
        //                 d.endAngle = angleScale_arr_ard[i](tmpVariance_arr[w].value[i]);
        //                 // console.log("d: ",d);
        //                 let inp = d3.interpolate(d.startAngle, d.endAngle);
        //                 return function (t) {
        //                     d.endAngle = inp(t);
        //                     return arc(d);
        //                 }
        //             })
        //     }
        // }

        //添加过渡效果
        let d3Overlay = L.d3SvgOverlay(function (selection, projection) {
            //给svg添加id
            selection.attr("id", "variance_" + ard_id);
            let tmp_loc = projection.latLngToLayerPoint(latlng);

            for (let w = 0; w < variable.stdPie_dataArr.length; w++) {
                // console.log('w: ', w);
                let pie = d3.pie().value(d => d);
                let data = pie(variable.stdPie_dataArr[w].value);
                // console.log('tmpVariance_arr[w].value: ', tmpVariance_arr[w].value);

                // console.log('data: ', data);
                for (i in data) {
                    data[i].startAngle = Math.PI / 5 * i * 2;
                    data[i].endAngle = angleScale_arr_std[i](data[i].value);
                    data[i].duration = 1000;
                }
                let arc = d3.arc()
                    .innerRadius(dish_radius + 10 * w + 10)
                    .outerRadius(dish_radius + 10 * (w + 1) + 10);
                selection.append("g").selectAll("path").data(data).enter()
                    .append("path")
                    .attr("id", function (d, i) {
                        return variable.value_attrs[i] + "_" + w + "_pie";
                    })
                    .attr("transform", 'translate(' + tmp_loc.x + ',' + tmp_loc.y + ')')
                    .transition()
                    .duration(2000)
                    .attrTween("d", function (d, j) {//过度器
                        let i = d3.interpolate(d.startAngle, d.endAngle);
                        return function (t) {
                            d.endAngle = i(t);
                            return arc(d);
                        }
                    })
                    .attr('fill', function (d, i) {
                        // console.log(d);
                        // console.log(variable.attr_color[i])
                        return variable.attr_color[i];
                    }).attr("stroke", "white")
                    .attr("stroke-width", 0.5);


                //初始比较井的pie
                let ard_data = pie(tmpVariance_arr[w].value);

                ard_data.forEach(function (d, i) {
                    d.startAngle = Math.PI / 5 * i * 2;
                    d.endAngle = angleScale_arr_ard[i](tmpVariance_arr[w].value[i]);
                    d.duration = 1000;
                })
                selection.append("g").selectAll("path").data(ard_data).enter()
                    .append("path")
                    .attr("id", function (d, i) {
                        return variable.value_attrs[i] + '_' + w + "_around_pie";
                    })
                    .attr("transform", 'translate(' + tmp_loc.x + ',' + tmp_loc.y + ')')
                    .transition()
                    .duration(2000)
                    .attrTween("d", function (d, j) {//过度器
                        let i = d3.interpolate(d.startAngle, d.endAngle);
                        return function (t) {
                            d.endAngle = i(t);
                            return arc(d);
                        }
                    })
                    .attr('fill', "gray")
                    .attr("stroke", "white")
                    .attr("stroke-width", 0.5);
            }
        });
        d3Overlay.addTo(map);
        let tmp_svg = $("#variance_" + ard_id).parent();

        variable.lastPieSvgArr.push(tmp_svg);
    }


    function getWellData_2() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "get",
                url: "/well_data_2",
                async: false,
                data: {},
                success: function (data) {
                    resolve(data);
                },
                error: function () {

                }
            });
        });
    }


    function getWellData() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "get",
                url: "/well_data",
                async: false,
                data: {},
                success: function (data) {
                    resolve(data);
                },
                error: function () {

                }
            });
        });
    }




    function getChosenData(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "get",
                url: "/id/ChosenId",
                async: false,
                data: {
                    'id': id
                },
                success: function (data) {
                    resolve(data);
                },
                error: function () { }
            });
        });
    }


    return {
        map,
        getWellData,
        getChosenData,
        drawCircleOut,
        drawCompareCirlce,
        getWellData_2,
    }
})()