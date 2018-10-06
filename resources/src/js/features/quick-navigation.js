export default class {
    /**
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;

        this.elementType = ['h1','h2','h3','h4','h5','h6', 'button', 'a'];
    }

    /**
     *
     */
    initialize() {
        this.resetTabsIndexes();

        this.gatherItems();

        this.focusQuickNavigationListener();

        this.navigationListener();

        if (this.accessibility.accessibilityFeatures.getState('disable-transitions') === 'enable') {
            this.navigation.$el.find('button').focus();
            return;
        }

        let self = this;

        this.accessibility.$body.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd', function() {
            self.navigation.$el.find('button').focus();
        });
    }

    /**
     *
     */
    gatherItems() {
        let currentTabIndex = this.tabIndexStarter,
            itemsType = this.elementType.join(', '),
            state = this.accessibility.accessibilityFeatures.getState('quickNavigation');

        let self = this,
            navigation = {};

        this.accessibility.jQuery.each(state.items, function() {
            this.$tabs = this.$el.find(itemsType);

            this.tabIndex = this.tabIndex ? this.tabIndex : currentTabIndex;

            this.$tabs.attr('tabindex', this.tabIndex);
            this.$trigger.find('a').attr('data-tab-href', this.tabIndex);

            navigation[this.tabIndex] = this;

            if (this.tabIndex === currentTabIndex) {
                currentTabIndex += self.tabIndexExtend;
            }
        });

        this.navigation = this.accessibility.jQuery.extend(state, {items: navigation});
    }

    /**
     *
     */
    resetTabsIndexes() {
        this.tabIndexExtend = 10;
        this.tabIndexStarter = 20;
    }

    /**
     *
     */
    destroy() {
        this.accessibility.jQuery.each(this.navigation.items, function() {
            this.$tabs.attr('tabindex', null);
        });

        this.navigation.$el.find('ul > li > a').off('click.accessibility.quick-navigation-navigate');
        delete this.navigation;

        this.itemFocused();

        this.accessibility.$body.off('keyup.accessibility.quick-navigation-focus-key');
        this.accessibility.$body.off('keydown.accessibility.quick-navigation-focus-key');
        this.accessibility.$body.off('focus.accessibility.quick-navigation-item-focused', this.elementType.join(', '));
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

        this.accessibility.$body.on('focus.accessibility.quick-navigation-item-focused', this.elementType.join(', '), function() {
            if (self.accessibility.jQuery(this).is(self.accessibility.accessibilityMenu.getTrigger()))
                return;

            self.itemFocused(self.accessibility.jQuery(this));
        });
    }

    /**
     *
     */
    navigationListener() {
        let self = this;

        this.navigation.$el.find('ul > li > a').on('click.accessibility.quick-navigation-navigate', function(e) {
            let focusTab = self.accessibility.jQuery(this).attr('data-tab-href'),
                item = self.getNavigationTabIndexGroup(focusTab);

            if (! item || ! item.action) {
                self.accessibility.jQuery('[tabindex='+focusTab+']').first().focus();
                return;
            }

            if (item.action) {
                item.action(e);
            }
        });
    }

    /**
     *
     */
    itemFocused($el = null) {
        if (this.$focused) {
            this.$focused.removeClass('accessibility-item-focused');
        }

        this.$focused = $el;

        if (! $el) {
            return;
        }

        $el.addClass('accessibility-item-focused');
    }

    /**
     *
     * @param tabIndex
     * @returns {boolean}
     */
    getNavigationTabIndexGroup(tabIndex) {
        if (! this.navigation || ! this.navigation.items)
            return false;

        return (this.navigation.items[tabIndex]) ? this.navigation.items[tabIndex] : false;
    }
}