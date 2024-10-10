import { ADCODE_CHINA } from "@/const";
import type { AreaInfoItem, GeoJSON } from "@/types";
import * as echarts from "echarts";
import { merge } from "lodash";
import { getGeoJSON, getGeoJSONLocal } from "@/api/geo";


export function getEchartOptions(map: string | number, options: echarts.EChartsOption) {
    const defaultOptions: echarts.EChartsOption = {
        tooltip: {},
        geo: {
            map: `${map}`,
            roam: true,
            scaleLimit: {
                min: 0.6,
                max: 5,
            },
            zoom: 1.2,
            //图形上的文本标签，可用于说明图形的一些数据信息
            label: {
                show: true,
                fontSize: 14,
                color: "rgba(0,0,0)",
                fontFamily: "Arial",
                formatter(params) {
                    return params.name;
                },
            },
            //地图区域的多边形 图形样式，有 normal 和 emphasis 两个状态
            itemStyle: {
                //normal 是图形在默认状态下的样式；
                borderColor: "rgba(0, 0, 0, 0.2)",
                //emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
      
            },         
             emphasis: {
                itemStyle:{
                    areaColor: "#F3B329",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            }
        },
        series: [
            {
                type: "map",
                map: `${map}`,
                geoIndex: 0,
                name: "数量",
            },
        ],
        visualMap: {
            show: false,
            left: "right",
            min: 0,
            max: 10000,
            inRange: {
                color: [
                    "#FCDAD5",
                    "#FDE2CA",
                    "#FEEBD0",
                    "#FFFAB3",
                    "#C8E2B1",
                    "#C9E4D6",
                    "#CAE5E8",
                    "#BFCAE6",
                    "#A095C4",
                    "#C9B5D4",
                    "#ECECEC",
                ],
            },
            text: ["High", "Low"],
            calculable: true,
        },
    };

    const mOptions = merge(defaultOptions, options);

    return mOptions;
}

export async function getGeoJSONData(areaInfo: AreaInfoItem, isLocal: boolean = false) {
    const { adcode, level, childrenNum } = areaInfo;
    const mapData = echarts.getMap(`${adcode}`);

    let geoJSON: GeoJSON;
    if (mapData) {
        geoJSON = mapData.geoJSON;
    } else {
        const method = isLocal ? getGeoJSONLocal : getGeoJSON
        const fName = getFilename(areaInfo, isLocal);
        geoJSON = await method(fName);
        echarts.registerMap(`${adcode}`, geoJSON as any);
    }
    return geoJSON;
}


export function getFilename({ adcode, name, level, childrenNum }: AreaInfoItem, isLocal: boolean = false) {
    if (isLocal) return `${adcode}.json`;
    if (adcode === ADCODE_CHINA) return `${adcode}_full.json`;
    if (childrenNum == 0) return `${adcode}.json`;
    return level == "district" ? `${adcode}.json` : `${adcode}_full.json`;
}
