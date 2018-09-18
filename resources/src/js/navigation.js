export default class {

    /**
     * Accessibility Quick Navigation Class
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;
        this.$el = $('<div class="accessibility-navigation"/>');

        this.render();

        this.$el.appendTo(this.accessibility.getMainWrap());
    }

    /**
     *
     */
    render() {
        this.$el.append(this.getQuickAccess());
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getQuickAccess() {
        if (typeof this.$quickAccess !== 'undefined') {
            return this.$quickAccess;
        }

        this.$quickAccess = $('<div class="accessibility-quick-access"/>');
        this.$quickAccess.append(this.createQuickAccessItems());

        return this.$quickAccess;
    }

    /**
     *
     */
    createQuickAccessItems() {
        this.items = [
            {text: 'Press <span class="keyboard"><kbd>Enter ↵</kbd></span> To open Accessibility Menu', action: this.openAccessibilityMenu.bind(this)}
        ];

        let $itemsWrap = $('<ul/>');

        $.each(this.items, function() {
            let $item = $('<li/>');

            $item.append('<button type="button" tabindex="1"/>');
            $item.find('button').append(this.text);

            $itemsWrap.append($item);

            this.$el = $item;
            this.$button = $item.find('button');
        });

        this.focusListener();

        return $itemsWrap;
    }

    /**
     *
     */
    focusListener() {
        let self = this;

        $(document).on('focus', '.accessibility-navigation button', function() {
            let item = self.getButtonItemParams($(this));

            if (item) {
                item.action(item, 'focus');
            }
        });

        $(document).on('blur', '.accessibility-navigation button', function() {
            let item = self.getButtonItemParams($(this));

            if (item) {
                item.action(item, 'blur');
            }
        });
    }

    /**
     *
     * @param $el
     * @returns {boolean}
     */
    getButtonItemParams($el) {
        let item = false;

        $.each(this.items, function() {
            if (! $el.is(this.$button))
                return;

            item = this;
            return false;
        });

        return item;
    }

    /**
     *
     * @param item
     * @param buttonState
     */
    openAccessibilityMenu(item, buttonState) {
        let self = this;

        if (buttonState === 'focus') {
            $(document).on('keypress.accessibility.enter-click-menu-toggle', function(e) {
                if (e.which === 13) {
                    self.accessibility.accessibilityMenu.openMenu(e);
                    item.$button.blur();
                }
            });

            return;
        }

        $(document).off('keypress.accessibility.enter-click-menu-toggle');
    }
}