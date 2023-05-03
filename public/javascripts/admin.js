var edittedProdRecord = new Set();

function setUpEditableListeners() {
    let editables = document.getElementsByClassName("contenteditable");

    for (let editable of editables) {
        editable.addEventListener("input", function () {
            edittedProdRecord.add(editable.id);
            console.log(edittedProdRecord);
        });
    }
}

/**
 * update product information
 */
function updateProduct() {

    for (let id of edittedProdRecord) {
        //Get product info
        let prodInfo = document.getElementById(id).children;
        let prodName = prodInfo[1].innerHTML;
        let prodPrice = prodInfo[3].innerHTML;
        let prodDesc = prodInfo[2].innerHTML;
        let prodImage = prodInfo[4].innerHTML;

        console.log(prodName);


        /// Ajax to send post request
        let xhttp = new XMLHttpRequest();

        // Define a callback on result
        xhttp.onload = function () {
            // TODO: Do something after a result is returned
            if (xhttp.status == 200) {
                // alert("Successfully updated product");
            } else {
                alert("Failed to update product");
            }
        };

        let url = "/admin/product-update";
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        // TODO: Construct a content body to send
        let body = "id=" + id + "&name=" + prodName + "&price=" + prodPrice + "&desc=" + prodDesc + "&image=" + prodImage;

        // Send the request
        xhttp.send(body);
    }
}

// Set up event listeners
setUpEditableListeners();