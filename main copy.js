var Circle = function(x, y, r, color){
	this.x = x;
	this.y = y;
	this.radius = r;
	this.color = color;
}

var animationID;
var verticalOffset = 0;
var isAnimating = false;
var canvas = document.getElementById("js-canvas");
canvas.height=200;
canvas.width=$('.js-paper').width();
var context = canvas.getContext("2d");
var circle = new Circle(100,100,3,"red");
var currentColor;
var currentHorizOffset;


Circle.prototype.draw = function(ctx){
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	ctx.fillStyle = ctx.strokeStyle = this.color;
	ctx.lineWidth = 1;
	ctx.fill();
}


var keyAllowed = {};

var keysDown = {};

keyIds = {83:"#1", 68: "#2", 70:"#3", 71:"#4", 72:"#5", 74:"#6", 75:"#7", 76:"#8"};

$(document).keydown(function(e) {
	if (keyAllowed [e.which] === false) return;
	keyAllowed [e.which] = false;

	var keys = [83,68,70,71,72,74,75,76];
	var currentKeyDown = e.which;

	if ( $.inArray(currentKeyDown, keys) > -1 ) {

		if (e.which==83){
			keyID = $('#1')
			keysDown[83] = true;
			keyID.addClass('active');
		}

		if (e.which==68){
			keyID = $('#2')
			keysDown[68] = true;
			keyID.addClass('active');
		}

		if (e.which==70){
			keyID = $('#3')
			keysDown[70] = true;
			keyID.addClass('active');
		}

		if (e.which==71){
			keyID = $('#4')
			keysDown[71] = true;
			keyID.addClass('active');
		}

		if (e.which==72){
			keyID = $('#5')
			keysDown[72] = true;
			keyID.addClass('active');
		}

		if (e.which==74){
			keyID = $('#6')
			keysDown[74] = true;
			keyID.addClass('active');
		}

		if (e.which==75){
			keyID = $('#7')
			keysDown[75] = true;
			keyID.addClass('active');
		}

		if (e.which==76){
			keyID = $('#0')
			keysDown[76] = true;
			keyID.addClass('active');
		} 
	}
});

$(document).keyup(function(e) { 
	keyAllowed [e.which] = true;
	keysDown[e.which] = false;

	if (e.which==83){
		keyID = $('#1');
		keyID.removeClass('active');
	}

	if (e.which==68){
		keyID = $('#2');
		keyID.removeClass('active');
	}

	if (e.which==70){
		keyID = $('#3');
		keyID.removeClass('active');
	}

	if (e.which==71){
		keyID = $('#4');
		keyID.removeClass('active');
	}

	if (e.which==72){
		keyID = $('#5');
		keyID.removeClass('active');
	}

	if (e.which==74){
		keyID = $('#6');
		keyID.removeClass('active');
	}

	if (e.which==75){
		keyID = $('#7');
		keyID.removeClass('active');
	}

	if (e.which==76){
		keyID = $('#0');
		keyID.removeClass('active');
	}

});

$(document).focus(function(e) { 
	keyAllowed = {};
});


function animate(){
	numberKeysDown = 0;
	animationID = requestAnimationFrame(animate);
	for (var key in keysDown){
		if (keysDown[key] == true){
			keyIndex = $(keyIds[key]).index("div");

			circle.x = $(keyIds[key]).position().left + 16;
			circle.y = 2400 - verticalOffset;
			circle.color = "hsla("+360*(keyIndex + 2)/($(".js-key").length)+", 75%, 60%, 0.8)";
			circle.draw(context);
			numberKeysDown++;
		}
	}


	if (numberKeysDown > 0){
		verticalOffset = parseFloat(verticalOffset + 1);
		$(".js-paper").css("-webkit-transform", "translateY(" + verticalOffset + "px)");
	}
}

animate();

$('.save-canvas').on('click', function(){
	var canvas = document.getElementById("js-canvas");
	var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)

	window.location.href = image;
});

$('.add-old').on('click', function(){
	var canvas = document.getElementById("js-canvas");
	var image = canvas.toDataURL("image/png")
	
	$('.previous-prints').append('<li><img src="'+image+'"/></li>');
});