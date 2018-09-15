export default class {

    constructor(accessibility) {
        this.accessibility = accessibility;
        this.$el = $('<div class="accessibility accessibility-navigation"/>');

        this.render();

        this.accessibility.$body.prepend(this.$el);
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
        let items = [
            {text: 'Press <span class="keyboard"><kbd>Enter ↵</kbd></span> To open Accessibility Menu', action: ''}
        ];

        let $itemsWrap = $('<ul/>');

        $.each(items, function() {
            let $item = $('<li/>');

            $item.append('<button type="button"/>');
            $item.find('button').append(this.text);

            $itemsWrap.append($item);
        });

        return $itemsWrap;
    }
}