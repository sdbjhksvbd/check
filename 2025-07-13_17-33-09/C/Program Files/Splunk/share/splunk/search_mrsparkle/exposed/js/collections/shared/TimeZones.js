/**
 * @author ykou
 *
 */

define(
        [
            'underscore',
            'collections/Base'

        ],
        function(_, BaseCollection) {
            // Updated the latest values from https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
            // Look at the bottom of this file for more instructions.
            return BaseCollection.extend({
                models: [
                    {label: _('-- Default System Timezone --').t(), id: '', offset: 0},
                    {label: _('(GMT) Greenwich Mean Time').t(), id: 'GMT', offset: 0},
                    {label: _('(GMT-11:00) Midway Island, Samoa').t(), id: 'Pacific/Midway', offset: -39600},
                    {label: _('(GMT-10:00) Hawaii-Aleutian').t(), id: 'America/Adak', offset: -36000},
                    {label: _('(GMT-10:00) Hawaii').t(), id: 'Pacific/Honolulu', offset: -36000},
                    {label: _('(GMT-09:30) Marquesas Islands').t(), id: 'Pacific/Marquesas', offset: -34200},
                    {label: _('(GMT-09:00) Gambier Islands').t(), id: 'Pacific/Gambier', offset: -32400},
                    {label: _('(GMT-09:00) Alaska').t(), id: 'America/Anchorage', offset: -32400},
                    {label: _('(GMT-08:00) Tijuana, Baja California').t(), id: 'America/Ensenada', offset: -28800},
                    {label: _('(GMT-08:00) Pitcairn Islands').t(), id: 'Pacific/Pitcairn', offset: -28800},
                    {label: _('(GMT-08:00) Pacific Time (US & Canada)').t(), id: 'America/Los_Angeles', offset: -28800},
                    {label: _('(GMT-07:00) Mountain Time (US & Canada)').t(), id: 'America/Denver', offset: -25200},
                    {label: _('(GMT-07:00) Chihuahua, La Paz, Mazatlan').t(), id: 'America/Chihuahua', offset: -25200},
                    {label: _('(GMT-07:00) Arizona').t(), id: 'America/Dawson_Creek', offset: -25200},
                    {label: _('(GMT-06:00) Saskatchewan, Central America').t(), id: 'America/Belize', offset: -21600},
                    {label: _('(GMT-06:00) Guadalajara, Mexico City, Monterrey').t(), id: 'America/Mexico_City', offset: -21600},
                    {label: _('(GMT-06:00) Easter Island').t(), id: 'Chile/EasterIsland', offset: -21600},
                    {label: _('(GMT-06:00) Central Time (US & Canada)').t(), id: 'America/Chicago', offset: -21600},
                    {label: _('(GMT-05:00) Eastern Time (US & Canada)').t(), id: 'America/New_York', offset: -18000},
                    {label: _('(GMT-05:00) Cuba').t(), id: 'America/Havana', offset: -18000},
                    {label: _('(GMT-05:00) Bogota, Lima, Quito, Rio Branco').t(), id: 'America/Bogota', offset: -18000},
                    {label: _('(GMT-04:00) Caracas').t(), id: 'America/Caracas', offset: -14400},
                    {label: _('(GMT-04:00) Santiago').t(), id: 'America/Santiago', offset: -14400},
                    {label: _('(GMT-04:00) La Paz').t(), id: 'America/La_Paz', offset: -14400},
                    {label: _('(GMT-04:00) Brazil').t(), id: 'America/Campo_Grande', offset: -14400},
                    {label: _('(GMT-04:00) Atlantic Time (Goose Bay)').t(), id: 'America/Goose_Bay', offset: -14400},
                    {label: _('(GMT-04:00) Atlantic Time (Canada)').t(), id: 'America/Glace_Bay', offset: -14400},
                    {label: _('(GMT-03:30) Newfoundland').t(), id: 'America/St_Johns', offset: -12600},
                    {label: _('(GMT-03:00) Faukland Islands').t(), id: 'Atlantic/Stanley', offset: -10800},
                    {label: _('(GMT-03:00) UTC-3').t(), id: 'America/Araguaina', offset: -10800},
                    {label: _('(GMT-03:00) Montevideo').t(), id: 'America/Montevideo', offset: -10800},
                    {label: _('(GMT-03:00) Miquelon, St. Pierre').t(), id: 'America/Miquelon', offset: -10800},
                    {label: _('(GMT-03:00) Greenland').t(), id: 'America/Godthab', offset: -10800},
                    {label: _('(GMT-03:00) Buenos Aires').t(), id: 'America/Argentina/Buenos_Aires', offset: -10800},
                    {label: _('(GMT-03:00) Brasilia').t(), id: 'America/Sao_Paulo', offset: -10800},
                    {label: _('(GMT-02:00) Mid-Atlantic').t(), id: 'America/Noronha', offset: -7200},
                    {label: _('(GMT-01:00) Cape Verde Is.').t(), id: 'Atlantic/Cape_Verde', offset: -3600},
                    {label: _('(GMT-01:00) Azores').t(), id: 'Atlantic/Azores', offset: -3600},
                    {label: _('(GMT) Greenwich Mean Time : Belfast').t(), id: 'Europe/Belfast', offset: 0},
                    {label: _('(GMT) Greenwich Mean Time : Dublin').t(), id: 'Europe/Dublin', offset: 0},
                    {label: _('(GMT) Greenwich Mean Time : Lisbon').t(), id: 'Europe/Lisbon', offset: 0},
                    {label: _('(GMT) Greenwich Mean Time : London').t(), id: 'Europe/London', offset: 0},
                    {label: _('(GMT) Monrovia, Reykjavik').t(), id: 'Africa/Abidjan', offset: 0},
                    {label: _('(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna').t(), id: 'Europe/Amsterdam', offset: 3600},
                    {label: _('(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague').t(), id: 'Europe/Belgrade', offset: 3600},
                    {label: _('(GMT+01:00) Brussels, Copenhagen, Madrid, Paris').t(), id: 'Europe/Brussels', offset: 3600},
                    {label: _('(GMT+01:00) West Central Africa').t(), id: 'Africa/Algiers', offset: 3600},
                    {label: _('(GMT+02:00) Windhoek').t(), id: 'Africa/Windhoek', offset: 7200},
                    {label: _('(GMT+02:00) Beirut').t(), id: 'Asia/Beirut', offset: 7200},
                    {label: _('(GMT+02:00) Cairo').t(), id: 'Africa/Cairo', offset: 7200},
                    {label: _('(GMT+02:00) Gaza').t(), id: 'Asia/Gaza', offset: 7200},
                    {label: _('(GMT+02:00) Harare, Pretoria').t(), id: 'Africa/Blantyre', offset: 7200},
                    {label: _('(GMT+02:00) Jerusalem').t(), id: 'Asia/Jerusalem', offset: 7200},
                    {label: _('(GMT+02:00) Syria').t(), id: 'Asia/Damascus', offset: 7200},
                    {label: _('(GMT+03:00) Minsk').t(), id: 'Europe/Minsk', offset: 10800},
                    {label: _('(GMT+03:00) Istanbul').t(), id: 'Europe/Istanbul', offset: 10800},
                    {label: _('(GMT+03:00) Moscow, St. Petersburg, Volgograd').t(), id: 'Europe/Moscow', offset: 10800},
                    {label: _('(GMT+03:00) Nairobi').t(), id: 'Africa/Addis_Ababa', offset: 10800},
                    {label: _('(GMT+03:30) Tehran').t(), id: 'Asia/Tehran', offset: 12600},
                    {label: _('(GMT+04:00) Abu Dhabi, Muscat').t(), id: 'Asia/Dubai', offset: 14400},
                    {label: _('(GMT+04:00) Yerevan').t(), id: 'Asia/Yerevan', offset: 14400},
                    {label: _('(GMT+04:30) Kabul').t(), id: 'Asia/Kabul', offset: 16200},
                    {label: _('(GMT+05:00) Tashkent').t(), id: 'Asia/Tashkent', offset: 18000},
                    {label: _('(GMT+05:00) Ekaterinburg').t(), id: 'Asia/Yekaterinburg', offset: 18000},
                    {label: _('(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi').t(), id: 'Asia/Kolkata', offset: 19800},
                    {label: _('(GMT+05:45) Kathmandu').t(), id: 'Asia/Katmandu', offset: 20700},
                    {label: _('(GMT+06:00) Astana, Dhaka').t(), id: 'Asia/Dhaka', offset: 21600},
                    {label: _('(GMT+06:30) Yangon (Rangoon)').t(), id: 'Asia/Rangoon', offset: 23400},
                    {label: _('(GMT+07:00) Novosibirsk').t(), id: 'Asia/Novosibirsk', offset: 25200},
                    {label: _('(GMT+07:00) Bangkok, Hanoi, Jakarta').t(), id: 'Asia/Bangkok', offset: 25200},
                    {label: _('(GMT+07:00) Krasnoyarsk').t(), id: 'Asia/Krasnoyarsk', offset: 25200},
                    {label: _('(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi').t(), id: 'Asia/Hong_Kong', offset: 28800},
                    {label: _('(GMT+08:00) Irkutsk, Ulaan Bataar').t(), id: 'Asia/Irkutsk', offset: 28800},
                    {label: _('(GMT+08:00) Taipei').t(), id: 'Asia/Taipei', offset: 28800},
                    {label: _('(GMT+08:00) Perth').t(), id: 'Australia/Perth', offset: 28800},
                    {label: _('(GMT+08:45) Eucla').t(), id: 'Australia/Eucla', offset: 31500},
                    {label: _('(GMT+09:00) Osaka, Sapporo, Tokyo').t(), id: 'Asia/Tokyo', offset: 32400},
                    {label: _('(GMT+09:00) Seoul').t(), id: 'Asia/Seoul', offset: 32400},
                    {label: _('(GMT+09:00) Yakutsk').t(), id: 'Asia/Yakutsk', offset: 32400},
                    {label: _('(GMT+09:30) Adelaide').t(), id: 'Australia/Adelaide', offset: 34200},
                    {label: _('(GMT+09:30) Darwin').t(), id: 'Australia/Darwin', offset: 34200},
                    {label: _('(GMT+10:00) Brisbane').t(), id: 'Australia/Brisbane', offset: 36000},
                    {label: _('(GMT+10:00) Hobart').t(), id: 'Australia/Hobart', offset: 36000},
                    {label: _('(GMT+10:00) Melbourne').t(), id: 'Australia/Melbourne', offset: 36000},
                    {label: _('(GMT+10:00) Sydney').t(), id: 'Australia/Sydney', offset: 36000},
                    {label: _('(GMT+10:00) Vladivostok').t(), id: 'Asia/Vladivostok', offset: 36000},
                    {label: _('(GMT+10:30) Lord Howe Island').t(), id: 'Australia/Lord_Howe', offset: 37800},
                    {label: _('(GMT+11:00) Solomon Is., New Caledonia').t(), id: 'Pacific/Guadalcanal', offset: 39600},
                    {label: _('(GMT+11:00) Magadan').t(), id: 'Asia/Magadan', offset: 39600},
                    {label: _('(GMT+11:00) Norfolk Island').t(), id: 'Pacific/Norfolk', offset: 39600},
                    {label: _('(GMT+12:00) Anadyr, Kamchatka').t(), id: 'Asia/Anadyr', offset: 43200},
                    {label: _('(GMT+12:00) Auckland, Wellington').t(), id: 'Pacific/Auckland', offset: 43200},
                    {label: _('(GMT+12:00) Fiji, Kamchatka, Marshall Is.').t(), id: 'Pacific/Fiji', offset: 43200},
                    {label: _('(GMT+12:45) Chatham Islands').t(), id: 'Pacific/Chatham', offset: 45900},
                    {label: _('(GMT+13:00) Nuku Alofa').t(), id: 'Pacific/Tongatapu', offset: 46800},
                    {label: _('(GMT+14:00) Kiritimati').t(), id: 'Pacific/Kiritimati', offset: 50400}
                ],
                constructor: function(models, options) {
                   if (!models) {
                       models = this.models;
                   }
                   BaseCollection.prototype.constructor.call(this, models, options);
                }
            });
        }
);


/*
// Use this simple program for constructing the latest values from wiki

const uiTz = [
    {label: '(GMT) Greenwich Mean Time', id: 'GMT', offset: 0},
    ...
];

// Construct the wiki data in some text editor. We only need the ids and the offsets
const expectedTz = {
    "Africa/Abidjan": "+00:00",
    ...
};

let newTz = uiTz.map(tz => {
    // Extract the city label
    const label = tz.label.split(")")[1];

    // Compute the offset values
    let offsetStr = expectedTz[tz.id];

    if (offsetStr) {
        const offsetArr = offsetStr.split(":");

        // Offset = (Sign*Hours*3600 + Min*60) 
        const offset = (offsetArr[0][0] == "-" ? -1 : 1) * (parseInt(offsetArr[0].substring(1))*3600 + parseInt(offsetArr[1])*60);
        return `                    {label: _('(GMT${offsetStr})${label}').t(), id: '${tz.id}', offset: ${offset}},\n`;
    } else {
        return `                    {label: _('${tz.label}').t(), id: '${tz.id}', offset: ${tz.offset}},\n`;
    }
});

console.log(newTz.join(""));


*/