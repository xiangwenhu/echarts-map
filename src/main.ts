import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/display.css' // 引入基于断点的隐藏类
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus, { size: 'default' })

app.use(createPinia())
app.use(router)

app.mount('#app')
