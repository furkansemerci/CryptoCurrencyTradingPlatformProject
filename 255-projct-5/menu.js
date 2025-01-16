$(function () {
    let userArr = JSON.parse(localStorage.getItem("userArr")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    class User {
        constructor(name, wallet) {
            this.name = name;
            this.wallet = wallet;
        }
    }

    function updateCurrentUserWallet() {
        if (currentUser) {
            const userIndex = userArr.findIndex(user => user.name === currentUser.name);
            if (userIndex !== -1) {
                userArr[userIndex].wallet = currentUser.wallet;
                localStorage.setItem("userArr", JSON.stringify(userArr));
            }
        }
    }

    // Call this when the menu page loads to ensure wallet sync
    updateCurrentUserWallet();

    $("#add-button").on("click", function () {
        if ($("#toggle-add").is(":hidden")) {
            $("#toggle-add").show();
            $("#username-in").focus();
            $("#bg-blur").show();
            $("#menu *").prop("disabled", true);
        }
    });

    $("#finish-and-add").on("click", addUser);

    $(this).on("keydown", function (e) {
        if ($("#toggle-add").is(":visible")) {
            if (e.code === "Enter") {
                addUser();
            } else if (e.code === "Escape") {
                cancelAddUser();
            }
        }
    });

    $(document).on("click", ".close-button", function (event) {
        event.preventDefault();
        const index = Number($(this).parent().attr("id").substring(4));
        userArr.splice(index, 1);
        localStorage.setItem("userArr", JSON.stringify(userArr));
        drawUsers();
        event.stopPropagation();
    });

    function addUser() {
        const username = $("#username-in").val().trim();
        if (username !== "") {
            const newUser = new User(username, [{name: "Dollar", code: "dlr", amount: 1000.0}]);
            userArr.push(newUser);
            $("#username-in").val("");
            $("#toggle-add").hide();
            $("#menu *").prop("disabled", false);
            $("#bg-blur").hide();
            localStorage.setItem("userArr", JSON.stringify(userArr));
            drawUsers();
            location.reload();
        } else {
            alert("Invalid username.");
        }
    }

    function cancelAddUser() {
        $("#toggle-add").hide();
        $("#menu *").prop("disabled", false);
        $("#username-in").val("");
        $("#bg-blur").hide();
        location.reload();
    }

    function drawUsers() {
        if (userArr.length === 0) {
            $("#toggle-empty").css("display", "block");
            $("#user-section").css("display", "none");
        } else {
            $("#toggle-empty").css("display", "none");
            $("#user-section").css("display", "flex");
            const userSection = $("#user-section");
            userSection.empty();
            
            userArr.forEach((user, index) => {
                userSection.append(`
                    <a href="../255-projct/nextDayPart.html">
                        <div class="user" id="user${index}">
                            <i class="fa fa-user"></i> ${user.name}
                            <div class="close-button">x</div>
                        </div>
                    </a>
                `);
            });
        }
    }

    // Handle user selection
    $(document).on("click", ".user", function () {
        const index = Number($(this).attr("id").substring(4));
        const selectedUser = userArr[index];
        localStorage.setItem("currentUser", JSON.stringify({
            name: selectedUser.name,
            wallet: selectedUser.wallet
        }));
    });

    drawUsers();

    // Your existing hover effects...
    $("#add-button").hover(function () {
        if ($("#toggle-add").is(":hidden")) {
            $(this).css("background-color", "#ccc");
            $(this).css("cursor", "pointer");
        }
    }, function () {
        $(this).css("background-color", "#eee");
        $(this).css("cursor", "auto");
    });

    $(document).on("mouseenter", ".user", function () {
        if ($("#toggle-add").is(":hidden")) {
            $(this).css("background-color", "#bbb");
            $(this).css("cursor", "pointer");
            $(".user .close-button").css("background-color", "#0a00ff");
        }
    }).on("mouseleave", ".user", function () {
        $(this).css("background-color", "#ddd");
        $(this).css("cursor", "auto");
    });

    $(document).on("mouseenter", ".close-button", function () {
        if ($("#toggle-add").is(":hidden")) {
            $(this).css("cursor", "pointer");
            $(this).css("width", "15px");
            $(this).css("height", "15px");
            $(this).parent().css("background-color", "#ddd");
            $(this).parent().css("cursor", "pointer");
        }
    }).on("mouseleave", ".close-button", function () {
        $(this).css("cursor", "auto");
        $(this).css("width", "10px");
        $(this).css("height", "10px");
        $(this).parent().css("background-color", "#bbb");
        $(this).parent().css("cursor", "pointer");
    });
});