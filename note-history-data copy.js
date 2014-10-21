var Line = function(x, y, length, color) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color;
}


Line.prototype.draw = function(ctx) {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.y + this.length);
    context.strokeStyle = this.color;
    context.lineWidth = 26;
    context.stroke();
}

var keys = [0, 1, 2, 3, 4, 5, 6, 7];

var data = [];

var start = new Date().getTime();
var toTime = start;
var interval = 2000;

getAjaxData();

var timeoutID = setInterval(function(){
    getAjaxData();
    drawLinesRealTime();
},interval)


var startTime;

function getAjaxData(){
    startTime = toTime-interval;
    $.get( "http://api.mavis.madebyfieldwork.com/actions/get.json?from="+(startTime)+"&to="+toTime, function( data ) {
      //draw lines with newly loaded data
      console.log(data);
      drawLines(data);
      toTime = toTime + interval;
    });
} 

//duration of sketch
// maxDuration = data[data.length - 1][1] - data[0][1];
maxDuration = interval;

canvasHeight = interval/10;

noteInstances = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
};

var times = 0;

function parseRawData(rawData) {
    var noteInstances = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
    };
    for (i = 0; i < rawData.length; i++) {
        for (j = 0; j < keys.length; j++) {
            if (rawData[i][0] == j) {
                noteInstances[j].push(rawData[i]);
            }
        }
    }

    return noteInstances;
}


var lines = [];
function drawLines(noteInstances) {
    startTime = new Date().getTime() - interval;
    for (var i = 0 ; i < noteInstances.length ; i++){
        // keyIndex = $("#" + notes).index("div");
        keyIndex = noteInstances[i]["key_id"];
        lineOffset = $("#0").width() / 2;
        var X = (1220 / 8) * keyIndex + lineOffset + 2.5;
        var noteColor = $("#" + keyIndex).css('color');
        // var startY = (noteInstances[i]["`on`"]  - noteInstances[0]["`on`"])* canvasHeight / maxDuration;
        // var startY = (noteInstances[i]["`on`"]  - start)* canvasHeight / maxDuration;
        var startY = (noteInstances[i]["`on`"]  - startTime)* canvasHeight / maxDuration;
        var length = calcNoteLengthInPixels(noteInstances[i].duration);
        line = new Line(X, startY, length, noteColor);
        line.draw();
        lines.push(line);
        console.log(startTime);
        // console.log(startY);
    }
    // for (notes in noteInstances) {
    //     for (i = 0; i < noteInstances[notes].length; i += 2) {

    //         keyIndex = $("#" + notes).index("div");
    //         lineOffset = $("#" + notes).width() / 2;

    //         var X = (1220 / 8) * $("#" + notes).index() + lineOffset + 2.5;
    //         var noteColor = $("#" + notes).css('color');
    //         var startY = noteInstances[notes][i][1] * canvasHeight / maxDuration;
    //         var length = calcNoteLengthInPixels(noteInstances[notes][i], noteInstances[notes][i + 1]);

    //         line = new Line(X, startY, length, noteColor);
    //         line.draw();
    //         lines.push(line);

    //         $("#" + notes).addClass('active'); // this is for testing - its as inefficient as spitting on a fire.
    //     }
    // }
}


function drawSetOfLines(rawData) {
    parsedData = parseRawData(rawData);
    $('.js-key').removeClass('active'); // this is for testing - its as inefficient as spitting on a fire.
    drawLines(parsedData);
}

drawSetOfLines(data);

// function calcNoteLengthInPixels(noteInstanceOn, noteInstanceOff) {
//     durationInMS = noteInstanceOff[1] - noteInstanceOn[1];
//     return canvasHeight * (durationInMS / maxDuration);
// }

function calcNoteLengthInPixels(durationInMS) {
    // durationInMS = noteInstanceOff[1] - noteInstanceOn[1];
    return canvasHeight * (durationInMS / maxDuration);
}



var myTimer;
$('body').on('click', function() {

    flip();
    console.log(flag);
    
    if (flag == true) {
		drawLinesRealTime();
		// myTimer = window.setInterval(drawLinesRealTime, interval);
	} else {
		clearInterval(myTimer);
	}
});

// On/Off switch.

var flag = false;

function flip() {
    flag = !flag;
    return flag;
}


// Code to draw the lines and scroll to the corrent location.
function drawLinesRealTime() { 
    var orgHeight = $(".js-paper").height();
    var heightOffset = $('.content').height();

    $('body').animate({
        scrollTop: heightOffset
    }, interval, "linear", function() {
        saveOldCanvas(function() {
            $(window).scrollTop($(window).scrollTop() + $(".js-paper").height() - $('.js-paper').height() + $('.js-paper img').height());
        });
    });
}

// Save the old canvas and prepend it as a Base64 image then clear the canvas and draw on it again.
function saveOldCanvas(callback) {

    var oldCanvas = canvas.toDataURL("image/png");
    $('.js-paper').prepend('<img src="' + oldCanvas + '" />');

    // Store the current transformation matrix
    context.save();

    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    context.restore();

    drawSetOfLines(data);

    callback();
}

function animate(){
    animationID = requestAnimationFrame(animate);
}

animate();

// Scroll Down to view history.

$('.history').on('click', function(e) {
    flip();

    if (flag == true) {
        $('html, body').animate({
            scrollTop: $('#endOfPage').offset().top
        }, 2000, "linear");
    }
});

// Padding on load (variable header height) so the lines arn't cut off by the header.
var headerHeight = $('.play-machine-header').outerHeight();

$('.play-machine-body').css('padding-top', headerHeight);