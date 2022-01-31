<template>
<div id="app-load-screen" :class="{ visible: visible }">
    <div class="company-logo">Loading...</div>
</div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data() {
        return {
            visible: true
        }
    },
    mounted() {
        // setTimeout(() => {
        //     this.visible = true;
        // }, 5);
    }
}
</script>

<style scoped>
#app-load-screen {

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #444444;
    z-index: 5000;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#app-load-screen .company-logo {
    font-size: 32px;
    opacity: 0;
    transition: opacity 6s ease;

    /*background: transparent url('../assets/img/turnsail-logo.png') no-repeat center center;*/
    height: 400px;
    width: 400px;
    background-size: contain;

}

#app-load-screen.visible .company-logo {
    opacity: 1;
}

</style>
