export default class {

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
            decreaseFontSize: false,
            increaseFontSize: false,
            fontFamily: false,
            cursorBw: false,
            cursorBb: false,
            zoom: false,
            highlightLinks: false,
            highlightTitles: false
        };
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