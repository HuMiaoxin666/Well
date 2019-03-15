var AttrValue = (function () {

    let svg_attrValue = d3.select('#attr_value');

    //添加文字
    let tmp_value = MatchCal.deepCopy(variable.importance_arr);
    for (let i = 0; i < tmp_value.length; i++) {
        tmp_value[i] = parseFloat((tmp_value[i] * 10000).toFixed(2));

    }
    console.log('tmp_value: ', tmp_value);
    svg_attrValue.append('a').selectAll('text').data(variable.value_attrs).enter()
        .append('text')
        .attr('x', 10)
        .attr('y', function (d, i) {
            return i * 20 + 40;
        }).text(function (d) { return d + ' : '; })
        .style('fill', '#AAAAAA')
        .style('font-size', '0.9em');
    //添加系数值
    svg_attrValue.append('a').selectAll('text').data(tmp_value).enter()
        .append('text')
        .attr('x', function (d, i) {
            return 10 + variable.value_attrs[i].length * 14;
        })
        .attr('y', function (d, i) {
            return i * 20 + 40;
        }).text('')
        .style('fill', '#AAAAAA')
        .style('font-size', '0.9em')
        .attr('id', 'attrValue_text');

    //添加值矩形
    let max_width = d3.max([-d3.min(variable.importance_arr), d3.max(variable.importance_arr)]);
    console.log('max_width: ', max_width);
    let widthScale = d3.scaleLinear().domain([0, max_width]).range([0, 50]);

    svg_attrValue.append('g').selectAll('rect').data(variable.importance_arr).enter()
        .append('rect')
        .attr('x', function (d) {
            let tmp_width = widthScale(Math.abs(d));
            if (d < 0)
                return 150 - tmp_width;
            else
                return 150;
        }).attr('y', function (d, i) {
            return i * 20 + 25;
        }).attr('width', 0)
        .attr('height', 15)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', 'none').attr('id', 'value_rect');

    function updataValue(regression) {
        let tmp_value;
        if (regression == 1)
            tmp_value = MatchCal.deepCopy(variable.importance_arr);
        else
            tmp_value = MatchCal.deepCopy(variable.importance_arr_12);

        for (let i = 0; i < tmp_value.length; i++) {
            tmp_value[i] = parseFloat((tmp_value[i] * 1000).toFixed(2));

        }
        let max_width = d3.max([-d3.min(tmp_value), d3.max(tmp_value)]);
        console.log('max_width: ', max_width);
        let widthScale = d3.scaleLinear().domain([0, max_width]).range([0, 50]);

        svg_attrValue.selectAll('#value_rect').transition().duration(1000)
            .attr('x', function (d, i) {
                d = tmp_value[i];
                let tmp_width = widthScale(Math.abs(d));
                if (d < 0)
                    return 150 - tmp_width;
                else
                    return 150;
            }).attr('y', function (d, i) {
                d = tmp_value[i];
                return i * 20 + 25;
            }).attr('width', function (d, i) { d = tmp_value[i]; return widthScale(Math.abs(d)); })
            .attr('height', 15)
            .attr('fill', function (d, i) {
                d = tmp_value[i];
                if (d < 0)
                    return '#259aef';
                else
                    return '#f2992c';
            });

        svg_attrValue.selectAll('#attrValue_text')
            .text(function (d, i) {
                d = tmp_value[i];
                return d;
            })
    }


    return {
        updataValue
    }
})()