//! moment.js locale configuration
//! locale : Turkish [tr]
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak YiÄŸit Kaya: https://github.com/BYK

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var suffixes = {
    1: '\'inci',
    5: '\'inci',
    8: '\'inci',
    70: '\'inci',
    80: '\'inci',
    2: '\'nci',
    7: '\'nci',
    20: '\'nci',
    50: '\'nci',
    3: '\'Ã¼ncÃ¼',
    4: '\'Ã¼ncÃ¼',
    100: '\'Ã¼ncÃ¼',
    6: '\'ncÄ±',
    9: '\'uncu',
    10: '\'uncu',
    30: '\'uncu',
    60: '\'Ä±ncÄ±',
    90: '\'Ä±ncÄ±'
};

var tr = moment.defineLocale('tr', {
    months : 'Ocak_Åžubat_Mart_Nisan_MayÄ±s_Haziran_Temmuz_AÄŸustos_EylÃ¼l_Ekim_KasÄ±m_AralÄ±k'.split('_'),
    monthsShort : 'Oca_Åžub_Mar_Nis_May_Haz_Tem_AÄŸu_Eyl_Eki_Kas_Ara'.split('_'),
    weekdays : 'Pazar_Pazartesi_SalÄ±_Ã‡arÅŸamba_PerÅŸembe_Cuma_Cumartesi'.split('_'),
    weekdaysShort : 'Paz_Pts_Sal_Ã‡ar_Per_Cum_Cts'.split('_'),
    weekdaysMin : 'Pz_Pt_Sa_Ã‡a_Pe_Cu_Ct'.split('_'),
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
        nextDay : '[yarÄ±n saat] LT',
        nextWeek : '[gelecek] dddd [saat] LT',
        lastDay : '[dÃ¼n] LT',
        lastWeek : '[geÃ§en] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s sonra',
        past : '%s Ã¶nce',
        s : 'birkaÃ§ saniye',
        ss : '%d saniye',
        m : 'bir dakika',
        mm : '%d dakika',
        h : 'bir saat',
        hh : '%d saat',
        d : 'bir gÃ¼n',
        dd : '%d gÃ¼n',
        M : 'bir ay',
        MM : '%d ay',
        y : 'bir yÄ±l',
        yy : '%d yÄ±l'
    },
    dayOfMonthOrdinalParse: /\d{1,2}'(inci|nci|Ã¼ncÃ¼|ncÄ±|uncu|Ä±ncÄ±)/,
    ordinal : function (number) {
        if (number === 0) {  // special case for zero
            return number + '\'Ä±ncÄ±';
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

return tr;

})));
