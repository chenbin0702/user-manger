import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VChart from 'vue-echarts'

const app = createApp(App)

app.component('VChart', VChart)
app.use(router)
app.use(ElementPlus)
app.mount('#app')