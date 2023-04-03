import { MovedProducts } from '@/pages/content/tasks/getMovedProducts'

const url = 'https://dd.chengji-inc.com/product/product/manage';
const key = 'moved-products';

const getMovedProducts = async(isForce: boolean): Promise<MovedProducts> => {
  let movedProducts = {};
  try {
    if (isForce) {
      const tabs = await chrome.tabs.query({ url });
      const tabId = (tabs && tabs.length) ? tabs[0].id : null;
      if (!tabId) return movedProducts;
      const taskName: TaskKeys = 'getMovedProducts';
      movedProducts = await chrome.tabs.sendMessage(tabId, { type: 'runTask', taskName });
      if (movedProducts) {
        const temp: { [key: string]: MovedProducts } = {};
        temp[key] = movedProducts;
        await chrome.storage.local.set(temp);
      }
    } else {
      const rlt = await chrome.storage.local.get(key);
      movedProducts = rlt[key] || {};
    }
  } catch (error) {
    console.warn('popup getMovedProducts', error);
  } finally {
    return movedProducts;
  }
}
export default getMovedProducts;
