var variable = (function () {
    let basicData;//保存基础数据（包括每口井各种采样率下的采样状态和周围点）
    let basic_attrs =  ["DEPT", "SP", "COND", "ML1", "ML2", "R4", "AC"];
    let chosenData;//当前选中的采样点
    let chosenId;//当前选中的采样点
    let chosenArr = [];
    let match = false;//是否匹配两口井的标志
    let chosen_attrs = [];//选择的属性数组
    let rate = 10;//采样率
    let circle_arr = [];//保存采样点的对象
    let around_circle = [];//保存上次点击周围点的对象
    let allData = {};//
    let importance_arr = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2];//计算概率时个属性的系数
    let sample_10;//两口井之间的匹配数据
    let index_dict = {};//基础数据中每口井的id对应的index
    let around_wellData = [];
    let aroundPt_ids = [];
    let variance_dict = {};
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
        sample_10,
        index_dict,
        basic_attrs,
        around_wellData,
        aroundPt_ids,
        variance_dict,
        chosenId
    }
})()