var drawPoint = (function () {

    //画井
    function draw(data, sample_rate) {
        d3.select("#map").selectAll("path").remove();
        let sampleStatus_index = parseInt(sample_rate / 10);
        //采样率不是100时
        if (sampleStatus_index != 10) {
            for (var i = 0; i < data.length; i++) {
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

                        console.log('$(this): ', $(this));
                        //匹配状态点击
                        if (variable.match == true) {
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                variable.chosenArr.push(data[0]);
                            })
                        }
                        else {
                            //非匹配状态点击
                            if (variable.around_circle.length != 0) {
                                for (let i = 0; i < variable.around_circle.length; i++) {
                                    variable.around_circle[i].remove();
                                }
                            }
                            variable.around_circle = []; //泊松盘内其他点的path DOM
                            let tmp_aroundPt = this.options.data.around_points[sampleStatus_index];
                            let tmp_aroundPt_ids = this.options.data.around_ids[sampleStatus_index];
                            for (let i = 0; i < tmp_aroundPt.length; i++) {
                                let circle_around = L.circle([tmp_aroundPt[i][0], tmp_aroundPt[i][1]], {
                                    id: "around",
                                    radius: 5,
                                    color: "yellow"
                                }).addTo(mapView.map);
                                variable.around_circle.push(circle_around);
                            }
                            
                            for (let ai = 0; ai < tmp_aroundPt_ids.length; ai++) {
                                mapView.getChosenData(tmp_aroundPt_ids[ai]).then(function (data) {
                                    lineChart.drawLineChart(data[0], false);
                                })
                            }
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                console.log('data: ', data);
                                variable.chosenData = data[0];
                                lineChart.drawLineChart(data[0], true);
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