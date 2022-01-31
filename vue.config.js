module.exports = {
    chainWebpack: config => {
        config.externals({ "electron-store": "electron-store" });
    },
    pluginOptions: {
        electronBuilder: {
            preload: "src/preload/preload.js",
            builderOptions: {
                // files: [
                //     {
                //         from: "defaults",
                //         to: "defaults",
                //         filter: ["**/*"]
                //     }
                // ],
                extraResources: [
                    {
                        "from": "node_modules/regedit/vbs",
                        "to": "regedit/vbs",
                        "filter": [
                            "**/*"
                        ]
                    }
                ]
            },

        }
    }
};


