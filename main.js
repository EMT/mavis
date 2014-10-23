
// set up
var milliSecondsPerPixel = 10,
	newPaperAfter = 6000; // milliseconds of silence
	pollEvery = 5000; // milliseconds

// init some vars for later
var keyPresses = [],
	paperStartTime = null,
	lastKeyPressOff = null;

$(function() {

	// load some data
	mavis.loadKeyPresses(null, new Date().getTime(), 100);

});


var mavis = {

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
					keyPresses.push.apply(keyPresses, data);
					mavis.renderKeyPresses();
				}
			}
		);
	},

	// render key presses
	renderKeyPresses: function() {
		$paper = mavis.newPaper(keyPresses[0].on);

		for (var i = 0, len = keyPresses.length; i < len; i ++) {
			if (lastKeyPressOff && keyPresses[i].on - lastKeyPressOff > newPaperAfter) {
				$paper = mavis.newPaper(keyPresses[i].on);
			}

			$paper.append(
				$('<div></div>')
					.addClass('key-press key-press-' + keyPresses[i].key_id)
					.css({
						bottom: Math.round((keyPresses[i].on - paperStartTime) / milliSecondsPerPixel),
						height: Math.round(keyPresses[i].duration / milliSecondsPerPixel)
					})
			);

			lastKeyPressOff = keyPresses[i].on * 1 + keyPresses[i].duration * 1;
		}

		$paper.css({height: ((lastKeyPressOff - paperStartTime * 1) / milliSecondsPerPixel) + 'px'});
		keyPresses = [];
	},

	// start new paper
	newPaper: function(timestamp) {
		$('.js-paper')
			.css({height: ((lastKeyPressOff - paperStartTime * 1) / milliSecondsPerPixel) + 'px'})
			.removeClass('js-paper');
		$('<p class="timestamp">' + timestamp + '</p>').prependTo($('.js-play-machine'));
		$('<div class="play-machine_paper js-paper"></div>').prependTo($('.js-play-machine'));

		paperStartTime = timestamp;
		lastKeyPressOff = null;

		return $('.js-paper');
	}
}
