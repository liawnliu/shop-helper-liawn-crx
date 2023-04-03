import { waitFor } from "@/utils/index";

type DataType = {
  index: number,
  title: string,
  originNum?: number,
  nowNum?: number,
  children: DataType[]
}
type TempDataType = {
  title: string,
  rowspan: number | null,
  nowIndex: number,
  handleNum: number,
  el: HTMLElement
}
let tree: DataType[] = [];
const createTreeRecurrence = (td: HTMLElement, parentChildren: DataType[] | undefined, index:number, lastData: DataType | undefined = undefined) => {
  const rowspan = td.getAttribute("rowspan")
  if (rowspan == null || (rowspan && Number(rowspan) > 0)) {
    const title: string = (td.querySelector("div > span:nth-child(1) > span") as HTMLElement)?.innerText;
    const data: DataType = { index, title, children: [] };
    parentChildren && parentChildren.push(data);
    return data;
  }
  return lastData;
}
const hideCellsRecurrence = (arr: DataType[], level = 1) => {
  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i];
    item.originNum = item.nowNum = item.children.length;
    if (item.children && item.children.length) {
      hideCellsRecurrence(item.children, level + 1)
    }
    if (level === 4) {

    }
  }
}
const showTargetDeposit = async({ deposit, type, revise }: {deposit: string, type: 'contain' | 'equal', revise: boolean | undefined}) => {
  console.log('depositdepositdepositdeposit', deposit);
  const tbody = await waitFor('div.tb-scrollable-children > table > tbody');
  if (!tbody) return
  const trs = tbody.children;
  // tr:nth-child(245)
  // tr:nth-child(255)
  if (revise) {
    for (let i = 254; i >= 244; i -= 1) {
      const tr = trs ? trs[i] : null;
      const td = tr?.children[0];
      if (td) {
        if (i === 244) {
          td.setAttribute("rowspan", 254 - 244 + 1 + '');
          td.classList.remove("table-hide");
        } else {
          td.setAttribute("rowspan", '0');
          td.classList.add("table-hide");
        }
      }
    }
  }

  let lastFirstTdObject: TempDataType | null = null
  let lastSecondTdObject: TempDataType | null = null
  let lastThirdTdObject: TempDataType | null = null;
  for (let i = 0; i < trs.length; i += 1) {
    if (i < 2) continue;
    const tr = trs[i];
    const tds = tr.children;

    const firstTd = tds[0] as HTMLElement;
    const firstTdRowspan = firstTd.getAttribute("rowspan");
    const firstTdTitle = (firstTd.querySelector("span:nth-child(1) > span") as HTMLElement)?.innerText;
    if (firstTdRowspan == null || (firstTdRowspan && Number(firstTdRowspan) > 0)) {
      lastFirstTdObject = {
        title: firstTdTitle,
        rowspan: firstTdRowspan ? Number(firstTdRowspan) : null,
        nowIndex: 1,
        handleNum: 0,
        el: firstTd
      }
    } else {
      lastFirstTdObject && (lastFirstTdObject.nowIndex ++)
    }

    const secondTd = tds[1] as HTMLElement;
    const secondTdRowspan = secondTd.getAttribute("rowspan");
    const secondTdTitle = lastFirstTdObject?.title + '-' + (secondTd.querySelector("span:nth-child(1) > span") as HTMLElement)?.innerText;
    if (secondTdRowspan == null || (secondTdRowspan && Number(secondTdRowspan) > 0)) {
      lastSecondTdObject = {
        title: secondTdTitle,
        rowspan: secondTdRowspan ? Number(secondTdRowspan) : null,
        nowIndex: 1,
        handleNum: 0,
        el: secondTd
      }
    } else {
      lastSecondTdObject && (lastSecondTdObject.nowIndex ++)
    }

    const thirdTd = tds[2] as HTMLElement;
    const thirdTdRowspan = thirdTd.getAttribute("rowspan");
    const thirdTdTitle = lastSecondTdObject?.title + '-' + (thirdTd.querySelector("span:nth-child(1) > span") as HTMLElement)?.innerText;
    if (thirdTdRowspan == null || (thirdTdRowspan && Number(thirdTdRowspan) > 0)) {
      lastThirdTdObject = {
        title: thirdTdTitle,
        rowspan: thirdTdRowspan ? Number(thirdTdRowspan) : null,
        nowIndex: 1,
        handleNum: 0,
        el: thirdTd
      }
    } else {
      lastThirdTdObject && (lastThirdTdObject.nowIndex ++)
    }

    const text = (tds[4]?.querySelector("span:nth-child(1) > span") as HTMLElement)?.innerText.trim();
    // 保留
    if ((type === 'equal' && text === deposit)
      || (type === 'contain' && ((text === deposit && deposit === '/') || (Number(text) <= Number(deposit))))
      || deposit === 'All') {
      for (let j = tds.length - 1; j >= 0; j -= 1) {
        const td = tds[j] as HTMLElement;
        if (!td) continue;
        if (j >= 3) {
          td.classList.remove("table-hide");
        } else {
          const rowspan = td.getAttribute("rowspan");
          if (rowspan == null || (rowspan && Number(rowspan) > 0)) {
            td.classList.remove("table-hide");
          } else {
            td.classList.add("table-hide");
          }
        }
      }
    } else if (text !== deposit) { // 去掉
      lastFirstTdObject && lastFirstTdObject.handleNum ++;
      lastSecondTdObject && lastSecondTdObject.handleNum ++;
      lastThirdTdObject && lastThirdTdObject.handleNum ++;
      for (let j = tds.length - 1; j >= 0; j -= 1) {
        const td = tds[j] as HTMLElement;
        if (!td) continue;
        if (j >= 3) {
          td.classList.add("table-hide");
        }
      }
      console.log('lastFirstTdObject', i, lastFirstTdObject);
      console.log('lastSecondTdObject', i, lastSecondTdObject);
      console.log('lastThirdTdObject', i, lastThirdTdObject);
      if (lastThirdTdObject?.rowspan == null || (lastThirdTdObject?.rowspan === lastThirdTdObject?.nowIndex
        && lastThirdTdObject?.handleNum === lastThirdTdObject?.rowspan)) {
          lastThirdTdObject && (lastThirdTdObject.el.classList.add("table-hide"));
      } else {
        lastThirdTdObject && (lastThirdTdObject.el.classList.remove("table-hide"));
      }
      if (lastSecondTdObject?.rowspan == null || (lastSecondTdObject?.rowspan === lastSecondTdObject?.nowIndex
        && lastSecondTdObject?.handleNum === lastSecondTdObject?.rowspan)) {
          lastSecondTdObject && (lastSecondTdObject.el.classList.add("table-hide"));
      } else {
        lastSecondTdObject && (lastSecondTdObject.el.classList.remove("table-hide"));
      }
      if (lastFirstTdObject?.rowspan == null || (lastFirstTdObject?.rowspan === lastFirstTdObject?.nowIndex
        && lastFirstTdObject?.handleNum === lastFirstTdObject?.rowspan)) {
          lastFirstTdObject && (lastFirstTdObject.el.classList.add("table-hide"));
      } else {
        lastFirstTdObject && (lastFirstTdObject.el.classList.remove("table-hide"));
      }
    }
  }
}
export default showTargetDeposit;
