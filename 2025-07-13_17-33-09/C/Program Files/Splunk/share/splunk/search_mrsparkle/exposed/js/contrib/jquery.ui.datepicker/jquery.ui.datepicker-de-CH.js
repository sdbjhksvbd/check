ï»¿/* Swiss-German initialisation for the jQuery UI date picker plugin. */
/* By Douglas Jose & Juerg Meier. */
jQuery(function($){
	$.datepicker.regional['de-CH'] = {
		closeText: 'schliessen',
		prevText: '&#x3c;zurÃ¼ck',
		nextText: 'nÃ¤chster&#x3e;',
		currentText: 'heute',
		monthNames: ['Januar','Februar','MÃ¤rz','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'],
		monthNamesShort: ['Jan','Feb','MÃ¤r','Apr','Mai','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dez'],
		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
		dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		weekHeader: 'Wo',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['de-CH']);
});