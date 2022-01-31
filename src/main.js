import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueGtag from "vue-gtag";

const GA_MEASUREMENT_ID = "G-F8F4XQRV4L";

// Vue.use(VueGtag, {
//     config: { id: GA_MEASUREMENT_ID },
//     appName: 'Decal Plugin Manager',
//     pageTrackerScreenviewEnabled: true
// }, router);

Vue.config.productionTip = false
import { BootstrapVue } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)



let app;

(async () => {

    //console.log('Hydrating local store...')
    // Hydrate user settings to vuex
    // let localStore = await window.ipcRenderer.invoke('read-local-store', { status: 'init' });
    // console.log(localStore);

    // store.dispatch('mergeState', localStore);

    app = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')

})();

