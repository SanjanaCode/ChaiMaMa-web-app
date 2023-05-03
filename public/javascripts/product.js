
var amount = 0;

function addCart() {
    console.log("Adding to cart...");
    // Get the information to add to cart
    var productId = document.getElementById('product_id').innerHTML;
    var productName = document.getElementById('product_name').innerHTML;
    var price = document.getElementById('price').innerHTML.replace('$', '');
    var quantity = document.getElementById('quantity').value;
    var body = "id=" + productId + "&name=" + productName + "&price=" + price + "&quantity=" + quantity + "&add=" + true;

    // Add to cart
    var xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (xhttp.status == 200) {
            document.body.innerHTML += `
            <div id = 'dialog' data-reflow-type="toast" class="ref-notification success no-description" style="transform: translateY(-20px);">
                <div class="ref-notification-content">
                    <div class="ref-notification-title">Product added to cart</div>
                    <div class="ref-notification-description"></div>
                    <div class="ref-close-button" onclick='closeDialog();'>×</div>
                    <a class="ref-button" href='/showcart'>See Cart</a>
                </div>
            </div>
            `;
        } else {
            document.body.innerHTML += `
            <div id = 'dialog' data-reflow-type="toast" class="ref-notification error no-description" style="transform: translateY(-20px);">
                <div class="ref-notification-content">
                    <div class="ref-notification-title">Failed to add to cart</div>
                    <div class="ref-notification-description"></div>
                    <div class="ref-close-button" onclick='closeDialog();'>×</div>
                </div>
            </div>
            `;
        }

        // Set the chosen quantity (Why? Adding elements will reset the value)
        document.getElementById('quantity').value = quantity;
    };

    xhttp.open("POST", "/addcart", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(body);
}

function closeDialog() {
    document.getElementById('dialog').remove();
}

function increase() {
    var inputEle = document.getElementById('quantity');
    inputEle.value = Number(inputEle.value) + 1;
}

function decrease() {
    var inputEle = document.getElementById('quantity');
    if (inputEle.value > 1) {
        inputEle.value = Number(inputEle.value) - 1;
    }
}

function updateSelect() {
    let inputEle = document.getElementById("quantity");
    if (!(/\d+/.test(inputEle.value))) {
        inputEle.value = 1;
    }
}


function updateQuantity(id, isIncrease, isRemove, isManual) {
    var inputEle = document.getElementById(`quantity_${id}`);
    if (/\d+/.test(inputEle.value)) {
        // If the user use the +/- buttons
        if (!isManual) {
            if (isIncrease) {
                inputEle.value = Number(inputEle.value) + 1;
            } else {
                if (inputEle.value > 1) {
                    inputEle.value = Number(inputEle.value) - 1;
                }
            }
        } // Else don't do anything
    } else {
        inputEle.value = 1; // If input quantity is not numeric, just set quantity to 1
    }

    let productName = document.getElementById(`product_name_${id}`).innerHTML;
    let price = document.getElementById(`price_${id}`).innerHTML.replace('$', '');
    let productId = document.getElementById(`product_id_${id}`).innerHTML;
    let quantity = isRemove ? 0 : inputEle.value;
    var body = "id=" + productId + "&name=" + productName + "&price=" + price + "&quantity=" + quantity;
    let xhttp = new XMLHttpRequest();


    // Set listener
    xhttp.onload = function () {

        if (xhttp.status == 200) {
            let json = xhttp.response;
            let subTotal = json.subTotal;
            let product = json.added;

            // Check if subtotal is 0
            // If so, show empty cart page
            console.log(subTotal);
            if (Number(subTotal) == 0) {
                document.location.href = '/showcart';
                return;
            }

            if (product) { // If the product id is returned, the product is still in cart (quantity > 0)
                // Update the total $$ of the product
                document.getElementById(`total_${id}`).innerHTML = `$${(Number(product.quantity) * Number(product.price)).toFixed(2)}`
            } else {
                document.getElementById(`product_${id}`).remove();
            }

            // Update the subTotal
            document.getElementById('subTotal').innerHTML = `$${Number(subTotal).toFixed(2)}`;

        } else {
            // Rollback
            if (isIncrease) {
                decrease();
            } else {
                increase();
            }

            document.body.innerHTML += `
            <div id = 'dialog' data-reflow-type="toast" class="ref-notification error no-description" style="transform: translateY(-20px);">
                <div class="ref-notification-content">
                    <div class="ref-notification-title">Failed to update cart</div>
                    <div class="ref-notification-description"></div>
                    <div class="ref-close-button" onclick='closeDialog();'>×</div>
                </div>
            </div>
            `;
        }
    };

    xhttp.responseType = 'json';
    xhttp.open("POST", "/addcart", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(body);

}

function switchMainImage(id) {

    // Cast id to number
    id = Number(id);

    // Deactivate all other images
    for (let ele of document.getElementsByClassName('ref-image')) {
        ele.classList.remove('active');
    }

    // Activate the image based on id
    document.getElementById(`image_${id}`).classList.add('active');
    document.getElementById(`thumb_${id}`).classList.add('active');
}


