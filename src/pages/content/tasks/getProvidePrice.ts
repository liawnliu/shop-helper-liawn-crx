const getProvidePrice = () => {
  const thead = document.querySelector("div.index-module-detailTable--VgCkH > div > div > div > div > div > div > table > thead");
  if (!thead || !thead.firstChild) return
  let providePriceIndex = 0;
  let hasCase = false;
  for (let i = 2; i < thead.firstChild.childNodes.length; i += 1) {
    const th = thead.firstChild.childNodes[i] as HTMLElement;
    if (i <= 1) continue;
    if (i === 2 && th.innerText.trim() !== '库存') hasCase = true
    if (th.innerText === '供货价') {
      providePriceIndex = i;
      break;
    }
  }
  const tbody = document.querySelector("div.index-module-detailTable--VgCkH > div > div > div > div > div > div > table > tbody");
  console.log('tbody', tbody);
  if (!tbody) return
  const sku: { [key: string]: { providePrice: number, sellPrice: number } } = {};
  for (let i = 0; i < tbody.childNodes.length; i += 1) {
    const tr = tbody.childNodes[i] as HTMLElement;
    if (tr.classList.contains("auxo-table-expanded-row")) continue;
    const skuNameTd = tr.childNodes[1] as HTMLElement;
    let skuName: string = skuNameTd?.innerText.trim();
    if (hasCase) {
      skuName = skuName + '-*-' +(tr.childNodes[2] as HTMLElement)?.innerText;
    }
    if (!skuName) continue;
    const providePriceTd = tr.childNodes[providePriceIndex] as HTMLElement;
    let providePrice: string | number = providePriceTd?.innerText.trim();
    if (!providePrice) continue;
    providePrice = Number(providePrice)
    const limitRate = 1; // 限时限量购
    const rate = 1 - 0.01 - 0.01;
    let sellPrice: number = 0;
    if (providePrice >= 11) {
      sellPrice = Number(((providePrice / rate / 0.94 + 5) / (limitRate - 0.16)).toFixed(2));
    } else {
      sellPrice = Number(((providePrice / rate / 0.94 + 5) / limitRate).toFixed(2))
    }
    sku[skuName] = { providePrice, sellPrice };
  }
  console.log('sku', sku);
  return sku;
}
export default getProvidePrice;
