export default class {

    /**
     * Accessibility Navigation Class
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;
        this.$el = this.accessibility.jQuery('<div class="accessibility-navigation"/>');

        this.render();

        this.$el.appendTo(this.accessibility.getMainWrap());
    }

    /**
     *
     */
    render() {
        this.$el.append(this.getQuickAccess());

        this.renderQuickNavigation();

        this.focusListener();
    }

    /**
     *
     */
    renderQuickNavigation() {
        if (! this.isQuickNavigationEnable())
            return;

        if (! this.navigationConfig.items) {
            // Todo no item init
            // this.accessibility.options.extendConfig({navigation: {enable: false}});
            // return;
        }

        let initializedState = this.accessibility.accessibilityFeatures.getState('quickNavigation'),
            quickNavigation = {
                $el: null,
                state: 'disable',
                items: this.bindQuickNavigationItems()
            };

        this.accessibility.accessibilityFeatures.extendStates({quickNavigation});

        this.getQuickNavigation();

        quickNavigation.$el = this.$quickNavigation;

        this.accessibility.accessibilityFeatures.extendStates({quickNavigation});
        this.$el.append(this.$quickNavigation);

        if (initializedState && initializedState.state === 'enable') {
            this.enableQuickNavigation();
        }
    }

    /**
     *
     */
    getQuickNavigation() {
        if (typeof this.$quickNavigation !== 'undefined') {
            return this.$quickNavigation;
        }

        this.$quickNavigation = this.accessibility.jQuery('<div class="accessibility-quick-navigation"/>');

        let $container = this.accessibility.jQuery('<div class="accessibility-quick-navigation-container"/>'),
            $infoButton = this.accessibility.jQuery('<button tabindex="1" role="tooltip"/>');

        $infoButton.append('<i class="accessibility icon-info"></i>');

        let info = this.accessibility.$i18n.trans('info-enable-quick-navigation', '<span class="keyboard"><kbd>Ctrl</kbd> + <kbd>F9</kbd></span>');

        this.accessibility.renderToolTipEl($infoButton, info);
        // $infoButton.append();

        $container.append($infoButton);
        $container.append(this.createQuickNavigationItems());

        this.$quickNavigation.append($container);
        return this.$quickNavigation;
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getQuickAccess() {
        if (typeof this.$quickAccess !== 'undefined') {
            return this.$quickAccess;
        }

        this.$quickAccess = this.accessibility.jQuery('<div class="accessibility-quick-access"/>');
        this.$quickAccess.append(this.createQuickAccessItems());

        return this.$quickAccess;
    }

    /**
     *
     */
    createQuickNavigationItems() {
        let self = this,
            $items = this.accessibility.jQuery('<ul/>');

        this.accessibility.jQuery.each(this.accessibility.accessibilityFeatures.states.quickNavigation.items, function() {
            let $item = self.accessibility.jQuery('<li/>');

            $item.append('<a href="javascript:void(0)" tabindex="1">'+this.title+'</a>');
            $items.append($item);

            this.$trigger = $item;
        });

        return $items;
    }

    /**
     *
     */
    createQuickAccessItems() {
        this.items = [
            {text: this.accessibility.$i18n.trans('press-to-open-menu', '<span class="keyboard"><kbd>Enter ↵</kbd></span>'), keyListener: 13, action: this.openAccessibilityMenu.bind(this)}
        ];

        if (this.isQuickNavigationEnable()) {
            this.items.push({text: this.accessibility.$i18n.trans('press-to-enable-quick-navigation', '<span class="keyboard"><kbd>Enter ↵</kbd></span>'), keyListener: 13, action: this.enableQuickNavigation.bind(this)})
        }

        let self = this,
            $itemsWrap = this.accessibility.jQuery('<ul/>');

        this.accessibility.jQuery.each(this.items, function() {
            let $item = self.accessibility.jQuery('<li/>');

            $item.append('<button type="button" tabindex="1"/>');
            $item.find('button').append(this.text);

            $itemsWrap.append($item);

            this.$el = $item;
            this.$button = $item.find('button');
        });

        return $itemsWrap;
    }

    /**
     *
     */
    focusListener() {
        let self = this;

        this.accessibility.jQuery(document).on('focus', '.accessibility-navigation button', function() {
            let item = self.getButtonItemParams(self.accessibility.jQuery(this));

            if (! item)
                return;

            if (item.keyListener) {
                self.bindKeyListerner(item.keyListener, item, 'focus');
                return;
            }

            item.action(item, 'focus');
        });

        this.accessibility.jQuery(document).on('blur', '.accessibility-navigation button', function() {
            let item = self.getButtonItemParams(self.accessibility.jQuery(this));

            if (! item)
                return;

            if (item.keyListener) {
                self.bindKeyListerner(item.keyListener, item, 'blur');
                return;
            }

            item.action(item, 'blur');
        });
    }

    /**
     *
     * @param key
     * @param item
     * @param buttonState
     * @param e
     */
    bindKeyListerner(key, item, buttonState, e) {
        let self = this;

        if (buttonState === 'focus') {
            this.accessibility.jQuery(document).on('keypress.accessibility.navigation-focus-item-listener', function(e) {
                if (e.which === key) {
                    item.action(e);
                    item.$button.blur();
                }
            });

            return;
        }

        this.accessibility.jQuery(document).off('keypress.accessibility.navigation-focus-item-listener');
    }

    /**
     *
     * @param $el
     * @returns {boolean}
     */
    getButtonItemParams($el) {
        let item = false;

        this.accessibility.jQuery.each(this.items, function() {
            if (! $el.is(this.$button))
                return;

            item = this;
            return false;
        });

        return item;
    }

    /**
     *
     * @param e
     */
    openAccessibilityMenu(e) {
        this.accessibility.accessibilityMenu.openMenu(e);
    }

    /**
     *
     * @param e
     */
    enableQuickNavigation(e) {
        if (! this.isQuickNavigationEnable())
            return;

        this.accessibility.accessibilityFeatures.enableQuickNavigation();
    }

    /**
     *
     */
    disableQuickNavigation() {
        this.accessibility.accessibilityFeatures.disableQuickNavigation();
    }

    /**
     *
     * @returns {boolean}
     */
    isQuickNavigationEnable() {
        this.navigationConfig = this.navigationConfig ? this.navigationConfig : this.accessibility.options.getConfig('quickNavigation');
        return (this.navigationConfig && this.navigationConfig.enable);
    }

    /**
     *
     * @returns {*[]}
     */
    bindQuickNavigationItems() {
        if (! this.navigationConfig) {
            if (! this.isQuickNavigationEnable())
                return [];
        }

        if (! this.navigationConfig.items) {
            return [];
        }

        let self = this,
            items = [];

        this.accessibility.jQuery.each(this.navigationConfig.items, function() {
            if (! this.$el)
                return;

            let item = {
                $el: self.accessibility.jQuery(this.$el),
                title: this.title
            };

            if (! item.$el.length)
                return;

            items.push(item);
        });


        items.push({
            tabIndex: 1,
            action: this.openAccessibilityMenu.bind(this),
            $el: this.accessibility.accessibilityMenu.$el,
            title: this.accessibility.$i18n.trans('accessibility-menu')
        });

        return items;
    }
}