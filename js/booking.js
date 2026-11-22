/* =========================================
   BOOKING.JS
========================================= */

// 1. Get Current User

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "user") {
    window.location.href = "login.html";
    throw new Error("User is not logged in.");
}

const users = JSON.parse(localStorage.getItem("users")) || [];

const customer = users.find(
    user => user.email.toLowerCase() === currentUser.email.toLowerCase()
);

if (!customer) {
    window.location.href = "login.html";
    throw new Error("Customer account not found.");
}

// 2. Get Data

let services = JSON.parse(localStorage.getItem("services")) || [];
let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
let availableTimes = JSON.parse(localStorage.getItem("clinicAvailableTimes")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

// 3. Get HTML Elements

const bookingForm = document.getElementById("bookingForm");
const message = document.getElementById("message");

const serviceSelect = document.getElementById("service");
const doctorSelect = document.getElementById("doctor");
const priceInput = document.getElementById("price");

const customerName = document.getElementById("customerName");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");

const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const stepOne = document.getElementById("stepOne");
const stepTwo = document.getElementById("stepTwo");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

// 4. Fill Customer Information

if (customerName) {
    customerName.value = customer.fullName;
    customerName.readOnly = true;
}

if (ageInput) {
    ageInput.value = customer.age;
    ageInput.readOnly = true;
}

if (emailInput) {
    emailInput.value = customer.email;
    emailInput.readOnly = true;
}

// 5. Set Minimum Date to Today

if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}

// 6. Load Services

function loadServices() {

    services = JSON.parse(localStorage.getItem("services")) || [];
    doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    serviceSelect.innerHTML = `
        <option value="">Select Service</option>
    `;

    if (services.length === 0) {
        serviceSelect.innerHTML = `
            <option value="">No Services Available</option>
        `;
        return;
    }

    services.forEach(service => {

        const option = document.createElement("option");

        option.value = service.id;
        option.textContent = service.name;

        serviceSelect.appendChild(option);

    });
}

// 7. Load Available Times

function loadAvailableTimes() {
    if (!timeInput) return;

    // Turn the existing time input into a dropdown.
    // The HTML file does not need to be changed.

    if (timeInput.tagName.toLowerCase() !== "select") {
        const newTimeSelect = document.createElement("select");

        newTimeSelect.id = "time";
        newTimeSelect.name = timeInput.name || "time";
        newTimeSelect.required = true;
        newTimeSelect.className = timeInput.className;

        timeInput.replaceWith(newTimeSelect);
    }

    const timeSelect = document.getElementById("time");

    timeSelect.innerHTML = `
        <option value="">Choose an Available Time</option>
        ${availableTimes.map(time => `
            <option value="${time}">${time}</option>
        `).join("")}
    `;

    if (availableTimes.length === 0) {
        timeSelect.innerHTML = `
            <option value="">No available times currently</option>
        `;
    }
}

// 8. When Customer Selects a Service

function updateServiceDetails() {
    const serviceId = Number(serviceSelect.value);

    const selectedService = services.find(
        service => Number(service.id) === serviceId
    );

    if (!selectedService) {
        doctorSelect.innerHTML = `<option value="">Choose a Doctor</option>`;
        if (priceInput) priceInput.value = "";
        return;
    }

    const selectedDoctor = doctors.find(
        doctor => Number(doctor.id) === Number(selectedService.doctorId)
    );

    if (doctorSelect) {
        doctorSelect.innerHTML = selectedDoctor
            ? `<option value="${selectedDoctor.id}">${selectedDoctor.name}</option>`
            : `<option value="">Doctor Not Available</option>`;
    }

    if (priceInput) {
        priceInput.value = selectedService.price;
    }
}

if (serviceSelect) {
    serviceSelect.addEventListener("change", updateServiceDetails);
}

// 9. Show Message

function showMessage(text, type = "error") {
    if (!message) {
        alert(text);
        return;
    }

    message.textContent = text;
    message.style.color = type === "success" ? "green" : "red";
}

// 10. Validate Booking Information

function validateBooking() {
    const phone = phoneInput.value.trim();
    const date = dateInput.value;
    const time = document.getElementById("time").value;
    const serviceId = Number(serviceSelect.value);

    if (!/^01\d{9}$/.test(phone)) {
        showMessage("Please enter a valid Egyptian phone number.");
        return false;
    }

    if (!serviceId) {
        showMessage("Please select a service.");
        return false;
    }

    if (!date) {
        showMessage("Please select a date.");
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date + "T00:00:00");

    if (selectedDate < today) {
        showMessage("Please select today or a future date.");
        return false;
    }

    if (!time) {
        showMessage("Please select an available time.");
        return false;
    }

    if (!availableTimes.includes(time)) {
        showMessage("This time is no longer available.");
        return false;
    }

    const service = services.find(
        s => Number(s.id) === serviceId
    );

    if (!service) {
        showMessage("This service is no longer available.");
        return false;
    }

    const doctor = doctors.find(
        d => Number(d.id) === Number(service.doctorId)
    );

    if (!doctor) {
        showMessage("The doctor for this service is unavailable.");
        return false;
    }

    const conflict = appointments.some(appointment =>
        Number(appointment.doctorId) === Number(doctor.id) &&
        appointment.date === date &&
        appointment.time === time &&
        appointment.status !== "Cancelled"
    );

    if (conflict) {
        showMessage("This time is already booked. Please choose another time.");
        return false;
    }

    return true;
}

// 11. Next Step

/* 11. Next Step */

if (nextBtn) {
    nextBtn.addEventListener("click", function () {

        const phone = phoneInput.value.trim();
        const serviceId = Number(serviceSelect.value);

        if (!/^01\d{9}$/.test(phone)) {
            showMessage("Please enter a valid Egyptian phone number.");
            return;
        }

        if (!serviceId) {
            showMessage("Please select a service.");
            return;
        }

        const selectedService = services.find(
            service => Number(service.id) === serviceId
        );

        if (!selectedService) {
            showMessage("This service is not available.");
            return;
        }

        const selectedDoctor = doctors.find(
            doctor => Number(doctor.id) === Number(selectedService.doctorId)
        );

        if (!selectedDoctor) {
            showMessage("Doctor for this service is unavailable.");
            return;
        }

        updateServiceDetails();

        if (stepOne) stepOne.style.display = "none";
        if (stepTwo) stepTwo.style.display = "block";

        if (message) message.textContent = "";
    });
}

// 12. Back Button

if (backBtn) {
    backBtn.addEventListener("click", function () {
        if (stepTwo) stepTwo.style.display = "none";
        if (stepOne) stepOne.style.display = "block";
    });
}

// 13. Save Booking

if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Refresh data in case admin changed something.
        services = JSON.parse(localStorage.getItem("services")) || [];
        doctors = JSON.parse(localStorage.getItem("doctors")) || [];
        availableTimes = JSON.parse(localStorage.getItem("clinicAvailableTimes")) || [];
        appointments = JSON.parse(localStorage.getItem("appointments")) || [];

        if (!validateBooking()) return;

        const serviceId = Number(serviceSelect.value);

        const selectedService = services.find(
            s => Number(s.id) === serviceId
        );

        const selectedDoctor = doctors.find(
            d => Number(d.id) === Number(selectedService.doctorId)
        );

        const selectedTime = document.getElementById("time").value;
        const selectedDate = dateInput.value;

        // Check again immediately before saving.
        const conflict = appointments.some(appointment =>
            Number(appointment.doctorId) === Number(selectedDoctor.id) &&
            appointment.date === selectedDate &&
            appointment.time === selectedTime &&
            appointment.status !== "Cancelled"
        );

        if (conflict) {
            showMessage("Sorry, this time has just been booked.");
            return;
        }

        const newAppointment = {
            id: Date.now(),
            fullName: customer.fullName,
            age: customer.age,
            email: customer.email,
            phone: phoneInput.value.trim(),

            serviceId: selectedService.id,
            doctorId: selectedDoctor.id,

            price: selectedService.price,
            date: selectedDate,
            time: selectedTime,

            payment: "Cash at Clinic",
            status: "Pending"
        };

        appointments.push(newAppointment);

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );

        showMessage("Your appointment has been booked successfully!", "success");

        bookingForm.reset();

        customerName.value = customer.fullName;
        ageInput.value = customer.age;
        emailInput.value = customer.email;

        doctorSelect.innerHTML = `<option value="">Choose a Doctor</option>`;
        priceInput.value = "";

        loadServices();
        loadAvailableTimes();

        if (stepTwo) stepTwo.style.display = "none";
        if (stepOne) stepOne.style.display = "block";
    });
}

// 14. Start

loadServices();
loadAvailableTimes();