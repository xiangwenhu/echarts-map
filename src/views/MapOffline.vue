<template>
  <div
    style="position: fixed; top: 10px; left: 10px; cursor: pointer; z-index: 99"
  >
    <el-space>
      <province-city-town
        @nodeChange="onCodeChange"
        v-model="pct"
        style="width: 300px"
      ></province-city-town>
      <el-button @click="onBack()">返回地图上一级</el-button>
      <el-button @click="onBackHome()">返回地图首页</el-button>
      <router-link to="/">返回网站首页</router-link>
      <el-button @click="reload">页面刷新</el-button>
    </el-space>
  </div>

  <div
    id="main"
    style="height: calc(100vh - 1px); width: calc(100vw - 1px)"
    ref="refDom"
  ></div>
</template>
  
  <script setup lang="ts">
import { type AreaInfoItem, type GeoJSON } from "@/types";
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import * as echarts from "echarts";
import { ADCODE_CHINA } from "@/const";
import { getGeoJSONLocal as getGeoJSON } from "@/api/geo";
import { nextTick } from "vue";
import ProvinceCityTown from "@/components/PCAOffline.vue";
import {  random } from "lodash";
import { getEchartOptions, getGeoJSONData } from "@/util/map";
import parkJPG from "@/assets/images/park.jpg"

const adCodeMap: Record<string, AreaInfoItem> = {
  [ADCODE_CHINA]: {
    adcode: ADCODE_CHINA,
    name: "中国",
    level: "country",
    childrenNum: 34,
  },
};

const mapStacks: AreaInfoItem[] = [];

function onBack() {
  if (mapStacks.length === 1) return;
  mapStacks.pop();
  const adcode = mapStacks[mapStacks.length - 1];
  mapStacks.pop();
  onViewMap(adcode);
}

function onBackHome() {
  mapStacks.length = 0;
  onViewMap(adCodeMap[ADCODE_CHINA]);
}

function pushStack(areaInfoInfo: AreaInfoItem) {
  if (
    mapStacks.length > 0 &&
    areaInfoInfo.adcode === mapStacks[mapStacks.length - 1].adcode
  )
    return;
  mapStacks.push(areaInfoInfo);
}

async function onViewMap(areaInfo: number | AreaInfoItem) {
  const info: AreaInfoItem =
    typeof areaInfo == "number" ? adCodeMap[areaInfo] : areaInfo;
  console.log("onViewMap:", info);
  await onViewMapArea(info);
  console.log("stacks:", mapStacks);
}

/**
 * 核心的业务逻辑在此处理，
 * 1. 每个区域的值
 * 2. 每个区域的 scatter 散点图
 * @param areaInfo
 */
async function onViewMapArea(areaInfo: AreaInfoItem) {
  refChartIns.value?.showLoading();
  const { adcode, level, childrenNum } = areaInfo;
  const geoJSON: GeoJSON = await ensureGeoJSON(areaInfo);

  let otherSeries: echarts.SeriesOption[] = [];
  // 按需添加 scatter
  if (areaInfo.level === "country") {
    otherSeries = [
      {
        tooltip: {
          formatter(params, ticket) {
            // @ts-ignore
            return `${params.name} <br/> 空位: ${params.value[2]}`;
          },
        },
        name: "停车场",
        type: "scatter",
        coordinateSystem: "geo",
        data: [
          {
            name: "停车场1",
            value: [88.718619, 38.138863, 100],
          },
        ],
        symbolSize: 20,
        symbol: `image://${parkJPG}`, // 这里填写你想要展示的图片的URL
        symbolRotate: 0,
      },
    ];
  }

  // ** 业务数据，转为 地图的 options
  const options: echarts.EChartsOption = {
    series: [
      {
        data: geoJSON.features.map((f) => ({
          name: f.properties.name,
          value: random(0, 10000),
          adcode: f.properties.adcode,
        })),
      },
      ...otherSeries,
    ],
  };

  pushStack(areaInfo);
  refChartIns.value?.hideLoading();

  initEcharts(adcode, options);
}

// https://lbs.amap.com/api/javascript-api-v2/guide/services/district-search
const refDom = ref<HTMLDivElement>();
const refChartIns = ref<echarts.ECharts>();

function initEcharts(map: string | number, options: echarts.EChartsOption) {

  const mOptions = getEchartOptions(map, options);
  // chartInstance.value!.clear();
  refChartIns.value!.setOption(mOptions, true);
}


async function ensureGeoJSON(areaInfo: AreaInfoItem) {
  const geoJSON = await getGeoJSONData(areaInfo, true)
  geoJSON.features.forEach((p) => {
    adCodeMap[p.properties.adcode] = {
      adcode: p.properties.adcode,
      name: p.properties.name,
      level: p.properties.level,
      childrenNum: p.properties.childrenNum,
    };
  });

  return geoJSON;
}

function onResize() {
  if (refChartIns.value) {
    const options = refChartIns.value.getOption();
    refChartIns.value.resize();
    refChartIns.value.setOption(options, true);
  }
}

onMounted(() => {
  nextTick(() => {
    refChartIns.value = echarts.init(refDom.value);
    refChartIns.value.on(
      "click",
      "series",
      function (params: echarts.ECElementEvent) {
        if (params.componentSubType !== "map") return;
        // @ts-ignore
        const value = params.data?.adcode as number;
        if (value in adCodeMap) {
          if (
            mapStacks.length > 0 &&
            value == mapStacks[mapStacks.length - 1].adcode
          )
            return;
          onViewMap(value);
        }
      }
    );
    onViewMap(adCodeMap[ADCODE_CHINA]);
  });
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);

  if (refChartIns.value && !refChartIns.value.isDisposed()) {
    refChartIns.value?.dispose();
  }
});

const pct = ref<AreaInfoItem>();
function onCodeChange(areaInfos: AreaInfoItem[]) {
  if (!areaInfos || areaInfos.length == 0) {
    return onViewMap(adCodeMap[ADCODE_CHINA]);
  }
  console.log(pct.value);
  onViewMap(areaInfos[0]);
}

function reload() {
  location.reload();
}
</script>
  
  
  <style>
</style>
  