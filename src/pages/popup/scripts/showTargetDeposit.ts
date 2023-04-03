const title = '基础保证金标准-抖音电商学习中心';
const showTargetDeposit = async(deposit: string, type: 'contain' | 'equal', revise: boolean = true) => {
  const taskName: TaskKeys = 'showTargetDeposit';
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true } );
  const tabId = (tabs && tabs.length) ? tabs[0].id : null;
  if (!tabId) return
  await chrome.tabs.sendMessage(tabId, { type: 'runTask', taskName, params: { deposit, type, revise } });

}
export default showTargetDeposit;
