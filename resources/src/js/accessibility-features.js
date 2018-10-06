import QuickNavigation from './features/quick-navigation';
import ImgAltDescription from './features/img-alt-description';

export default class {

    /**
     * Accessibility Features Handler Class
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;

        this.initStates();

        this.initFeatures();
    }

    /**
     * Initialize Features States
     */
    initStates() {
        let storageStates = this.accessibility.accessibilityStorage.initializeFromStorage();

        this.states = this.accessibility.jQuery.extend({
            monochrome: 'disable',
            darkContrast: 'disable',
            brightContrast: 'disable',
            fontFamily: 'disable',
            cursorBw: 'disable',
            cursorBb: 'disable',
            zoom: 'disable',
            highlightLinks: 'disable',
            highlightTitles: 'disable',
            altDescription: 'disable',
            disableTransitions: 'disable',

            fontSize: {
                max: 1.5,
                current: 1,
                search: ['*'],
                $in: this.accessibility.jQuery('html'),
                exclude: ['svg', '.accessibility', 'head']
            },

            quickNavigation: {
                state: 'disable'
            }
        }, this.mapStorageKeyObj(storageStates));
    }

    /**
     *
     * @param object
     */
    extendStates(object) {
        this.states = this.accessibility.jQuery.extend(this.states, object);
    }

    /**
     * Initialize Features Handlers
     * Append To Object Features From Outside Classes
     * Loop On States Object To Activate Actions
     */
    initFeatures() {
        this.imgAltDescription = new ImgAltDescription(this.accessibility);
        this.quickNavigationHandler = new QuickNavigation(this.accessibility);

        let self = this;

        this.accessibility.jQuery.each(this.states, function(key) {
            if (this !== 'enable') {
                return;
            }

            let feature = self.getAccessibilityFeature(key);

            if (! feature.enable) {
                return;
            }

            if (typeof self[key] === 'undefined') {
                return;
            }

            self[key]();
        });

        if (this.states.fontSize.current > 1) {
            this.updateBodyElements();
        }

        this.initialized = true;
    }

    /**
     *
     */
    featureActivated(feature) {
        if (! feature.$el)
            return;

        feature.$el.addClass('accessibility-feature-activated');
    }

    /**
     *
     */
    featureDeActivated(feature) {
        if (! feature.$el)
            return;

        feature.$el.removeClass('accessibility-feature-activated');
    }

    /**
     *
     */
    cursorBb() {
        if (this.states.cursorBb === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-big-black-cursor');
        } else {
            this.removeAllCursors();
            this.accessibility.$body.addClass('accessibility-big-black-cursor');
        }

        let state = (this.initialized && this.states.cursorBb === 'enable') ? 'disable' : 'enable';
        this.setState('cursorBb', state);
        return (state === 'enable') ? 'cursorBb' : 'disable';
    }

    /**
     *
     */
    cursorBw() {
        if (this.states.cursorBw === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-big-white-cursor');
        } else {
            this.removeAllCursors();
            this.accessibility.$body.addClass('accessibility-big-white-cursor');
        }

        let state = (this.initialized && this.states.cursorBw === 'enable') ? 'disable' : 'enable';
        this.setState('cursorBw', state);
        return (state === 'enable') ? 'cursorBw' : 'disable';
    }

    /**
     * Monochrome Contrast Handler
     * @returns string
     */
    monochrome() {
        if (this.states.monochrome === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-monochrome');
        } else {
            this.removeAllContrasts();
            this.accessibility.$body.addClass('accessibility-monochrome');
        }

        let state = (this.initialized && this.states.monochrome === 'enable') ? 'disable' : 'enable';
        this.setState('monochrome', state);
        return (state === 'enable') ? 'monochrome' : 'disable';
    }

    /**
     *
     * @returns string
     */
    darkContrast() {
        if (this.states.darkContrast === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-dark-contrast');
        } else {
            this.removeAllContrasts();
            this.accessibility.$body.addClass('accessibility-dark-contrast');
        }

        let state = (this.initialized && this.states.darkContrast === 'enable') ? 'disable' : 'enable';
        this.setState('darkContrast', state);
        return (state === 'enable') ? 'darkContrast' : 'disable';
    }

    /**
     *
     * @returns string
     */
    brightContrast() {
        if (this.states.brightContrast === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-bright-contrast');
        } else {
            this.removeAllContrasts();
            this.accessibility.$body.addClass('accessibility-bright-contrast');
        }

        let state = (this.initialized && this.states.brightContrast === 'enable') ? 'disable' : 'enable';
        this.setState('brightContrast', state);
        return (state === 'enable') ? 'brightContrast' : 'disable';
    }

    /**
     *
     * @returns string
     */
    highlightLinks() {
        if (this.states.highlightLinks === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-highlight-link');
        } else {
            this.accessibility.$body.addClass('accessibility-highlight-link');
        }

        let state = (this.initialized && this.states.highlightLinks === 'enable') ? 'disable' : 'enable';
        this.setState('highlightLinks', state);
        return this.states.highlightLinks;
    }

    /**
     *
     * @returns string
     */
    highlightTitles() {
        if (this.states.highlightTitles === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-highlight-titles');
        } else {
            this.accessibility.$body.addClass('accessibility-highlight-titles');
        }

        let state = (this.initialized && this.states.highlightTitles === 'enable') ? 'disable' : 'enable';
        this.setState('highlightTitles', state);
        return this.states.highlightTitles;
    }

    /**
     *
     * @returns string
     */
    fontFamily() {
        if (this.states.fontFamily === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-readable-font-family');
        } else {
            this.accessibility.$body.addClass('accessibility-readable-font-family');
        }

        let state = (this.initialized && this.states.fontFamily === 'enable') ? 'disable' : 'enable';
        this.setState('fontFamily', state);
        return this.states.fontFamily;
    }

    /**
     *
     * @returns string
     */
    zoom() {
        if (this.states.zoom === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-body-zoomed');
        } else {
            this.accessibility.$body.addClass('accessibility-body-zoomed');
        }

        let state = (this.initialized && this.states.zoom === 'enable') ? 'disable' : 'enable';
        this.setState('zoom', state);
        return this.states.zoom;
    }

    /**
     *
     * @returns string
     */
    disableTransitions() {
        if (this.states.disableTransitions === 'enable' && this.initialized) {
            this.accessibility.$body.removeClass('accessibility-transitions-disabled');
        } else {
            this.accessibility.$body.addClass('accessibility-transitions-disabled');
        }

        let state = (this.initialized && this.states.disableTransitions === 'enable') ? 'disable' : 'enable';
        this.setState('disableTransitions', state);
        return this.states.disableTransitions;
    }

    /**
     *
     * @returns {boolean}
     */
    altDescription() {
        if (this.states.altDescription === 'enable' && this.initialized) {
            this.setImageAltDescription(false);
        } else {
            this.setImageAltDescription(true);
        }

        let state = (this.initialized && this.states.altDescription === 'enable') ? 'disable' : 'enable';
        this.setState('altDescription', state);
        return this.states.altDescription;
    }

    /**
     * Increase Font Size Handler
     */
    increaseFontSize() {
        if (this.states.fontSize.current >= this.states.fontSize.max)
            return this.states.fontSize.current;

        this.states.fontSize.current += 0.1;

        this.updateBodyElements();
        return this.states.fontSize.current;
    }

    /**
     * Decrease Font Size Handler
     */
    decreaseFontSize() {
        if (this.states.fontSize.current <= 1)
            return null;

        this.states.fontSize.current -= 0.1;

        this.updateBodyElements();
        return (this.states.fontSize.current <= 1) ? 'disable' : this.states.fontSize.current;
    }

    /**
     * Toggle Quick Navigation
     */
    quickNavigation() {
        if (typeof this.states.quickNavigation === 'undefined')
            return;

        if (this.states.quickNavigation.state === 'enable' && this.initialized) {
            this.disableQuickNavigation();
            return this.states.quickNavigation.state;
        }

        this.enableQuickNavigation();
        return this.states.quickNavigation.state;
    }

    /**
     * Enable Quick Navigation
     */
    enableQuickNavigation() {
        if (this.states.quickNavigation.state === 'enable') {
            return;
        }

        this.accessibility.$body.addClass('accessibility-quick-navigation-enabled');
        this.accessibility.$body.scrollTop(0);

        this.states.quickNavigation.state = 'enable';
        this.accessibility.accessibilityMenu.closeMenu();

        this.quickNavigationHandler.initialize();
    }

    /**
     * Disable Quick Navigation
     */
    disableQuickNavigation() {
        if (this.states.quickNavigation.state === 'disable') {
            return;
        }

        this.accessibility.$body.removeClass('accessibility-quick-navigation-enabled');
        this.accessibility.$body.scrollTop(0);

        this.states.quickNavigation.state = 'disable';

        this.quickNavigationHandler.destroy();
    }

    /**
     * Update Font Attribute To Document Elements
     * Search & Loop On Elements Inside The Given Element To States
     */
    updateBodyElements() {
        let self = this;

        if (! this.states.fontSize.initialized) {
            this.initializeOriginalFontSize();
        }

        this.states.fontSize.current = Number(this.states.fontSize.current.toFixed(2));

        this.states.fontSize.$in.find(this.fontElements()).each(function() {
            let currentFontSize = parseFloat(self.accessibility.jQuery(this).css('font-size'));

            if (!currentFontSize) {
                return;
            }

            let defaultFontSize = self.accessibility.jQuery(this).data('original-font-size'),
                updateFontSize = (defaultFontSize * self.states.fontSize.current).toFixed(1) + 'px';

            self.accessibility.jQuery(this).css('font-size', updateFontSize);
        });
    }

    /**
     * Initialize Font Size
     * Loop On Element That Will
     * Handle There Font Size, And Set
     * There Original Font Size For Later Calculate
     * This Is Mandatory Loop Before The Change Take Effect
     * For Proper Handling Font Size Like 'rem', 'em'
     */
    initializeOriginalFontSize() {
        let self = this;

        this.states.fontSize.$in.find(this.fontElements()).each(function() {
            let elFontSize = parseFloat(self.accessibility.jQuery(this).css('font-size'));

            if (! elFontSize) {
                return;
            }

            self.accessibility.jQuery(this).data('original-font-size', elFontSize);
        });

        this.states.fontSize.initialized = true;
    }

    /**
     * Building jQuery Query For Search
     * Elements To Update Css Attributes
     *
     * @returns {string}
     */
    fontElements() {
        if (this.states.fontSize.fontElements) {
            return this.states.fontSize.fontElements;
        }

        let exclude = '',
            fontElements = '';

        for (let i = 0; i < this.states.fontSize.exclude.length; i++) {
            exclude += ':not(' + this.states.fontSize.exclude[i] + '):not(' + this.states.fontSize.exclude[i] + ' *)';
        }
        exclude += ':not(script):not(style):not(link)';

        for (let i = 0; i < this.states.fontSize.search.length; i++) {
            fontElements += (i > 0) ? ',' : '';
            fontElements += this.states.fontSize.search + exclude;
        }

        this.states.fontSize.fontElements = fontElements;
        return this.states.fontSize.fontElements;
    }

    /**
     *
     * @param enable
     */
    setImageAltDescription(enable = true) {
        if (! enable) {
            this.accessibility.jQuery(document).off('mouseenter.accessibility.image-hover-description');
            this.imgAltDescription.destroy();
            return;
        }

        let self = this;

        this.accessibility.jQuery(document).on('mouseenter.accessibility.image-hover-description', 'body > img, body > :not(.accessibility) img', function(e) {
            self.imgAltDescription.mouseIn(self.accessibility.jQuery(this), e);
        });
    }

    /**
     *
     */
    reset() {
        let self = this;

        this.accessibility.jQuery.each(this.states, function(key) {
            if (this !== 'enable') {
                return;
            }

            if (typeof self[key] === 'undefined') {
                return;
            }

            self[key]();

            let feature = self.accessibility.getFeatureBy(AccessibilityForAll.snakeCase(key), null);

            if (feature) {
                self.featureDeActivated(feature);
            }
        });

        if (this.states.fontSize.current > 1) {
            this.states.fontSize.current = 1;
            this.updateBodyElements();
        }

        if (this.states.quickNavigation.state === 'enable') {
            this.quickNavigation();

            let feature = self.accessibility.getFeatureBy(AccessibilityForAll.snakeCase('quick-navigation'), 'layout');
            this.featureDeActivated(feature);
        }

        this.accessibility.accessibilityStorage.resetStorage();
        return null;
    }

    /**
     * Update Feature State
     *
     * @param type
     * @param state
     */
    setState(type, state) {
        this.states[type] = state
    }

    /**
     *
     * @param type
     * @returns {null}
     */
    getState(type) {
        if (typeof this.states[type] !== 'undefined') {
            return this.states[type];
        }

        let camelCase = this.accessibility.camelCase(type);

        return (typeof this.states[camelCase] !== 'undefined') ? this.states[camelCase] : null;
    }

    /**
     *
     * @returns {boolean}
     */
    getAccessibilityFeature(featureKey) {
        let featureName = AccessibilityForAll.snakeCase(featureKey);
        return this.accessibility.getFeatureBy(featureName);
    }

    /**
     *
     * @param featureName
     * @returns {*}
     */
    mapFeatureToStorage(featureName) {
        let mappingTypeToState = {
            cursorBb: 'cursorPointer',
            cursorBw: 'cursorPointer',
            monochrome: 'colorContrast',
            darkContrast: 'colorContrast',
            brightContrast: 'colorContrast',
            increaseFontSize: 'fontSize',
            decreaseFontSize: 'fontSize'
        };

        return mappingTypeToState[featureName] ? mappingTypeToState[featureName] : featureName;
    }

    /**
     *
     * @param storageStates
     * @returns {*}
     */
    mapStorageKeyObj(storageStates) {
        let mappingValueToAction = ['colorContrast', 'cursorPointer'];

        if (typeof storageStates.quickNavigation !== 'undefined') {
            storageStates.quickNavigation = {state: storageStates.quickNavigation};
        }

        if (typeof storageStates.fontSize !== 'undefined') {
            storageStates.fontSize = {
                max: 1.5,
                search: ['*'],
                $in: this.accessibility.jQuery('html'),
                current: Number(storageStates.fontSize),
                exclude: ['svg', '.accessibility', 'head']
            }
        }

        this.accessibility.jQuery.each(mappingValueToAction, function() {
            if (typeof storageStates[this] === 'undefined') {
                return;
            }

            storageStates[storageStates[this]] = 'enable';
            delete storageStates[this];
        });

        return storageStates;
    }

    /**
     * Remove All Enabled Features Contrasts
     */
    removeAllContrasts() {
        if (this.states.darkContrast === 'enable' && this.initialized) {
            this.accessibility.initFeatureListener('dark-contrast');
        }

        if (this.states.brightContrast === 'enable' && this.initialized) {
            this.accessibility.initFeatureListener('bright-contrast');
        }

        if (this.states.monochrome === 'enable' && this.initialized) {
            this.accessibility.initFeatureListener('monochrome');
        }
    }

    /**
     *
     */
    removeAllCursors() {
        if (this.states.cursorBb === 'enable' && this.initialized) {
            this.accessibility.initFeatureListener('cursor-bb');
        }

        if (this.states.cursorBw === 'enable' && this.initialized) {
            this.accessibility.initFeatureListener('cursor-bw');
        }
    }
}