<template>
    <div>
        <header>
            <h2>Plugins</h2>
        </header>

        <div>

            <p>Enable plugin providers</p>
            <p>Select which providers may be used to search for and install new plugins.</p>

            <p>{{ providers}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "SettingsAboutView",
    data() {
        return {
            providers: ["AsheronDB"],
        };
    },
};
</script>