
// Booking Button

let bookButton = document.querySelector(".hero-content button");

bookButton.addEventListener("click", function() {

    document.querySelector("#booking").scrollIntoView({
        behavior: "smooth"
    });

});


// Learn More Button

let learnButton = document.querySelector(".about-content button");

learnButton.addEventListener("click", function() {

    document.querySelector("#services").scrollIntoView({
        behavior: "smooth"
    });

});


// Booking Form

let bookingForm = document.querySelector("#bookingForm");

bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Your appointment has been booked successfully!");

    bookingForm.reset();

});

