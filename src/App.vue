<template>
    <div id="app">
        <app-title-bar />
        <router-view />

        <div class="overlay" v-if="isOverlayVisible">
            Modal content
        </div>

        <transition name="fade">
            <app-loading-screen v-if="!isAppReady" />
        </transition>
    </div>
</template>

<script>
import AppTitleBar from "@/components/AppTitleBar";
import AppLoadingScreen from "@/components/AppLoadingScreen";
import PluginDetailsView from "@/views/PluginDetails";

import { mapActions } from "vuex";

import axios from "axios";




// https://docs.microsoft.com/en-us/windows/apps/design/style/segoe-ui-symbol-font

export default {
    name: "Home",
    data() {
        return {
            isOverlayVisible: false,
            isAppReady: false,
            serverPort: 0,
        };
    },
    components: {
        AppTitleBar,
        AppLoadingScreen,
        PluginDetailsView,
    },
    methods: {
        ...mapActions(["mergeState"]),
        async syncLocalStore() {
            console.log("SERVER READY IN APP.VUE");
            const SERVER_API_URL = "http://localhost:" + this.serverPort;
            console.log(SERVER_API_URL);
            let localStore = await axios.get(SERVER_API_URL + "/store");
            this.mergeState(localStore.data);
            //return
        },
        // async setupTimers() {
        //     setTimeout(async () => {
        //         console.log('Fetching local store in timer..')
        //         let storeData = await this.fetchLocalStore();
        //         console.log(storeData.data);
        //         this.mergeState(storeData.data);
        //         console.log('Finished fetching local store in timer.')
        //         this.setupTimers();
        //     }, 5000);
        // },
    },
    mounted() {
        window.ipcRenderer.receive("server-ready", async (serverPort) => {
            this.serverPort = serverPort;

            await this.syncLocalStore();
            this.isAppReady = true;
            //this.setupTimers();

            window.ipcRenderer.receive("store-changed", async () => {
                console.log("store changed in app.vue");

                //let localStore = await window.ipcRenderer.invoke('read-local-store');
                await this.syncLocalStore();
                //let localStore = await this.fetchLocalStore();
                //this.mergeState(localStore.data);

                // Fetch whole store and merge?
                // store.dispatch('mergeState', localStore);
            });

            // Set up timer to query server
        });

        // Set up timers

        window.ipcRenderer.send("mounted");
    },
};
</script>

<style>
html,
body {
    min-height: 100%;
    height: 100%;

    font-family: Arial;
    font-weight: 300;
}

#app {
    height: 100%;
    position: relative;
}

.overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    padding: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5000;
    color: #fff;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
