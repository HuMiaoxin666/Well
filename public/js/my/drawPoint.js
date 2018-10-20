var drawPoint = (function () {

    //画井
    function draw(data, sample_rate) {
        d3.select("#map").selectAll("path").remove();
        let sampleStatus_index = parseInt(sample_rate / 10);
        if (sampleStatus_index != 10) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].latlng.length > 0 && data[i].sample_status[sampleStatus_index] == 1) {


                    data[i].color = "blue";
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
                            if (variable.chosenArr.length == 2) {
                                MatchCal.CalMatrix([variable.chosenArr[0], variable.chosenArr[1]]);
                            }
                        } else {
                            mapView.getChosenData(this.options.data.id).then(function (data) {
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
                    data[i].color = "blue";
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
                            if (variable.chosenArr.length == 2) {
                                MatchCal.CalMatrix([variable.chosenArr[0], variable.chosenArr[1]]);
                            }
                        } else {
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