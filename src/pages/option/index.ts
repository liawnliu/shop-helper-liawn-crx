import { createApp } from 'vue'
import App from './App.vue'
// import store from "./store";
let app
function render() {
    app = createApp(App)
    //   app.use(store)
    app.mount('#option')
}
render()
