<template>
    <div id="plugin-details">

        <header>
            <div class="nav-bar">
                <font-awesome-icon :icon="icons.faArrowLeft"></font-awesome-icon>
                <router-link :to="returnLink.path">Back</router-link>
            </div>

            <h2>{{ plugin.name }}</h2>
            <p class="author">{{ plugin.author }}</p>
            <p class="version">{{ plugin.version }}</p>
            <nav>
                <ul>
                    <li>
                        <router-link :to="`/details/${plugin.slug}`">Description</router-link>
                    </li>
                    <li>
                        <router-link :to="`/details/${plugin.slug}/gallery`">Gallery</router-link>
                    </li>
                    <li>
                        <router-link :to="`/details/${plugin.slug}/about`">About</router-link>
                    </li>

                </ul>
            </nav>
        </header>

        <div class="content">

            <router-view />
            {{ plugin }}

        </div>

        <footer><div class="install"></div>Install - [ View Homepage ]<div class="uninstall">Remove</div></footer>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "PluginDetails",
    components: {},
    data() {
        return {
            icons: {
                faArrowLeft,
            },
        };
    },
    computed: {
        plugin() {
            return this.combinedPlugins.find(
                (plugin) => plugin.slug == this.$route.params.slug
            );
        },
        returnLink() {
            console.log(this.$route);
            let obj;

            if (this.$route.name == "MyPluginDetails") {
                obj = {
                    path: "/myplugins",
                    label: "My Plugins",
                };
            } else {
                obj = {
                    path: "/getplugins",
                    label: "Get Plugins",
                };
            }
            return obj;
        },
        ...mapGetters(["combinedPlugins"]),
    },
};
</script>

<style scoped>
#plugin-details {

    display: flex;
    flex-direction: column;
    overflow: hidden;
    
}
#plugin-details h2 {
    font-size: 21px;
    margin: 0;
    padding: 0;
}

#plugin-details header .version {
    opacity: 0.6;
    font-size: 13px;
}

.nav-bar {
    padding: 10px 5px;
    margin-bottom: 5px;
}

.content {
    flex: 1 1 auto;
    padding: 20px 30px;
    overflow-y: scroll;
}

footer {
    flex: 0 0 auto;
    padding: 10px 30px;
    background: #555555;
    display: flex;
    flex-direction: row;
}

footer .install { flex: 0 0 auto; }
footer .uninstall { flex: 1 1 auto; display: flex; justify-content: flex-end; }
header {
    flex: 0 0 auto;
    background: #555555;
    padding: 5px 30px 0 30px;
}

header p {
    margin: 0;
    padding: 0;
}
nav { padding: 15px 0 0 }

nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
nav ul li {
    display: inline-block;
    margin-right: 30px;
}
nav ul li a {
    color: #fff;
    border-bottom: 3px solid transparent;
    text-decoration: none;
    padding: 10px 0;
    display: block;
    font-weight: bold;
    font-size: 14px;
}

nav ul li a.router-link-exact-active {
    border-bottom-color: orange;
}
</style>