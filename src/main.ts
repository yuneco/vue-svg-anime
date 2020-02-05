import Vue from 'vue'
import App from './App.vue'
import store from './store'
import CompositionApi from '@vue/composition-api'

Vue.config.productionTip = false
Vue.use(CompositionApi)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
