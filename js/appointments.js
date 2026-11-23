/* =========================================
   APPOINTMENTS.JS
========================================= */

// 1. Check Current User

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

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let services = JSON.parse(localStorage.getItem("services")) || [];
let doctors = JSON.parse(localStorage.getItem("doctors")) || [];

// 3. HTML Elements

const appointmentsTable = document.getElementById("appointmentsTable");
const appointmentsMessage = document.getElementById("appointmentsMessage");

const searchEmail = document.getElementById("searchEmail");
const searchBtn = document.getElementById("searchBtn");

// 4. Customer Email

if (searchEmail) {
    searchEmail.value = customer.email;
    searchEmail.readOnly = true;
}

// 5. Helper Functions

function getServiceName(id) {
    const service = services.find(
        s => Number(s.id) === Number(id)
    );

    return service ? service.name : "Service Not Found";
}

function getDoctorName(id) {
    const doctor = doctors.find(
        d => Number(d.id) === Number(id)
    );

    return doctor ? doctor.name : "Doctor Not Found";
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// 6. Display Customer Appointments

function displayCustomerAppointments() {
    appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    services = JSON.parse(localStorage.getItem("services")) || [];
    doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    const customerAppointments = appointments.filter(
        appointment =>
            appointment.email &&
            appointment.email.toLowerCase() === customer.email.toLowerCase()
    );

    if (!appointmentsTable) return;

    if (customerAppointments.length === 0) {
        appointmentsTable.innerHTML = `
            <tr>
                <td colspan="8">You don't have any appointments yet.</td>
            </tr>
        `;

        if (appointmentsMessage) {
            appointmentsMessage.textContent = "";
        }

        return;
    }

    appointmentsTable.innerHTML = customerAppointments.map(appointment => `
        <tr>
            <td>${escapeHTML(getServiceName(appointment.serviceId))}</td>
            <td>${escapeHTML(getDoctorName(appointment.doctorId))}</td>
            <td>${escapeHTML(appointment.date)}</td>
            <td>${escapeHTML(appointment.time)}</td>
            <td>${escapeHTML(appointment.price)} EGP</td>
            <td>${escapeHTML(appointment.status)}</td>
            <td>${escapeHTML(appointment.payment || "Cash at Clinic")}</td>
            <td>
                ${
                    appointment.status === "Pending"
                    ? `
                        <button onclick="cancelAppointment(${Number(appointment.id)})">
                            Cancel
                        </button>
                    `
                    : appointment.status === "Cancelled"
                    ? "Cancelled"
                    : "Confirmed"
                }
            </td>
        </tr>
    `).join("");
}

// 7. Cancel Appointment

function cancelAppointment(id) {
    appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    const appointment = appointments.find(
        a =>
            Number(a.id) === Number(id) &&
            a.email.toLowerCase() === customer.email.toLowerCase()
    );

    if (!appointment) {
        alert("Appointment not found.");
        return;
    }

    if (appointment.status !== "Pending") {
        alert("Only pending appointments can be cancelled.");
        return;
    }

    if (!confirm("Are you sure you want to cancel this appointment?")) {
        return;
    }

    appointment.status = "Cancelled";

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    displayCustomerAppointments();

    if (appointmentsMessage) {
        appointmentsMessage.textContent = "Appointment cancelled successfully.";
        appointmentsMessage.style.color = "green";
    }
}

// 8. Search Button

if (searchBtn) {
    searchBtn.addEventListener("click", function () {
        displayCustomerAppointments();
    });
}

// 9. Start

displayCustomerAppointments();