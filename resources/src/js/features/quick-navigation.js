export default class {
    /**
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;
    }

    /**
     *
     */
    initialize() {
        this.focusQuickNavigationListener();
    }

    /**
     *
     */
    destroy() {
        this.accessibility.$body.off('keyup.accessibility.quick-navigation-focus-key');
        this.accessibility.$body.off('keydown.accessibility.quick-navigation-focus-key');
    }

    /**
     *
     */
    focusQuickNavigationListener() {
        let self = this,
            keys = [];

        this.accessibility.$body.on('keydown.accessibility.quick-navigation-focus-key', function(e) {
            keys.push(e.which);
        });

        this.accessibility.$body.on('keyup.accessibility.quick-navigation-focus-key', function(e) {
            if (keys.indexOf(120) >= 0 && keys.indexOf(17) >= 0) {
                self.accessibility.accessibilityNavigation.$quickNavigation.find('button').first().focus();
            }

            keys = [];
        });
    }
}