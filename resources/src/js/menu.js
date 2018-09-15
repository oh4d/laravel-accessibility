export default class {

    /**
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.$body = $('body');
        this.accessibility = accessibility;
        this.$el = $('<div class="accessibility accessibility-menu"/>');

        this.render();

        this.setEvents();
    }

    /**
     * Append The Accessibility Menu To Body
     */
    render() {
        this.appendMenuContent();

        this.$el.appendTo('body');
    }

    /**
     * Append Menu Content Including:
     * Menu Button Trigger
     * Menu Features
     */
    appendMenuContent() {
        this.$el.append(this.getTrigger());
        this.$el.append(this.getMenuHeader());
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
        this.$el.append(this.$menuBody);
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
        this.$menuHeader.append('<h3>Accessibility</h3>');
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

    documentClickListener(listen) {
        if (!listen) {
            this.$body.off('click.accessibility.document-click-listener');
            return;
        }

        let self = this;

        this.$body.on('click.accessibility.document-click-listener', function(e) {
            if (self.$el.is(e.target) || self.$el.find(e.target).length)
                return;

            e.preventDefault();
            e.stopPropagation();

            self.$el.removeClass('accessibility-menu-opened');
            self.documentClickListener(false);
        });
    }

    /**
     * 
     */
    setEvents() {
        let self = this;

        // Open Menu
        this.$trigger.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            this.$el.addClass('accessibility-menu-opened');
            this.documentClickListener(true);
        }.bind(this));

        // Close Menu
        this.$closeTrigger.on('click', function() {
            this.$el.removeClass('accessibility-menu-opened');
            this.documentClickListener(false);
        }.bind(this));

        // Feature Clicked
        this.$features.find('.accessibility-feature button').on('click', function() {
            self.accessibility.featureListener($(this).data('feature'));
        });
    }
}