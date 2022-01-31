<template>
    <div class="page">
        <router-view />
    </div>
</template>

<script>
import { orderBy } from "lodash";

// import { app, analytics } from "@/config/firebase";

// import Cookies from "js-cookie";

import axios from "axios";

import {
    faSyncAlt,
    faArrowDown,
    faTimes,
    faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

import { mapGetters } from "vuex";

export default {
    data() {
        return {
            icons: {
                faSyncAlt,
                faArrowDown,
                faTimes,
                faEllipsisH,
            },
            searchFilter: "",
            filterOn: ["name"],
            fields: [
                {
                    key: "name",
                    label: "Plugin",
                    sortable: false,
                },
                {
                    key: "downloads",
                    label: "Downloads",
                    sortable: true,
                },
                {
                    key: "published_at",
                    label: "Released At",
                    sortable: false,
                },
                {
                    key: "author",
                    label: "Author(s)",
                    sortable: true,
                },
                {
                    key: "status",
                    label: "Status",
                    sortable: false,
                },
                {
                    key: "menu",
                    label: "",
                    sortable: false,
                    class: "menu",
                },
            ],
        };
    },
    computed: {
        allPluginsMerged() {
            let merged = this.allPlugins.map((plugin) => {
                let installedPlugin = this.installedPlugins.find(
                    (installedPlugin) => installedPlugin.name == plugin.name
                );

                console.log("installed plugin");
                console.log(installedPlugin);
                if (installedPlugin) {
                    plugin.installed = true;
                    plugin.installedVersion = installedPlugin.version;
                } else {
                    plugin.installed = false;
                }

                return plugin;
            });

            return merged;
        },
        items() {
            return orderBy(this.allPluginsMerged, ["name"]);
        },
        ...mapGetters(["installedPlugins", "allPlugins", "programs"]),
    },
    methods: {
        async onClickInstall(plugin, event) {

            console.log('clicked install');
            const GA_API_SECRET = "6aYxDYWtQMq_NkVtw5wYzQ";
            const POST_BASE_URL = "https://www.google-analytics.com/mp/collect";
            const FIREBASE_APP_ID = "1:94708366979:web:3fa79dcf5971e32953a5b6";
            const GA_MEASUREMENT_ID = "G-L466DEKFLZ";
            const GA_TRACKING_ID = 'UA-210611752-1';
            //const POST_URL = `${POST_BASE_URL}?api_secret=${GA_API_SECRET}&firebase_app_id=${FIREBASE_APP_ID}`;

            //const APP_INSTANCE_ID = Cookies.get("_ga");

           // const CLIENT_ID = await(new Promise(resolve => this.$gtag.query("get", GA_MEASUREMENT_ID, "client_id", resolve)));

            //console.log(CLIENT_ID);

            // console.log(this.$gtag);

            // this.$gtag.event("download_test", {
            //     event_category: "download_category",
            //     event_label: "download_label",
            //     value: 1,
            // });

            // let clientId = await (new Promise((resolve) => {
            //     gtag("get", GA_MEASUREMENT_ID, "client_id", resolve);
            // }));

            // console.log(clientId);

            // let postBody = {
            //     app_instance_id: ,
            //     events: [
            //         {
            //             name: "tutorial_begin",
            //             params: {},
            //         },
            //     ],
            // };

            // Unviersal Analytics

            
            let anon_client_id = '62b86608-b918-4bf6-bca7-528c94d3c7ca';


            let queryParams = {
                v: 1,
                tid: GA_TRACKING_ID,
                cid: anon_client_id,
                t: 'event',
                ec: 'plugin',
                ea: 'download',
                el: plugin.name,
                ev: '1'
            };

            // queryParams = {
            //     v: 1,
            //     tid: GA_TRACKING_ID,
            //     cid: '555',
            //     t: 'pageview',
            //     dp: '/home'
            // };

        
            
            try {
                let req = await fetch(
                    `https://www.google-analytics.com/collect`,
                    {
                        method: "POST",
                        body: new URLSearchParams(queryParams).toString()
                    }
                );
                console.log(req);
            } catch (error) {
                console.log(error);
            }

            // GA4 version

            // try {
            //     let req = await fetch(
            //         `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
            //         {
            //             method: "POST",
            //             body: JSON.stringify({
            //                 client_id: clientId,
            //                 events: [
            //                     {
            //                         name: "download_standalone",
            //                         params: {},
            //                     },
            //                 ],
            //             }),
            //         }
            //     );
            //     console.log(req);
            // } catch (error) {
            //     console.log(error);
            // }

            // try {
            //     let eventReq = await axios.post(
            //         POST_URL,
            //         JSON.stringify(postBody),
            //         {
            //             headers: { "Content-Type": "application/json" },
            //         }
            //     );
            //     console.log(eventReq);
            // } catch (error) {
            //     console.log(error);
            // }

            // window.ipcRenderer.send("install-plugin", plugin);
        },
        onRowDblClicked(item, index, event) {
            this.$router.push("/details/" + item.slug);
        },
        onRowClicked(item, index, event) {},
        onRowSelected(item) {},
        onRowContextMenu(item) {
            console.log(item);
            console.log("context menu click");
            window.ipcRenderer.send("show-context-menu", item);
        },
    },
};
</script>

<style scoped>
.page {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.options {
    padding: 15px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
}

.options .controls,
.options .filter {
    display: flex;
    flex-direction: row;
}

.options .filter {
    flex: 1 1 auto;
}

.options .filter .filter-input {
    border: 1px solid #666;
    border-radius: 4px;
}

.options .filter .filter-input:focus {
    background: #555555;
}

.options .filter .filter-input .clear {
    border: 0;
    background: 0;
    color: #666;
    padding: 4px 10px;
    visibility: hidden;
}

.options .filter .filter-input.filled .clear {
    visibility: visible;
    color: #fff;
}

.options .filter .filter-input.filled .clear:hover {
}

.options .filter .filter-input input {
    background: transparent;
    color: #fff;
    border: 0;
    padding: 6px 8px;
    width: 250px;
    font-size: 13px;
}

.options .controls {
    justify-content: flex-end;
}
.options .controls div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 10px;
}

.options .controls div:last-child {
    margin: 0;
}

.content {
    color: #fff;

    font-size: 13px;
    flex: 1 1 auto;
    overflow: hidden;
}

.content >>> table {
    background: #555555;
}

.content >>> table thead th {
    background-color: #555555 !important;
    color: #fff !important;
    font-weight: normal;
    font-size: 11px !important;
    padding-top: 16px;
    padding-bottom: 16px;
    box-shadow: 0 1px 0 0 #666;
}

.content >>> table tr > *:first-child {
    padding-left: 20px;
    min-width: 150px;
}

.content >>> tbody {
}

.content >>> thead {
    vertical-align: middle;
}
.content >>> td {
    border-color: #666666 !important;
    font-size: 13px;
    color: #fff;
    vertical-align: middle;
}

.content >>> td,
.content >>> th {
}

.content >>> .menu {
    text-align: right;
    width: 0.1%;
    white-space: nowrap;
}

.name {
    margin: 0;
}

.current-version {
    margin: 0;
    font-size: 11px;
    opacity: 0.5;
}

.b-table-sticky-header {
    height: 100%;
    max-height: 100%;

    scrollbar-gutter: stable both-edges;
}

*::-webkit-scrollbar {
    width: 12px;
    background: transparent;
}

*::-webkit-scrollbar-track {
    background: transparent;
}

*::-webkit-scrollbar-thumb {
    background-color: #222;
    border-radius: 20px;
    border: 2px solid transparent;
    z-index: 500;
}

::-webkit-scrollbar-corner {
    /*
background-image: url(resources/corner.png);
background-repeat: no-repeat;
*/
    background-color: transparent;
}

.update {
    background: none;
    border: none;
    border-radius: 4px;
    background: #e0c884;
    padding: 6px 26px;
    font-weight: bold;
    font-size: 12px;
    color: #444444;
}

.custom-btn {
    background: none;
    border: none;
    border-radius: 4px;
    background: #e0c884;
    padding: 8px 14px;
    font-weight: bold;
    font-size: 12px;
    color: #444444;
}

.icon {
    margin-right: 8px;
}
</style>