
// set up
var milliSecondsPerPixel = 10,
	newPaperAfter = 6000; // milliseconds of silence
	pollEvery = 5000; // milliseconds


$(function() {

	// load some data
	mavis.loadKeyPresses(null, new Date().getTime(), 800);

	setInterval(function() {
		if (mavis.lastKeyPress) {
			mavis.loadKeyPresses(mavis.lastKeyPress.on + 1);
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
	lastKeyPressOff: null,

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
		$paper = mavis.newPaper(mavis.keyPresses[0].on);

		if (!mavis.firstKeyPress) {
			mavis.firstKeyPress = mavis.keyPresses[0];
		}

		for (var i = 0, len = mavis.keyPresses.length; i < len; i ++) {
			if (mavis.lastKeyPressOff && mavis.keyPresses[i].on - mavis.lastKeyPressOff > newPaperAfter) {
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
			mavis.lastKeyPressOff = mavis.keyPresses[i].on * 1 + mavis.keyPresses[i].duration * 1;
		}

		$paper.css({height: ((mavis.lastKeyPressOff - mavis.paperStartTime * 1) / milliSecondsPerPixel) + 'px'});
		mavis.keyPresses = [];
	},

	// start new paper
	newPaper: function(timestamp) {
		$('.js-paper')
			.css({height: ((mavis.lastKeyPressOff - mavis.paperStartTime * 1) / milliSecondsPerPixel) + 'px'})
			.removeClass('js-paper');
		$('<p class="timestamp">' + timestamp + '</p>').prependTo($('.js-play-machine'));
		$('<div class="play-machine_paper js-paper"></div>').prependTo($('.js-play-machine'));

		mavis.paperStartTime = timestamp;
		mavis.lastKeyPressOff = null;

		return $('.js-paper');
	}
}
