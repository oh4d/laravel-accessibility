import TransHE from './trans/he'
import TransEN from './trans/en'

export default class {
    /**
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;

        this.locale = this.accessibility.options.getConfig('locale');
        this.defaultLocale = 'en';

        this.setTrans();

        this.setLocale();
    }

    /**
     * Get Translation By Key
     *
     * @param key
     * @param attributes
     */
    trans(key, attributes = null) {
        if (! this.translates)
            return '';

        for (let _key in this.translates) {
            if (_key === key)
                return (attributes) ? this.bindAttributes(this.translates[key], attributes) : this.translates[key];
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
     *
     */
    setTrans() {
        this.translations = {
            en: TransEN,
            he: TransHE
        };
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

        /*try {
            trans = require('./trans/' + locale + '.js');
        } catch(e) {
            this.locale = this.defaultLocale;
            trans = require('./trans/' + this.defaultLocale + '.js');
        }*/

        /*if (! trans.default)
            return;*/

        let translates = this.accessibility.options.getConfig('translates');

        if (!translates) {
            translates = (this.translations[locale.toLowerCase()]) ? this.translations[locale.toLowerCase()] : this.translations[this.defaultLocale];
        }

        this.translates = this.accessibility.jQuery.extend(this.translations[this.defaultLocale], translates);
    }
}
