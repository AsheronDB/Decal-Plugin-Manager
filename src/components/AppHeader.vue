<template>
    <header>
        <h1>Decal Plugin Manager</h1>
        <nav>
            <ul>
                <li>
                    <router-link to="/">
                        <font-awesome-icon :icon="icons.faCube" class="icon"></font-awesome-icon>My Plugins
                    </router-link>
                </li>
                <li>
                    <router-link to="/getplugins">
                        <font-awesome-icon :icon="icons.faSearch" class="icon"></font-awesome-icon>Get Plugins
                    </router-link>
                </li>
                <li>
                    <router-link to="/settings">
                        <font-awesome-icon :icon="icons.faCog" class="icon"></font-awesome-icon>Settings
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
import { faSearch, faCube, faCog } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "AppHeader",
    data() {
        return {
            icons: {
                faSearch,
                faCube,
                faCog,
            },
        };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
    flex: 0 0 auto;
    background: #682725;
    padding-top: 0px;

    /* -webkit-app-region: drag; */
}

h1 {
    color: #fff;
    margin: 0;
    padding: 10px 0 15px 0;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    -webkit-user-select: none;
}

nav {
}

nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: center;
}

nav ul li {
    display: inline-block;
    margin-right: 6px;
}

nav ul li a {
    text-decoration: none;
    padding: 8px 14px;

    border-radius: 4px 4px 0 0;
    display: block;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
    transition: background-color 0.08s linear;
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: no-drag;
    cursor: default;
}

nav ul li a:hover {
    background: #763732;
}

nav ul li a.router-link-active {
    background: #540c06;
}

.icon {
    margin-right: 8px;
}
</style>
