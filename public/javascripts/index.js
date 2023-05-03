
var timeout = false, // holder for timeout id
    delay = 250; // (ms) delay after event is "complete" to run callback


function resizeIcons() {

    // Get the width of the current screen
    var w = window.outerWidth;

    // Calculate new size of the logo
    var newLogoSize = (w > 1024) ? 34 : 24;

    // Reset the attributes of svg element
    // Viewport remains unchanged!
    // Smaller svg size will basically gives a smaller 
    document.getElementById('logo').setAttribute('width', `${newLogoSize}`);
    document.getElementById('logo').setAttribute('height', `${newLogoSize}`);
}


// Add listener for screen resizing
window.addEventListener('resize', function () {
    // Clear timeout
    this.clearTimeout(timeout);
    // start timing for event "completion"
    timeout = this.setTimeout(resizeIcons, delay);
});

// Call for intialization
resizeIcons();