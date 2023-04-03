import { waitFor } from '@/utils/index'

export type MovedProducts = Record<string, string>;

const getMovedProducts = async(): Promise<MovedProducts> => {
  const movedProducts: MovedProducts = {};

  const productListTable = await waitFor('table.J_productListTable');
  if (!productListTable) return movedProducts;

  const tds = productListTable.querySelectorAll('tr > td:nth-child(6)');
  console.log('content getMovedProducts tds', tds);
  for (let i = 0; i < tds.length; i += 1) {
      const td = tds[i];
      const a1 = td.querySelector("a.J_showLtaoDetailModal");
      // http://detail.1688.com/offer/684634507146.html?amug_web_biz=fwmkt&amug_web_fl_src=cy
      let url = a1?.getAttribute("data-url");
      url = url?.split("?")[0];
      const arr = url?.split("/");
      url = (arr && arr.length) ? arr[arr.length - 1] : null;
      const movedId = url?.split(".")[0];

      const a2 = td.querySelector("a.J_setMoveProductSource");
      const nowId = a2?.getAttribute("data-product-id");
      if (movedId && nowId) {
        movedProducts[movedId] = nowId;
      }
  }
  return movedProducts;
}
export default getMovedProducts;
