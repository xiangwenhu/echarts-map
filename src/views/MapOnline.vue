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
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { ADCODE_CHINA } from "@/const";
import { getGeoJSON } from "@/api/geo";
import { nextTick } from "vue";
import ProvinceCityTown from "@/components/PCAOnline.vue";
import { onBeforeMount } from "vue";
import { onBeforeUnmount } from "vue";

const adCodeMap: Record<string, AreaInfoItem> = {
  [ADCODE_CHINA]: {
    adcode: ADCODE_CHINA,
    name: "中国",
    level: "country",
    childrenNum: 34,
  },
};

const levelHanlderMap = {
  country: viewChinaMap,
  province: onViewProvince,
  city: onViewCity,
  district: onViewDistrict,
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
  viewChinaMap(adCodeMap[ADCODE_CHINA]);
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
  const handler = levelHanlderMap[info.level];
  console.log("onViewMap:", info);
  await handler(info);
  console.log("stacks:", mapStacks);
}

// https://lbs.amap.com/api/javascript-api-v2/guide/services/district-search
const refDom = ref<HTMLDivElement>();
const refChartIns = ref<echarts.ECharts>();

function initEcharts(
  map: string | number,
  options: {
    data: { name: string; value: string | number }[];
    series?: echarts.SeriesOption[];
  }
) {
  let option: echarts.EChartsOption = {
    geo: {
      map: `${map}`,
      roam: true,
      scaleLimit: {
        min: 1.2,
        max: 5,
      },
      zoom: 1.2,
      //图形上的文本标签，可用于说明图形的一些数据信息
      label: {
        normal: {
          show: true,
          fontSize: 14,
          color: "rgba(0,0,0)",
          fontFamily: "Arial",
        },
      },
      //地图区域的多边形 图形样式，有 normal 和 emphasis 两个状态
      itemStyle: {
        //normal 是图形在默认状态下的样式；
        normal: {
          borderColor: "rgba(0, 0, 0, 0.2)",
        },
        //emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
        emphasis: {
          areaColor: "#F3B329",
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 20,
          borderWidth: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
    series: [
      {
        type: "map",
        mapType: `${map}`,
        geoIndex: 0,
        data: options.data,
      },
      ...(options.series || []),
    ],
    visualMap: {
      show: false,
      left: "right",
      min: 100000,
      max: 700000,
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

  // chartInstance.value!.clear();
  refChartIns.value!.setOption(option, true);
}

function getFilename({ adcode, name, level, childrenNum }: AreaInfoItem) {
  if (adcode === ADCODE_CHINA) return `${adcode}_full.json`;
  if (childrenNum == 0) return `${adcode}.json`;
  return level == "district" ? `${adcode}.json` : `${adcode}_full.json`;
}

async function ensureGeoJSON(areaInfo: AreaInfoItem) {
  const { adcode, level, childrenNum } = areaInfo;
  const mapData = echarts.getMap(`${adcode}`);

  let geoJSON: GeoJSON;
  if (mapData) {
    geoJSON = mapData.geoJSON;
  } else {
    const fName = getFilename(areaInfo);
    geoJSON = await getGeoJSON(fName);
    // geoJSON.features = geoJSON.features.filter((f) => f.properties.name);
    echarts.registerMap(`${adcode}`, geoJSON as any);
  }

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

async function viewChinaMap(areaInfo: AreaInfoItem) {
  const { adcode, level, childrenNum } = areaInfo;
  const geoJSON: GeoJSON = await ensureGeoJSON(areaInfo);
  const options = {
    data: geoJSON.features.map((f) => ({
      name: f.properties.name,
      value: f.properties.adcode,
    })),
    series: [
      {
        name: "Scatter",
        type: "scatter",
        coordinateSystem: "geo",
        data: [
          {
            name: "",
            value: [88.718619, 38.138863], // 这里填写具体的经纬度和图片URL
          },
        ],
        symbolSize: 20,
        symbol: "image://http://localhost:3001/images/park.jpg", // 这里填写你想要展示的图片的URL
        symbolRotate: 0,
      },
    ],
  };
  pushStack(areaInfo);
  initEcharts(adcode, options);
}

async function onViewProvince(areaInfo: AreaInfoItem) {
  const { adcode, level, childrenNum } = areaInfo;
  const geoJSON: GeoJSON = await ensureGeoJSON(areaInfo);
  const options = {
    data: geoJSON.features.map((f) => ({
      name: f.properties.name,
      value: f.properties.adcode,
    })),
  };
  pushStack(areaInfo);
  initEcharts(adcode, options);
}

async function onViewCity(areaInfo: AreaInfoItem) {
  const { adcode, level, childrenNum } = areaInfo;
  const geoJSON = await ensureGeoJSON(areaInfo);
  const options = {
    data: geoJSON.features.map((f) => ({
      name: f.properties.name,
      value: f.properties.adcode,
    })),
  };
  pushStack(areaInfo);
  initEcharts(adcode, options);
}

async function onViewDistrict(areaInfo: AreaInfoItem) {
  const { adcode, level, childrenNum } = areaInfo;
  const geoJSON: GeoJSON = await ensureGeoJSON(areaInfo);
  const options = {
    data: geoJSON.features.map((f) => ({
      name: f.properties.name,
      value: f.properties.adcode,
    })),
    series: [
      {
        name: "Scatter",
        type: "scatter",
        coordinateSystem: "geo",
        data: [
          {
            name: "",
            value: [88.718619, 38.138863], // 这里填写具体的经纬度和图片URL
          },
        ],
        symbolSize: 20,
        symbol: "image://http://localhost:3001/images/park.jpg", // 这里填写你想要展示的图片的URL
        symbolRotate: 0,
      },
    ],
  };
  pushStack(areaInfo);
  initEcharts(adcode, options as any);
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

        const value = params.value as number;
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
    viewChinaMap(adCodeMap[ADCODE_CHINA]);
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
  if (!areaInfos  || areaInfos.length == 0) {
    return viewChinaMap(adCodeMap[ADCODE_CHINA]);
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
