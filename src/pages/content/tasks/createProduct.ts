const { waitFor, fireClick, fireInput, fireChange, delay } = require('@/utils/index');

const createProduct = async(params: { [key: string]: { providePrice: number, sellPrice: number } } | number | undefined) => {
  console.log('createProduct params', params);

  const shortTitleBtn = await waitFor("button", "一键智能生成")
  shortTitleBtn && fireClick(shortTitleBtn);

  const addSizeBtn = await waitFor("button", "添加尺码", undefined, 300)
  addSizeBtn && fireClick(addSizeBtn);

  const addSizeLabel = await waitFor("div.ecom-g-zform-item-label", "尺码模板", undefined, 300)
  if (addSizeLabel) {
    const input = addSizeLabel.parentElement.querySelector("div.ecom-g-zform-item-control div.ecom-g-select-selector input");
    console.log('input', input);
    input && fireChange(input, '女装尺码2');
    await delay(2000);
    const label = await waitFor("div[title='女装尺码2']");
    console.log('label', label);
    label && fireClick(label);
    await delay(2000);
    const model = await waitFor("div.ecom-g-modal-header", "添加尺码信息")
    const submitBtn = model.parentElement.querySelector("div.ecom-g-modal-footer div.ecom-g-space-horizontal button");
    submitBtn && fireClick(submitBtn);
  }
  await delay(1500);

  const deliveryTimeBtn = await waitFor("span", "48小时")
  deliveryTimeBtn && fireClick(deliveryTimeBtn)
  await delay(500);

  // 拿到售价才设置sku的价格
  if (params) {
    const skuTrs = document.querySelectorAll("div.index_skuTableNew__3xs2L div.ecom-g-table-body table tr")
    if (typeof params === 'number') {
      for (let i = 0; i < skuTrs.length; i += 1) {
        const tr = skuTrs[i];
        const prefix = tr.querySelector("span.ecom-g-input-prefix");
        if (prefix) {
          if (prefix.innerHTML.includes('￥')) {
            const priceInput = prefix.parentElement?.querySelector("input");
            priceInput && fireChange(priceInput, params);
            await delay(100);
          }
        }
      }
    } else {
      // #full-screen-card > div > div:nth-child(2) > div > div > div > div.ecom-g-table-wrapper.custom-style-gray.index_skuTableNew__3xs2L.sku-table-create > div > div > div > div > div.ecom-g-table-header > table > thead > tr > th.ecom-g-table-cell.ecom-g-table-cell-fix-left.ecom-g-table-cell-fix-left-last > div
      const headTr = document.querySelector("div.index_skuTableNew__3xs2L div.ecom-g-table-header table tr");
      const hasCase = !(headTr?.childNodes[1]?.firstChild as HTMLElement)?.innerHTML.includes('价格');
      console.log('hasCase', hasCase);
      if (!hasCase) {
        for (let i = 0; i < skuTrs.length; i += 1) {
          const tr = skuTrs[i];
          if (tr.getAttribute("aria-hidden")) continue;
          const skuNameTd = tr.childNodes[0] as HTMLElement;
          const skuName = (skuNameTd?.firstChild as HTMLElement)?.innerText.trim()
          const obj = params[skuName];
          if (obj) {
            const prefix = tr.querySelector("span.ecom-g-input-prefix");
            if (prefix?.innerHTML.includes('￥')) {
              const priceInput = prefix.parentElement?.querySelector("input");
              priceInput && fireChange(priceInput, params[skuName]?.sellPrice);
              await delay(100);
            }
          }
        }
      } else {
        // 有“套餐”
        let lastFirstTdName;
        for (let i = 0; i < skuTrs.length; i += 1) {
          const tr = skuTrs[i];
          if (tr.getAttribute("aria-hidden")) continue;
          const firstTd = tr.childNodes[0] as HTMLElement;
          const secondTd = tr.childNodes[1] as HTMLElement;
          const rowspan = firstTd.getAttribute("rowspan");
          let skuName;
          console.log('rowspan', rowspan);
          if (rowspan) {
            // 折叠的第一行，那么secondTd是“套餐”
            lastFirstTdName = (firstTd?.firstChild as HTMLElement)?.innerText.trim();
            skuName = lastFirstTdName + '-*-' + (secondTd.firstChild as HTMLElement).innerText.trim();
          } else if (firstTd.classList.contains("ecom-g-table-cell-fix-left-last")) {
            // 折叠的第n行（非第一行），那么firstTd就是“套餐”
            skuName = lastFirstTdName + '-*-' + (firstTd.firstChild as HTMLElement).innerText.trim();
          } else {
            // 有“套餐”，但是没有折叠
            skuName = (firstTd?.firstChild as HTMLElement)?.innerText.trim();
            skuName = skuName + '-*-' + (secondTd.firstChild as HTMLElement).innerText.trim();
          }
          console.log('skuName', skuName);
          const obj = params[skuName];
          if (obj) {
            const prefix = tr.querySelector("span.ecom-g-input-prefix");
            if (prefix?.innerHTML.includes('￥')) {
              const priceInput = prefix.parentElement?.querySelector("input");
              priceInput && fireChange(priceInput, params[skuName]?.sellPrice);
              await delay(100);
            }
          }
        }
      }
    }
  }

  const stockBtn = await waitFor("span", "付款减库存")
  stockBtn && fireClick(stockBtn);

  const carriageInput = document.querySelector("div[attr-field-id='运费模板'] input");
  // 除偏远地区，统一运费 2 元
  carriageInput && fireChange(carriageInput, "除偏远地区全国包邮");
  const carriageLabel = document.querySelector("div[title='除偏远地区全国包邮']");
  carriageLabel && fireClick(carriageLabel);

  const aftermarketSelect = await waitFor("span", "请选择无理由售后规则");
  const aftermarketInput = aftermarketSelect.parentElement.querySelector("input");
  aftermarketInput && fireChange(aftermarketInput, '支持7天无理由退货');
  let aftermarketLabel = document.querySelector("div[title*='不支持']");
  aftermarketLabel = aftermarketLabel || (document.querySelector("div[title='支持7天无理由退货']"));
  aftermarketLabel && fireClick(aftermarketLabel);

  const moreBtn = await waitFor("a", "更多内容");
  moreBtn && fireClick(moreBtn);

  const draftBtn = await waitFor("span", "放入仓库");
  draftBtn && fireClick(draftBtn);
}

export default createProduct;
