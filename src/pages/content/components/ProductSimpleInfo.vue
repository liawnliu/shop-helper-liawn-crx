<template>
  <div class="product-simple-info" @click.stop="">
    <div class="product-item">
      <div class="product-item-label">
        <span>是否勾选</span>
      </div>
      <div class="product-item-content">
        <el-checkbox v-model="select" size="small" :disabled="!!isFilterMoved&&!!movedProductNowId" @change="checkChange" />
        <el-tag v-if="!!movedProductNowId" type="danger" size="small">已搬家</el-tag>
        <el-tag v-else type="success" size="small">未搬家</el-tag>
      </div>
    </div>
    <div class="product-item">
      <div class="product-item-label">
        <span>类别</span>
      </div>
      <div class="product-item-content">
        <span>{{offer.postCategory.fullName}}</span>
      </div>
    </div>
    <div class="product-item">
      <div class="product-item-label">
        <span>1688商品ID</span>
      </div>
      <div class="product-item-content">
        <span>{{offer.id}}</span>
      </div>
    </div>
    <div class="product-item">
      <div class="product-item-label">
        <span>下游商品ID</span>
      </div>
      <div class="product-item-content">
        <span>{{movedProductNowId}}</span>
      </div>
    </div>
    <div class="product-item">
      <div class="product-item-label">
        <span>月销量</span>
      </div>
      <div class="product-item-content">
        <span>{{offer.thirtyBookCount}}笔，代销{{offer.agentInfo.agentBookedCount}}笔</span>
      </div>
    </div>
    <div class="product-item">
      <div class="product-item-label">
        <span>累计销量</span>
      </div>
      <div class="product-item-content">
        <span>{{offer.bookedCount}}笔，{{offer.saleQuantity}}件</span>
      </div>
    </div>
    <div class="product-item">
      <div class="product-item-label">
        <span>上货时间</span>
      </div>
      <div class="product-item-content">
        <span>{{offer.gmtCreate}}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { CheckboxValueType } from 'element-plus/es/components/checkbox';

const props = defineProps(['offer', 'movedProductNowId', 'afterItemCheck']);
/* console.log('props.offer', props.offer);
console.log('props.movedProducts', props.movedProductNowId); */
const select = ref(false);
const isFilterMoved = ref(true);

const checkChange = (value: CheckboxValueType) => {
  props.afterItemCheck(props.offer.id, value)
}

const selectItem = (type: "select" | "cancel", isFilter: boolean) => {
  console.log('ProductSimpleInfo selectItem type isFilter', type, isFilter);
  isFilterMoved.value = isFilter;
  if (type === 'select' && (!isFilter || !props.movedProductNowId)) {
    select.value = true
  } else {
    select.value = false
  }
  return { select: select.value, movedId: props.offer.id };
}
defineExpose({ selectItem })
</script>
<style  lang='less' scoped>
@import "@/style/main.css";
.product-simple-info {
  cursor: default;
  padding: 5px;
  .product-item {
    display: flex;
    height: 23px;
    .product-item-label {
      width: 30%;
      text-align: justify;
      text-align-last: justify;
    }
    .product-item-content {
      width: 70%;
      color: #0072ff;
      .el-tag {
        float: right;
        height: 20px;
        padding: 0 3px;
        margin-right: 5px;
        :deep(.el-tag__content) {

        }
      }
      .el-checkbox {
        height: 20px;
        margin-left: 5px;
      }
      &::before {
        content: ': ';
      }
    }
  }
}
</style>
