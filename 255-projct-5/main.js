let today = [];
let count = 0;
let playing = false;
let intervalId = null;
let selectedCrypto = 'btc';
let selectedIndex = 2;
let x = 0;
let tempUser = JSON.parse(localStorage.getItem("currentUser"));
let userArr = JSON.parse(localStorage.getItem("userArr")) || [];

const MAX_BARS = 120;
const X_INCREMENT = 10;

const cryptoIndexMap = {
    btc: 2,
    eth: 4,
    ada: 0,
    doge: 3,
    pol: 5,
    snx: 6,
    trx: 7,
    xrp: 8,
    avax: 1
};

const cryptoNameMap = {
    btc: "Bitcoin",
    eth: "Ethereum",
    xrp: "Ripple",
    ada: "Cardano",
    avax: "Avalanche",
    trx: "TRON",
    doge: "Dogecoin",
    pol: "Polygon",
    snx: "Synthetix"
};

$(function () {
   
    $(".user").html(`<i class="fa fa-user"></i> ${tempUser.name}`);
    let walletCur = [...tempUser.wallet];
    console.log(walletCur)
    nextday();
    $("#amount").on("keydown keyup", function (e) {
        if (e.type == "keyup") {
            $("#rtAmount").text((parseFloat($("#amount").val()) * market[count-1].coins[cryptoIndexMap[selectedCrypto]].close).toFixed(2));
        }
        e.stopPropagation();
    });

    renderWallet();
   

    function updateUserWallet() {
        const userIndex = userArr.findIndex(user => user.name === tempUser.name);
        if (userIndex !== -1) {
            userArr[userIndex].wallet = walletCur;
            localStorage.setItem("userArr", JSON.stringify(userArr));
            localStorage.setItem("currentUser", JSON.stringify({
                name: tempUser.name,
                wallet: walletCur
            }));
        }
    }

    function addToWallet(coinAddToWallet) {
        const existingCoin = walletCur.find(w => w.code === coinAddToWallet.code);
        
        if (!existingCoin) {
            walletCur.push(coinAddToWallet);
        } else {
            existingCoin.amount += coinAddToWallet.amount;
        }

        updateUserWallet();
        renderWallet();
    }

    

    function buyCoin() {
        const price = market[count-1].coins[cryptoIndexMap[selectedCrypto]].close;
        const amountOfCoin = parseFloat($(".amount-input input").val());
        const dollarWallet = walletCur.find(w => w.code === "dlr");
        
        if (!dollarWallet || dollarWallet.amount < price * amountOfCoin) {
            alert("Not enough money!");
            return;
        }

        dollarWallet.amount -= (price * amountOfCoin);
        addToWallet({ 
            name: cryptoNameMap[selectedCrypto], 
            code: selectedCrypto, 
            amount: amountOfCoin 
        });
    }

    function sellCoin() {
        const tAmount = parseFloat($("#amount").val());
        const coin = walletCur.find(w => w.code === selectedCrypto);
        
        if (!coin || coin.amount < tAmount) {
            alert("You do not possess enough of this coin.");
            return;
        }

        coin.amount -= tAmount;
        const dollarWallet = walletCur.find(w => w.code === "dlr");
        dollarWallet.amount += tAmount * market[count-1].coins[cryptoIndexMap[selectedCrypto]].close;

        if (coin.amount === 0) {
            walletCur = walletCur.filter(w => w.code !== selectedCrypto);
        }

        updateUserWallet();
        renderWallet();
    }

    $("#execute-btn").on("click", function () {
        if ($(".sell-btn").hasClass("active")) {
            sellCoin();
        } else {
            buyCoin();
        }
    });



    function nextday() {
        if (count < 365) {
            today = market[count];
            
            let day = []
            day = today.date.split("-");

            const monthNames = [
                "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"
            ];
            const month = monthNames[Number(day[1])-1];
             
            
            
            $("#p-day").html(`${day[0]} ${month} ${day[2]}`);
            $("#h1-day").text("Day " + (count+1));
            count++;

            if(count >= 365){
                $(".balance").addClass('heartbeat')
                $(".trading-section").remove();
            }

            if (count > 365) {
                $("#next-day, #play").prop("disabled", true);
            }
            drawChart(selectedIndex);
            renderWallet();
        }
    }
    

    function renderWallet() {
        $(".walletRow").empty();
        
        let total = 0;

        walletCur.forEach(w => {
            
            if(w.code!=="dlr")
            {
                var subtotal = (w.amount * market[count-1].coins[cryptoIndexMap[w.code]].close);
                total += subtotal;
                var lClose = (market[count-1].coins[cryptoIndexMap[w.code]].close);
                var substring = subtotal.toFixed(2)
                var lstring = lClose.toFixed(2)
            }
            
            if(w.amount!=0)
            {
                if(w.code != 'dlr'){
                    var imCoin = "./images/" + w.code + ".png"
                    
                }
                else{
                    imCoin= "";
                }
                $(".walletRow").append(`
                    <tr class="${w.code}">
                        <td><img style='width:20px;' src=${imCoin}>  ${w.name}</td>
                        <td>${(w.amount).toFixed(2)}</td>
                        <td>${substring}</td>
                        <td>${lstring}</td>
                    </tr>
                `);
            }
            
        });
        
        total+=walletCur[0].amount;

        $(".balance").html(`<h1>$${(total).toFixed(2)}</h1>`)

        $(".dlr td:nth-of-type(3)").html(`<td>-</td>`)
        $(".dlr td:nth-of-type(4)").html(`<td>-</td>`)
    
    }

    function drawChart(selectedIndex) {
        index = selectedIndex;
        $(".dotted-line:first").remove();

    
        let open = market[count].coins[index].open;
        let close = market[count].coins[index].close;
        let low = market[count].coins[index].low;
        let high = market[count].coins[index].high;
    
        let stickHeight = high - low;
        let barHeight = Math.abs(close - open);
        let barPos = Math.min(open, close);
        let color = open < close ? "green" : "red";
    
        switch (index) {
            case 0: multiplier = 150; break;
            case 1: multiplier = 9; break;
            case 2: multiplier = 0.006; break;
            case 3: multiplier = 580; break;
            case 4: multiplier = 0.1; break;
            case 5: multiplier = 150; break;
            case 6: multiplier = 15; break;
            case 7: multiplier = 2800; break;
        }
    
        let linePos = market[count - 1].coins[selectedIndex].close * multiplier;
    
        if (count < MAX_BARS) {
            x += X_INCREMENT;
        } else {
            $(".stick:first").remove();
            $(".bar:first").remove();
            $(".dotted-line:first").remove(); 
    
            $(".stick, .bar, .dotted-line").each(function () {
                let currentLeft = parseInt($(this).css("left"), 10);
                let newLeft = currentLeft - X_INCREMENT;
                $(this).css("left", `${newLeft}px`);
            });
    
            x = MAX_BARS * X_INCREMENT;
        }
    
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
            <div class='bar' id="${count}" style='
                position: absolute;
                background: ${color};
                bottom: ${barPos * multiplier}px;
                left: ${x - 5}px;
                height: ${barHeight * multiplier}px;
                width: 10px;
            '></div>
        `);
    
        $("#chart-container").append(`
            <div class='dotted-line' style='
                position: absolute;
                text-align:right;
                border-top: 1px dotted gray;
                width: 100%; 
                top: calc(100% - ${linePos}px); 
                left: 0;
                z-index: 1;
            '>  $${close}</div>
        `);
    }
    

    
    

    function drawIndex(index) {
        let m = 0;
        if (count > 120) m = count - 120;

        for (m; m < count; m++) {
            let open = market[m].coins[index].open;
            let close = market[m].coins[index].close;
            let low = market[m].coins[index].low;
            let high = market[m].coins[index].high;

            let stickHeight = high - low;
            let barHeight = Math.abs(close - open);
            let barPos = Math.min(open, close);
            let color = open < close ? "green" : "red";

            switch (index) {
                case 0: multiplier = 150; break;
                case 1: multiplier = 9; break;
                case 2: multiplier = 0.006; break;
                case 3: multiplier = 580; break;
                case 4: multiplier = 0.1; break;
                case 5: multiplier = 150; break;
                case 6: multiplier = 15; break;
                case 7: multiplier = 2800; break;
                default: multiplier = 100;
            }

            x += X_INCREMENT;
            


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
                <div class='bar' id='${count}'style='
                    position: absolute;
                    background: ${color};
                    bottom: ${barPos * multiplier}px;
                    left: ${x - 5}px;
                    height: ${barHeight * multiplier}px;
                    width: 10px;
                '></div>
            `);

            
        }
    }

    function deleteAll() {
        x = 0;
        $(".stick").remove();
        $(".bar").remove();
    }

    function startPlaying() {
        if (!playing) {
            playing = true;
            intervalId = setInterval(nextday, 100);
            if(count>364)
                clearInterval(intervalId)
            $("#play").text("Pause");
        }
    }

    function stopPlaying() {
        if (playing) {
            playing = false;
            clearInterval(intervalId);
            intervalId = null;
            $("#play").text("Play");
        }
    }

    function togglePlay() {
        if (playing) {
            stopPlaying();
        } else {
            startPlaying();
        }
    }

    today = market[count];
    
    $("#h1-day").text("Day " + (count));
    count++;

    $("#next-day").on("click", nextday);
    $("#play").on("click", togglePlay);

    $('.buy-btn').click(function () {
        $('.buy-btn, .sell-btn').removeClass('active');
        $(this).addClass('active').css('background-color', '#4CAF50');
        $('.sell-btn').css('background-color', '#f0f0f0');
        $('#execute-btn').text('Buy BITCOIN').css('background-color', '#4CAF50');
    });

    $('.sell-btn').click(function () {
        $('.buy-btn, .sell-btn').removeClass('active');
        $(this).addClass('active').css('background-color', '#ff4444');
        $('.buy-btn').css('background-color', '#f0f0f0');
        $('#execute-btn').text('Sell BITCOIN').css('background-color', '#ff4444');
    });

    $('.crypto-icons img').click(function() {
        selectedCrypto = $(this).attr('alt').toUpperCase();
        
        if ($('.buy-btn').hasClass('active')) {
            $('#execute-btn').text('Buy ' + selectedCrypto);
        } else if ($('.sell-btn').hasClass('active')) {
            $('#execute-btn').text('Sell ' + selectedCrypto);
        }

        const cryptoKey = selectedCrypto.toLowerCase();
        $('.crypto-name img').attr("src", "./images/" + selectedCrypto + ".png");
        $('.crypto-name img').attr("alt", selectedCrypto);
        $('.crypto-name span:first').text(cryptoNameMap[cryptoKey]);

        
        selectedCrypto= selectedCrypto.toLowerCase().trim();
    
            
            
        selectedIndex = cryptoIndexMap[selectedCrypto];
        deleteAll();
        drawIndex(selectedIndex);
    });
    const $cryptoIcons = $('.crypto-icons img');
    
    $cryptoIcons.on('click', function () {
        $cryptoIcons.removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on("mouseover", ".bar",function(){

        let temp = parseInt($(this).attr("id")) - 1;
        console.log(temp)
        $(".crypto-name").append(`<span class="hoverInfo">Date: ${market[temp].date} Open: ${market[temp].coins[selectedIndex].open} Close: ${market[temp].coins[selectedIndex].close} High: ${market[temp].coins[selectedIndex].high} Low: ${market[temp].coins[selectedIndex].low}</span>`)

    })
    $(document).on("mouseleave", ".bar",function(){
        $(".hoverInfo").remove()
    })

   
});
