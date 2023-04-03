import { ModulesType } from '../index'
import { isJsonStr } from '@/utils/index'

const watchXhrRes = (contentScriptModules: ModulesType) => {
  // 执行如下代码, 其他window可以监听分发的message:
  window.addEventListener("message", async function(event) {
    const data = event.data;
    if (data.to === 'content_xhr' && (data.type === 'ajaxInterceptorXHR' || data.type === 'ajaxInterceptorFetch')) {
        if (/^\/\/h5api\.m\.1688\.com\/h5\/mtop\.1688\.shop\.data\.get\/1\.0\/.*api=mtop\.1688\.shop\.data\.get.*$/g.test(data.url)) {
            const response = data.response;
            console.log('typeof response', typeof response);
            if (isJsonStr(response)) {
                const content = JSON.parse(response);
                if (content.data && content.data.content && content.data.content.enMemberId && content.data.content.offerList
                    && content.data.content.offerList.length) {
                    const offerList = content.data.content.offerList;
                    const func = contentScriptModules['markMoved'];
                    func && func(offerList)
                }
            }
        }
    }
  }, false);
}

export default watchXhrRes;
