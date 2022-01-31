import Vue from 'vue'
import VueRouter from 'vue-router'

// Views
import HomeView from '@/views/Home';
import MyPluginsView from '@/views/MyPlugins';
import MyPluginsListView from '@/views/MyPlugins/List';
import GetPluginsView from '@/views/GetPlugins';
import GetPluginsListView from '@/views/GetPlugins/List';
import PluginDetailsView from '@/views/PluginDetails';
import PluginDetailsDescriptionView from '@/views/PluginDetails/Description';
import PluginDetailsAboutView from '@/views/PluginDetails/About';
import PluginDetailsGalleryView from '@/views/PluginDetails/Gallery';
import SettingsView from '@/views/Settings';
import SettingsDecalView from '@/views/Settings/Decal';
import SettingsApplicationView from '@/views/Settings/Application';
import SettingsPluginsView from '@/views/Settings/Plugins';
import SettingsAboutView from '@/views/Settings/About';

Vue.use(VueRouter)

let PluginDetailViewRoutes = {
    path: 'details/:slug',
    component: PluginDetailsView,
    children: [
        {
            path: '',
            name: 'PluginDetailsDescriptionView',
            component: PluginDetailsDescriptionView
        }, {
            path: 'about',
            name: 'PluginDetailsAboutView',
            component: PluginDetailsAboutView,

        }, {
            path: 'gallery',
            name: 'PluginDetailsGalleryView',
            component: PluginDetailsGalleryView,
        },
    ]
};

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        children: [
            {
                name: 'MyPlugins',
                path: '',
                component: MyPluginsView,
                alias: '/myplugins',
                children: [{
                    path: '',
                    name: 'MyPluginsListView',
                    component: MyPluginsListView,
                }, PluginDetailViewRoutes]
            },
            {
                path: '/getplugins',
                name: 'GetPlugins',
                component: GetPluginsView,
                children: [{
                    path: '',
                    name: 'GetPluginsListView',
                    component: GetPluginsListView,
                }, PluginDetailViewRoutes]
            },
            {
                path: '/settings',
                component: SettingsView,
                children: [
                    {
                        path: '',
                        name: 'SettingsDecalView',
                        component: SettingsDecalView,
                        alias: '/settings/decal'
                    }, {
                        path: 'applications',
                        name: 'SettingsApplicationView',
                        component: SettingsApplicationView,
                    }, {
                        path: 'plugins',
                        name: 'SettingsPluginsView',
                        component: SettingsPluginsView,
                    }, {
                        path: 'about',
                        name: 'SettingsAboutView',
                        component: SettingsAboutView,
                    },
                ]
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
