
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

// Open Login

let openLogin = document.querySelector("#openLogin");

let loginPopup = document.querySelector("#loginPopup");

let closeLogin = document.querySelector("#closeLogin");

openLogin.addEventListener("click", function() {

    loginPopup.style.display = "flex";

});


// Close Login

closeLogin.addEventListener("click", function() {

    loginPopup.style.display = "none";

});


// Login Form
g


var users= JSON.parse(localStorage.getItem("users")) || []

var SignupForm= document.getElementById("SignupForm")
var FullName = document.getElementById("FullName")
var Age = document.getElementById("Age")
var Email = document.getElementById("Email")
var Password = document.getElementById("Password")
var ConfirmPassword = document.getElementById("ConfirmPassword")
var Message = document.getElementById("Message")

function showMessage(text, color) {
        Message.textContent = text
        Message.style.color = color
    }


SignupForm.addEventListener("submit", function (e) {
    e.preventDefault()

    var fullName = FullName.value
    var age = Age.value
    var email = Email.value
    var password = Password.value
    var confirmPassword = ConfirmPassword.value

    var selestGender = document.querySelector('input[name="Gender"]:checked')
    var gender = selestGender ? selestGender.value : ""

    
    if (fullName === ""||age === ""||email === ""||password === ""||confirmPassword === "") {
        showMessage("Please fill in all feilds","red")
        return;
    }

    if (gender === "") {
        showMessage("Please select the gender","red")
        return;
    }

    if (age < 18) {
        showMessage("You must be at least 18 years old","red")
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 chars", "red")
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage("Password and its confirmation don't match", "red")
        return;
    }


var emailLower = email.toLowerCase();
var emailExists = users.some(function (user) {
    return user.email === emailLower
    
})

if (emailExists) {
    showMessage("This email is already registed" , "red")
     return;
}

var newUser = {
    fullName: fullName,
    age: age,
    email: emailLower,
    password: password,
    gender: gender,
    role: "user"
}
users.push(newUser)
localStorage.setItem("users" , JSON.stringify(users))

showMessage("Account created successfully", "green")
SignupForm.reset()
setTimeout(function () {
    window.location.href = "login.html"
} , 2000)

})
