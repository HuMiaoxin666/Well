var drawPoint = (function () {

    //画井
    function drawP(data, sample_rate, IsV) {
        d3.select("#map").selectAll("path").remove();
        let sampleStatus_index = parseInt(sample_rate / 10) - 1;
        let tmp_count = 0;//当前标准井数量
        //采样率不是100时
        for (let i = 0; i < data.length; i++) {
            // console.log('data[i].vSample_status[sampleStatus_index]: ', data[i].vSample_status[sampleStatus_index]);
            if (data[i].latlng.length > 0 && data[i].sample_status[sampleStatus_index] == 1 && IsV == false) {
                darw(data[i], data[i], data[i]);
                tmp_count += 1;
            }
            //*******v最大值的井*******/
            else if (data[i].latlng.length > 0 && data[i].vSample_status[sampleStatus_index] == 1 && IsV == true) {
                let tmp_dish_data = variable.basicData[variable.index_dict[data[i]['dish_id'][sampleStatus_index]]];
                let dish_data_1 = variable.basicData_1[variable.index_dict[data[i]['dish_id'][sampleStatus_index]]];
                darw(tmp_dish_data, data[i], dish_data_1);
                tmp_count += 1;
            }
            function darw(dish_data, tmp_data, dish_data_1) {
                tmp_data.color = "#7483FF";
                for (let m = 0; m < 2; m++) {
                    // if (dish_data['around_ids'][sampleStatus_index].indexOf(variable.myStd_well[m]) != -1)
                    //     tmp_data.color = 'red';

                    // if (tmp_data.id == 'GD1-7-42')
                    //     tmp_data.color = 'red';
                }

                //画出当前盘的边界点
                let tmp_radius = 10;
                if (dish_data.r_loc[sampleStatus_index].length != 0) {
                    tmp_radius = mapView.map.distance(dish_data['latlng'], dish_data.r_loc[sampleStatus_index]);
                    // console.log('tmp_radius: ', tmp_radius);
                }
                let circle_r = L.circle([dish_data.latlng[0], dish_data.latlng[1]], {
                    text: tmp_data.id,
                    id: tmp_data.id,
                    radius: tmp_radius,
                    data: tmp_data,
                    color: "red",
                    latlng: dish_data.latlng,
                    fillColor: "none",
                    weight: 1,
                    opacity: 0,
                    className: tmp_data.id + "_radius"
                }).addTo(mapView.map);
                variable.radius_circle[tmp_data.id] = circle_r;

                //获取当前盘内的所有井
                let tmp_dishLocs = dish_data.around_points[sampleStatus_index];//当前盘内其他点的坐标
                tmp_dishLocs.push(dish_data.latlng)
                let tmp_dishIds = MatchCal.deepCopy(dish_data.around_ids[sampleStatus_index]);//当前盘内其他点的ID
                tmp_dishIds.push(dish_data.id);

                let circle = L.circle([tmp_data.latlng[0], tmp_data.latlng[1]], {
                    text: tmp_data.id,
                    latlng: tmp_data.latlng,
                    id: tmp_data.id,
                    dish_loc: dish_data.latlng,
                    radius: 5,
                    dish_radius: tmp_radius,
                    data: tmp_data,
                    color: tmp_data.color,
                    dish_wellLocs: tmp_dishLocs,
                    dish_wellIds: tmp_dishIds
                }).addTo(mapView.map);
                variable.circle_arr.push(circle);

                //*******************添加点击事件******************
                circle.on("click", function () {
                    //修改信息展示出的井ID
                    $("#well_id").val(this.options.id);
                    //清空around_wellData
                    variable.around_wellData = [];
                    //初始化点击状态
                    variable.around_click = 0;

                    console.log(this.options.data);
                    variable.radius_circle[this.options.id].setStyle({
                        opacity: 1.0,
                    })
                    variable.chosenId = this.options.data.id;

                    lineChart.svg_lineChart.selectAll("*").remove();
                    console.log(this.options.data);

                    //匹配状态点击

                    //非匹配状态点击
                    if (variable.reCalB == true) {
                    } else {
                        //清空上个盘内其他点
                        for (let j = 0; j < variable.around_circle.length; j++) {
                            variable.around_circle[j].remove();
                        }
                        for (let j = 0; j < variable.dish_idArr.length; j++) {
                            variable.radius_circle[variable.dish_idArr[j]].setStyle({
                                opacity: 0,
                            })
                        }
                        variable.around_circle = []; //泊松盘内其他点的path DOM
                    }
                    //将当前点加入dish_id
                    variable.dish_idArr.push(this.options.id);
                    //获取当前盘内的所有井
                    let tmp_aroundPt = MatchCal.deepCopy(this.options.dish_wellLocs);//当前盘内所有点的坐标
                    let tmp_aroundPt_ids = MatchCal.deepCopy(this.options.dish_wellIds);//当前盘内所有点的ID
                    //修改信息展示出的盘内井数
                    $("#IndishWell_count").val(tmp_aroundPt_ids.length);
                    console.log('tmp_aroundPt_ids: ', tmp_aroundPt_ids);
                    let tmp_id_index = tmp_aroundPt_ids.indexOf(this.options.data.id);//
                    console.log('tmp_id_index: ', tmp_id_index);
                    //若井id存在，则通过转换删除
                    let tranform = [];
                    for (let w = 0; w < tmp_aroundPt_ids.length; w++) {
                        if (w != tmp_id_index)
                            tranform.push(tmp_aroundPt_ids[w]);
                    }
                    tmp_aroundPt_ids = tranform;
                    console.log(tmp_aroundPt_ids.length);
                    console.log('tmp_aroundPt_ids: ', tmp_aroundPt_ids);

                    tranform = [];
                    for (let w = 0; w < tmp_aroundPt.length; w++) {
                        if (w != tmp_id_index)
                            tranform.push(tmp_aroundPt[w]);
                    }
                    tmp_aroundPt = tranform;
                    console.log(tmp_aroundPt.length);
                    console.log('tmp_aroundPt_ids: ', tmp_aroundPt);

                    //********画出周围井在地图上的点********
                    let thisId = this.options.id;
                    let thisLoc = this.options.dish_loc;
                    for (let j = 0; j < tmp_aroundPt.length; j++) {
                        if (tmp_aroundPt_ids[j] in variable.index_dict) {
                            let tmp_aroundColor = "#B5B5B5";
                            let tmp_data = variable.basicData_1[variable.index_dict[tmp_aroundPt_ids[j]]];
                            console.log(' v_std', dish_data_1['v_std'][sampleStatus_index]);
                            if (variable.test > 0 && dish_data_1['v_std'][sampleStatus_index] == tmp_aroundPt_ids[j]) {

                                tmp_aroundColor = '#FFBD00';
                                console.log('1');
                            }
                            let tmp_opacity = 1.0
                            // if (variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]]['vSample_status'][0] == 1)
                            //     tmp_aroundColor = 'blue';
                            if (tmp_aroundPt_ids[j] == 'GD1-11-5')
                                tmp_opacity = 0;
                            let circle_around = L.circle([tmp_aroundPt[j][0], tmp_aroundPt[j][1]], {
                                id: tmp_aroundPt_ids[j],
                                radius: 5,
                                dish_id: thisId,
                                dish_loc: thisLoc,
                                dish_radius: tmp_radius,
                                data: variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]],
                                color: tmp_aroundColor,
                                opacity: tmp_opacity
                            }).addTo(mapView.map);

                            //*********周围井的点击设置**********

                            circle_around.on("click", function () {
                                variable.around_click += 1;
                                console.log("this.options.data: ", this.options.data);
                                console.log("id: ", this.options.id);

                                //将井作为备选井
                                variable.wait_circle = this;

                                if (variable.last_ArId == '') {
                                    variable.last_ArId = this.options.id;
                                } else {
                                    for (let a = 0; a < variable.value_attrs.length; a++)
                                        d3.select("#" + variable.value_attrs[a] + "_" + variable.last_ArId).attr("stroke", "#B5B5B5").attr("opacity", 0.3).attr("stroke-width", 0.5);
                                    //更新变量值
                                    variable.last_ArId = this.options.id;
                                }
                                for (let a = 0; a < variable.value_attrs.length; a++) {
                                    d3.select("#" + variable.value_attrs[a] + "_" + this.options.id).attr("stroke", "#A4A6A4").attr("opacity", 1.0).attr("stroke-width", 1);
                                }

                                //高亮当前周围井的匹配值矩阵图的样式
                                //改变坐标
                                let x_arr = [], y_arr = [];
                                for (let i = 0; i < 1; i++) {
                                    for (let j = 0; j < 5; j++) {
                                        let tmpRect_id_1 = variable.matchValueSort_arr[j][i] + '_' + this.options.id + '_' + variable.value_attrs[j];
                                        let tmpRect_id_2 = this.options.id + '_' + variable.matchValueSort_arr[j][i] + '_' + variable.value_attrs[j];

                                        let rt = $("#" + tmpRect_id_1)[0].attributes;
                                        let lb = $("#" + tmpRect_id_2)[0].attributes;
                                        x_arr = [lb.x.value, rt.x.value];
                                        y_arr = [lb.y.value, rt.y.value];
                                        d3.selectAll("#ard_row_" + j).transition().duration(2000)
                                            .attr('stroke', 'gray')
                                            .attr('x', function (d) { d.x = x_arr[0]; return d.x; })
                                            .attr('y', function (d) { d.y = y_arr[0]; return d.y; });
                                        d3.selectAll("#ard_col_" + j).transition().duration(2000)
                                            .attr('stroke', 'gray')
                                            .attr('x', function (d) { d.x = x_arr[1]; return d.x; })
                                            .attr('y', function (d) { d.y = y_arr[1]; return d.y; })
                                    }
                                }

                                //计算当前井的方差之和
                                let tmp_dict = variable.variance_dict[this.options.data.id];
                                let tmp_variance_arr = [0, 0, 0, 0, 0];

                                for (key in tmp_dict) {
                                    for (let a = 0; a < tmp_dict[key].length; a++) {
                                        tmp_variance_arr[a] += tmp_dict[key][a];
                                    }
                                }
                                histogram.drawAroundHist(tmp_variance_arr);
                                mapView.drawCompareCirlce(this.options.data.id, this.options.dish_id, this.options.dish_radius, this.options.dish_loc);
                            })
                            variable.around_circle.push(circle_around);
                        }
                    }
                    //画出周围点的曲线
                    $.ajax({
                        type: "get",
                        url: "/id/ChosenId",
                        async: false,
                        data: {
                            'id': this.options.data.id
                        },
                        success: function (std_well) {
                            variable.around_wellData.push(std_well[0]);
                            variable.variance_dict[std_well[0].id] = {};
                            for (let ai = 0; ai < tmp_aroundPt_ids.length; ai++) {
                                $.ajax({
                                    type: "get",
                                    url: "/id/ChosenId",
                                    async: false,
                                    data: {
                                        'id': tmp_aroundPt_ids[ai]
                                    },
                                    success: function (data) {
                                        variable.around_wellData.push(data[0]);
                                        lineChart.drawLineChart(data[0], 0);
                                    },
                                    error: function () { }
                                });
                            }
                        },
                        error: function () { }
                    });

                    tmp_aroundPt_ids.push(this.options.data.id);
                    console.log('options.data.id: ', this.options.data.id);
                    //将当前盘内的井id传入变量函数中
                    variable.aroundPt_ids = tmp_aroundPt_ids;
                    //计算当前盘内的方差字典
                    calVariance();
                    //计算当前井的方差之和
                    let tmp_dict = variable.variance_dict[this.options.data.id];
                    let tmp_variance_arr = [0, 0, 0, 0, 0];


                    for (key in tmp_dict) {
                        for (let i = 0; i < tmp_dict[key].length; i++) {
                            tmp_variance_arr[i] += tmp_dict[key][i];
                        }
                    }

                    histogram.drawHistogram(tmp_variance_arr);
                    mapView.drawCircleOut(this.options.data.id, this.options.dish_loc, this.options.dish_radius);
                    //画出当前采样点的曲线
                    mapView.getChosenData(this.options.data.id).then(function (data) {
                        // console.log('data: ', data);
                        variable.chosenData = data[0];
                        //画出当前标准井的原始数据曲线
                        lineChart.drawLineChart(data[0], 1);
                        //画出每口井之间各属性的匹配值
                        rectView.drawRect(tmp_aroundPt_ids, data[0].id);

                        //画出标准井的匹配值矩形区域，并提前画好周围井的线

                    });
                })//点击事件结束
            }

        }

        //修改infor窗口显示
        $('#dish_count').val(tmp_count);







    }

    function drawRadius(data) {

        if (variable.radius_circle.length != 0) {
            for (let j = 0; j < variable.radius_circle.length; j++) {
                variable.radius_circle[j].remove();
            }
        }
        variable.radius_circle[j] = [];
        let tmp_radius = 10;
        if (data.r_loc[sampleStatus_index].length != 0)
            tmp_radius = mapView.map.distance(data.latlng, data.r_loc[sampleStatus_index]);
        console.log('tmp_radius: ', tmp_radius);
        let circle_r = L.circle([data.latlng[0], data.latlng[1]], {
            text: data.id,
            id: data.id,
            radius: tmp_radius,
            data: data,
            color: "red",
            fillColor: "none",
            weight: 1,
            opacity: 1.0,
            className: data.id + "_radius"
        }).addTo(mapView.map);
        variable.radius_circle.push(circle_r);
    }

    function calVariance() {
        //计算方差
        let tmp_aroundPt_ids = variable.aroundPt_ids;
        console.log('tmp_aroundPt_ids: ', tmp_aroundPt_ids);

        console.log('variable.around_wellData: ', variable.around_wellData);


        for (let i = 0; i < tmp_aroundPt_ids.length; i++) {
            variable.variance_dict[tmp_aroundPt_ids[i]] = {};
            for (let j = 0; j < tmp_aroundPt_ids.length; j++) {
                if (i != j) {
                    variable.variance_dict[tmp_aroundPt_ids[i]][tmp_aroundPt_ids[j]] = [];
                    for (let r = 0; r < 5; r++) {
                        variable.variance_dict[tmp_aroundPt_ids[i]][tmp_aroundPt_ids[j]].push(0);
                    }
                }
            }
        }

        console.log('variable.around_wellData.length: ', variable.around_wellData[0]);
        for (let i = 0; i < variable.around_wellData.length; i++) {
            for (let j = 0; j < variable.around_wellData.length; j++) {
                if (i != j) {
                    let len_1 = variable.around_wellData[i].value.length;
                    let len_2 = variable.around_wellData[j].value.length;
                    let max_well = '';
                    let min_well = '';
                    let max_len = d3.max([len_1, len_2]);
                    if (len_1 > len_2) {
                        max_well = variable.around_wellData[i];
                        min_well = variable.around_wellData[j];
                    }
                    else {
                        max_well = variable.around_wellData[j];
                        min_well = variable.around_wellData[i];
                    }

                    //开始计算方差
                    for (let l = 0; l < max_len; l++) {

                        for (let r = 1; r < 6; r++) {
                            if (l >= min_well.value.length) {
                                variable.variance_dict[max_well.id][min_well.id][r - 1] += Math.pow(max_well.value[l][r] - 0, 2);
                                variable.variance_dict[min_well.id][max_well.id][r - 1] += Math.pow(max_well.value[l][r] - 0, 2);
                            } else {
                                variable.variance_dict[max_well.id][min_well.id][r - 1] += Math.pow(max_well.value[l][r] - min_well.value[l][r], 2);
                                variable.variance_dict[min_well.id][max_well.id][r - 1] += Math.pow(max_well.value[l][r] - min_well.value[l][r], 2);
                            }
                        }
                    }
                    for (let r = 0; r < 5; r++) {
                        variable.variance_dict[max_well.id][min_well.id][r] = variable.variance_dict[max_well.id][min_well.id][r] / max_len;
                        variable.variance_dict[min_well.id][max_well.id][r] = variable.variance_dict[min_well.id][max_well.id][r] / max_len;
                    }

                }
            }
        }//for循环计算结束
        console.log("variance: ", variable.variance_dict);

    }

    return {
        drawP,
        calVariance,
    }
})()