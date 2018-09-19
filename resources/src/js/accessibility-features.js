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
        this.states = {
            monochrome: false,
            darkContrast: false,
            brightContrast: false,
            fontFamily: false,
            cursorBw: false,
            cursorBb: false,
            zoom: false,
            highlightLinks: false,
            highlightTitles: false,
            altDescription: false,

            fontSize: {
                max: 1.5,
                current: 1,
                $in: $('html'),
                search: ['*'],
                exclude: ['svg', '.accessibility', 'head']
            }
        };
    }

    /**
     * Initialize Features Handlers
     */
    initFeatures() {
        this.imgAltDescription = new ImgAltDescription(this.accessibility);
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
        if (this.states.cursorBb) {
            this.accessibility.$body.removeClass('accessibility-big-black-cursor');
        } else {
            this.removeAllCursors();
            this.accessibility.$body.addClass('accessibility-big-black-cursor');
        }

        this.setState('cursorBb', !this.states.cursorBb);
        return this.states.cursorBb;
    }

    /**
     *
     */
    cursorBw() {
        if (this.states.cursorBw) {
            this.accessibility.$body.removeClass('accessibility-big-white-cursor');
        } else {
            this.removeAllCursors();
            this.accessibility.$body.addClass('accessibility-big-white-cursor');
        }

        this.setState('cursorBw', !this.states.cursorBw);
        return this.states.cursorBw;
    }

    /**
     * Monochrome Contrast Handler
     * @returns {boolean}
     */
    monochrome() {
        if (this.states.monochrome) {
            this.accessibility.$body.removeClass('accessibility-monochrome');
        } else {
            this.removeAllContrasts();
            this.accessibility.$body.addClass('accessibility-monochrome');
        }

        this.setState('monochrome', !this.states.monochrome);
        return this.states.monochrome;
    }

    /**
     *
     * @returns {boolean}
     */
    darkContrast() {
        if (this.states.darkContrast) {
            this.accessibility.$body.removeClass('accessibility-dark-contrast');
        } else {
            this.removeAllContrasts();
            this.accessibility.$body.addClass('accessibility-dark-contrast');
        }

        this.setState('darkContrast', !this.states.darkContrast);
        return this.states.darkContrast;
    }

    /**
     *
     * @returns {boolean}
     */
    brightContrast() {
        if (this.states.brightContrast) {
            this.accessibility.$body.removeClass('accessibility-bright-contrast');
        } else {
            this.removeAllContrasts();
            this.accessibility.$body.addClass('accessibility-bright-contrast');
        }

        this.setState('brightContrast', !this.states.brightContrast);
        return this.states.brightContrast;
    }

    /**
     *
     * @returns {boolean}
     */
    highlightLinks() {
        if (this.states.highlightLinks) {
            this.accessibility.$body.removeClass('accessibility-highlight-link');
        } else {
            this.accessibility.$body.addClass('accessibility-highlight-link');
        }

        this.setState('highlightLinks', !this.states.highlightLinks);
        return this.states.highlightLinks;
    }

    /**
     *
     * @returns {boolean}
     */
    highlightTitles() {
        if (this.states.highlightTitles) {
            this.accessibility.$body.removeClass('accessibility-highlight-titles');
        } else {
            this.accessibility.$body.addClass('accessibility-highlight-titles');
        }

        this.setState('highlightTitles', !this.states.highlightTitles);
        return this.states.highlightTitles;
    }

    /**
     *
     * @returns {boolean}
     */
    fontFamily() {
        if (this.states.fontFamily) {
            this.accessibility.$body.removeClass('accessibility-readable-font-family');
        } else {
            this.accessibility.$body.addClass('accessibility-readable-font-family');
        }

        this.setState('fontFamily', !this.states.fontFamily);
        return this.states.fontFamily;
    }

    zoom() {
        if (this.states.zoom) {
            this.accessibility.$body.removeClass('accessibility-body-zoomed');
        } else {
            this.accessibility.$body.addClass('accessibility-body-zoomed');
        }

        this.setState('zoom', !this.states.zoom);
        return this.states.zoom;
    }

    /**
     *
     * @returns {boolean}
     */
    altDescription() {
        if (this.states.altDescription) {
            this.setImageAltDescription(false);
        } else {
            this.setImageAltDescription(true);
        }

        this.setState('altDescription', !this.states.altDescription);
        return this.states.altDescription;
    }

    /**
     * Increase Font Size Handler
     */
    increaseFontSize() {
        if (this.states.fontSize.current >= 1.5)
            return null;

        this.states.fontSize.current += 0.1;

        this.updateBodyElements();
        return null;
    }

    /**
     * Decrease Font Size Handler
     */
    decreaseFontSize() {
        if (this.states.fontSize.current <= 1)
            return null;

        this.states.fontSize.current -= 0.1;

        this.updateBodyElements();
        return null;
    }

    /**
     * Update Font Attribute To Document Elements
     * Search & Loop On Elements Inside The Given Element To States
     */
    updateBodyElements() {
        let self = this;

        this.states.fontSize.$in.find(this.fontElements()).each(function() {
            let currentFontSize = parseFloat($(this).css('font-size'));

            if (!currentFontSize) {
                return;
            }

            // Set The Default Font Size Per El
            if (! $(this).data('original-font-size')) {
                $(this).data('original-font-size', currentFontSize);
            }

            let defaultFontSize = $(this).data('original-font-size'),
                updateFontSize = (defaultFontSize * self.states.fontSize.current).toFixed(1) + 'px';

            $(this).css('font-size', updateFontSize);
        });
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
            $(document).off('mouseenter.accessibility.image-hover-description');
            return;
        }

        let self = this;

        $(document).on('mouseenter.accessibility.image-hover-description', 'body > img, body > :not(.accessibility) img', function(e) {
            self.imgAltDescription.mouseIn($(this), e);
        });
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
     * Remove All Enabled Features Contrasts
     */
    removeAllContrasts() {
        if (this.states.darkContrast) {
            this.darkContrast();
        }

        if (this.states.brightContrast) {
            this.brightContrast();
        }

        if (this.states.monochrome) {
            this.monochrome();
        }
    }

    /**
     *
     */
    removeAllCursors() {
        if (this.states.cursorBb) {
            this.cursorBb();
        }

        if (this.states.cursorBw) {
            this.cursorBw();
        }
    }
}