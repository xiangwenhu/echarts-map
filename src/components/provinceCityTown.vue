<template>
  <el-cascader
    ref="refCascader"
    filterable
    :props="cityProps"
    :options="cityData.children"
    placeholder="请选择省市区"
    @change="onChange"
  ></el-cascader>
</template>


<script setup lang="ts">
import cityData from "@/assets/data/pca-code.json";
import {
  type CascaderInstance,
  ElCalendar,
  type CascaderValue,
} from "element-plus";
import { ref } from "vue";

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
  const node = refCascader.value?.getCheckedNodes(false);
  if (!node || (Array.isArray(node) && node.length == 0))
    emits("nodeChange", undefined);

  // @ts-ignore
  const data = node[node.length - 1].data;
  emits("nodeChange", data);
}
</script>