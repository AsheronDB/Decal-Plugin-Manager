<template>
    <div>
        <header>
            <h2>Decal</h2>
        </header>

        <div>

            <p>Decal is installed.</p>

            <p>Current version: {{ programs.decal.version }}</p>

            <p>Installation path: {{ programs.decal.directory }}</p>

            <p>Launch Decal -- Open Folder</p>
            
            {{ decal }}</div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "SettingsDecalView",
    computed: {
        ...mapGetters(["programs"]),
    },
};
</script>

<style scoped>

header { border-bottom: 1px solid red; }
</style>