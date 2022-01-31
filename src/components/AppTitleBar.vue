<template>
    <div id="title-bar">
        <div class="title"></div>
        <div class="title-bar-btns">
            <button class="min-btn" @click="onMinimize">&#xE921;</button>
            <button class="max-btn" @click="onMaximize" v-if="!isMaximized">&#xE922;</button>
            <button class="max-btn" @click="onMaximize" v-if="isMaximized">&#xE923;</button>
            <button class="close-btn" @click="onClose">&#xE8BB;</button>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters(['isMaximized'])
    },
    methods: {
        onClose() {
            window.ipcRenderer.send('close');
        },
        onMinimize() {
            window.ipcRenderer.send('minimize');
        },
        onMaximize() {
           window.ipcRenderer.send('maximize');
        }
    }
};
</script>


<style scoped>

#title-bar {
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 5000;
    
}

#title-bar .title {
    flex: 1 1 auto;
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
}

button {
    font-family: "Segoe MDL2 Assets";
    background: none;
    border: 0;
    padding: 7px 18px;
    font-size: 10px;
    color: #fff;
    transition: background-color 0.08s linear;
    

}

button:hover {
    background: #763732;
    cursor: default !important;
}

button.close-btn:hover {
   color: #fff; 
   background: red;
}
</style>