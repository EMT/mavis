
// set up
var milliSecondsPerPixel = 10,
	newPaperAfter = 6000; // milliseconds of silence
	pollEvery = 5000; // milliseconds


$(function() {

	// load some data
	mavis.loadKeyPresses(null, new Date().getTime(), 800);
	// mavis.loadKeyPresses(null, 1414244040000, 800);

	setInterval(function() {
		if (mavis.lastKeyPress) {
			mavis.loadKeyPresses((mavis.lastKeyPress.on * 1) + 1);
		} 
		else {
			mavis.loadKeyPresses(null, new Date().getTime(), 800);
		}
	}, 3000);


	// load more at the bottom on scroll
	// var scroll_timer;
	// $(window).on('scroll', function() {
	// 	if (scroll_timer) {
	// 		clearTimeout(scroll_timer);
	// 	}
	// 	scroll_timer = setTimeout(function() {
	// 		var doc_h = $(document).height(),
	// 			win_h = $(window).height(),
	// 			scroll = $(window).scrollTop();

	// 		if (scroll + win_h > doc_h - 80) {
	// 			mavis.loadKeyPresses(null, mavis.firstKeyPress.on - 1, 30);
	// 		}
	// 	}, 200);
	// });

});


var mavis = {

	keyPresses: [],
	paperStartTime: null,
	lastKeyPress: null,
	firstKeyPress: null,
	lastKeyOff: null,

	// load some data
	loadKeyPresses: function(from, to, limit) {
		$.get(
			'http://api.mavis.madebyfieldwork.com/actions/get.json?',
			{
				from: from,
				to: to,
				limit: limit
			},
			function(data) {
				if (data.length) {
					mavis.keyPresses.push.apply(mavis.keyPresses, data);
					mavis.renderKeyPresses();
				}
			}
		);
	},

	// render key presses
	renderKeyPresses: function() {
		$paper = $('.js-paper');

		if (!mavis.firstKeyPress) {
			mavis.firstKeyPress = mavis.keyPresses[0];
		}

		for (var i = 0, len = mavis.keyPresses.length; i < len; i ++) {
			if (mavis.lastKeyOff && mavis.keyPresses[i].on - mavis.lastKeyOff > newPaperAfter) {
				$paper = mavis.newPaper(mavis.keyPresses[i].on);
			}

			$paper.append(
				$('<div></div>')
					.addClass('key-press key-press-' + mavis.keyPresses[i].key_id)
					.css({
						bottom: Math.round((mavis.keyPresses[i].on - mavis.paperStartTime) / milliSecondsPerPixel),
						height: Math.round(mavis.keyPresses[i].duration / milliSecondsPerPixel)
					})
			);

			mavis.lastKeyPress = mavis.keyPresses[i];
			mavis.lastKeyOff = Math.max(mavis.keyPresses[i].on * 1 + mavis.keyPresses[i].duration * 1, mavis.lastKeyOff);
		}

		mavis.setPaperHeight($paper);
		mavis.keyPresses = [];
	},

	// start new paper
	newPaper: function(timestamp) {
		var $paper = $('.js-paper');
		mavis.setPaperHeight($paper);
		$paper.removeClass('js-paper');

		var date = new Date(timestamp * 1);
		$('<p class="timestamp">' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</p>').prependTo($('.js-play-machine'));
		$('<div class="play-machine_paper js-paper"></div>').prependTo($('.js-play-machine'));

		mavis.paperStartTime = timestamp;
		mavis.lastKeyOff = null;

		return $('.js-paper');
	},

	// set paper height
	setPaperHeight: function($paper) {
		var oldHeight = $paper.height(),
			newHeight = (mavis.lastKeyOff - mavis.paperStartTime * 1) / milliSecondsPerPixel;

		if ($(window).scrollTop() < 20) {
			$paper.css({marginTop: '-' + (newHeight - oldHeight) + 'px', height: newHeight + 'px'})
				.animate({marginTop: '0'}, 400);
		}
		else {
			$paper.css({height: newHeight + 'px'});
		}

		return $paper;
	}
}
