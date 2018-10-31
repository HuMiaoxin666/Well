var drawPoint = (function () {

    //画井
    function draw(data, sample_rate) {
        d3.select("#map").selectAll("path").remove();
        let sampleStatus_index = parseInt(sample_rate / 10);
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
                    circle.on("click", function () {
                        console.log('$(this): ', $(this));
                        if (variable.match == true) {
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                variable.chosenArr.push(data[0]);
                            })
                        } else {
                            if (variable.around_circle.length != 0) {
                                for (let i = 0; i < variable.around_circle.length; i++) {
                                    variable.around_circle[i].remove();
                                }
                            }
                            variable.around_circle = [];
                            let tmp_aroundPt = this.options.data.around_points[sampleStatus_index];
                            for (let i = 0; i < tmp_aroundPt.length; i++) {
                                let circle_around = L.circle([tmp_aroundPt[i][0], tmp_aroundPt[i][1]], {
                                    id: "around",
                                    radius: 5,
                                    color: "yellow"
                                }).addTo(mapView.map);
                                variable.around_circle.push(circle_around);
                            }
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                console.log('data: ', data);
                                variable.chosenData = data[0];
                                variable.chosenArr.push(data[0]);
                                lineChart.drawLineChart(data[0]);
                            })
                        }
                    })
                }
            }
        } else {
            for (var i = 0; i < data.length; i++) {
                if (data[i].latlng.length > 0) {
                    data[i].color = "#7483FF";
                    var circle = L.circle([data[i].latlng[0], data[i].latlng[1]], {
                        radius: 5,
                        data: data[i],
                        color: data[i].color
                    }).addTo(mapView.map);
                    circle.on("click", function () {
                        if (variable.match == true) {
                            mapView.getChosenData(this.options.data.id).then(function (data) {
                                variable.chosenArr.push(data[0]);
                            })
                            // if (variable.chosenArr.length == 2) {
                            //     MatchCal.CalMatchValue([variable.chosenArr[0], variable.chosenArr[1]]);
                            // }
                        } else {
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