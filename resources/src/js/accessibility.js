import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import AccessibilityMenu from './menu';
import AccessibilityFeatures from './accessibility-features'

window.AccessibilityForAll = class {

    constructor() {
        this.initializeParams();

        this.renderMenu();
    }

    initializeParams() {
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

    featureListener(feature) {
        // console.log();
        // feature
    }

    renderMenu() {
        this.accessibilityMenu = new AccessibilityMenu(this);
        this.accessibilityFeatures = new AccessibilityFeatures(this);
    }

    getFeatures() {
        return this.features;
    }
};