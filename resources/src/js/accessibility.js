import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import AccessibilityMenu from './menu';
import AccessibilityNavigation from './navigation';
import AccessibilityFeatures from './accessibility-features';

window.AccessibilityForAll = class {

    constructor() {
        this.initializeParams();

        this.renderMenu();
    }

    /**
     *
     */
    initializeParams() {
        this.$body = $('body');
        this.features = [
            {type: 'monochrome', enable: true, icon: 'accessibility icon-monochrome'},
            {type: 'dark-contrast', enable: true, icon: 'accessibility icon-dark-contrast'},
            {type: 'bright-contrast', enable: true, icon: 'accessibility icon-bright-contrast'},
            {type: 'decrease-font-size', enable: true, icon: 'accessibility icon-decrease-font-size'},
            {type: 'increase-font-size', enable: true, icon: 'accessibility icon-increase-font-size'},
            {type: 'font-family', enable: true, icon: 'accessibility icon-font-family'},
            {type: 'cursor-bw', enable: true, icon: 'accessibility icon-cursor-bw'},
            {type: 'cursor-bb', enable: true, icon: 'accessibility icon-cursor-bb'},
            {type: 'zoom', enable: true, icon: 'accessibility icon-zoom'},
            {type: 'highlight-links', enable: true, icon: 'accessibility icon-highlight-links'},
            {type: 'highlight-titles', enable: true, icon: 'accessibility icon-highlight-titles'},
            {type: 'alt-description', enable: true, icon: 'accessibility icon-alt-description'}
        ];
    }

    /**
     *
     */
    renderMenu() {
        this.accessibilityMenu = new AccessibilityMenu(this);
        this.accessibilityFeatures = new AccessibilityFeatures(this);
        this.accessibilityNavigation = new AccessibilityNavigation(this);
    }

    /**
     *
     * @param feature
     */
    featureListener(feature) {
        feature = this.camelCase(feature);

        if (typeof this.accessibilityFeatures[feature] === 'undefined')
            return;

        this.accessibilityFeatures[feature]();
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
     * @param str
     * @returns {string}
     */
    ucwords(str) {
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    camelCase(value) {
        value = this.ucwords(this.replaceAll(['-', '_'], ' ', value));
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
    };
};