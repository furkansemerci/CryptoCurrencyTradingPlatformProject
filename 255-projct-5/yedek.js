
let today = [];
let count = 0;
let playing = false; 
let intervalId = null; 

function nextday(){
    if (count < 365) {
        today = market[count];
        console.log(today.date);
        $("#p-day").text(today.date);
        $("#h1-day").text("Day " + (count + 1));
        count++;

        
        if(count >= 365){
            $("#next-day, #play").prop("disabled", true);
        }
        drawChart();
    }
}
let x =0;

const MAX_BARS = 120;
const X_INCREMENT = 10;
const MULTIPLIER_HIGH = 0.005;
const MULTIPLIER_DEFAULT = 0.005;

function drawChart(){
    let index = 2; // Assuming you always access the first coin

    // Retrieve current market data
    let open = market[count].coins[index].open; // bar
    let close = market[count].coins[index].close; // bar
    let low = market[count].coins[index].low; // stick
    let high = market[count].coins[index].high; // stick
    
    // Calculate heights and positions
    let stickHeight = high - low; // height of black stick
    let barHeight = Math.abs(close - open); // height of green/red bar
    let barPos = Math.min(open, close); // from the bottom 
    let color = open < close ? "green" : "red";

    // Determine multiplier based on open value
    let multiplier;
    if (open > 0 && open < 2) {
        multiplier = MULTIPLIER_HIGH;
    } else {
        multiplier = MULTIPLIER_DEFAULT;
    }

    if (count < MAX_BARS) {
        // Increment x for new elements
        x += X_INCREMENT;
    } else {
        // Remove the first stick and bar to maintain the maximum number
        $(".stick:first").remove();
        $(".bar:first").remove();

        // Shift existing sticks and bars to the left by X_INCREMENT pixels
        $(".stick, .bar").each(function() {
            let currentLeft = parseInt($(this).css("left"), 10);
            let newLeft = currentLeft - X_INCREMENT;
            $(this).css("left", `${newLeft}px`);
        });

        // Reset x to the position of the last bar
        x = MAX_BARS * X_INCREMENT;
    }

    // Append new stick and bar
    $("#chart-container").append(`
        <div class='stick' style='
            position: absolute;
            height: ${stickHeight * multiplier}px; 
            bottom: ${low * multiplier}px; 
            left: ${x}px; 
            width: 2px; 
            background-color: black;
        '></div>
    `);
    $("#chart-container").append(`
        <div class='bar' style='
            position: absolute;
            background: ${color}; 
            bottom: ${barPos * multiplier}px; 
            left: ${x - 5}px; 
            height: ${barHeight * multiplier}px; 
            width: 10px;
        '></div>
    `);
}


function startPlaying(){
    if (!playing) { 
        playing = true;
        intervalId = setInterval(nextday, 10);
        $("#play").text("Pause"); 
    }
}

function stopPlaying(){
    if (playing) {
        playing = false;
        clearInterval(intervalId);
        intervalId = null;
        $("#play").text("Play");
    }
}

function togglePlay(){
    if (playing) {
        stopPlaying();
    } else {
        startPlaying();
    }
}

$(function(){
    today = market[count];
    $("#p-day").text(today.date);
    $("#h1-day").text("Day " + (count + 1));
    count++;
    
    
    $("#next-day").on("click", nextday);
    $("#play").on("click", togglePlay);
});
//////////////////////////////////////
$(document).ready(function() {
    $('.buy-btn').click(function() {
        // Reset both buttons
        
        $('.buy-btn, .sell-btn').removeClass('active');
        // Add active class to buy button
        
        $(this).addClass('active');
        // Change button color to green
        
        $(this).css('background-color', '#4CAF50');
        
        $('.sell-btn').css('background-color', '#f0f0f0');
        // Update execute button text and color
        $('.execute-btn').text('Buy BITCOIN').css('background-color', '#4CAF50');
    });

    $('.sell-btn').click(function() {
        // Reset both buttons
        $('.buy-btn, .sell-btn').removeClass('active');
        // Add active class to sell button
        $(this).addClass('active');
        // Change button color to red
        $(this).css('background-color', '#ff4444');
        $('.buy-btn').css('background-color', '#f0f0f0');
        // Update execute button text and color
        $('.execute-btn').text('Sell BITCOIN').css('background-color', '#ff4444');
    });
});

$(document).ready(function() {
    // Variable to store currently selected cryptocurrency
    let selectedCrypto = 'BITCOIN'; // Default value
    
    // Handle crypto icon clicks
    $('.crypto-icons img').click(function() {
        // Get the alt text of clicked crypto icon which contains the name
        selectedCrypto = $(this).attr('alt').toUpperCase();
        
        // Update button text based on which button is currently active
        if ($('.buy-btn').hasClass('active')) {
            $('.execute-btn').text('Buy ' + selectedCrypto);
        } else if ($('.sell-btn').hasClass('active')) {
            $('.execute-btn').text('Sell ' + selectedCrypto);
        }
    });

    // Update the buy/sell button handlers to use selectedCrypto
    $('.buy-btn').click(function() {
        $('.buy-btn, .sell-btn').removeClass('active');
        $(this).addClass('active');
        $(this).css('background-color', '#4CAF50');
        $('.sell-btn').css('background-color', '#f0f0f0');
        $('.execute-btn').text('Buy ' + selectedCrypto).css('background-color', '#4CAF50');
    });

    $('.sell-btn').click(function() {
        $('.buy-btn, .sell-btn').removeClass('active');
        $(this).addClass('active');
        $(this).css('background-color', '#ff4444');
        $('.buy-btn').css('background-color', '#f0f0f0');
        $('.execute-btn').text('Sell ' + selectedCrypto).css('background-color', '#ff4444');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cryptoIcons = document.querySelectorAll('.crypto-icons img');
    
    cryptoIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Remove selected class from all icons
            cryptoIcons.forEach(i => i.classList.remove('selected'));
            // Add selected class to clicked icon
            this.classList.add('selected');
        });
    });
});
