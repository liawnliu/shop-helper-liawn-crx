import { createApp, App, ref, watch } from 'vue';
import { waitFor } from '@/utils/index'
import ProductSimpleInfo from '../components/ProductSimpleInfo.vue'
import ProductsCheckbox from '../components/ProductsCheckbox.vue'
import { MovedProducts } from './getMovedProducts';

let productVms: Record<string, App<any>> = {};
let productsCheckboxVm: App<any>;
let isFilterMoved = ref(true);

const selectAllFunc = (type: "select" | "cancel", isFilter: boolean) => {
  isFilterMoved.value = isFilter;
  const keys = Object.keys(productVms);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const productVm = productVms[key];
    if (productVm &&  productVm._instance && productVm._instance.exposed && productVm._instance.exposed.selectItem) {
      const { select, movedId } = productVm._instance.exposed.selectItem(type, isFilter);
      console.log('markMoved selectAllFunc selelct movedId', select, movedId);
      if (productsCheckboxVm &&  productsCheckboxVm._instance && productsCheckboxVm._instance.exposed
        && productsCheckboxVm._instance.exposed.changeSelectArr) {
          productsCheckboxVm._instance.exposed.changeSelectArr(select?'add':'delete',movedId);
      }

    }
  }
}

const afterItemCheck = (movedId: string, check: boolean) => {
  if (productsCheckboxVm &&  productsCheckboxVm._instance && productsCheckboxVm._instance.exposed
    && productsCheckboxVm._instance.exposed.changeSelectArr) {
      productsCheckboxVm._instance.exposed.changeSelectArr(check?'add':'delete',movedId);
  }
}

const markMoved = async(offerList: any[]) => {
  productVms = {};
  if (!/^.*\.1688\.com\/page\/offerlist\.htm.*$/g.test(window.location.href)) return
  const rlt = await chrome.storage.local.get('moved-products');
  console.log('rltrltrltrlt', rlt);
  const movedProducts: MovedProducts = rlt['moved-products'];
  if (!offerList || !offerList.length) return
  // #bd_1_container_0 > div > div:nth-child(2) > div:nth-child(6)
  const productTable = await waitFor('#bd_1_container_0 > div > div:nth-child(2) > div:nth-child(6)');
  if (!productTable) return;

  const offerListDiv = productTable.children;

  let canCheakAfterFilter = offerListDiv.length;
  console.log('123123123123123123123offerList', offerList);
  console.log('123123123123123123123offerListDiv', offerListDiv);
  for (let i = 0; i < offerListDiv.length; i += 1) {
    console.log('imgimgimgimgimgimgimgimgimgimg', offerListDiv[i].querySelector("img.main-picture")?.getAttribute("source"));
    const offer = offerList[i];
    if (!offer) {
      console.warn('该offerListDiv没有对应的offer数据！');
      continue
    };
    const item = offerListDiv[i];
    if (item.childNodes[3]) {
      item.removeChild(item.childNodes[3])
    }
    const p = item.querySelector("div > p");
    const title = p?.getAttribute("title");
    // console.log('offerofferoffer', offer);
    if (title !== offer.subject) continue;
    const id = `product-simple-info-${offer.id}`;
    const root = document.createElement("div");
    root.id = id;
    item.appendChild(root);

    const movedProductNowId = movedProducts[offer.id]
    movedProductNowId && (canCheakAfterFilter --);
    /* console.log('afterLoad movedProducts', movedProducts);
    console.log('offer.id', offer.id);
    console.log('movedProductNowId', movedProductNowId); */
    const productVm = createApp(ProductSimpleInfo, { offer, movedProductNowId, afterItemCheck });
    productVm.mount(`#${id}`);
    productVms[id] = productVm;
  }

  const productsCondition = document.querySelector('#bd_1_container_0 > div > div:nth-child(2) > div:nth-child(5) > div > div:nth-child(1)');
  if (productsCondition) {
    const productsCheckboxRoot = document.createElement("div");
    const id = "products-checkbox"
    productsCheckboxRoot.id = id;
    productsCondition.appendChild(productsCheckboxRoot);
    productsCheckboxVm = createApp(ProductsCheckbox, { movedProducts, selectAllFunc });
    productsCheckboxVm.mount(`#${id}`);
  }
  watch(isFilterMoved, (isFilter: boolean) => {
    if (productsCheckboxVm._instance && productsCheckboxVm._instance.exposed
      && productsCheckboxVm._instance.exposed.changeTotal) {
        const total = isFilter ? canCheakAfterFilter : offerListDiv.length;
        productsCheckboxVm._instance.exposed.changeTotal(total)
    }
  }, { immediate: true })
}
export default markMoved;
