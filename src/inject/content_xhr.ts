import { injectCustomJs } from '@/utils'

injectCustomJs('my_xhr.main.js', function(temp: Element) {
  // 放在页面不好看，执行完后移除掉
  temp && temp.parentNode && temp.parentNode.removeChild(temp);
});
