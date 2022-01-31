export default () => ({
    programs: {
        acclient: { running: false },
        decal: { running: false, installed: false }
    },
    installedPlugins: [],
    allPlugins: [{
        name: 'DoThingsBot',
        version: '2.0.0.6',
        author: 'trevis',
        copyright: 'Wat',
        installerFilename: 'DoThingsBotInstaller-2.0.0.6.exe',
        installerUrl: 'https://gitlab.com/trevis/dothingsbot/uploads/d15cd820fbb19e85ae22b23479c1b236/DoThingsBotInstaller-2.0.0.6.exe'
    }, {
        name: 'Defective',
        version: '1.0.0.3',
        author: 'trevis',
        copyright: 'Wat'
    }],
    settings: {
        preferences: {},
        app: {
            screen: {
                maximized: false,
                fullscreen: false,
                resolution: {
                    width: 0,
                    height: 0
                }
            }
        }
    }
})
