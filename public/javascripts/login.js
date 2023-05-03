function authenticateUser() {
    // Create a form data object"
    var params = "username=" + document.getElementById('username').value
        + "&password=" + document.getElementById('password').value
        + "&remember=" + document.getElementById('remember').checked;
    console.log(params);

    // Create a request and send it out
    var xhttp = new XMLHttpRequest();
    // Set listenrs for the request
    xhttp.onload = function () {
        console.log("xhttp.status");
        if (xhttp.status === 200) {
            let isAdmin = JSON.parse(xhttp.response).isAdmin;
            let newRef = Boolean(isAdmin) ? "/admin/customer" : "/listprod";
            // If the user is authenticated, redirect to the home page or previous page (if there was one)
            window.location.replace(newRef);
        } else {
            alert("Invalid username or password");
        }
    }

    xhttp.onerror = function () {
        alert("Request failed! Please try again...");
    }

    xhttp.open("POST", "/validateLogin", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);


}

