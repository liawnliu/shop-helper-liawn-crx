import { axios } from '@/api/useAxios'

chrome.runtime.onMessage.addListener(function (request: any, sender: any, sendResponse: any) {
  switch (request.funType) {
    case 'axios':
      axios(request, sender, sendResponse)
      break;
  }
  //处理异步响应
  return true
});
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.removeAll(function(){
    chrome.contextMenus.create({
      "id" : "getProvidePrice",
      "title": "获取抖链原价和售价"
    });
    chrome.contextMenus.create({
      "id" : "createProduct",
      "title": "填入计算好的售价"
    });
  })
});
let sku: { [key: string]: { providePrice: number, sellPrice: number } }| undefined;
chrome.contextMenus.onClicked.addListener(async function(clickData){
  console.log('clickData', clickData);
  try {
    if (clickData.menuItemId == "getProvidePrice") {
      const tabs = await chrome.tabs.query({ url: "https://bscm.jinritemai.com/views/selection-center/my-selection", active: true, currentWindow: true });
      const taskName = 'getProvidePrice';
      const id = tabs[0] ? tabs[0].id : null;
      id && chrome.tabs.sendMessage(id, { type: 'runTask', taskName }, async res => {
        console.log('getProvidePrice 响应 res',res);
        sku = res;
      });
    } else if (clickData.menuItemId == "createProduct") {
      if (sku) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const taskName = 'createProduct';
        const id = tabs[0] ? tabs[0].id : null;
        id && chrome.tabs.sendMessage(id, { type: 'runTask', taskName, params: sku }, async res => {});
      }
    }
  } catch (error) {
    console.warn('error', error);
  }
})
