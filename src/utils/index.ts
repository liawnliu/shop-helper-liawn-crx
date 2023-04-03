// 向页面注入JS
export function injectCustomJs(jsPath: string, loadCallBack: Function) {
  if (!jsPath) return;
  const temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  temp.src = chrome.runtime.getURL(jsPath);
  loadCallBack && (temp.onload = function() {
      loadCallBack(temp);
  });
  (document.head || document.documentElement).appendChild(temp);
}
export const isJsonStr = (str: string) => {
  try {
      const obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
          return true;
      } else {
          return false;
      }
  } catch (e) {
      return false;
  }
}
export const delay = (time: number) => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(undefined);
      }, time)
  })
}
// 查询
export const queryByText = (selector: string, text: string, target: Element | Document) => {
  target = target || document;
  const qall = target.querySelectorAll(selector);
  if (text == ''){
      return qall[0];
  }
  for (let i = 0; i < qall.length; i += 1) {
      const element = qall[i];
      if (element.innerHTML.includes(text)){
          return element;
      }
  }
};
export const waitFor = async(selector: string, text: string = '', target: Element | Document = document, time: number = 10000) => {
  const t = 300;
  const length = Math.ceil(time / t);
  for (let i = 0; i < length; i += 1) {
      const el = queryByText(selector, text, target)
      if (el) return el;
      await delay(t);
  }
}
export const waitForPopup = async(popupSelector: string, hiddenClass: string, target: Element | Document = document, time: number = 10000) => {
  let popup;
  const t = 300;
  const length = Math.ceil(time / t);
  for (let i = 0; i < length; i += 1) {
    const popconfirms = document.querySelectorAll(popupSelector); // "div.auxo-popconfirm"
    for (let i = 0; i < popconfirms.length; i += 1) {
      const popconfirm = popconfirms[i];
      // "auxo-popover-hidden"
      if (!popconfirm.classList.contains(hiddenClass)) {
        popup = popconfirm;
        break;
      }
    }
    if (popup) return popup
    await delay(t);
  }
}
export const waitRemove = async(selector: string, text: string = '', target: Element | Document = document, time: number = 8000) => {
  const t = 200;
  const length = Math.ceil(time / t / 2);
  let el;
  for (let i = 0; i < length; i += 1) {
      el = queryByText(selector, text, target)
      if (el) {
        console.log('waitRemove1', el);
        break
      }
      await delay(t);
  }
  if (el) {
    for (let i = 0; i < length; i += 1) {
      el = queryByText(selector, text, target);
      if (!el) {
        console.log('waitRemove2', el);
        break
      }
      await delay(t);
    }
  }
}
// 模拟点击事件
export const fireClick = (node: Element) => {
  node.dispatchEvent(new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
  }));
};
// 模拟输入事件
export const fireInput = (node: Element) => {
  node.dispatchEvent(new InputEvent('input'));
};
// 模拟change事件
export const fireChange = (node: HTMLSelectElement, val: string) => {
  node.value = val;
  node.dispatchEvent(new Event("change", {
      bubbles: true,
      cancelable: true,
  }));
};
export function getUrlsFromHref(selector: string, from: Element | Document) {
  const urls = [];
  const tds = from.querySelectorAll(selector);
  for (let i = 0; i < tds.length; i += 1) {
      const td = tds[i];
      const a = td.querySelector("a");
      const url = a?.getAttribute("href");
      url && urls.push(url);
  }
  return urls;
}
export function getIdsFromLinkInnerText(selector: string, from: Element | Document) {
  const ids = [];
  const tds = from.querySelectorAll(selector)
  for (let i = 0; i < tds.length; i += 1) {
      const td = tds[i];
      const a = td.querySelector("a");
      const id = a?.innerText;
      id && ids.push(id)
  }
  return ids;
}
export function getTextByAttr(selector: string, from: Element | Document, attr: string) {
  const vals = [];
  const els = from.querySelectorAll(selector);
  for (let i = 0; i < els.length; i += 1) {
    const el = els[i];
    const tar = el.querySelector(`[${attr}]`);
    const val = tar?.getAttribute(attr);
    val && vals.push(val)
  }
  return vals;
}
