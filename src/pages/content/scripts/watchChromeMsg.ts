import { ModulesType } from '../index'

const watchChromeMsg = (contentScriptModules: ModulesType) => {
  chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
    try {
      const { type, taskName, params }: { type: string, taskName: TaskKeys, params: never } = message;
      console.log('watchMsg addListener type taskName params', type, taskName, params);
      if (type === 'runTask') {
        const taskFunc = contentScriptModules[taskName];
        if (taskFunc) {
          sendResponse(await taskFunc(params));
        } else {
          console.warn(`content watchMsg runTask ${taskName} 没有可执行的函数`);
        }
      }
    } catch (error) {
      console.warn('content watchMsg runTask', error);
    }
  });
}
export default watchChromeMsg;
