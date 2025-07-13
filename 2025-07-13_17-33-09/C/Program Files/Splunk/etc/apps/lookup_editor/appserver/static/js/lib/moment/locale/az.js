//! moment.js locale configuration
//! locale : Azerbaijani [az]
//! author : topchiyev : https://github.com/topchiyev

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var suffixes = {
    1: '-inci',
    5: '-inci',
    8: '-inci',
    70: '-inci',
    80: '-inci',
    2: '-nci',
    7: '-nci',
    20: '-nci',
    50: '-nci',
    3: '-Ã¼ncÃ¼',
    4: '-Ã¼ncÃ¼',
    100: '-Ã¼ncÃ¼',
    6: '-ncÄ±',
    9: '-uncu',
    10: '-uncu',
    30: '-uncu',
    60: '-Ä±ncÄ±',
    90: '-Ä±ncÄ±'
};

var az = moment.defineLocale('az', {
    months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
    monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
    weekdays : 'Bazar_Bazar ertÉ™si_Ã‡É™rÅŸÉ™nbÉ™ axÅŸamÄ±_Ã‡É™rÅŸÉ™nbÉ™_CÃ¼mÉ™ axÅŸamÄ±_CÃ¼mÉ™_ÅžÉ™nbÉ™'.split('_'),
    weekdaysShort : 'Baz_BzE_Ã‡Ax_Ã‡É™r_CAx_CÃ¼m_ÅžÉ™n'.split('_'),
    weekdaysMin : 'Bz_BE_Ã‡A_Ã‡É™_CA_CÃ¼_ÅžÉ™'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[bugÃ¼n saat] LT',
        nextDay : '[sabah saat] LT',
        nextWeek : '[gÉ™lÉ™n hÉ™ftÉ™] dddd [saat] LT',
        lastDay : '[dÃ¼nÉ™n] LT',
        lastWeek : '[keÃ§É™n hÉ™ftÉ™] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s sonra',
        past : '%s É™vvÉ™l',
        s : 'birneÃ§É™ saniyyÉ™',
        ss : '%d saniyÉ™',
        m : 'bir dÉ™qiqÉ™',
        mm : '%d dÉ™qiqÉ™',
        h : 'bir saat',
        hh : '%d saat',
        d : 'bir gÃ¼n',
        dd : '%d gÃ¼n',
        M : 'bir ay',
        MM : '%d ay',
        y : 'bir il',
        yy : '%d il'
    },
    meridiemParse: /gecÉ™|sÉ™hÉ™r|gÃ¼ndÃ¼z|axÅŸam/,
    isPM : function (input) {
        return /^(gÃ¼ndÃ¼z|axÅŸam)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'gecÉ™';
        } else if (hour < 12) {
            return 'sÉ™hÉ™r';
        } else if (hour < 17) {
            return 'gÃ¼ndÃ¼z';
        } else {
            return 'axÅŸam';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(Ä±ncÄ±|inci|nci|Ã¼ncÃ¼|ncÄ±|uncu)/,
    ordinal : function (number) {
        if (number === 0) {  // special case for zero
            return number + '-Ä±ncÄ±';
        }
        var a = number % 10,
            b = number % 100 - a,
            c = number >= 100 ? 100 : null;
        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return az;

})));
