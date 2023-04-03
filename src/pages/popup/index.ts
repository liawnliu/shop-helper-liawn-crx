import { createApp } from 'vue'
import App from './App.vue'
let app
function render() {
  app = createApp(App)
  app.mount('#popup')
}
render()
