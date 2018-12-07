var variable = (function () {
    let basicData;//绘画时用到的基础数据（包括每口井各种采样率下的采样状态和周围点）
    let basicData_1;//保存一组系数基础数据（包括每口井各种采样率下的采样状态和周围点）
    let basicData_2;//另一组系数的结果
    let basic_attrs =  ["DEPT", "SP", "COND", "ML1", "ML2", "AC"];
    let value_attrs = ["SP", "COND", "ML1", "ML2", "AC"];
    let chosenData;//当前选中的采样点
    let chosenId;//当前选中的采样点
    let chosenArr = [];
    let rate = 10;//采样率
    let circle_arr = [];//保存采样点的对象
    let around_circle = [];//保存上次点击周围点的对象
    let allData = {};//
    let importance_arr = [-0.00009675, 0.0012, 0.00005763, -0.0004, 0.001];//[-0.0005, 0.002 , 0.0002, -0.0004, 0.0011];//计算概率时个属性的系数
    let importance_arr_12 = [-0.00006986, 0.0009, 0.0004, -0.0005, 0.0005]
    let match_value;//两口井之间的匹配数据
    let index_dict = {};//基础数据中每口井的id对应的index
    let around_wellData = [];
    let aroundPt_ids = [];
    let variance_dict = {};
    let last_ArId = '';//用于跟新点击周围点时原始数据展示窗口的线高亮
    let attr_color = ["#1DFF74", '#FFEB16', '#FF9354', '#E835FF', '#3284FF'];
    let vsample = [];
    let variance_arr = [];
    let r_dict = {};
    let radius_circle = {};
    let reCalB = false;//需要重新计算系数时，查看多个盘的flag
    let dish_idArr = [];//当重新计算系数时，将之前选中盘的id记录在内
    let myStd_well = ['GD1-11-13', 'GD1-13-714', 'GD1-13-12', 'GD1-14-413', 'GD1-15-14', 'GD1-17N11', 'GD1-6N13', 'GD1-7-5', 'GD1-7-11', 'GD1-9-13'];
    let std_maxV;//标准井的方差最大值（用于直方图的确定比例尺）
    let around_click = 0;
    let rect_Xscale;//直方图的x轴比例尺
    let variance_extremeArr = [];//保存地图上各属性比例尺的极值
    let stdPie_dataArr = [];//用于保存标准井的从里到外的井id和值的字典数组
    let lastPieSvgArr = []; //保存pie的svg
    let wait_circle; //当前选中的周围井对象，用于替换标准井
    return {
        basicData,
        chosenData,
        chosenArr,
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
        vsample,
        value_attrs,
        last_ArId,
        match_value,
        attr_color,
        variance_arr,
        r_dict,
        radius_circle,
        reCalB,
        dish_idArr,
        std_maxV,
        around_click,
        rect_Xscale,
        variance_extremeArr,
        stdPie_dataArr,
        lastPieSvgArr,
        myStd_well,
        basicData_2,
        importance_arr_12,
        wait_circle,
        basicData_1
    }
})()