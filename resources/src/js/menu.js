export default class {

    /**
     * Accessibility Main Menu Class
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;
        this.$el = $('<div class="accessibility-menu"/>');

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
        this.$container = $('<div class="accessibility-menu-container"/>');

        this.$el.append(this.$container);

        this.$el.append(this.getTrigger());

        this.$container.append(this.getMenuHeader());

        this.getMenuBody().append(this.getFeatures());
    }

    /**
     *
     */
    getMenuBody() {
        if (typeof this.$menuBody !== 'undefined') {
            return this.$menuBody;
        }

        this.$menuBody = $('<div class="accessibility-menu-body"/>');
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

        this.$menuHeader = $('<div class="accessibility-menu-header"/>');
        this.$menuHeader.append('<h3 tabindex="0">' + this.accessibility.$i18n.trans('accessibility') + '</h3>');
        this.$menuHeader.append(this.getCloseTrigger());
        return this.$menuHeader;
    }

    /**
     * Return Menu Trigger Button
     * @returns {*}
     */
    getTrigger() {
        if (typeof this.$trigger !== 'undefined') {
            return this.$trigger;
        }

        this.$trigger = $('<button type="button"/>').addClass('accessibility-menu-trigger');

        this.$trigger.append('<i/>');
        this.$trigger.find('i').addClass('accessibility icon-accessibility');
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

        this.$closeTrigger = $('<button type="button"/>').addClass('accessibility-menu-close-trigger');

        this.$closeTrigger.append('<i/>');
        this.$closeTrigger.find('i').addClass('accessibility icon-cancel');
        return this.$closeTrigger;
    }

    /**
     * Return Features Element To Menu Container
     */
    getFeatures() {
        if (typeof this.$features !== 'undefined') {
            return this.$features;
        }

        let self = this;
        this.$features = $('<div class="accessibility-features"/>');

        $.each(this.accessibility.getFeatures(), function() {
            let $feature = $('<div class="accessibility-feature"/>').addClass(this.type);

            $feature.append('<button type="button" data-feature="'+this.type+'"><i></i><span></span></button>');
            $feature.find('i').addClass(this.icon);

            self.$features.append($feature);
        });

        return this.$features;
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

        // Feature Clicked
        this.$features.find('.accessibility-feature button').on('click', function() {
            self.accessibility.featureListener($(this).parent(), $(this).data('feature'));
        });
    }

    /**
     * Open Accessibility Menu
     */
    openMenu(e) {
        this.accessibility.preventDefault(e);

        this.$el.addClass('accessibility-menu-opened');
        this.$container.attr('aria-hidden', false);

        this.closeMenuListeners(true);

        this.$menuHeader.find('h3').focus();
    }

    /**
     * Close Accessibility Menu
     */
    closeMenu(e) {
        this.accessibility.preventDefault(e);

        this.$el.removeClass('accessibility-menu-opened');
        this.$container.attr('aria-hidden', true);

        this.closeMenuListeners(false);

        this.accessibility.focusLastEl();
    }
}