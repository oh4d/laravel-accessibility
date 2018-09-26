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
     * @param attributes
     */
    trans(key, attributes = null) {
        if (! this.translations)
            return '';

        for (let _key in this.translations) {
            if (_key === key)
                return (attributes) ? this.bindAttributes(this.translations[key], attributes) : this.translations[key];
        }
    }

    /**
     *
     * @param trans
     * @param attributes
     * @returns {*}
     */
    bindAttributes(trans, attributes) {
        let transSpliced = trans.split('(:a)');

        if (transSpliced.length <= 1)
            return trans;

        attributes = (typeof attributes === 'string') ? [attributes] : attributes;

        let transBinding = '';

        for (let i = 0; i < transSpliced.length; i++) {
            transBinding += transSpliced[i];

            if (attributes[i]) {
                transBinding += attributes[i];
            }
        }

        return transBinding;
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