<template>
    <div class="page">
        <div class="options">

            <div class="filter">
                <div class="">
                    <div class="filter-input" :class="{ filled: searchFilter.length > 0 }">
                        <input type="text" v-model="searchFilter" placeholder="Filter" />
                        <button class="clear">
                            <font-awesome-icon :icon="icons.faTimes"></font-awesome-icon>
                        </button>
                    </div>

                </div>
            </div>
            <div class="controls">
                <div class="">
                    <button class="custom-btn">
                        <font-awesome-icon :icon="icons.faArrowDown" class="icon"></font-awesome-icon>Update All
                    </button>
                </div>

                <div class="">
                    <button class="custom-btn">
                        <font-awesome-icon :icon="icons.faSyncAlt" class="icon"></font-awesome-icon>Check Updates
                    </button>
                </div>
            </div>

        </div>
        <div class="content">
            <b-table selectable sticky-header select-mode="single" :items="items" :fields="fields" :filter="searchFilter" :filter-included-fields="filterOn" @row-contextmenu="onRowContextMenu" @row-selected="onRowSelected" @row-clicked="onRowClicked" @row-dblclicked="onRowDblClicked">
                <template #cell(name)="data" v-b-popover.click.blur="'Content'">
                    <p class="name">{{ data.value }}</p>
                    <p class="current-version">{{ data.item.version }}</p>
                </template>
                <template #cell(status)="data">
                    <span v-if="data.item.version == data.item.latestVersion">Up to date</span>
                    <button class="update" v-if="data.item.version != data.item.latestVersion">Update</button>
                </template>

                <template #cell(menu)="data">

                    <b-dropdown variant="link" no-caret>
                        <template #button-content>
                            <font-awesome-icon :icon="icons.faEllipsisH"></font-awesome-icon>
                        </template>
                        <b-dropdown-item href="#">An item</b-dropdown-item>
                        <b-dropdown-item href="#">Another item</b-dropdown-item>
                    </b-dropdown>

                </template>
            </b-table>
        </div>
    </div>

</template>

<script>
import { orderBy } from "lodash";

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
                    key: "status",
                    label: "Status",
                    sortable: false,
                },
                {
                    key: "latestVersion",
                    label: "Latest Version",
                    sortable: false,
                },
                {
                    key: "published_at",
                    label: "Released At",
                    sortable: false,
                },
                {
                    key: "author",
                    label: "Author(s)",
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
        pluginsMerged() {
            let merged = this.installedPlugins.map((plugin) => {
                console.log("original pluginn");
                console.log(plugin);
                let knownPlugin = this.allPlugins.find(
                    (allPlugin) => allPlugin.name == plugin.name
                );

                console.log("known plugin");
                console.log(knownPlugin);
                if (knownPlugin) {
                    plugin.latestVersion = knownPlugin.version;
                    return plugin;
                } else {
                    plugin.latestVersion = plugin.version;
                    return plugin;
                }
            });

            return merged;
        },
        items() {
            return orderBy(this.pluginsMerged, ["name"]);
        },
        ...mapGetters(["installedPlugins", "allPlugins"]),
    },
    methods: {
        onRowDblClicked(item, index, event) {
            this.$router.push("/myplugins/details/" + item.slug);
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