

const createProduct = async(price: number) => {
  const taskName: TaskKeys = 'createProduct';
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = (tabs && tabs.length) ? tabs[0].id : null;
  if (!tabId) return
  await chrome.tabs.sendMessage(tabId, { type: 'runTask', taskName, params: price });
}
export default createProduct
