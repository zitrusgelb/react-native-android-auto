const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('@expo/config-plugins');

const withAutomotiveApp = (config) => {
    config = withAndroidManifest(config, async (config) => {
        let mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

        // Adding meta-data
        mainApplication['meta-data'] = (mainApplication['meta-data'] || []).concat({
            $: {
                'android:name': "com.google.android.gms.car.application",
                'android:resource': "@xml/automotive_app_desc",
            }
        });

        return config;
    });

    // Adding automotive_app_desc.xml file
    config = withDangerousMod(config, [
        'android',
        async (config) => {
            const appDir = config.modRequest.projectRoot + '/android/app/src/main/res/xml/';
            const filename = appDir + 'automotive_app_desc.xml';

            const fs = require('fs');

            if (!fs.existsSync(appDir)) {
                fs.mkdirSync(appDir, { recursive: true });
            }

            fs.writeFileSync(filename,
                `<?xml version="1.0" encoding="utf-8"?>
         <automotiveApp>
           <uses name="template" />
         </automotiveApp>`
            );

            return config;
        }
    ]);

    return config;
};

module.exports = withAutomotiveApp;
