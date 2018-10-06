export default class {

    constructor(accessibility) {
        this.accessibility = accessibility;

        this.prepare();
    }

    /**
     *
     * @returns {*}
     */
    prepare() {
        if (this.$el) {
            return this.$el;
        }

        this.$el = this.accessibility.jQuery('<div class="accessibility-img-alt-description"/>');
        this.accessibility.getMainWrap().append(this.$el);
        return this.$el;
    }

    /**
     *
     * @param $el
     * @param event
     */
    mouseIn($el, event) {
        if (! $el)
            return;

        let self = this,
            alt = $el.attr('alt');

        if (!alt)
            return;

        this.$hoverImg = $el;

        this.$el.addClass('accessibility-img-description-block');

        this.renderAltDescription(alt, event);

        this.visible();

        this.$hoverImg.on('mouseout.accessibility.image-mouse-out', function() {
            self.mouseOut();
        });

        this.$hoverImg.on('mousemove.accessibility.image-mouse-move', function(e) {
            self.positionBox(e);
        });
    }

    /**
     *
     */
    mouseOut() {
        this.visible(false);

        this.$hoverImg.off('mouseout.accessibility.image-mouse-out');
        this.$hoverImg.off('mousemove.accessibility.image-mouse-move');

        this.$hoverImg = false;
    }

    /**
     *
     * @param visible
     */
    visible(visible = true) {
        if (! visible) {
            this.$el.removeClass('accessibility-img-mouse-in accessibility-img-description-block');
            this.$el.html('');
            return;
        }

        this.$el.addClass('accessibility-img-mouse-in');
    }

    /**
     *
     * @param alt
     * @param event
     */
    renderAltDescription(alt, event) {
        let $box = this.accessibility.jQuery('<span/>');
        $box.html(alt);

        this.prepare().html($box);
        this.positionBox(event);
    }

    /**
     *
     * @param event
     */
    positionBox(event) {
        AccessibilityForAll.preventDefault(event);

        let elWidth = this.$el.width(),
            pX = event.clientX - (elWidth / 2),
            pY = event.clientY + 20;

        if (this.accessibility.$body.hasClass('accessibility-big-white-cursor') || this.accessibility.$body.hasClass('accessibility-big-black-cursor')) {
            pY += 20;
        }

        if (event.clientX + (elWidth / 2) > this.accessibility.$body.width()) {
            pX = event.clientX - elWidth;
        }

        if (pX < 0) {
            pX = event.clientX;
        }

        this.$el.css({'left': pX, 'top': pY});
    }

    /**
     *
     */
    destroy() {
        if (! this.$hoverImg)
            return;

        this.mouseOut();
    }
}