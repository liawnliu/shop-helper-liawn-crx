import { waitFor, fireClick, delay, waitRemove, waitForPopup } from '@/utils/index';

const clearMySelect = async(count = 500) => {
  const lastTitles: string[] = [];
  console.log('count', count);
  for (let i = 0; i < count; i += 1) {
    const queryBtn = await waitFor("button.auxo-btn-primary", "查询");
    if (queryBtn) {
      fireClick(queryBtn);
      await waitRemove("span.auxo-spin-dot-spin");
    } else {
      break;
    }
    const trs = document.querySelectorAll("div.auxo-table-body table tr.auxo-table-row");
    let tr;
    for (let i = 0; i < trs.length; i += 1) {
      const item = trs[i];
      if (item) {
        const title = (item.querySelector("div.index-module-name--gKEFF")  as HTMLElement )?.innerText;
        if (!lastTitles.includes(title)) {
          tr = item;
          console.log('title', title, lastTitles.length);
          lastTitles.push(title);
          break
        }
      }
    }
    if (!tr) continue;
    const removeBtn = tr.querySelector("td:nth-child(9) > div > button:nth-child(3)");
    // console.log('removeBtn', removeBtn, i);
    if (removeBtn) {
      fireClick(removeBtn);
      let popup = await waitForPopup("div.auxo-popconfirm", "auxo-popover-hidden");
      const confirmBtn = popup?.querySelector("div.auxo-popover-buttons > button.auxo-btn.auxo-btn-primary.auxo-btn-sm");
      console.log('confirmBtn', confirmBtn, i);
      if (confirmBtn) {
        fireClick(confirmBtn);
        await waitRemove("div.auxo-message-success", "移除选品成功");
      }
    }
    await delay(500);
  }
}
export default clearMySelect
