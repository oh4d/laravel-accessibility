export default class {

    constructor(accessibility, options = {}) {
        this.accessibility = accessibility;

        this.config = this.initializeConfig(options);
    }

    /**
     *
     * @param options
     */
    initializeConfig(options) {
        let config = this.accessibility.jQuery.extend({
            locale: this.setLocale(options.locale),
            direction: this.setDirection(options.direction),
            storage: 'cookies',
        }, options);

        config.menu = this.accessibility.jQuery.extend({
            footer: {
                reset: true
            }
        }, options.menu);

        config.features = this.accessibility.jQuery.extend({
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
        }, options.features);

        config.quickNavigation = this.accessibility.jQuery.extend({
            enable: true
        }, options.quickNavigation);

        config.translates = options.translates ? options.translates : false;
        return config;
    }

    /**
     *
     * @param options
     * @returns {Browsersync.config|*|Config}
     */
    extendConfig(options) {
        this.config = this.accessibility.jQuery.extend(this.config, options);
        return this.config;
    }

    /**
     *
     * @param direction
     */
    setDirection(direction = null) {
        if (direction) {
            return direction;
        }

        return (document.dir === 'rtl') ? 'rtl' : 'ltr';
    }

    /**
     *
     * @param locale
     * @returns string
     */
    setLocale(locale = null) {
        if (locale) {
            return locale;
        }

        return (this.accessibility.$html.attr('lang')) ? this.accessibility.$html.attr('lang') : 'en';
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

        if (typeof config[key[0]] === 'undefined')
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
