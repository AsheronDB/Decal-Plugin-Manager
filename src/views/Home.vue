<template>
    <div id="home">
        <app-header />
        <main>
            <router-view />
        </main>
        <app-footer />
    </div>
</template>

<script>
// @ is an alias to /src
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
    name: "Home",
    components: {
        AppHeader,
        AppFooter,
    },
};
</script>

<style scoped>
#home {
    display: flex;
    flex-direction: column;

    height: 100%;
}

#home main {
    flex: 1 1 auto;
    background: #444444;
    color: #fff;
    overflow: hidden;
}

.overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
