import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import AccessibilityMenu from './menu';
import AccessibilityTrans from './i18n';
import AccessibilityNavigation from './navigation';
import AccessibilityFeatures from './accessibility-features';

window.AccessibilityForAll = class {

    /**
     * Accessibility For All
     */
    constructor() {
        this.initializeParams();

        this.getMainWrap();

        this.render();
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
        this.accessibilityMenu = new AccessibilityMenu(this);
        this.accessibilityFeatures = new AccessibilityFeatures(this);
        this.accessibilityNavigation = new AccessibilityNavigation(this);
    }

    /**
     *
     * @param $el
     * @param feature
     */
    featureListener($el, feature) {
        feature = this.getFeatureBy(feature);

        if (! feature || ! feature.enable)
            return;

        feature.$el = $el;

        let featureHandler = this.camelCase(feature.type);

        if (typeof this.accessibilityFeatures[featureHandler] === 'undefined')
            return;

        let activated = this.accessibilityFeatures[featureHandler](feature);

        if (activated === null)
            return;

        if (activated)
            this.accessibilityFeatures.featureActivated(feature);
        else
            this.accessibilityFeatures.featureDeActivated(feature);
    }

    /**
     *
     * @returns {*[]}
     */
    getFeatures() {
        return this.features;
    }

    /**
     * Get Feature By Original Type Name
     *
     * @param type
     * @returns {boolean}
     */
    getFeatureBy(type) {
        let feature = false;

        $.each(this.getFeatures(), function() {
            if (this.type === type) {
                feature = this;
                return false;
            }
        });

        return feature;
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
    }

    /**
     *
     * @param e
     */
    preventDefault(e) {
        if (!e) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
    }
};