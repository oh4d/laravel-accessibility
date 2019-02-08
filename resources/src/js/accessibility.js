import jQuery from 'jquery';

window.jQuery = window.$ = jQuery;

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
        this.$ = this.jQuery = jQuery;

        this.initializeParams(options);

        this.getMainWrap();

        this.render();

        this.initialized = true;
    }

    /**
     *
     */
    initializeParams(options) {
        if (this.initialized) {
            return;
        }

        this.$html = this.jQuery('html');

        this.$body = this.$html.find('body');

        this.options = new AccessibilityOptions(this, options);

        // Todo Move All Features To AccessibilityOptions
        this.features = [
            {type: 'monochrome', enable: this.options.getConfig('features.monochrome'), icon: 'accessibility icon-monochrome'},
            {type: 'dark-contrast', enable: this.options.getConfig('features.darkContrast'), icon: 'accessibility icon-dark-contrast'},
            {type: 'bright-contrast', enable: this.options.getConfig('features.brightContrast'), icon: 'accessibility icon-bright-contrast'},
            {type: 'decrease-font-size', enable: this.options.getConfig('features.decreaseFontSize'), icon: 'accessibility icon-decrease-font-size'},
            {type: 'increase-font-size', enable: this.options.getConfig('features.increaseFontSize'), icon: 'accessibility icon-increase-font-size'},
            {type: 'font-family', enable: this.options.getConfig('features.fontFamily'), icon: 'accessibility icon-font-family'},
            {type: 'cursor-bw', enable: this.options.getConfig('features.cursorBw'), icon: 'accessibility icon-cursor-bw'},
            {type: 'cursor-bb', enable: this.options.getConfig('features.cursorBb'), icon: 'accessibility icon-cursor-bb'},
            {type: 'zoom', enable: this.options.getConfig('features.zoom'), icon: 'accessibility icon-search'},
            {type: 'highlight-links', enable: this.options.getConfig('features.highlightLinks'), icon: 'accessibility icon-highlight-links'},
            {type: 'highlight-titles', enable: this.options.getConfig('features.highlightTitles'), icon: 'accessibility icon-highlight-titles'},
            {type: 'alt-description', enable: this.options.getConfig('features.altDescription'), icon: 'accessibility icon-alt-description'}
        ];

        this.layoutFeatures = [
            {type: 'quick-navigation', enable: this.options.getConfig('quickNavigation.enable'), icon: 'accessibility icon-quick-navigation'},
            {type: 'disable-transitions', enable: this.options.getConfig('features.disableTransitions'), icon: 'accessibility icon-disable-transitions'}
        ];

        this.helperFeatures = [
            {type: 'reset', enable: this.options.getConfig('menu.footer.reset'), icon: 'accessibility icon-reset'}
        ];
    }

    /**
     * Get Accessibility Main Wrapper
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getMainWrap() {
        if (this.initialized) {
            return;
        }

        if (typeof this.$el !== 'undefined') {
            return this.$el;
        }

        this.$el = this.jQuery('<div class="accessibility"/>');
        this.$body.prepend(this.$el);

        return this.$el;
    }

    /**
     *
     */
    render() {
        if (this.initialized) {
            return;
        }

        this.$i18n = new AccessibilityTrans(this);

        this.accessibilityStorage = new AccessibilityStorage(this);

        this.accessibilityFeatures = new AccessibilityFeatures(this);

        this.accessibilityMenu = new AccessibilityMenu(this);

        this.accessibilityNavigation = new AccessibilityNavigation(this);

        this.toolTipListener();

        this.$html.attr({
            'lang': this.options.getConfig('locale'),
            'dir': this.options.getConfig('direction')
        });

        if (this.options.getConfig('direction') === 'rtl') {
            this.$body.addClass('accessibility-rtl-direction')
        }
    }

    /**
     *
     * @param feature
     * @param type
     */
    initFeatureListener(feature, type = 'view') {
        feature = this.getFeatureBy(feature, type);

        if (! feature || ! feature.enable)
            return;

        this.featureListener(feature);
    }

    /**
     *
     * @param feature
     */
    featureListener(feature) {
        if (! feature || ! feature.enable)
            return;

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

    toolTipListener() {
        let self = this;

        this.$body.on('mouseenter.accessibility.tooltip-visible, focus.accessibility.tooltip-visible', '.accessibility-tooltip-element', function() {
            let $toolTip = self.jQuery(this).data('tooltip-element'),
                position = self.jQuery(this).offset();

            let style = {
                top: (! $toolTip.data('tooltip-position')) ? position.top + self.jQuery(this).outerHeight() + 20 : position.top
            };

            if (! $toolTip.data('tooltip-position')) {
                style.transform = 'translateX(-50%)';
                style.left = position.left + (self.jQuery(this).outerWidth() / 2);
            } else if ($toolTip.data('tooltip-position') === 'right') {
                style[$toolTip.data('tooltip-position')] = self.$body.width() - (position.left - 20);
            }

            $toolTip.css(style);
            $toolTip.stop().fadeIn();
        });

        this.$body.on('mouseleave.accessibility.tooltip-hide, blur.accessibility.tooltip-visible', '.accessibility-tooltip-element', function() {
            if (self.jQuery(this).is(':focus'))
                return;

            let $toolTip = self.jQuery(this).data('tooltip-element');

            $toolTip.stop().fadeOut();
        });
    }

    /**
     *
     * @param $trigger
     * @param content
     * @param id
     * @param position
     * @returns {*|jQuery|HTMLElement}
     */
    renderToolTipEl($trigger, content, id = null, position = null) {
        let $el = this.jQuery('<div class="accessibility-index-tooltip"/>');

        if (id) {
            $el.attr('id', id);
        }

        if (position) {
            $el.attr('data-tooltip-position', position);
        }

        $el.html(content);
        $el.css({'display': 'none'});

        $trigger.addClass('accessibility-tooltip-element');
        $trigger.data('tooltip-element', $el);

        this.getMainWrap().append($el);
        return $el;
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
    getFeatureBy(type, featuresType = null) {
        let features = [];

        if (featuresType === null) {
            features = features.concat(this.getFeatures(), this.getLayoutFeatures(), this.getHelperFeatures());
        } else {
            features = (featuresType === 'layout') ? this.getLayoutFeatures() : (featuresType === 'helper' ? this.getHelperFeatures() : this.getFeatures());
        }

        let feature = false;

        this.jQuery.each(features, function() {
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
     * @param featuresType
     */
    appendFeatureEl(type, $el, featuresType = 'view') {
        let features = 'features';

        if (featuresType === 'layout') {
            features = 'layoutFeatures';
        } else if (featuresType === 'helper') {
            features = 'helperFeatures';
        }

        for (let i = 0; i < this[features].length; i++) {
            if (this[features][i].type !== type)
                continue;

            this[features][i].$el = $el;
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

        this.jQuery.each(search, function() {
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
};
