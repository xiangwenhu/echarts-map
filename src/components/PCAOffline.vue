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
import { get } from "@/api/request";
import {
  type CascaderInstance,
  ElCalendar,
  type CascaderValue,
} from "element-plus";
import { onMounted, ref } from "vue";

const pcaData = ref<any[]>();

const emits = defineEmits(["nodeChange"]);

const cityProps = {
  value: "code",
  label: "name",
  children: "children",
  checkStrictly: true,
  //   emitPath: false,
};

const refCascader = ref<CascaderInstance>();

function onChange(value: CascaderValue) {
  const nodes = refCascader.value?.getCheckedNodes(false) || [];
  emits("nodeChange", nodes.map(n => n.data));
}

async function getPCAData() {
  const res = await get({ url: "/data/pca/pca-code.json" });
  pcaData.value = res.children;
}

onMounted(() => {
  getPCAData();
});
</script>