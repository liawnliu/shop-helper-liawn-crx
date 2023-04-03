const url = 'https://bscm.jinritemai.com/views/selection-center/my-selection';

const clearMySelect = async(count: number) => {
  const taskName: TaskKeys = 'clearMySelect';
  const tabs = await chrome.tabs.query({ url });
  const tabId = (tabs && tabs.length) ? tabs[0].id : null;
  if (!tabId) return
  await chrome.tabs.sendMessage(tabId, { type: 'runTask', taskName, params: count });
}
export default clearMySelect
