var drawPoint = (function () {

    //画井
    function draw(data) {
        d3.select("#map").selectAll("path").remove();

        for (var i = 0; i < data.length; i++) {

            data[i].color = "blue";
            if (data[i].latlng.length > 0) {
                var circle = L.circle([data[i].latlng[0], data[i].latlng[1]], {
                    radius: 5,
                    data:data[i],
                    color: data[i].color
                }).addTo(mapView.map);
                circle.on("click", function () {
                    lineChart.drawLineChart(this.options.data);
                })
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