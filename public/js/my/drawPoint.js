var drawPoint = (function () {

    //画井
    function draw(data, sample_rate) {
        d3.select("#map").selectAll("path").remove();
        let sampleStatus_index = parseInt(sample_rate / 10);
        //采样率不是100时
        if (sampleStatus_index != 10) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].latlng.length > 0 && data[i].sample_status[sampleStatus_index] == 1) {
                    data[i].color = "#7483FF";
                    let circle = L.circle([data[i].latlng[0], data[i].latlng[1]], {
                        text: data[i].id,
                        id: data[i].id,
                        radius: 5,
                        data: data[i],
                        color: data[i].color
                    }).addTo(mapView.map);
                    variable.circle_arr.push(circle);

                    //*******************添加点击事件******************

                    circle.on("click", function () {
                        variable.chosenId = this.options.data.id;
                        variable.around_wellData = [];
                        lineChart.svg_lineChart.selectAll("*").remove();
                        console.log(this.options.data);

                        // console.log('$(this): ', $(this));
                        //匹配状态点击
                        if (variable.match == true) {
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                variable.chosenArr.push(data[0]);
                            })
                        }
                        else {
                            //非匹配状态点击
                            if (variable.around_circle.length != 0) {
                                for (let j = 0; j < variable.around_circle.length; j++) {
                                    variable.around_circle[j].remove();
                                }
                            }
                            variable.around_circle = []; //泊松盘内其他点的path DOM
                            let tmp_aroundPt = this.options.data.around_points[sampleStatus_index];//当前盘内其他点的坐标
                            let tmp_aroundPt_ids = MatchCal.deepCopy(this.options.data.around_ids[sampleStatus_index]);//当前盘内其他点的ID
                            let tmp_id_index = tmp_aroundPt_ids.indexOf(this.options.data.id);//
                            if (tmp_id_index) {
                                tmp_aroundPt_ids.splice(tmp_id_index, 1);
                                tmp_aroundPt.splice(tmp_id_index, 1);
                            }
                            console.log(tmp_aroundPt_ids.length);
                            //画出周围井在地图上的点
                            for (let j = 0; j < tmp_aroundPt.length; j++) {
                                if (tmp_aroundPt_ids[j] in variable.index_dict) {
                                    let tmp_status = variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]].sample_status[sampleStatus_index];
                                    let tmp_vStatus = variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]].tmp_vSample;
                                    let tmp_pStatus = variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]].tmp_pSample;
                                    let tmp_vDishId = variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]].tmp_vDishId;
                                    let tmp_pDishId = variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]].tmp_pDishId;

                                    let tmp_aroundColor = "#B5B5B5";
                                    if (tmp_vStatus == 1 && tmp_vDishId.indexOf(this.options.data.id) != -1) {
                                        tmp_aroundColor = '#F3A700'
                                    }
                                    if (tmp_pStatus == 1 && tmp_pDishId.indexOf(this.options.data.id) != -1) {
                                        tmp_aroundColor = '#00FF1F';
                                    }
                                    // console.log('tmp_status: ', tmp_status);
                                    let circle_around = L.circle([tmp_aroundPt[j][0], tmp_aroundPt[j][1]], {
                                        id: tmp_aroundPt_ids[j],
                                        radius: 5,
                                        vSample: tmp_vStatus,
                                        pSample: tmp_pStatus,
                                        data: variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]],
                                        color: tmp_aroundColor
                                    }).addTo(mapView.map);
                                    circle_around.on("click", function () {
                                        console.log("this.options.data: ", this.options.data);
                                        console.log("id: ", this.options.id);
                                        let tmp_aroundId = this.options.data.id;
                                        let tmp_sum = 0;

                                        if (variable.variance_dict[tmp_aroundId]) {
                                            for (key in variable.variance_dict[tmp_aroundId]) {
                                                for (let r = 0; r < variable.variance_dict[tmp_aroundId][key].length; r++) {
                                                    tmp_sum += 0.2 * variable.variance_dict[tmp_aroundId][key][r];
                                                }
                                            }
                                        }
                                        console.log('tmp_sum: ', tmp_sum);
                                        let tmp_vSample = this.options.vSample;
                                        let tmp_pSample = this.options.pSample;
                                        let tmp_color = this.options.color;
                                        if (variable.last_line == '') {
                                            variable.last_line = this.options.id;
                                        } else {
                                            for (let a = 0; a < variable.value_attrs.length; a++)
                                                d3.select("#" + variable.value_attrs[a] + "_" + variable.last_line).attr("stroke", "#B5B5B5").attr("opacity", 0.3).attr("stroke-width", 0.5);
                                            variable.last_line = this.options.id;
                                        }
                                        for (let a = 0; a < variable.value_attrs.length; a++) {
                                            d3.select("#" + variable.value_attrs[a] + "_" + this.options.id).attr("stroke", "red").attr("opacity", 1.0).attr("stroke-width", 1);
                                        }
                                        // mapView.getChosenData(this.options.data.id).then(function (data) {
                                        //     console.log('data: ', data);
                                        //     console.log('tmp_vStatus: ', tmp_vSample);
                                        //     console.log('tmp_pStatus: ', tmp_pSample);
                                        //     lineChart.drawLineChart(data[0], tmp_status, tmp_color);
                                        // })
                                    })
                                    variable.around_circle.push(circle_around);
                                }
                            }
                            //画出周围点的曲线
                            for (let ai = 0; ai < tmp_aroundPt_ids.length; ai++) {
                                mapView.getChosenData(tmp_aroundPt_ids[ai]).then(function (data) {
                                    // console.log('data: ', data);
                                    variable.around_wellData.push(data[0]);
                                    lineChart.drawLineChart(data[0], 0);
                                })
                            }
                            //画出当前采样点的曲线
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                console.log('data: ', data);
                                variable.around_wellData.push(data[0]);
                                variable.chosenData = data[0];
                                lineChart.drawLineChart(data[0], 1);
                                rectView.drawRect(data[0].id);
                            })
                            tmp_aroundPt_ids.push(this.options.data.id);
                            variable.aroundPt_ids = tmp_aroundPt_ids;
                        }//else判断是否匹配状态结束
                    })//点击事件结束
                }
            }
        }



        // var map = mapView.map;
        // var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
        //     console.log('selection: ', selection);
        //     var updateSelection = selection.selectAll('circle').data(data);
        //     updateSelection.enter()
        //         .append('circle')
        //         .attr("r",2)
        //         .attr("cx", function (d) {
        //             return projection.latLngToLayerPoint(d.latLng).x;
        //         })
        //         .attr("cy", function (d) {
        //             return projection.latLngToLayerPoint(d.latLng).y
        //         })
        //         .attr("fill", function (d) {
        //             return d.color;
        //         });

        // });
        // d3Overlay.addTo(mapView.map);


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

                        for (let r = 2; r <= 6; r++) {
                            if (l >= min_well.value.length) {
                                variable.variance_dict[max_well.id][min_well.id][r - 2] += Math.pow(max_well.value[l][r] - 0, 2);
                                variable.variance_dict[min_well.id][max_well.id][r - 2] += Math.pow(max_well.value[l][r] - 0, 2);
                            } else {
                                variable.variance_dict[max_well.id][min_well.id][r - 2] += Math.pow(max_well.value[l][r] - min_well.value[l][r], 2);
                                variable.variance_dict[min_well.id][max_well.id][r - 2] += Math.pow(max_well.value[l][r] - min_well.value[l][r], 2);
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

    function count() {
        let tmp_rateIndex = parseInt(variable.rate / 10);
        for (let w = 0; w < variable.basicData.length; w++) {
            if (variable.basicData[w].sample_status[tmp_rateIndex] == 1) {
                let tmp_chosenId = variable.basicData[w].id;
                let tmp_aroundPt_ids = MatchCal.deepCopy(variable.basicData[w].around_ids[tmp_rateIndex]);
                tmp_aroundPt_ids.push(tmp_chosenId);
                variable.around_wellData = [];
                let tmp_vId, tmp_pId;

                for (let i = 0; i < tmp_aroundPt_ids.length; i++) {
                    $.ajax({
                        type: "get",
                        url: "/id/ChosenId",
                        async: false,
                        data: {
                            'id': tmp_aroundPt_ids[i]
                        },
                        success: function (WellData) {
                            if (WellData.length > 0)
                                variable.around_wellData.push(WellData[0]);
                        },
                        error: function () { }
                    });
                    //
                    if (variable.basicData[variable.index_dict[tmp_aroundPt_ids[i]]].tmp_pSample == 1)
                        tmp_pId = tmp_aroundPt_ids[i];
                    if (variable.basicData[variable.index_dict[tmp_aroundPt_ids[i]]].tmp_vSample == 1)
                        tmp_vId = tmp_aroundPt_ids[i];
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
                console.log(variable.around_wellData.length);

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

                                for (let r = 0; r < variable.importance_arr.length; r++) {
                                    if (l >= min_well.value.length) {
                                        variable.variance_dict[max_well.id][min_well.id][r] += Math.pow(max_well.value[l][r + 1] - 0, 2);
                                        variable.variance_dict[min_well.id][max_well.id][r] += Math.pow(max_well.value[l][r + 1] - 0, 2);
                                    } else {
                                        variable.variance_dict[max_well.id][min_well.id][r] += Math.pow(max_well.value[l][r + 1] - min_well.value[l][r + 1], 2);
                                        variable.variance_dict[min_well.id][max_well.id][r] += Math.pow(max_well.value[l][r + 1] - min_well.value[l][r + 1], 2);
                                    }
                                }
                            }
                            for (let r = 0; r < 5; r++) {
                                variable.variance_dict[max_well.id][min_well.id][r] = variable.variance_dict[max_well.id][min_well.id][r] / max_len;
                                variable.variance_dict[min_well.id][max_well.id][r] = variable.variance_dict[min_well.id][max_well.id][r] / max_len;
                            }
                        }
                    }
                }
                //for循环计算结束
                let tmp_sum_v = 0;
                let tmp_sum_p = 0;
                let tmp_sum_r = 0;
                let min_variance = 10000000;
                for (let id = 0; id < tmp_aroundPt_ids.length; id++) {
                    let tmp_variance_sum = 0;
                    if (variable.variance_dict[tmp_aroundPt_ids[id]]) {
                        for (key in variable.variance_dict[tmp_aroundPt_ids[id]]) {
                            for (let r = 0; r < variable.variance_dict[tmp_aroundPt_ids[id]][key].length; r++) {
                                // console.log(r);
                                // console.log(variable.importance_arr[r]);
                                tmp_variance_sum += variable.importance_arr[r] * variable.variance_dict[tmp_aroundPt_ids[id]][key][r];
                            }
                        }
                    }
                    if (min_variance > tmp_variance_sum)
                        min_variance = tmp_variance_sum;
                }
                if (variable.variance_dict[tmp_vId]) {
                    for (key in variable.variance_dict[tmp_vId]) {
                        for (let r = 0; r < variable.variance_dict[tmp_vId][key].length; r++) {
                            // console.log(r);
                            // console.log(variable.importance_arr[r]);
                            tmp_sum_v += variable.importance_arr[r] * variable.variance_dict[tmp_vId][key][r];
                        }
                    }
                }
                if (variable.variance_dict[tmp_chosenId]) {
                    for (key in variable.variance_dict[tmp_chosenId]) {
                        for (let r = 0; r < variable.variance_dict[tmp_chosenId][key].length; r++) {
                            // console.log(r);
                            // console.log(variable.importance_arr[r]);
                            tmp_sum_r += variable.importance_arr[r] * variable.variance_dict[tmp_chosenId][key][r];
                        }
                    }
                }
                if (variable.variance_dict[tmp_pId]) {
                    for (key in variable.variance_dict[tmp_pId]) {
                        for (let r = 0; r < variable.variance_dict[tmp_pId][key].length; r++) {
                            tmp_sum_p += variable.importance_arr[r] * variable.variance_dict[tmp_pId][key][r];
                        }
                    }
                }

                if (min_variance == tmp_sum_p)
                    variable.p_min += 1;
                else if (min_variance == tmp_sum_v)
                    variable.v_min += 1;
                else if (tmp_sum_r == min_variance)
                    variable.r_min += 1;


                if (tmp_sum_p > tmp_sum_v)
                    variable.v_min_p += 1;
                else if (tmp_sum_p < tmp_sum_v)
                    variable.p_min_v += 1;
                if (tmp_pId == tmp_vId && tmp_pId == tmp_chosenId)
                    variable.v_p_r += 1;
                else if (tmp_pId == tmp_vId && tmp_pId != tmp_chosenId)
                    variable.v_p += 1;
                else if (tmp_pId != tmp_vId && tmp_pId == tmp_chosenId)
                    variable.r_p += 1;
                else if (tmp_pId != tmp_vId && tmp_vId == tmp_chosenId)
                    variable.v_r += 1;
            }
        }
        console.log('variable.v_min_p: ', variable.v_min_p);
        console.log('variable.p_min_v: ', variable.p_min_v);
        console.log('variable.v_min: ', variable.v_min);
        console.log('variable.r_min: ', variable.r_min);
        console.log('variable.p_min: ', variable.p_min);
        console.log('variable.v_p_r: ', variable.v_p_r);
        console.log('variable.r_p: ', variable.r_p);
        console.log('variable.v_p: ', variable.v_p);
        console.log('variable.v_r: ', variable.v_r);

    }
    return {
        draw,
        calVariance,
        count
    }
})()