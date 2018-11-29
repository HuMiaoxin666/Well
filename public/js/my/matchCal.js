var MatchCal = (function () {
    //处理文件数据

    var gminv = 0.0,
        gmaxv = 10.0;
    var TopH = 1000,
        BotH = 1400; //定义绘制的区间
    //归一化两口井的所有层数据的属性值，层厚、均值、方差、相对重心等//////////
    var attrs = ["dh", "fv", "mv", "rm", "maxv", "minv", "dtv", "topk", "botk"];
    var dis_able = 0;
    var dismax, dismin;
    var xiehmax = 315.7;
    var attrnames = ["DEPT", "SP", "COND", "ML1", "ML2", "R4", "AC"];

    function showcurves(well_arr, attr) {
        wtdatas = [];
        wbdatas = [];
        let tmp_attr = attr;
        console.log('tmp_attr: ', tmp_attr);
        let attrn = attrnames.indexOf(tmp_attr);
        console.log('attrn: ', attrn);
        for (let n = 0; n < well_arr.length; n++) {

            let curved = well_arr[n].value; //存储1000-1500米之间的数据
            ////////////绘制显示不同属性的曲线///////////////////////////////////////////////////////////////////////////////////
            ///////////////先绘制测试参数指定的属性//////////////////////////////////////////////////////////////////////////////
            var fcd = curved.filter(function (cd) {
                return (cd[0] >= TopH) && (cd[0] <= BotH) && (cd[attrn] > -1000.0) && (cd[attrn] < 1000.0)
            });
            // console.log('fcd: ', fcd);
            // console.log('curved: ', curved);


            //处理异常数据//////////////////////////////////////////////////
            // if (attrn == 6) {
            //     var fcdtemp = curved.filter(function (cd) {
            //         return (cd[0] >= TopH) && (cd[0] <= BotH) && (cd[attrn] > 50.0) && (cd[attrn] < 1000.0);
            //     });
            //     var fcdmean = d3.mean(fcdtemp, function (cd) {
            //         return cd[attrn]
            //     });

            //     for (var i = 0; i < fcd.length; i++)
            //         if (fcd[i][attrn] < 50.0)
            //             fcd[i][attrn] = fcdmean;
            // }

            //保存原始曲线数据，用于绘制细节对比
            var curvedata = fcd;

            var mind = d3.min(fcd, function (d) {
                return d[attrn]
            });
            var maxd = d3.max(fcd, function (d) {
                return d[attrn]
            });

            //归一化//////////////////////////////////////////////
            for (var i = 0; i < fcd.length; i++) {
                fcd[i][attrn] = gmaxv * (fcd[i][attrn] - mind) / (maxd - mind);

                fcd[i].lmax = 0;
                fcd[i].lmin = 0;
            }

            //标记极大值、极小值
            for (var i = 1; i < fcd.length - 1; i++) {
                if (fcd[i][attrn] - fcd[i - 1][attrn] > 0.0 && fcd[i + 1][attrn] - fcd[i][attrn] < 0.0) fcd[i].lmax = 1;
                if (fcd[i][attrn] - fcd[i - 1][attrn] < 0.0 && fcd[i + 1][attrn] - fcd[i][attrn] > 0.0) fcd[i].lmin = 1;
            }

            //   var XScale = d3.scaleLinear().domain([gminv, gmaxv]).range([0, well_width]);

            //   var sx=startx+(well_width+interval)*n;

            //   var line = d3.line()
            //         .x(function(d) { return sx+XScale(d[attrn]); })
            //         .y(function(d) { return starty+FlagScale(d.DEPT); });

            //////////////////1.测井曲线数据预处理//////////////////////////////////////////////////////////////////
            /////////////1.1异常值校正、缺失值插值/////////////////////////////////////////////////////////////////////////////

            /////////////1.2.中值滤波////////////////////////////////////////////////////////////////////////////////////////
            var midvf_N = 10; //中值滤波前后各取值的数量

            for (var ti = 0; ti < fcd.length; ti++) {
                var tempN = midvf_N;
                if (ti < midvf_N) tempN = ti;
                if (ti > fcd.length - 1 - midvf_N) tempN = fcd.length - ti - 1;

                var midvs = []; //存放前后的取值
                for (var tj = ti - tempN; tj < ti + tempN + 1; tj++)
                    midvs.push(fcd[tj][attrn]);
                //取中值//////////////////////////
                fcd[ti]["MV_" + attrn] = d3.median(midvs);
            }

            //绘制中值曲线//////////////////////
            //   var linem = d3.line()
            //         .x(function(d) { return sx+XScale(d["MV_"+attrn]); })
            //         .y(function(d) { return starty+FlagScale(d.DEPT); });

            ////////////////1.3.根据中值计算活度函数及绘制///////////////////////////////////////////////////////////////////////
            var act_N = 15; //活度计算前后各取值的数量
            console.log('fcd: ', fcd[0]);
            fcd[0]["AV_" + attrn] = 0.0;

            fcd[fcd.length - 1]["AV_" + attrn] = 0.0;

            var isiter = false;
            var Rd = 0.0,
                Td = 0.0;

            for (var ti = 1; ti < fcd.length - 1; ti++) {
                var tempN = act_N;

                if (ti < act_N) {
                    tempN = ti;
                    var actvs = [];

                    for (var tj = ti - tempN; tj < ti + tempN + 1; tj++)
                        actvs.push(fcd[tj]["MV_" + attrn]);

                    fcd[ti]["AV_" + attrn] = d3.variance(actvs);

                } else if (ti >= act_N && ti <= fcd.length - 1 - act_N) {
                    if (isiter) {
                        Rd = Rd - (fcd[ti - tempN - 1]["MV_" + attrn] * fcd[ti - tempN - 1]["MV_" + attrn]) + (fcd[ti + tempN]["MV_" + attrn] * fcd[ti + tempN]["MV_" + attrn]);
                        Td = Td - fcd[ti - tempN - 1]["MV_" + attrn] + fcd[ti + tempN]["MV_" + attrn];

                        fcd[ti]["AV_" + attrn] = Rd - Td * Td / (2 * tempN + 1);
                    } else {
                        isiter = true;
                        for (var tj = ti - tempN; tj < ti + tempN + 1; tj++) {
                            Rd += (fcd[tj]["MV_" + attrn] * fcd[tj]["MV_" + attrn]);
                            Td += fcd[tj]["MV_" + attrn];
                        }
                        fcd[ti]["AV_" + attrn] = Rd - Td * Td / (2 * tempN + 1);
                    }
                } else {
                    tempN = fcd.length - ti - 1;
                    var actvs = [];

                    for (var tj = ti - tempN; tj < ti + tempN + 1; tj++)
                        actvs.push(fcd[tj]["MV_" + attrn]);

                    fcd[ti]["AV_" + attrn] = d3.variance(actvs);
                }
            }

            //统计活度值范围
            var mina = d3.min(fcd, function (d) {
                return d["AV_" + attrn]
            });
            var maxa = d3.max(fcd, function (d) {
                return d["AV_" + attrn]
            });

            //   var AXScale = d3.scaleLinear().domain([mina, maxa]).range([0, well_width]);

            //绘制活度函数曲线//////////////////////
            //   var linea = d3.line()
            //         .x(function(d) { return sx+AXScale(d["AV_"+attrn]); })
            //         .y(function(d) { return starty+FlagScale(d.DEPT); });

            ////////////////1.4.阈值检验活度极值///////////////////////////////////////////////////////////////////////////////
            var av_threshold = maxa * 0.05;
            /////计算活度值差分/////////////////
            var diffs = [];
            for (var ti = 1; ti < fcd.length; ti++) diffs.push(fcd[ti]["AV_" + attrn] - fcd[ti - 1]["AV_" + attrn]);

            var borders = []; //存放符合阈值的活度深度索引
            borders.push(1);

            for (var ti = 0; ti < diffs.length - 1; ti++)
                if (diffs[ti] > 0.0 && diffs[ti + 1] < 0.0 && fcd[ti + 1]["AV_" + attrn] >= av_threshold)
                    borders.push(ti + 1);
            borders.push(diffs.length - 2)

            ////////////1.5.层均值检验进行薄层合并/////////////////////////////////////////////////////////////////////////////////

            ////////////1.6.井层数据设计//////////////////////////////////////////////////////////////////////////////////////////
            var wbdata = {};
            wbdata.idn = well_arr[n].id;
            wbdata.bdata = [];
            wbdata.cdata = curvedata;

            //标记//
            for (var k = 1; k < borders.length; k++) {
                var indext = borders[k - 1],
                    indexb = borders[k];
                var tempbd = {};

                tempbd.indext = indext;

                tempbd.th = fcd[indext][0]; //层顶深度
                tempbd.bh = fcd[indexb][0]; //层底深度
                tempbd.dh = tempbd.bh - tempbd.th; //层的厚度

                var bvs = [],
                    rmvs = [];

                for (var tm = indext; tm <= indexb; tm++) {
                    bvs.push(fcd[tm][attrn]);
                    rmvs.push(fcd[tm][attrn] * (tm - indext + 1));
                }

                //存放原始数据
                tempbd.bvs = bvs;

                tempbd.fv = d3.variance(bvs); //方差
                tempbd.mv = d3.mean(bvs); //均值
                tempbd.rm = d3.sum(rmvs) / ((indexb - indext + 1) * d3.sum(bvs)); //相对重心

                tempbd.maxv = d3.max(bvs); //最大值
                tempbd.minv = d3.min(bvs); //最小值

                //新添加属性:最大最小值之差，上下陡度，极大极小值及相对位置/////////////////////////////
                tempbd.dtv = tempbd.maxv - tempbd.minv; //最大值最小值之差

                tempbd.topk = fcd[indext + 1][attrn] - fcd[indext - 1][attrn]; //上陡度，定义为边界处的斜率
                tempbd.botk = fcd[indexb + 1][attrn] - fcd[indexb - 1][attrn]; //下陡度

                var lmaxvs = [],
                    lminvs = [];
                for (var tm = indext; tm <= indexb; tm++) {
                    if (fcd[tm].lmax == 1) lmaxvs.push([fcd[tm][attrn], tm]);
                    if (fcd[tm].lmin == 1) lminvs.push([fcd[tm][attrn], tm]);
                }

                tempbd.lmaxv = -1, tempbd.lminv = -1, tempbd.lmaxp = -1, tempbd.lminp = -1;

                if (lmaxvs.length > 0) {
                    //排序，找出最大的极大值
                    function compareLmaxv(a, b) {
                        return b[0] - a[0];
                    }

                    lmaxvs.sort(compareLmaxv);

                    tempbd.lmaxv = lmaxvs[0][0];
                    tempbd.lmaxp = (lmaxvs[0][1] - indext) / (indexb - indext);
                }

                if (lminvs.length > 0) {
                    //排序，找出最小的极小值
                    function compareLminv(a, b) {
                        return a[0] - b[0];
                    }

                    lminvs.sort(compareLminv);

                    tempbd.lminv = lminvs[0][0];
                    tempbd.lminp = (lminvs[0][1] - indext) / (indexb - indext);
                }
                // console.log('tempbd  : ', tempbd);
                wbdata.bdata.push(tempbd);

            }
            wbdatas.push(wbdata);
        }
        // console.log(wbdatas)
    }

    function layermatch(wbdataA, wbdataB) {
        var m = wbdataA.bdata.length,
            n = wbdataB.bdata.length;

        for (var k = 0; k < attrs.length; k++) {
            var tempatts = [];

            for (var i = 0; i < m; i++) tempatts.push(wbdataA.bdata[i][attrs[k]]);
            for (var i = 0; i < n; i++) tempatts.push(wbdataB.bdata[i][attrs[k]]);

            var maxattr = d3.max(tempatts);
            var minattr = d3.min(tempatts);

            var newattr = "g" + attrs[k];

            for (var i = 0; i < m; i++) wbdataA.bdata[i][newattr] = (wbdataA.bdata[i][attrs[k]] - minattr) / (maxattr - minattr);
            for (var i = 0; i < n; i++) wbdataB.bdata[i][newattr] = (wbdataB.bdata[i][attrs[k]] - minattr) / (maxattr - minattr);
        }
        ///////////////////////////////////////////////////////////////
        var disvs = [];
        var disvsm = [];

        for (var i = 0; i < m; i++) {
            var tdm = [];
            for (var j = 0; j < n; j++) {
                var tdis = disbdata(wbdataA.bdata[i], wbdataB.bdata[j]);
                disvs.push(tdis);
                tdm.push(tdis);
            }
            disvsm.push(tdm);
        }

        var vadis = Math.sqrt(d3.variance(disvs) * m * n / (m * n - 2));

        //定义距离矩阵和标记矩阵//////////////////////////////////////////////i代表行，j代表列
        var dism = [];
        var flag = [];
        for (var i = 0; i <= m; i++) {
            var tempdism = [];
            var tempflag = [];

            for (var j = 0; j <= n; j++) {
                tempdism.push(0.0);
                tempflag.push(-1);
            }

            dism.push(tempdism);
            flag.push(tempflag);
        }

        //首先初始化距离矩阵两边//////////////////
        dism[0][0] = 0.0;
        for (var i = 1; i <= m; i++) dism[i][0] = 0.5 * vadis * i;
        for (var j = 1; j <= n; j++) dism[0][j] = 0.5 * vadis * j;

        //动态规划算法
        var smallest = 1.0 / Math.pow(10, 10);
        for (var i = 1; i <= m; i++)
            for (var j = 1; j <= n; j++) {
                var dirvs = []; //存放所有方向的值

                var chui = {},
                    shui = {};
                chui.id = 1;
                chui.value = dism[i - 1][j] + 0.5 * vadis;
                shui.id = 3;
                shui.value = dism[i][j - 1] + 0.5 * vadis;

                dirvs.push(chui);
                dirvs.push(shui);

                var tempdis = disbdata(wbdataA.bdata[i - 1], wbdataB.bdata[j - 1]);
                //具备相似性的条件（相似值在一个标准差内且高度差异在合理范围内）
                if (tempdis < vadis && Math.abs(wbdataA.bdata[i - 1].th - wbdataB.bdata[j - 1].th) <= xiehmax) {
                    var dui = {};
                    dui.id = 2;
                    dui.value = dism[i - 1][j - 1] + tempdis;
                    dirvs.push(dui);
                }

                //排序，找出最小值
                function compareDV(a, b) {
                    return a.value - b.value;
                }

                dirvs.sort(compareDV);

                //如果存在两条路径
                if (Math.abs(dirvs[0].value - dirvs[1].value) < smallest) {
                    flag[i][j] = 4;
                } else {
                    flag[i][j] = dirvs[0].id;
                }

                dism[i][j] = dirvs[0].value;
            }

        //寻找翘曲路径///////////////////////////////////
        var layerpairs = []; //定义匹配的层段

        var i = m,
            j = n;
        while (i > 0 && j > 0) {
            if (flag[i][j] == 2) //如果是斜向下标记
            {
                var layerpair = [];
                layerpair.push(i - 1);
                layerpair.push(j - 1);

                layerpairs.push(layerpair);

                i--;
                j--;
            } else if (flag[i][j] == 1) ///如果是垂直标记
                i--;
            else if (flag[i][j] == 3) ///如果是水平标记
                j--;
            else //如果路径模糊，4，查找其余三个向前的值
            {
                var dirvs = []; //存放所有方向的值

                var chui = {},
                    shui = {},
                    dui = {};
                chui.id = 1;
                chui.value = dism[i - 1][j];
                shui.id = 3;
                shui.value = dism[i][j - 1];
                dui.id = 2;
                dui.value = dism[i - 1][j - 1];

                dirvs.push(chui);
                dirvs.push(shui);
                dirvs.push(dui);

                //排序，找出最小值
                function compareDV(a, b) {
                    return a.value - b.value;
                }

                dirvs.sort(compareDV);

                if (dirvs[0].id == 2) {

                    var layerpair = [];
                    layerpair.push(i - 1);
                    layerpair.push(j - 1);
                    i--;
                    j--;

                } else if (dirvs[0].id == 1) i--;
                else j--;
            }
        }

        //归一化距离矩阵////////////////////////////////////////
        if (dis_able == 0) {
            dismax = d3.max(disvs), dismin = d3.min(disvs);
            dis_able = 1;
        }

        for (var i = 0; i < m; i++)
            for (var j = 0; j < n; j++) {
                disvsm[i][j] = (disvsm[i][j] - dismin) / (dismax - dismin);
                if (disvsm[i][j] < 0) disvs[i][j] = 0;
                else if (disvsm[i][j] > 1) disvsm[i][j] = 1;
            }

        for (var i = 0; i <= m; i++)
            for (var j = 0; j <= n; j++) {
                dism[i][j] = dism[i][j] / dism[m][n];
                if (dism[i][j] < 0) dism[i][j] = 0;
                else if (dism[i][j] > 1) dism[i][j] = 1;
            }

        //返回匹配的数据/////////////////////////////////////////
        var lmdata = {};
        lmdata.ida = 0;
        lmdata.idb = 1;
        lmdata.rn = m;
        lmdata.cn = n;
        lmdata.layerpairs = layerpairs;
        lmdata.dism = dism;
        lmdata.flag = flag;
        lmdata.disvsm = disvsm;
        return lmdata;
    }

    //计算最终展示值函数
    function disbdata(bdatap, bdataq) {
        var wattrs = [0.2, 0.3, 0.3, 0.1, 0.05, 0.05, 0.2, 0.1, 0.1];
        var disv = 0.0;
        for (var k = 0; k < attrs.length; k++)
            disv += (wattrs[k] * Math.abs(bdatap[attrs[k]] - bdataq[attrs[k]]));

        //添加极大值极小值的影响
        var wmaxv = 0.1, wmaxp = 0.1, wminv = 0.1, wminp = 0.1;
        if (bdatap.lmaxv >= 0.0 && bdataq.lmaxv >= 0.0) {
            disv += wmaxv * Math.abs(bdatap.lmaxv - bdataq.lmaxv) / (gmaxv - gminv);
            disv += wmaxp * Math.abs(bdatap.lmaxp - bdataq.lmaxp);
        }

        if (bdatap.lminv >= 0.0 && bdataq.lminv >= 0.0) {
            disv += wminv * Math.abs(bdatap.lminv - bdataq.lminv) / (gmaxv - gminv);
            disv += wminp * Math.abs(bdatap.lminp - bdataq.lminp);
        }

        return disv;
    }



    //深拷贝函数
    function deepCopy(o) {
        if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i) {
                n[i] = deepCopy(o[i]);
            }
            return n;
        } else if (o instanceof Function) {
            var n = new Function("return " + o.toString())();
            return n
        } else if (o instanceof Object) {
            var n = {}
            for (var i in o) {
                n[i] = deepCopy(o[i]);
            }
            return n;
        } else {
            return o;
        }
    }

    function ReSample() {
        let stop = false;
        let rate_index = parseInt(variable.rate / 10);
        console.log('rate_index: ', rate_index);
        let index = 0;
        for (let i = 0; i < variable.basicData.length; i++) {
            // console.log("i: ", i);
            if (variable.basicData[i].sample_status[rate_index] == 1) {
                let tmp_chosenId = variable.basicData[i].id;
                let MatchValue_dict = {};//井的V值总和
                let V_dict = {};

                let tmp_aroundIds = deepCopy(variable.basicData[i].around_ids[rate_index]);
                // console.log('variable.basicData[i]: ', variable.basicData[i]);

                if (tmp_aroundIds.length > 0) {
                    tmp_aroundIds.push(tmp_chosenId);
                    for (let p = 0; p < tmp_aroundIds.length; p++) {
                        if (tmp_aroundIds[p] in MatchValue_dict == false) {
                            MatchValue_dict[tmp_aroundIds[p]] = 0;
                        }
                        for (let q = 0; q < tmp_aroundIds.length; q++) {
                            // console.log('tmp_aroundIds[p]: ', tmp_aroundIds[p]);
                            // console.log('tmp_aroundIds[q]: ', tmp_aroundIds[q]);
                            if (q != p) {
                                let tmp_key = tmp_aroundIds[p] + "&" + tmp_aroundIds[q];
                                V_dict[tmp_key] = 0;
                                if (variable.match_value[tmp_key]) {
                                    index += 1;
                                    let tmp_value = variable.match_value[tmp_key].value;
                                    for (let a = 0; a < variable.importance_arr.length; a++) {
                                        MatchValue_dict[tmp_aroundIds[p]] += parseFloat(tmp_value[a]) * variable.importance_arr[a];
                                        V_dict[tmp_key] += parseFloat(tmp_value[a]) * variable.importance_arr[a];
                                    }
                                }
                            }
                        }
                    }
                    //计算V值最大的井
                    console.log('MatchValue_dict: ', MatchValue_dict);
                    let max_id_v, max_value_v = 0;
                    
                    for (id in MatchValue_dict) {
                        if (MatchValue_dict[id] > max_value_v) {
                            max_id_v = id;
                            max_value_v = MatchValue_dict[id];
                        }
                    }
                    console.log('max_id_v: ', max_id_v);

                    console.log('tmp_chosenId: ', tmp_chosenId);
                    variable.basicData[variable.index_dict[max_id_v]].tmp_vSample = 1;
                    variable.vsample.push({ 'id': max_id_v, 'latlng': [variable.basicData[variable.index_dict[max_id_v]].latlng] ,"dish":tmp_chosenId})
                }
                if (stop == true)
                    break;
            }

        }
        console.log("index: ", index);

        drawPoint.draw(variable.basicData, variable.rate);
    }

    function CalMatchValue(well_arr, attr) {
        showcurves(well_arr, attr);
        let lmdata = layermatch(wbdatas[0], wbdatas[1]);
        return [lmdata, wbdatas[0], wbdatas[1]];
    }
    return {
        showcurves,
        ReSample,
        deepCopy,
        CalMatchValue
    }
})()