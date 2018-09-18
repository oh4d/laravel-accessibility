export default class {

    /**
     * Accessibility Features Handler Class
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;

        this.initStates();
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

            font: {
                max: 1.5,
                current: 1,
                $in: $('body'),
                search: ['*'],
                exclude: ['svg', '.accessibility']
            }
        };
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
     * Monochrome Contrast Handler
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
     * Increase Font Size Handler
     */
    increaseFontSize() {
        if (this.states.font.current >= 1.5)
            return (this.states.font.current > 1);

        this.states.font.current += 0.1;

        this.updateBodyElements();
        return (this.states.font.current > 1);
    }

    /**
     * Decrease Font Size Handler
     */
    decreaseFontSize() {
        if (this.states.font.current <= 1)
            return false;

        this.states.font.current -= 0.1;

        this.updateBodyElements();
        return (this.states.font.current > 1);
    }

    /**
     * Update Font Attribute To Document Elements
     * Search & Loop On Elements Inside The Given Element To States
     */
    updateBodyElements() {
        let self = this;

        this.states.font.$in.find(this.fontElements()).each(function() {
            let currentFontSize = parseFloat($(this).css('font-size'));

            if (!currentFontSize) {
                return;
            }

            // Set The Default Font Size Per El
            if (! $(this).data('original-font-size')) {
                $(this).data('original-font-size', currentFontSize);
            }

            let defaultFontSize = $(this).data('original-font-size'),
                updateFontSize = (defaultFontSize * self.states.font.current).toFixed(1) + 'px';

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
        if (this.states.font.fontElements) {
            return this.states.font.fontElements;
        }

        let exclude = '',
            fontElements = '';

        for (let i = 0; i < this.states.font.exclude.length; i++) {
            exclude += ':not(' + this.states.font.exclude[i] + '):not(' + this.states.font.exclude[i] + ' *)';
        }
        exclude += ':not(script):not(style):not(link)';

        for (let i = 0; i < this.states.font.search.length; i++) {
            fontElements += (i > 0) ? ',' : '';
            fontElements += this.states.font.search + exclude;
        }

        this.states.font.fontElements = fontElements;
        return this.states.font.fontElements;
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

        }

        if (this.states.brightContrast) {

        }

        if (this.states.monochrome) {
            this.monochrome();
        }
    }
}