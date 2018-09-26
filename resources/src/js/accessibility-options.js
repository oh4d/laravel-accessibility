export default class {

    constructor(options) {
        this.config = this.setConfig(options);
    }

    /**
     *
     * @param options
     */
    setConfig(options) {
        let config = $.extend({
            locale: 'en',
            direction: 'ltr',
            storage: 'cookies',
        }, options);

        config.menu = $.extend({
            footer: {
                reset: true
            }
        }, config.menu);

        config.features = $.extend({
            monochrome: true,
            darkContrast: true,
            brightContrast: true,
            decreaseFontSize: true,
            increaseFontSize: true,
            fontFamily: true,
            cursorBw: true,
            cursorBb: true,
            zoom: true,
            highlightLinks: true,
            highlightTitles: true,
            altDescription: true,
            disableTransitions: true,
        }, config.features);

        config.navigation = $.extend({
            enable: true
        }, config.navigation);

        return config;
    }

    /**
     *
     * @param key
     * @param config
     * @returns {*}
     */
    getConfig(key, config = null) {
        key = key.split('.');
        config = (config) ? config : this.config;

        if (! key[0])
            return null;

        if (! config[key[0]])
            return null;

        if (key.length === 1)
            return config[key[0]];

        if (typeof config[key[0]] !== 'object')
            return config[key[0]];

        let continueKey = '';

        for (let i = 1; i < key.length; i++) {
            continueKey += key[i];

            if (i + 1 < key.length) {
                continueKey += '.';
            }
        }

        return this.getConfig(continueKey, config[key[0]]);
    }
}