import importAllTask from './scripts/importAllTask';
import watchChromeMsg from './scripts/watchChromeMsg';
import watchXhrRes from './scripts/watchXhrRes';

export type ModulesType = {
  [key in TaskKeys]?: (params?: any) => Promise<any>
};

const contentScriptModules: ModulesType = {};

// 先导入所有的任务到contentScriptModules
importAllTask(contentScriptModules);
// 监听xhr返回值，执行对应的操作
watchXhrRes(contentScriptModules);
// 监听chrome.runtime.onMessage消息，执行对应的任务
watchChromeMsg(contentScriptModules);

