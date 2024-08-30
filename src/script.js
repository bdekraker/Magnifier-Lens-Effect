// Create the Magnifier Lens
var magnifierLens = document.createElement('div');
magnifierLens.classList.add('magnifier-lens');
document.body.appendChild(magnifierLens); // Append it to the body or a specific container

function setupMagnifier(imageElement) {
    var magnificationFactor = 3; // Adjust magnification level as needed
    var magnifierSize = 200; // Starting size of the magnifier lens

    // Ensure the magnifier lens is styled and prepared
    magnifierLens.style.backgroundRepeat = 'no-repeat';
    magnifierLens.style.pointerEvents = 'none';
    magnifierLens.style.position = 'absolute';
    magnifierLens.style.border = '1px solid #000';
    magnifierLens.style.borderRadius = '50%';
    magnifierLens.style.width = magnifierSize + 'px'; // Diameter of the lens
    magnifierLens.style.height = magnifierSize + 'px'; // Diameter of the lens
    magnifierLens.style.visibility = 'hidden'; // Initially hidden
    magnifierLens.style.boxShadow = '0 0 5px #000'; 
    magnifierLens.style.cursor = 'crosshair';

    // Function to update magnifier lens size
    function updateMagnifierSize(deltaY) {
        // Update magnifier size
        magnifierSize += deltaY > 0 ? -20 : 20;
        magnifierSize = Math.max(100, Math.min(magnifierSize, 400));
        
        // Adjust magnification factor based on lens size
        magnificationFactor = 2 + (magnifierSize - 100) * (5 - 2) / (400 - 100);
        
        magnifierLens.style.width = magnifierSize + 'px';
        magnifierLens.style.height = magnifierSize + 'px';
    
        // Update lens styling for new magnification
        updateLensMagnification();
    }

    function updateLensMagnification() {
        if (!imageElement) return; // Ensure there's an image element to work on

        var bounds = imageElement.getBoundingClientRect();
        var bgPosX = -(magnifierLens.offsetLeft - bounds.left) * magnificationFactor - magnifierLens.offsetWidth / 2;
        var bgPosY = -(magnifierLens.offsetTop - bounds.top) * magnificationFactor - magnifierLens.offsetHeight / 2;

        magnifierLens.style.backgroundSize = `${imageElement.width * magnificationFactor}px ${imageElement.height * magnificationFactor}px`;
        magnifierLens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

        // Trigger reflow
        magnifierLens.offsetHeight;
    }

    imageElement.addEventListener('mousemove', function(e) {
        magnifierLens.style.visibility = 'visible';
        var bounds = e.target.getBoundingClientRect();
        var mouseX = e.clientX - bounds.left;
        var mouseY = e.clientY - bounds.top;

        var lensX = mouseX - (magnifierLens.offsetWidth / 2);
        var lensY = mouseY - (magnifierLens.offsetHeight / 2);

        magnifierLens.style.left = (bounds.left + window.pageXOffset + lensX) + 'px';
        magnifierLens.style.top = (bounds.top + window.pageYOffset + lensY) + 'px';

        var bgPosX = -((mouseX * magnificationFactor) - magnifierLens.offsetWidth / 2);
        var bgPosY = -((mouseY * magnificationFactor) - magnifierLens.offsetHeight / 2);

        magnifierLens.style.backgroundImage = `url('${imageElement.src}')`;
        magnifierLens.style.backgroundSize = `${imageElement.width * magnificationFactor}px ${imageElement.height * magnificationFactor}px`;
        magnifierLens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

        imageElement.style.cursor = 'none'; // Hide the cursor when magnifier is active
    });

    imageElement.addEventListener('wheel', function(e) {
        e.preventDefault(); // Prevent the page from scrolling
        updateMagnifierSize(e.deltaY); // Adjust the magnifier size based on scroll direction
    }, { passive: false });

    imageElement.addEventListener('mouseleave', function() {
        magnifierLens.style.visibility = 'hidden';
        imageElement.style.cursor = 'default'; // Reset the cursor when the mouse leaves
    });
}

// Setup the magnifier on the image
var imageElement = document.getElementById('magnifiable-image');
setupMagnifier(imageElement);
