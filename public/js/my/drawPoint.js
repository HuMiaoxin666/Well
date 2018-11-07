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
                    //添加点击事件
                    circle.on("click", function () {
                        mapView.svg_lineChart.selectAll("*").remove();
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
                            let tmp_aroundPt = this.options.data.around_points[sampleStatus_index];
                            let tmp_aroundPt_ids = this.options.data.around_ids[sampleStatus_index];
                            let tmp_id_index = tmp_aroundPt_ids.indexOf(this.options.data.id);
                            tmp_aroundPt_ids.splice(tmp_id_index, 1);
                            tmp_aroundPt.splice(tmp_id_index, 1);

                            for (let j = 0; j < tmp_aroundPt.length; j++) {
                                if (tmp_aroundPt_ids[j] in variable.index_dict) {
                                    let tmp_status = variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]].sample_status[sampleStatus_index];
                                    // console.log('tmp_status: ', tmp_status);
                                    if (tmp_status == 2 || tmp_status == 'p') {
                                        let tmp_color = '#F31600';
                                        if(tmp_status == 'p')
                                            tmp_color = '#00FF1F';
                                        let circle_around = L.circle([tmp_aroundPt[j][0], tmp_aroundPt[j][1]], {
                                            id: tmp_aroundPt_ids[j],
                                            radius: 5,
                                            data: variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]],
                                            color: tmp_color
                                        }).addTo(mapView.map);
                                        circle_around.on("click", function () {
                                            let tmp_id = this.options.data.id;
                                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                                console.log('data: ', data);
                                                variable.before_id = tmp_id;
                                                lineChart.drawLineChart(data[0], 2);
                                            })
                                        })
                                        variable.around_circle.push(circle_around);
                                    } else {
                                        let circle_around = L.circle([tmp_aroundPt[j][0], tmp_aroundPt[j][1]], {
                                            id: "around",
                                            radius: 5,
                                            data: variable.basicData[variable.index_dict[tmp_aroundPt_ids[j]]],
                                            color: "#787878"
                                        }).addTo(mapView.map);
                                        circle_around.on("click", function () {
                                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                                console.log('data: ', data);
                                                lineChart.drawLineChart(data[0], 2);
                                            })
                                        })
                                        variable.around_circle.push(circle_around);
                                    }
                                }
                            }

                            for (let ai = 0; ai < tmp_aroundPt_ids.length; ai++) {
                                mapView.getChosenData(tmp_aroundPt_ids[ai]).then(function (data) {
                                    // console.log('tmp_aroundPt_ids[ai]: ', tmp_aroundPt_ids[ai]);
                                    // console.log('data: ', data);
                                    lineChart.drawLineChart(data[0], 0);
                                })
                            }
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                // console.log('data: ', data);
                                variable.chosenData = data[0];
                                lineChart.drawLineChart(data[0], 1);
                            })
                        }
                    })
                }
            }
        } else {
            //采样率为100时
            for (var i = 0; i < data.length; i++) {
                if (data[i].latlng.length > 0) {
                    data[i].color = "#7483FF";
                    var circle = L.circle([data[i].latlng[0], data[i].latlng[1]], {
                        radius: 5,
                        data: data[i],
                        color: data[i].color
                    }).addTo(mapView.map);
                    circle.on("click", function () {
                        //匹配状态
                        if (variable.match == true) {
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                variable.chosenArr.push(data[0]);
                            })
                            // if (variable.chosenArr.length == 2) {
                            //     MatchCal.CalMatchValue([variable.chosenArr[0], variable.chosenArr[1]]);
                            // }
                        } else {
                            //非匹配状态
                            let tmp_aroundPt = option.getAroundPoints(this.options.data.id, sampleStatus_index);
                            console.log('tmp_aroundPt: ', tmp_aroundPt);
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                variable.chosenData = data[0];
                                variable.chosenArr.push(data[0]);
                                lineChart.drawLineChart(this.options.data);
                            })
                        }
                    })
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
    return {
        draw: draw
    }
})()