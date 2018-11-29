var variable = (function () {
    let basicData;//保存基础数据（包括每口井各种采样率下的采样状态和周围点）
    let basic_attrs =  ["DEPT", "SP", "COND", "ML1", "ML2", "AC"];
    let value_attrs = ["SP", "COND", "ML1", "ML2", "AC"];
    let Value_attrs_index = [1, 2, 3, 4, 5];
    let basic_attrs_index = [0, 1, 2, 3, 4]
    let chosenData;//当前选中的采样点
    let chosenId;//当前选中的采样点
    let chosenArr = [];
    let match = false;//是否匹配两口井的标志
    let chosen_attrs = [];//选择的属性数组
    let rate = 10;//采样率
    let circle_arr = [];//保存采样点的对象
    let around_circle = [];//保存上次点击周围点的对象
    let allData = {};//
    let importance_arr = [-0.00009675, 0.0012, 0.00005763, -0.0004, 0.001];//[-0.0005, 0.002 , 0.0002, -0.0004, 0.0011];//计算概率时个属性的系数
    let match_value;//两口井之间的匹配数据
    let index_dict = {};//基础数据中每口井的id对应的index
    let around_wellData = [];
    let aroundPt_ids = [];
    let variance_dict = {};
    let last_line = '';
    let attr_color = ["#1DFF74", '#FFEB16', '#FF9354', '#E835FF', '#3284FF'];
    let vsample = [];
    let variance_arr = [];
    let r_dict = {};
    let radius_circle = {};
    let reCalB = false;
    let dish_idArr = [];//当重新计算系数时，将之前选中盘的id记录在内
    let myStd_well = ['GD1-11NB12', 'GD1-13-317', 'GD1-13P511', 'GD1-14-013', 'GD1-15-215', 'GD1-17-11', 'GD1-6-914', 'GD1-7-52', 'GD1-7-711', 'GD1-8-313'];
    return {
        basicData,
        chosenData,
        chosenArr,
        match,
        chosen_attrs,
        rate,
        circle_arr,
        around_circle,
        allData,
        importance_arr,
        index_dict,
        basic_attrs,
        around_wellData,
        aroundPt_ids,
        variance_dict,
        chosenId,
        Value_attrs_index,
        basic_attrs_index,
        vsample,
        value_attrs,
        last_line,
        match_value,
        attr_color,
        variance_arr,
        r_dict,
        radius_circle,
        reCalB,
        dish_idArr
    }
})()