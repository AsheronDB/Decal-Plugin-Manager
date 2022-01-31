import slugify from 'slugify';
import { uniqBy } from 'lodash';

export default {
    installedPlugins: state => {
        return state.installedPlugins.map(plugin => {
            plugin.slug = slugify(plugin.name, { lower: true, remove: /[*+~.()'"!:@]/g });
            return plugin;
        });
    },
    installedPluginsCount: state => state.installedPlugins.length,
    allPlugins: state => {
        return state.allPlugins.map(plugin => {
            plugin.slug = slugify(plugin.name, { lower: true, remove: /[*+~.()'"!:@]/g });
            return plugin;
        });
    },
    allPluginsCount: state => state.allPlugins.length,
    combinedPlugins: (state, getters) => {
        let merged = uniqBy([getters.allPlugins, getters.installedPlugins].flat(), (o) => o.name.toLowerCase());;
        console.log(merged);
        return merged;
    },
    settings: state => state.settings,
    isMaximized: state => state.settings.app.screen.maximized,
    programs: state => state.programs
}
