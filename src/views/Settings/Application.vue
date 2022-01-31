<template>
    <div>
        <header>
            <h2>Application</h2>
        </header>

        <div>

    
            Launch at startup<br/>
            Telemetry <button @click="onClickTelemetry">Telemetry</button><br/>

        </div>
    </div>
</template>

<script>
export default {
    name: "SettingsApplicationView",
    data() {
        return {};
    },
    methods: {
        onClickTelemetry() {
            this.$gtag.optIn();
        }
    },
};
</script>

<style scoped>
header {
    border-bottom: 1px solid red;
}
</style>