var heatView = (function () {
    function drawHeat(rate) {
        let container = $("#map").find("canvas");
        container.remove();

        let heatData = [];
        let tmp_rateIndex = parseInt(rate / 10) - 1;
        console.log('tmp_rateIndex: ', tmp_rateIndex);
        for (let i = 0; i < variable.basicData.length; i++) {
            if (variable.basicData[i]['sample_status'][tmp_rateIndex] == 1)
                heatData.push([variable.basicData[i].latlng[0], variable.basicData[i].latlng[1], 1]);
        }
        let heat = L.heatLayer(heatData, {
            maxZoom: 17,
            radius: 10
        }).addTo(mapView.map);
    }
    return {
        drawHeat
    }
})()