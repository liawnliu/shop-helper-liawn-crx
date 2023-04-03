<template>
  <div class="products-checkbox">
    <el-checkbox v-model="selectAll" @change="handleCheckChange" :indeterminate="isIndeterminate" :label="checkboxLabel" size="small" />
    <el-checkbox v-model="isFilter" label="过滤已搬家" size="small" />
    <div class="btn-area">
      <el-divider direction="vertical" />
      <el-button type="primary" size="small" @click.stop="handleCopy">
        <el-icon style="vertical-align: middle" size="small">
          <i-ep-copy-document />
        </el-icon>
        <span style="vertical-align: middle">复制</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { CheckboxValueType } from 'element-plus/es/components/checkbox';
import useClipboard from 'vue-clipboard3';

const props = defineProps(['movedProducts', 'selectAllFunc']);
const total = ref(0);
const selectAll = ref(false);
const isFilter = ref(true);
const selectArr = ref<string[]>([]);
const isIndeterminate = ref(false);
const { toClipboard } = useClipboard()

watch(isFilter, (val) => {
  props.selectAllFunc(selectAll.value ? 'select' : 'cancel', val)
});

const checkboxLabel = computed(() => {
  return `全选(${selectArr.value.length}/${total.value})`;
})
const handleCheckChange = (value: CheckboxValueType) => {
  props.selectAllFunc(value?'select':'cancel', isFilter.value);
}
const handleCopy = async() => {
  try {
    const arr = selectArr.value.map(item => `https://detail.1688.com/offer/${item}.html`);
    await toClipboard(arr.join('\n'));
    // @ts-ignore ElMessage已经自动引入了
    ElMessage({
      message: `成功复制${arr.length}条数据！`,
      type: 'success',
    })
  } catch (e) {
    console.warn('复制失败', selectArr.value);

  }
}

const changeSelectArr = (type: 'add' | 'delete', item: string) => {
  console.log('ProductsCheckbox changeSelectArr type item', type, item);
  if (!item) return
  const index = selectArr.value.indexOf(item);
  if (type === 'add') {
    if (index === -1) {
      if (!isFilter.value || !props.movedProducts[item]) {
        selectArr.value.push(item)
      }
    }
  } else {
    if (index !== -1) selectArr.value.splice(index, 1);
  }
  changeStatus();
}
const changeTotal = (val: number) => {
  total.value = val;
  changeStatus();
}
const changeStatus = () => {
  selectAll.value = selectArr.value.length === total.value;
  isIndeterminate.value = (!!selectArr.value.length) && (selectArr.value.length < total.value)
}
defineExpose({ changeSelectArr, changeTotal })
</script>

<style  lang='less' scoped>
@import "@/style/main.css";
.products-checkbox {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  width: 300px;
  height: 30px;
  border-radius: 15px;
  background-color: #dddfdf;
  .el-checkbox{
    margin: 0 5px;
  }
  .btn-area{
    line-height: 12px;
    .el-button {
      padding: 2px 5px
    }
    .el-divider{
      height: 15px;
      border-left: 1px solid #898484;
    }
  }
}
</style>
