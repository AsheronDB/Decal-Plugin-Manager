<template>
    <footer>
        <div class="left">
            <div>AC Client is {{ acClientStatus }}</div><div>Decal is {{ decalStatus }}</div></div>
        <div class="version">{{ installedPluginsCount }} Plugins</div>
        <div class="version">v0.1.0</div>
    </footer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "AppHeader",
    computed: {
        acClientStatus() {
            return this.programs.acclient.running ? "running" : "not running";
        },
        decalStatus() {
            return this.programs.decal.installed ? "installed" : "not installed";
        },
        ...mapGetters(["programs", "installedPluginsCount"]),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
    flex: 0 0 auto;
    background: #333333;
    padding: 6px;
    flex-direction: row;
    color: #fff;
    display: flex;
}

footer .left {
    flex: 1 1 auto;
}

footer .version {
    flex: 0 0 auto;
    opacity: 0.65;
    padding-right: 8px;
    font-size: 12px;
}
</style>
