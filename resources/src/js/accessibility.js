import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import AccessibilityMenu from './menu';
import AccessibilityTrans from './i18n';
import AccessibilityNavigation from './navigation';
import AccessibilityStorage from './accessibility-storage';
import AccessibilityOptions from './accessibility-options';
import AccessibilityFeatures from './accessibility-features';

window.AccessibilityForAll = class {

    /**
     * Accessibility For All
     */
    constructor(options = {}) {
        this.initializeParams(options);

        this.getMainWrap();

        this.render();
    }

    /**
     *
     */
    initializeParams(options) {
        this.$body = $('body');

        this.options = new AccessibilityOptions(options);

        this.features = [
            {type: 'monochrome', enable: this.options.getConfig('features.monochrome'), icon: 'accessibility icon-monochrome'},
            {type: 'dark-contrast', enable: this.options.getConfig('features.darkContrast'), icon: 'accessibility icon-dark-contrast'},
            {type: 'bright-contrast', enable: this.options.getConfig('features.brightContrast'), icon: 'accessibility icon-bright-contrast'},
            {type: 'decrease-font-size', enable: this.options.getConfig('features.decreaseFontSize'), icon: 'accessibility icon-decrease-font-size'},
            {type: 'increase-font-size', enable: this.options.getConfig('features.increaseFontSize'), icon: 'accessibility icon-increase-font-size'},
            {type: 'font-family', enable: this.options.getConfig('features.fontFamily'), icon: 'accessibility icon-font-family'},
            {type: 'cursor-bw', enable: this.options.getConfig('features.cursorBw'), icon: 'accessibility icon-cursor-bw'},
            {type: 'cursor-bb', enable: this.options.getConfig('features.cursorBb'), icon: 'accessibility icon-cursor-bb'},
            {type: 'zoom', enable: this.options.getConfig('features.zoom'), icon: 'accessibility icon-zoom'},
            {type: 'highlight-links', enable: this.options.getConfig('features.highlightLinks'), icon: 'accessibility icon-highlight-links'},
            {type: 'highlight-titles', enable: this.options.getConfig('features.highlightTitles'), icon: 'accessibility icon-highlight-titles'},
            {type: 'alt-description', enable: this.options.getConfig('features.altDescription'), icon: 'accessibility icon-alt-description'}
        ];

        this.layoutFeatures = [
            {type: 'quick-navigation', enable: this.options.getConfig('navigation.enable'), icon: 'accessibility icon-zoom'},
            {type: 'disable-transitions', enable: this.options.getConfig('features.disableTransitions'), icon: 'accessibility icon-zoom'}
        ];

        this.helperFeatures = [
            {type: 'reset', enable: this.options.getConfig('menu.footer.reset'), icon: 'accessibility icon-alt-description'}
        ];
    }

    /**
     * Get Accessibility Main Wrapper
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getMainWrap() {
        if (typeof this.$el !== 'undefined') {
            return this.$el;
        }

        this.$el = $('<div class="accessibility"/>');
        this.$body.prepend(this.$el);

        return this.$el;
    }

    /**
     *
     */
    render() {
        this.$i18n = new AccessibilityTrans('en');

        this.accessibilityStorage = new AccessibilityStorage(this);

        this.accessibilityFeatures = new AccessibilityFeatures(this);

        this.accessibilityNavigation = new AccessibilityNavigation(this);

        this.accessibilityMenu = new AccessibilityMenu(this);
    }

    /**
     *
     * @param $el
     * @param feature
     * @param type
     */
    initFeatureListener($el, feature, type = 'view') {
        feature = this.getFeatureBy(feature, type);

        if (! feature || ! feature.enable)
            return;

        this.featureListener($el, feature);
    }

    /**
     *
     * @param $el
     * @param feature
     */
    featureListener($el, feature) {
        if (! feature || ! feature.enable)
            return;

        feature.$el = $el;

        let featureHandler = this.camelCase(feature.type);

        if (typeof this.accessibilityFeatures[featureHandler] === 'undefined')
            return;

        let activated = this.accessibilityFeatures[featureHandler](feature);

        if (activated === null)
            return;

        this.accessibilityStorage.setStorage(featureHandler, activated);

        if (activated === 'disable') {
            this.accessibilityFeatures.featureDeActivated(feature);
            return;
        }

        if (isNaN(activated)) {
            this.accessibilityFeatures.featureActivated(feature);
        }
    }

    /**
     *
     * @returns {*[]}
     */
    getFeatures() {
        return this.features;
    }

    /**
     *
     * @returns {*[]}
     */
    getLayoutFeatures() {
        return this.layoutFeatures;
    }

    /**
     *
     * @returns {*}
     */
    getHelperFeatures() {
        return this.helperFeatures;
    }

    /**
     * Get Feature By Original Type Name
     *
     * @param type
     * @param featuresType
     * @returns {boolean}
     */
    getFeatureBy(type, featuresType = 'view') {
        let features = (featuresType === 'layout') ? this.getLayoutFeatures() : (featuresType === 'helper' ? this.getHelperFeatures() : this.getFeatures()),
            feature = false;

        $.each(features, function() {
            if (this.type === type) {
                feature = this;
                return false;
            }
        });

        return feature;
    }

    /**
     *
     * @param type
     * @param $el
     */
    appendFeatureEl(type, $el) {
        for (let i = 0; i < this.features.length; i++) {
            if (this.features[i].type !== type)
                continue;

            if (! this.features[i].$el) {
                this.features[i].$el = [];
            }

            this.features[i].$el.push($el);
        }
    }

    /**
     * Focusing Last Blur Element Recorded
     * And Resetting Param
     */
    focusLastEl() {
        if (! this.$lastFocusedEl)
            return;

        this.$lastFocusedEl.focus();
        this.$lastFocusedEl = false;
    }

    /**
     * Set Blur Element For Use Later
     *
     * @param $el
     */
    setLastFocusedEl($el) {
        if (! $el)
            return;

        this.$lastFocusedEl = $el;
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    camelCase(value) {
        value = AccessibilityForAll.ucwords(this.replaceAll(['-', '_'], ' ', value));
        value = this.replaceAll(' ', '', value);

        return value.charAt(0).toLowerCase() + value.slice(1);
    }

    /**
     *
     * @param search
     * @param replacement
     * @param target
     * @returns {*}
     */
    replaceAll(search, replacement, target) {
        if (typeof search === 'string')
            return target.split(search).join(replacement);

        $.each(search, function() {
            target = target.split(this).join(replacement);
        });

        return target;
    }

    /**
     * Get Host
     *
     * @returns {string | *}
     */
    getDomain() {
        if (this.hostname) {
            return this.hostname;
        }

        this.hostname = window.location.hostname;
        return this.hostname;
    }

    /**
     *
     * @param str
     * @returns {string}
     */
    static ucwords(str) {
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    }

    /**
     *
     * @param string
     * @returns {string}
     */
    static snakeCase(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     *
     * @param e
     */
    static preventDefault(e) {
        if (!e) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
    }

    /**
     *
     * @param content
     * @param id
     * @returns {*|jQuery|HTMLElement}
     */
    static renderToolTipEl(content, id = null) {
        let $el = $('<div class="accessibility-index-tooltip"/>');

        if (id) {
            $el.attr('id', id);
        }

        $el.html(content);
        return $el;
    }
};