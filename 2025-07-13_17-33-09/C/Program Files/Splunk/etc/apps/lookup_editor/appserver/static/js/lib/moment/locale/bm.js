//! moment.js locale configuration
//! locale : Bambara [bm]
//! author : Estelle Comment : https://github.com/estellecomment

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

// Language contact person : Abdoufata Kane : https://github.com/abdoufata

var bm = moment.defineLocale('bm', {
    months : 'Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_MÉ›kalo_ZuwÉ›nkalo_Zuluyekalo_Utikalo_SÉ›tanburukalo_É”kutÉ”burukalo_Nowanburukalo_Desanburukalo'.split('_'),
    monthsShort : 'Zan_Few_Mar_Awi_MÉ›_Zuw_Zul_Uti_SÉ›t_É”ku_Now_Des'.split('_'),
    weekdays : 'Kari_NtÉ›nÉ›n_Tarata_Araba_Alamisa_Juma_Sibiri'.split('_'),
    weekdaysShort : 'Kar_NtÉ›_Tar_Ara_Ala_Jum_Sib'.split('_'),
    weekdaysMin : 'Ka_Nt_Ta_Ar_Al_Ju_Si'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'MMMM [tile] D [san] YYYY',
        LLL : 'MMMM [tile] D [san] YYYY [lÉ›rÉ›] HH:mm',
        LLLL : 'dddd MMMM [tile] D [san] YYYY [lÉ›rÉ›] HH:mm'
    },
    calendar : {
        sameDay : '[Bi lÉ›rÉ›] LT',
        nextDay : '[Sini lÉ›rÉ›] LT',
        nextWeek : 'dddd [don lÉ›rÉ›] LT',
        lastDay : '[Kunu lÉ›rÉ›] LT',
        lastWeek : 'dddd [tÉ›mÉ›nen lÉ›rÉ›] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s kÉ”nÉ”',
        past : 'a bÉ› %s bÉ”',
        s : 'sanga dama dama',
        ss : 'sekondi %d',
        m : 'miniti kelen',
        mm : 'miniti %d',
        h : 'lÉ›rÉ› kelen',
        hh : 'lÉ›rÉ› %d',
        d : 'tile kelen',
        dd : 'tile %d',
        M : 'kalo kelen',
        MM : 'kalo %d',
        y : 'san kelen',
        yy : 'san %d'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return bm;

})));
