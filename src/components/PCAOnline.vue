<template>
  <el-cascader
    ref="refCascader"
    filterable
    :props="cityProps"
    :options="pcaData"
    placeholder="请选择省市区"
    @change="onChange"
  ></el-cascader>
</template>


<script setup lang="ts">
import { getGeoJSON } from "@/api/geo";
import { ADCODE_CHINA } from "@/const";
import type { AreaInfoItem, GeoJSON } from "@/types";
import {
  type CascaderInstance,
  type CascaderValue,
  type Resolve,
  type CascaderNode,
} from "element-plus";
import { onMounted, ref } from "vue";

const rootArea: AreaInfoItem = {
  adcode: ADCODE_CHINA,
  name: "中国",
  level: "country",
  childrenNum: 34,
};

const pcaData = ref<any[]>();

const emits = defineEmits(["nodeChange"]);

const cityProps = {
  value: "adcode",
  label: "name",
  children: "children",
  checkStrictly: true,
  lazy: true,
  lazyLoad,
};

function getFilename({ adcode, name, level, childrenNum }: AreaInfoItem) {
  if (adcode === ADCODE_CHINA) return `${adcode}_full.json`;
  if (childrenNum == 0) return `${adcode}.json`;
  return level == "district" ? `${adcode}.json` : `${adcode}_full.json`;
}

async function lazyLoad(node: CascaderNode, resolve: Resolve) {

  const areaInfo = node.root ? rootArea : node.data;
  const children: any = await getGeoJSONData(areaInfo as any);
  resolve(children);
}

async function getGeoJSONData(areaInfo: AreaInfoItem) {
  const fName = getFilename(areaInfo);
  const geoJSON: GeoJSON = await getGeoJSON(fName);

  const children = geoJSON.features.filter(p=> p.properties.name).map((p) => ({
    adcode: p.properties.adcode,
    name: p.properties.name,
    level: p.properties.level,
    childrenNum: p.properties.childrenNum,
    leaf: p.properties.childrenNum == 0
  }));
  return children;
}

const refCascader = ref<CascaderInstance>();

function onChange(value: CascaderValue) {
  const node = refCascader.value?.getCheckedNodes(false);
  if (!node || (Array.isArray(node) && node.length == 0))
    emits("nodeChange", undefined);

  // @ts-ignore
  const data = node[node.length - 1].data;
  emits("nodeChange", data);
}

onMounted(() => {
  // getGeoJSONData(rootArea);
});
</script>