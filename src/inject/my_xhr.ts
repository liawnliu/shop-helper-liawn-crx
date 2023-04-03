import { isJsonStr } from '@/utils/index'
type MyXHR = {
  _method: string,
  _url: string | URL
};
type MyOpenArg = [
  method: string,
  url: string | URL,
  async: boolean,
  username?: string | null | undefined,
  password?: string | null | undefined
];
type MySendArg = [body?: Document | XMLHttpRequestBodyInit | null | undefined];
// content_scripts中的run_at要设置为document_start，不然有个别接口截取不到（因为太晚了）
(function () {
  const XHR = XMLHttpRequest.prototype as XMLHttpRequest & MyXHR;
  const open = XHR.open;
  const send = XHR.send;

  XHR.open = function (method, url) {
      this._method = method;
      this._url = url;
      return open.apply(this, arguments as MyOpenArg & IArguments);
  };

  XHR.send = function (postData) {
      this.addEventListener('load', () => {
        const response = this.response;
        console.log('typeof response', typeof response);
        if (isJsonStr(response)) {
            const content = JSON.parse(response);
            if (content.data && content.data.content && content.data.content.enMemberId && content.data.content.offerList
                && content.data.content.offerList.length) {
                const offerList = content.data.content.offerList;
                console.log('content_xhr offerList1 content_xhr offerList1 content_xhr offerList1', offerList);
            }
        }
        window.postMessage({ type: 'ajaxInterceptorXHR', to: 'content_xhr', response: this.response, url: this._url }, '*');
      });
      return send.apply(this, arguments as MySendArg & IArguments);
  };
})();

(function () {
  let origFetch = window.fetch;
  window.fetch = async function (...args) {
      const response = await origFetch(...args);
      response
          .clone()
          .blob() // 此处需要根据不同数据调用不同方法，这里演示的是二进制大文件，比如音频
          .then(data => {
              // 对于二进制大文件可以创建为URL(blob:开头)，供其它脚本访问
              // window.postMessage({ type: 'ajaxInterceptorFetch', to: 'content_xhr', response: URL.createObjectURL(data) }, '*'); // send to content script
          })
          .catch(err => console.error(err));
      return response;
  }
})();
