/*!
 * numeral.js language configuration
 * language : korean
 * author : corona10 : https://github.com/corona10
 */
(function () {
    var language = {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'ì²œ',
            million: 'ë°±ë§Œ',
            billion: 'ì‹­ì–µ',
            trillion: 'ì‹­ì¡°'
        },
        ordinal: function (number) {
            return '.';
        },
        currency: {
            symbol: 'â‚©'
        }
    };

    // Node
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = language;
    }
    // Browser
    if (typeof window !== 'undefined' && this.numeral && this.numeral.language) {
        this.numeral.language('ko', language);
    }
}());