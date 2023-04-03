<template>
  <div class="chrome_container">
    <el-form :model="form" class="popup-form">
      <el-form-item class="show-target-deposit">
        <el-select v-model="form.deposit" placeholder="Select" size="small">
          <el-option
            v-for="(item, index) in depositArr"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-radio-group v-model="form.depositRadio">
          <el-radio label="contain" size="small">包含</el-radio>
          <el-radio label="equal" size="small">相等</el-radio>
        </el-radio-group>
        <el-button type="primary" size="small" @click="showTargetDeposit">展示目标保证金</el-button>
      </el-form-item>
      <el-form-item class="moved-filter" label="妙手">
        <el-button type="primary" size="small" @click="getMovedProducts(true)">
          已搬家商品({{movedProductsLength}})
        </el-button>
      </el-form-item>
      <el-form-item class="clea-my-select" label="抖链">
        <el-input-number v-model="form.clearMySelectCount" :min="1" :max="1000" size="small" />
        <el-button type="primary" size="small" @click="clearMySelect">清除选品</el-button>
      </el-form-item>
      <el-form-item class="create-product">
        <span>供价: </span>
        <!-- <el-input size="small" v-model:value="form.providePrice" @input="priceChange('provide', $event)"/> -->
        <el-input size="small" v-model="form.providePrice"/>
        <span>定价: </span>
        <!-- <el-input size="small" v-model:value="form.sellPrice" @input="priceChange('sell', $event)"/> -->
        <el-input size="small" v-model="form.sellPrice"/>
        <span>实售: {{form.realPrice}}。</span>
        <!-- <span>到手: {{form.finallPrice}}。</span> -->
        <el-button type="primary" size="small" @click="createProduct">生成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">

import { MovedProducts } from '@/pages/content/tasks/getMovedProducts'
import getMovedProductsTask from './scripts/getMovedProducts'
import clearMySelectTask from './scripts/clearMySelect'
import showTargetDepositTask from './scripts/showTargetDeposit'
import createProductTask from './scripts/createProduct'

const form = ref({
  aliUrl: '',
  clearMySelectCount: 1,
  deposit: 'All',
  depositRadio: 'contain',
  providePrice: 0,
  sellPrice: 0,
  finallPrice: 0,
  realPrice: 0
});
const movedProducts = ref<MovedProducts>({});
const movedProductsLength = computed(() => Object.keys(movedProducts.value).length)
const depositArr = ref(['2000', '5000', '10000', '20000', '30000', '50000', '100000', '200000', '500000', '/', 'All']);

onMounted(() => {
  getMovedProducts();
});

const getMovedProducts = async(isForce = false) => {
  movedProducts.value = await getMovedProductsTask(isForce);
};
const clearMySelect = async() => {
  await clearMySelectTask(form.value.clearMySelectCount);
};
const showTargetDeposit = async() => {
  await showTargetDepositTask(form.value.deposit , form.value.depositRadio as ('contain' | 'equal'), true)
}
watch(() => {
  return [form.value.providePrice, form.value.sellPrice]
}, (arr, prevArr) => {
  const providePriceStr = arr[0]; // 字符串
  const sellPriceStr = arr[1]; // 字符串
  const prevProvidePrice = prevArr[0]; // 数值
  const prevSellPrice = prevArr[1]; // 数值

  console.log('watch price', arr, prevArr);

  // priceChange里重复赋值，也会引起watch监听，但可用number类型来避免重复执行。因为正常输入是string类型
  if (typeof providePriceStr === 'number' && typeof sellPriceStr === 'number') return

  if (typeof providePriceStr === 'string') {
    if (Number.isNaN(providePriceStr)) return
    priceChange('provide', Number(providePriceStr));
  } else if (typeof sellPriceStr === 'string') {
    if (Number.isNaN(sellPriceStr)) return
    priceChange('sell', Number(sellPriceStr));
  }

});
const priceChange = (type: string, val: number)=> {
  console.log('type', val, type, form.value.providePrice, form.value.sellPrice);
  if (!val) {
    form.value.providePrice = 0;
    form.value.sellPrice = 0;
    form.value.realPrice = 0
    form.value.finallPrice = 0;
    return
  }
  const limitRate = 1; // 限时限量购
  const rate = 1 - 0.01 - 0.01;
  if (type === 'provide') {
    form.value.providePrice = val;
    //  rate店铺其他费用比例。 1-0.06=0.94，这个0.06是提现手续费
    form.value.sellPrice = Number(((val / rate / 0.94 + 5) / (limitRate - 0.16)).toFixed(2));
  } else if (type === 'sell') {
    form.value.sellPrice = val;
    form.value.providePrice = Number(((val * (limitRate - 0.16) - 5) * rate * 0.94).toFixed(2));
  }
  const realPrice = Number((form.value.sellPrice * limitRate).toFixed(2));
  form.value.realPrice = Number((realPrice - Math.floor((realPrice - 20) / 10) * 2 - 7 - 2).toFixed(2));
  form.value.finallPrice = Number((form.value.realPrice * rate * 0.94 - 2).toFixed(2));
}
const createProduct = async() => {
  await createProductTask(form.value.sellPrice);
}
</script>

<style  lang='less' scoped>
@import "@/style/main.css";
.chrome_container {
  width: 350px;
  background-color: white;
  .popup-form {
    width: 100%;
    .el-form-item{
      .el-button, .el-input {
        display: inline-block;
      }
    }
    .clea-my-select,show-target-deposit {
      .el-button, .el-input {
        width: 29%;
        margin: 2%;
      }
    }
    .show-target-deposit{
      .el-select,.el-button, .el-radio-group {
        width: 29%;
        margin: 2%;
        .el-radio {
          margin-right: 5px
        }
      }
    }
    .create-product {
      .el-input {
        width: 50px;
      }
    }
  }
}
</style>
