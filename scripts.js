// Global variables
let currentSlide = 0;
let isPlaying = true;
let slideInterval;
let slides;
let dots;
let playPauseBtn;

// Function to create navigation dots
function createDots() {
    const dotsContainer = document.querySelector(".dots");
    const slidesCount = slides.length;

    // Clear existing dots if any
    dotsContainer.innerHTML = "";

    // Create new dots based on number of slides
    for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.setAttribute("data-index", i);
        if (i === 0) dot.classList.add("active");

        // Add click event listener to each dot
        dot.addEventListener("click", () => goToSlide(i));

        dotsContainer.appendChild(dot);
    }

    // Update dots variable after creating them
    dots = document.querySelectorAll(".dot");
}

// Function to show specific slide
function goToSlide(index) {
    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    // Update current slide index
    currentSlide = index;

    // Add active class to new slide and dot
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");

    // Reset slideshow timer if playing
    if (isPlaying) {
        stopSlideshow();
        startSlideshow();
    }
}

// Function to move to next slide
function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
}

// Function to start slideshow
function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
}

// Function to stop slideshow
function stopSlideshow() {
    clearInterval(slideInterval);
}

// Function to toggle play/pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying
        ? `<img src="/images/pause.png" alt="Pause" style='width: 19px; height: 21px' />`
        : `<img src="/images/play.png" alt="Play" style='width: 19px; height: 21px' />`;
    // playPauseBtn.textContent = isPlaying ? '▶' : '⏸';

    if (isPlaying) {
        startSlideshow();
    } else {
        stopSlideshow();
    }
}

// Function to initialize slider
function initSlider() {
    // Get DOM elements
    slides = document.querySelectorAll(".slide");
    playPauseBtn = document.querySelector(".play-pause-btn");

    // Create navigation dots
    createDots();

    // Add click event listener to play/pause button
    playPauseBtn.addEventListener("click", togglePlayPause);

    // Start the slideshow
    startSlideshow();

    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        } else if (e.key === "ArrowRight") {
            const nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        }
    });
}

document.addEventListener("scroll", function () {
    const topContent = document.querySelector(".top-bar");
    const navbar = document.querySelector(".main-nav");
    const sliderContainer = document.querySelector(".slider-container");

    if (window.scrollY > topContent.offsetHeight) {
        navbar.classList.add("fixed");
        topContent.style.opacity = 0; // Hide the top content
        sliderContainer.style.marginTop = "98px";
    } else {
        navbar.classList.remove("fixed");
        topContent.style.opacity = 1; // Show the top content
        sliderContainer.style.marginTop = "0";
    }
});

// Initialize slider when DOM is loaded
document.addEventListener("DOMContentLoaded", initSlider);

// Contact Form
document.addEventListener("DOMContentLoaded", () => {
    // Helper function to validate email
    const isValidEmail = (email) => {
        // More comprehensive email regex pattern
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    // Helper function to show error
    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add("active");

        // Add error class to the input field
        const inputElement = document.getElementById(
            elementId.replace("Error", "")
        );
        if (inputElement) {
            inputElement.classList.add("error-field");
        }
    };

    // Helper function to clear error
    const clearError = (elementId) => {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = "";
        errorElement.classList.remove("active");

        // Remove error class from the input field
        const inputElement = document.getElementById(
            elementId.replace("Error", "")
        );
        if (inputElement) {
            inputElement.classList.remove("error-field");
        }
    };

    // Helper function to show success message
    const showSuccessMessage = (message) => {
        const successDiv = document.createElement("div");
        successDiv.className = "success-message";
        successDiv.textContent = message;

        const form = document.querySelector(".contactForm");
        form.insertBefore(successDiv, form.firstChild);

        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    };

    // Form submission handler
    const contactForm = document.querySelector(".contactForm");
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Clear all existing errors
        document.querySelectorAll(".error").forEach((error) => {
            error.textContent = "";
            error.classList.remove("active");
        });
        document.querySelectorAll("input, textarea, select").forEach((field) => {
            field.classList.remove("error-field");
        });

        let isValid = true;
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());

        // Validate name (minimum 2 characters)
        if (!formValues.name || formValues.name.trim().length < 2) {
            isValid = false;
            showError(
                "nameError",
                "Please enter a valid name (minimum 2 characters)"
            );
        }

        // Validate email
        if (!formValues.email) {
            isValid = false;
            showError("emailError", "Email is required");
        } else if (!isValidEmail(formValues.email)) {
            isValid = false;
            showError("emailError", "Please enter a valid email address");
        }

        // Validate message (minimum 10 characters)
        if (!formValues.message || formValues.message.trim().length < 10) {
            isValid = false;
            showError(
                "messageError",
                "Please enter a message (minimum 10 characters)"
            );
        }

        if (isValid) {
            try {
                // Disable submit button to prevent double submission
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";

                // Simulate API call (replace with actual API endpoint)
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Show success message
                showSuccessMessage(
                    "Thank you! Your message has been sent successfully."
                );

                // Reset form
                this.reset();

                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = "Submit";
            } catch (error) {
                console.error("Error submitting form:", error);
                showError(
                    "formError",
                    "An error occurred while sending your message. Please try again."
                );

                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = "Submit";
            }
        }
    });

    // Add input event listeners to clear errors as user types
    document
        .querySelectorAll(".contactForm input, .contactForm textarea")
        .forEach((element) => {
            element.addEventListener("input", function () {
                const errorId = this.id + "Error";
                clearError(errorId);
            });
        });
});

// navbar menu

document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const closeMenuBtn = document.querySelector(".close-menu");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu-content a");

    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    closeMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
    });

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    const links = document.querySelectorAll(".link");

    // Get current page path (e.g., "about.html")
    const currentPath = window.location.pathname.split("/").pop();

    links.forEach((link) => {
        // Check if the link's href matches the current path
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});
