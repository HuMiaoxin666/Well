var variable = (function () {
    var heat_data;//热力图数据
    var part_all = true; 
    var heat_plane = true;
    var chosen_data;//所选中的数据
    var chart_data;//表格所需数据
    var type = "all";
    var day;
    var hour;
    var WH_index  ="5";
    var selectAll = false;
    return {
        heat_data:heat_data,
        part_all:part_all,
        heat_plane: heat_plane,
        chosen_data:chosen_data,
        chart_data:chart_data,
        type:type,
        WH_index:WH_index,
        day:day,
        hour:hour,
        selectAll:selectAll
    }
})()