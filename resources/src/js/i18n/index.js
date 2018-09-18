export default class {
    /**
     *
     * @param locale
     */
    constructor(locale = 'en') {
        this.locale = locale;
        this.defaultLocale = 'en';

        this.setLocale();
    }

    /**
     * Get Translation By Key
     *
     * @param key
     */
    trans(key) {
        if (! this.translations)
            return '';

        for (let _key in this.translations) {
            if (_key === key)
                return this.translations[key];
        }
    }

    /**
     * Set Locale
     *
     * @param locale
     */
    setLocale(locale) {
        if (! locale)
            locale = this.locale;

        let trans = false;

        this.locale = locale;

        try {
            trans = require('./trans/' + locale + '.js');
        } catch(e) {
            this.locale = this.defaultLocale;
            trans = require('./trans/' + this.defaultLocale + '.js');
        }

        if (! trans.default)
            return;

        this.translations = trans.default;
    }
}