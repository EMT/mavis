var canvas = document.getElementById("js-canvas");
var context = canvas.getContext("2d");
var start = new Date().getTime();
var interval = 2000.0; //time between AJAX requests in MS
var canvasHeight = interval/10;

//fromTime is the time that indicates when the database query should search *from*  
//toTime is the time that indicates when the database query should search *to*  
var fromTime;
var toTime = start;


canvas.height=canvasHeight;
canvas.width=$('.js-paper').width();

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

var data = [];

getAjaxData();

var timeoutID = setInterval(function(){
    getAjaxData();
    drawLinesRealTime();
},interval)



function getAjaxData(){
    fromTime = toTime-interval;
    $.get( "http://api.mavis.madebyfieldwork.com/actions/get.json?from="+(fromTime)+"&to="+toTime, function( data ) {
      //draw lines with newly loaded data
      drawLines(data);
      toTime = toTime + interval;
    });
} 


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


var lines = [];
function drawLines(noteInstances) {
    fromTime = new Date().getTime() - interval;
    for (var i = 0 ; i < noteInstances.length ; i++){
        keyIndex = Math.abs(7 - noteInstances[i]["key_id"]);
        console.log(keyIndex)
        lineOffset = $("#0").width() / 2;
        var X = (1220 / 8) * keyIndex + lineOffset + 2.5;
        var noteColor = $("#" + keyIndex).css('color');
        var startY = canvasHeight - (noteInstances[i]["`on`"]  - fromTime)* canvasHeight / interval;
        var length = calcNoteLengthInPixels(noteInstances[i].duration);
        line = new Line(X, startY, length, noteColor);
        line.draw();
        lines.push(line);
        console.log(fromTime);
    }

}


function drawSetOfLines(rawData) {
    parsedData = noteInstances;
    $('.js-key').removeClass('active'); // this is for testing - its as inefficient as spitting on a fire.
    drawLines(parsedData);
}

drawSetOfLines(data);

function calcNoteLengthInPixels(durationInMS) {
    return canvasHeight * (durationInMS / interval);
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


// Scroll Down to view history.

// $('.history').on('click', function(e) {
//     flip();

//     if (flag == true) {
//         $('html, body').animate({
//             scrollTop: $('#endOfPage').offset().top
//         }, 2000, "linear");
//     }
// });

// Padding on load (variable header height) so the lines arn't cut off by the header.
var headerHeight = $('.play-machine-header').outerHeight();

$('.play-machine-body').css('padding-top', headerHeight);

