function startShipment() {
    var orderId = Number(document.getElementById("orderId").innerHTML);
    var xhttp = new XMLHttpRequest();

    // Add listener
    xhttp.onload = function () {
        if (xhttp.status === 200) {
            alert("Shipment for order " + orderId + " was successfully processed!");
        } else {
            alert("Failed to process shipment for order " + orderId)
        }
    }

    xhttp.open('GET', '/shipment?orderId=' + orderId, true);
    xhttp.send();
}

// Start the shipment process right after checkout
startShipment();