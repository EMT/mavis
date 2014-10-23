var canvas = document.getElementById("js-canvas");
var context = canvas.getContext("2d");
var interval = 5000.0; //time between AJAX requests in MS
var canvasHeight = interval/10;
var pageWidth = $("#js-canvas").width();

var toTime = new Date().getTime();
var fromTime = toTime - interval;

var numberOfRowsOfPixels = canvasHeight;
var currentRow = numberOfRowsOfPixels;

testStartDate = new Date().getTime();

var tempData = [

]

var loopID;
var newLines = [];

var hasLines = false;
var timestamped = false;

function loop(){
    loopID = window.requestAnimationFrame(loop);
    currentRow--;
    
    timeOfCurrentRow = fromTime + (1 - (currentRow / numberOfRowsOfPixels)) * interval ;


    for ( i = 0 ; i < tempData.length ; i++){
        // console.log(parseInt(tempData[i]["`on`"]), timeOfCurrentRow, parseInt(tempData[i]["`on`"]) + parseInt(tempData[i].duration), timeOfCurrentRow - fromTime);
        if (parseInt(tempData[i]["`on`"]) <= timeOfCurrentRow && parseInt(tempData[i]["`on`"]) + parseInt(tempData[i].duration) >= timeOfCurrentRow){
            //draw
            // console.log("fromTime:", fromTime, " toTime:", toTime, " timeOfCurrentRowOffset:", timeOfCurrentRow - fromTime);
            // console.log("noteStart:", 0, " noteStop", parseInt(tempData[i].duration), " timeOfCurrentRowOffset:", timeOfCurrentRow - fromTime);
            var keyIndex = Math.abs(7 - tempData[i]["key_id"]);
            var lineOffset = $(".js-key").width() / 2;
            var X = (pageWidth / 8) * keyIndex + parseInt(lineOffset + 2.5);
            var noteColor = $("#" + keyIndex).css('color');
            line = new Line(X, currentRow, 1, noteColor);
            newLines.push(line);
            line.draw(context);
            hasLines = true;
        } else {
            if (parseInt(tempData[i]["`on`"]) + parseInt(tempData[i].duration) + 20000 <= timeOfCurrentRow){
                //note has been and one, delete it
                tempData.splice(i, 1);

            }
        }
    }


    $(".js-paper").css("top", -1* currentRow + "px");
    if (currentRow <= 0){
        $(".js-paper").css("top", -1*numberOfRowsOfPixels + "px");
        currentRow = numberOfRowsOfPixels;
        // $("#js-canvas").after("<img src='http://lorempixel.com/1220/500/sports/1/' />")
        var oldCanvas = canvas.toDataURL("image/png");
        
        if (hasLines) {
            $('#js-canvas').after('<img src="' + oldCanvas + '" />');
        }
        else {
            if (!timestamped) {
                $('#js-canvas').after('<p class="timestamp">' + timeOfCurrentRow + '</p>');
                timestamped = true;
            }
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        hasLines = false;
    }
}




//fromTime is the time that indicates when the database query should search *from*  
//toTime is the time that indicates when the database query should search *to*  



canvas.height = canvasHeight;
canvas.width = $('.js-paper').width();

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
    context.lineWidth = 40;
    context.stroke();
}

var data = [];

getAjaxData();

var timeoutID = setInterval(function(){
    getAjaxData();
},interval)



function getAjaxData(){
    toTime =  new Date().getTime();
    fromTime = toTime-interval;
    $.get( "http://api.mavis.madebyfieldwork.com/actions/get.json?from="+(fromTime-10000)+"&to="+toTime, function( data ) {
        if (data.length > 0){
            console.log(data);
            // tempData = data;
            // tempData = tempData.concat(data);
            for (i = 0 ; i < data.length ; i++){
                tempData.push(data[i])
            }
            // drawLines(data);
            // drawLinesRealTime();
        } else {
        }
        // toTime = toTime + interval;
    });
} 


var lines = [];
function drawLines(noteInstances) {
    for (var i = 0 ; i < noteInstances.length ; i++){
        var keyIndex = Math.abs(7 - noteInstances[i]["key_id"]);
        var lineOffset = $("#0").width() / 2;
        var X = (pageWidth / 8) * keyIndex + lineOffset + 2.5;
        var noteColor = $("#" + keyIndex).css('color');
        var startY = canvasHeight - (noteInstances[i]["`on`"]  - fromTime)* canvasHeight / interval;
        var length = calcNoteLengthInPixels(noteInstances[i].duration);
        var line = new Line(X, startY, length, noteColor);
        line.draw();
        lines.push(line);
        console.log(fromTime);
    }

}

function calcNoteLengthInPixels(durationInMS) {
    return canvasHeight * (durationInMS / interval);
}

// Code to draw the lines and scroll to the corrent location.
function drawLinesRealTime() { 
    var orgHeight = $(".js-paper").height();

    // $('body').animate({
    //     scrollTop: 0
    // }, interval, "linear", function() {
    //     saveOldCanvas(function() {
    //         $(window).scrollTop($(window).scrollTop() + $('.js-paper img').height());
    //     });
    // });
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

    // drawLines(noteInstances);

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
// var headerHeight = $('.play-machine-header').outerHeight();

// $('.play-machine-body').css('padding-top', headerHeight);

loop();

