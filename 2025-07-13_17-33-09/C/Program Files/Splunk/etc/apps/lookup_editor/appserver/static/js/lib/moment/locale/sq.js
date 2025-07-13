//! moment.js locale configuration
//! locale : Albanian [sq]
//! author : FlakÃ«rim Ismani : https://github.com/flakerimi
//! author : Menelion ElensÃºle : https://github.com/Oire
//! author : Oerd Cukalla : https://github.com/oerd

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var sq = moment.defineLocale('sq', {
    months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_NÃ«ntor_Dhjetor'.split('_'),
    monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_NÃ«n_Dhj'.split('_'),
    weekdays : 'E Diel_E HÃ«nÃ«_E MartÃ«_E MÃ«rkurÃ«_E Enjte_E Premte_E ShtunÃ«'.split('_'),
    weekdaysShort : 'Die_HÃ«n_Mar_MÃ«r_Enj_Pre_Sht'.split('_'),
    weekdaysMin : 'D_H_Ma_MÃ«_E_P_Sh'.split('_'),
    weekdaysParseExact : true,
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Sot nÃ«] LT',
        nextDay : '[NesÃ«r nÃ«] LT',
        nextWeek : 'dddd [nÃ«] LT',
        lastDay : '[Dje nÃ«] LT',
        lastWeek : 'dddd [e kaluar nÃ«] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'nÃ« %s',
        past : '%s mÃ« parÃ«',
        s : 'disa sekonda',
        ss : '%d sekonda',
        m : 'njÃ« minutÃ«',
        mm : '%d minuta',
        h : 'njÃ« orÃ«',
        hh : '%d orÃ«',
        d : 'njÃ« ditÃ«',
        dd : '%d ditÃ«',
        M : 'njÃ« muaj',
        MM : '%d muaj',
        y : 'njÃ« vit',
        yy : '%d vite'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return sq;

})));
