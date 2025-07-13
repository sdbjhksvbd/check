//! moment.js locale configuration
//! locale : Maltese (Malta) [mt]
//! author : Alessandro Maruccia : https://github.com/alesma

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var mt = moment.defineLocale('mt', {
    months : 'Jannar_Frar_Marzu_April_Mejju_Ä unju_Lulju_Awwissu_Settembru_Ottubru_Novembru_DiÄ‹embru'.split('_'),
    monthsShort : 'Jan_Fra_Mar_Apr_Mej_Ä un_Lul_Aww_Set_Ott_Nov_DiÄ‹'.split('_'),
    weekdays : 'Il-Ä¦add_It-Tnejn_It-Tlieta_L-ErbgÄ§a_Il-Ä¦amis_Il-Ä imgÄ§a_Is-Sibt'.split('_'),
    weekdaysShort : 'Ä¦ad_Tne_Tli_Erb_Ä¦am_Ä im_Sib'.split('_'),
    weekdaysMin : 'Ä¦a_Tn_Tl_Er_Ä¦a_Ä i_Si'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Illum fil-]LT',
        nextDay : '[GÄ§ada fil-]LT',
        nextWeek : 'dddd [fil-]LT',
        lastDay : '[Il-bieraÄ§ fil-]LT',
        lastWeek : 'dddd [li gÄ§adda] [fil-]LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'fâ€™ %s',
        past : '%s ilu',
        s : 'ftit sekondi',
        ss : '%d sekondi',
        m : 'minuta',
        mm : '%d minuti',
        h : 'siegÄ§a',
        hh : '%d siegÄ§at',
        d : 'Ä¡urnata',
        dd : '%d Ä¡ranet',
        M : 'xahar',
        MM : '%d xhur',
        y : 'sena',
        yy : '%d sni'
    },
    dayOfMonthOrdinalParse : /\d{1,2}Âº/,
    ordinal: '%dÂº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return mt;

})));
