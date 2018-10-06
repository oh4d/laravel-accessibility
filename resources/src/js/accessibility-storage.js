export default class {
    /**
     *
     * @param accessibility
     */
    constructor(accessibility) {
        this.accessibility = accessibility;

        this.type = this.accessibility.options.getConfig('storage');
    }

    /**
     *
     */
    initializeFromStorage() {
        if (this.type === 'cookies') {
            return this.convertStringToObj(this.getCookie());
        }

        return {};
    }

    /**
     *
     * @param featureName
     * @param value
     */
    setStorage(featureName, value) {
        value = (value !== 'disable') ? value : null;
        featureName = this.accessibility.accessibilityFeatures.mapFeatureToStorage(featureName);

        let feature = {[featureName]: value};

        this.updateOrCreateToStorage(feature);
    }

    /**
     *
     */
    resetStorage() {
        let prefix = 'AccForAll';

        if (this.type === 'cookies') {
            document.cookie = prefix + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            return;
        }
    }

    /**
     *
     */
    getStorage() {

    }

    /**
     *
     * @param obj
     */
    updateOrCreateToStorage(obj) {
        if (this.type === 'cookies') {
            return this.setCookie(obj);
        }
    }

    /**
     *
     * @param feature
     */
    setCookie(feature) {
        let prefix = 'AccForAll',
            domain = this.accessibility.getDomain(),
            maxAge = 31536000,
            expires = new Date();

        expires.setDate(expires.getDate()+7);

        let params = this.updateCookieParams(feature);

        let cookiesParams = {
            [prefix]: params,
            expires: (params) ? expires.toGMTString() : '01 Jan 1970 00:00:01 GMT'
            // 'Max-Age': -99999999
            // domain,
        };

        let cookie = this.convertObjToString(cookiesParams);

        document.cookie = cookie;
        return cookie;
    }

    /**
     *
     * @param obj
     * @returns {string}
     */
    updateCookieParams(obj) {
        let cookie = this.getCookie();

        if (! cookie)
            return this.convertObjToString(obj, ',');

        let cookieObj = this.accessibility.jQuery.extend(this.convertStringToObj(cookie), obj);

        return this.convertObjToString(cookieObj, ',');
    }

    /**
     *
     * @returns {*}
     */
    getCookie() {
        let prefix = 'AccForAll=',
            ca = document.cookie.split(';');

        for (let i = 0 ;i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) === ' ') {
                c = c.substring(1,c.length);
            }

            if (c.indexOf(prefix) === 0) {
                return c.substring(prefix.length, c.length);
            }
        }

        return null;
    }

    /**
     *
     * @param obj
     * @param separator
     * @returns {string}
     */
    convertObjToString(obj, separator = ';') {
        let string = '';

        this.accessibility.jQuery.each(obj, function(key) {
            if (! this && typeof this !== 'string')
                return;

            string += key + '=' + this + separator;
        });

        return string.slice(0, -1);
    }

    /**
     *
     * @param string
     * @param separator
     * @returns {{}}
     */
    convertStringToObj(string, separator = ',') {
        let obj = {};

        if (! string)
            return obj;

        string = string.split(separator);

        for (let i = 0; i < string.length; i++) {
            let cur = string[i].split('=');

            obj[cur[0]] = cur[1];
        }

        return obj;
    }
}