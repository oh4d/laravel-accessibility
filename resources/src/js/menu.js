export default class {

    /**
     * Accessibility Main Menu Class
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;
        this.$el = this.accessibility.jQuery('<div class="accessibility-menu"/>');

        this.render();

        this.setEvents();
    }

    /**
     * Append The Accessibility Menu To Body
     */
    render() {
        this.appendMenuContent();

        this.$container.attr('aria-hidden', true);
        this.$el.appendTo(this.accessibility.getMainWrap());
    }

    /**
     * Append Menu Content Including:
     * Menu Button Trigger
     * Menu Features
     */
    appendMenuContent() {
        this.$container = this.accessibility.jQuery('<div class="accessibility-menu-container"/>');

        this.$el.append(this.$container);

        this.$el.append(this.getTrigger());

        this.$container.append(this.getMenuHeader());

        this.getMenuBody().append(this.getLayoutFeatures());

        this.getMenuBody().append(this.getViewFeatures());

        this.$container.append(this.getMenuFooter());
    }

    /**
     *
     */
    getMenuBody() {
        if (typeof this.$menuBody !== 'undefined') {
            return this.$menuBody;
        }

        this.$menuBody = this.accessibility.jQuery('<div class="accessibility-menu-body"/>');
        this.$container.append(this.$menuBody);
        return this.$menuBody;
    }

    /**
     *
     */
    getMenuHeader() {
        if (typeof this.$menuHeader !== 'undefined') {
            return this.$menuHeader;
        }

        this.$menuHeader = this.accessibility.jQuery('<div class="accessibility-menu-header"/>');
        this.$menuHeader.append('<h3 tabindex="0">' + this.accessibility.$i18n.trans('accessibility-menu') + '</h3>');
        this.$menuHeader.append(this.getCloseTrigger());
        return this.$menuHeader;
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getMenuFooter() {
        if (typeof this.$menuFooter !== 'undefined') {
            return this.$menuFooter;
        }

        this.$menuFooter = this.accessibility.jQuery('<div class="accessibility-menu-footer"/>');
        this.$menuFooter.append(this.getFooterActions());
        return this.$menuFooter;
    }

    /**
     * Return Menu Trigger Button
     * @returns {*}
     */
    getTrigger() {
        if (typeof this.$trigger !== 'undefined') {
            return this.$trigger;
        }

        this.$trigger = this.accessibility.jQuery('<button type="button" aria-labelledby="accessibilityTriggerButtonTt" role="button"/>').addClass('accessibility-menu-trigger');

        this.$trigger.append('<i/>');
        this.$trigger.find('i').addClass('accessibility icon-accessibility');

        this.accessibility.renderToolTipEl(this.$trigger,
            this.accessibility.$i18n.trans('accessibility-menu'), 'accessibilityTriggerButtonTt', this.accessibility.options.getConfig('direction') === 'rtl' ? 'right' : null
        );

        return this.$trigger;
    }

    /**
     *
     * @returns {*|jQuery}
     */
    getCloseTrigger() {
        if (typeof this.$closeTrigger !== 'undefined') {
            return this.$closeTrigger;
        }

        this.$closeTrigger = this.accessibility.jQuery('<button type="button"/>').addClass('accessibility-menu-close-trigger');

        this.$closeTrigger.append('<i/>');
        this.$closeTrigger.find('i').addClass('accessibility icon-cancel');
        return this.$closeTrigger;
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getFooterActions() {
        if (typeof this.$footerFeatures !== 'undefined') {
            return this.$footerFeatures;
        }

        this.$footerFeatures = this.accessibility.jQuery('<div class="accessibility-footer-features"/>');

        let features = this.accessibility.getHelperFeatures();

        this.$footerFeatures.append(this.createFeaturesEl(features, 'helper'));

        return this.$footerFeatures;
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getLayoutFeatures() {
        if (typeof this.$layoutFeatures !== 'undefined') {
            return this.$layoutFeatures;
        }

        this.$layoutFeatures = this.accessibility.jQuery('<div class="accessibility-layout-features"/>');

        let features = this.accessibility.getLayoutFeatures();

        this.$layoutFeatures.append(this.createFeaturesEl(features, 'layout'));

        return this.$layoutFeatures;
    }

    /**
     * Return Features Element To Menu Container
     */
    getViewFeatures() {
        if (typeof this.$viewFeatures !== 'undefined') {
            return this.$viewFeatures;
        }

        let features = this.spreadFeaturesToRows();

        this.$viewFeatures = this.accessibility.jQuery('<div class="accessibility-features"/>');

        for (let row = 0; row < features.length; row++) {
            this.$viewFeatures.append(this.createFeaturesEl(features[row], 'view', this.accessibility.jQuery('<div class="accessibility-features-row"/>')));
        }

        return this.$viewFeatures;
    }

    /**
     *
     * @param features
     * @param featuresType
     * @param $append
     */
    createFeaturesEl(features, featuresType = 'view', $append = null) {
        if (! features) {
            return null;
        }

        let self = this,
            $container = [];

        this.accessibility.jQuery.each(features, function(index) {
            // console.log(self.accessibility.options.getConfig('features.'+self.accessibility.camelCase(this.type)), this.type);

            if (! this.enable) {
                return;
            }

            let $feature = self.accessibility.jQuery('<div class="accessibility-feature"/>').addClass(this.type);

            $feature.append('<button type="button" data-feature="'+this.type+'"><i></i><span></span></button>');

            let featureState = self.accessibility.accessibilityFeatures.getState(this.type);

            if (featureState !== null) {
                if (featureState === 'enable') {
                    $feature.addClass('accessibility-feature-activated');
                }

                if (typeof featureState === 'object' && featureState.state === 'enable') {
                    $feature.addClass('accessibility-feature-activated');
                }
            }

            $feature.find('i').addClass(this.icon);
            $feature.find('span').html(self.accessibility.$i18n.trans(this.type));

            if ($append) {
                $append.append($feature);
            }

            $container.push($feature);

            // Appending feature trigger $el to features object
            self.accessibility.appendFeatureEl(this.type, $feature, featuresType);
        });

        return ($append) ? $append : $container;
    }

    /**
     *
     */
    spreadFeaturesToRows() {
        let index = 0,
            features = [];

        this.accessibility.jQuery.each(this.accessibility.getFeatures(), function() {
            if (! this.enable)
                return;

            if (features[index] && features[index].length >= 3) {
                index++;
            }

            if (! features[index]) {
                features[index] = [];
            }

            features[index].push(this);
        });

        return features;
    }

    /**
     * Append Listeners For Closing The Accessibility Menu
     *
     * @param listen
     */
    closeMenuListeners(listen) {
        if (!listen) {
            this.accessibility.$body.off('focusin.accessibility.focus-menu-item');
            this.accessibility.$body.off('keyup.accessibility.keyup-menu-item');
            this.accessibility.$body.off('click.accessibility.document-click-listener');
            return;
        }

        let self = this;

        this.accessibility.$body.on('click.accessibility.document-click-listener', function(e) {
            if (self.$el.is(e.target) || self.$el.find(e.target).length)
                return;

            self.closeMenu(e);
        });

        this.accessibility.$body.on('focusin.accessibility.focus-menu-item', function(e) {
            if (self.$el.is(e.target) || self.$el.find(e.target).length)
                return;

            self.closeMenu();
        });

        this.accessibility.$body.on('keyup.accessibility.keyup-menu-item', function(e) {
            if (e.which === 27){
                self.closeMenu();
            }
        });
    }

    /**
     * Set Global Menu Events
     * This Events Will Always Be Active
     */
    setEvents() {
        let self = this;

        // Open Menu
        this.$trigger.on('click', function(e) {
            self.openMenu(e);
        }.bind(this));

        // Close Menu
        this.$closeTrigger.on('click', function(e) {
            self.closeMenu(e);
        }.bind(this));

        // View Feature Clicked
        this.$viewFeatures.find('.accessibility-feature button').on('click', function() {
            self.accessibility.initFeatureListener(self.accessibility.jQuery(this).data('feature'));
        });

        // Layout Feature Clicked
        this.$layoutFeatures.find('.accessibility-feature button').on('click', function() {
            self.accessibility.initFeatureListener(self.accessibility.jQuery(this).data('feature'), 'layout');
        });

        // Footer Feature Clicked
        this.$footerFeatures.find('.accessibility-feature button').on('click', function() {
            self.accessibility.initFeatureListener(self.accessibility.jQuery(this).data('feature'), 'helper');
        });
    }

    /**
     * Open Accessibility Menu
     */
    openMenu(e) {
        AccessibilityForAll.preventDefault(e);

        this.$el.addClass('accessibility-menu-opened');
        this.$container.attr('aria-hidden', false);

        this.closeMenuListeners(true);

        this.$menuHeader.find('h3').focus();
    }

    /**
     * Close Accessibility Menu
     */
    closeMenu(e) {
        AccessibilityForAll.preventDefault(e);

        this.closeMenuListeners(false);

        this.accessibility.focusLastEl();
        this.$container.attr('aria-hidden', true);

        this.$el.removeClass('accessibility-menu-opened');
    }
}