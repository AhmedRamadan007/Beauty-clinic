/* =========================================
   ADMIN.JS
   Admin Dashboard + Doctors + Services
   + Appointments + Available Times
========================================= */

// 1. Check Admin Login

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "login.html";
}

// 2. Get Data from LocalStorage

let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
let services = JSON.parse(localStorage.getItem("services")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let availableTimes = JSON.parse(localStorage.getItem("clinicAvailableTimes")) || [];

function saveData() {
    localStorage.setItem("doctors", JSON.stringify(doctors));
    localStorage.setItem("services", JSON.stringify(services));
    localStorage.setItem("appointments", JSON.stringify(appointments));
    localStorage.setItem("clinicAvailableTimes", JSON.stringify(availableTimes));
}

// 3. Helper Functions

function getDoctorName(id) {
    const doctor = doctors.find(d => Number(d.id) === Number(id));
    return doctor ? doctor.name : "Unknown Doctor";
}

function getServiceName(id) {
    const service = services.find(s => Number(s.id) === Number(id));
    return service ? service.name : "Unknown Service";
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

// 4. Doctors

function displayDoctors() {
    const table = document.getElementById("doctorsTable");
    if (!table) return;

    table.innerHTML = doctors.map(doctor => `
        <tr>
            <td>${escapeHTML(doctor.name)}</td>
            <td>${escapeHTML(doctor.specialty)}</td>
            <td>
                <button onclick="editDoctor(${Number(doctor.id)})">Edit</button>
                <button onclick="deleteDoctor(${Number(doctor.id)})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function updateDoctorOptions() {
    const select = document.getElementById("serviceDoctor");
    if (!select) return;

    const oldValue = select.value;

    select.innerHTML = `
        <option value="">Select Doctor</option>
        ${doctors.map(doctor => `
            <option value="${Number(doctor.id)}">
                ${escapeHTML(doctor.name)}
            </option>
        `).join("")}
    `;

    if (doctors.some(d => String(d.id) === oldValue)) {
        select.value = oldValue;
    }
}

const doctorForm = document.getElementById("doctorForm");

if (doctorForm) {
    doctorForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = document.getElementById("doctorId").value;
        const name = document.getElementById("doctorName").value.trim();
        const specialty = document.getElementById("doctorSpecialty").value.trim();

        if (!name || !specialty) {
            alert("Please enter doctor name and specialty.");
            return;
        }

        if (id) {
            const doctor = doctors.find(d => Number(d.id) === Number(id));

            if (doctor) {
                doctor.name = name;
                doctor.specialty = specialty;
            }
        } else {
            doctors.push({
                id: Date.now(),
                name,
                specialty
            });
        }

        saveData();
        doctorForm.reset();

        document.getElementById("doctorId").value = "";

        displayAllData();
    });
}

function editDoctor(id) {
    const doctor = doctors.find(d => Number(d.id) === Number(id));
    if (!doctor) return;

    document.getElementById("doctorId").value = doctor.id;
    document.getElementById("doctorName").value = doctor.name;
    document.getElementById("doctorSpecialty").value = doctor.specialty;
}

function deleteDoctor(id) {
    const doctorHasServices = services.some(
        s => Number(s.doctorId) === Number(id)
    );

    if (doctorHasServices) {
        alert("You cannot delete this doctor because they are assigned to a service.");
        return;
    }

    if (!confirm("Delete this doctor?")) return;

    doctors = doctors.filter(d => Number(d.id) !== Number(id));

    saveData();
    displayAllData();
}

// 5. Services

function displayServices() {
    const table = document.getElementById("servicesTable");
    if (!table) return;

    table.innerHTML = services.map(service => `
        <tr>
            <td>${escapeHTML(service.name)}</td>
            <td>${escapeHTML(service.price)} EGP</td>
            <td>${escapeHTML(getDoctorName(service.doctorId))}</td>
            <td>
                <button onclick="editService(${Number(service.id)})">Edit</button>
                <button onclick="deleteService(${Number(service.id)})">Delete</button>
            </td>
        </tr>
    `).join("");

    updateDoctorOptions();
}

const serviceForm = document.getElementById("serviceForm");

if (serviceForm) {
    serviceForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = document.getElementById("serviceId").value;
        const name = document.getElementById("serviceName").value.trim();
        const price = Number(document.getElementById("servicePrice").value);
        const doctorId = Number(document.getElementById("serviceDoctor").value);

        if (!name || price <= 0 || !doctorId) {
            alert("Please enter valid service information.");
            return;
        }

        if (id) {
            const service = services.find(s => Number(s.id) === Number(id));

            if (service) {
                service.name = name;
                service.price = price;
                service.doctorId = doctorId;
            }
        } else {
            services.push({
                id: Date.now(),
                name,
                price,
                doctorId
            });
        }

        saveData();
        serviceForm.reset();

        document.getElementById("serviceId").value = "";

        displayAllData();
    });
}

function editService(id) {
    const service = services.find(s => Number(s.id) === Number(id));
    if (!service) return;

    document.getElementById("serviceId").value = service.id;
    document.getElementById("serviceName").value = service.name;
    document.getElementById("servicePrice").value = service.price;

    updateDoctorOptions();

    document.getElementById("serviceDoctor").value = service.doctorId;
}

function deleteService(id) {
    if (!confirm("Delete this service?")) return;

    services = services.filter(s => Number(s.id) !== Number(id));

    saveData();
    displayAllData();
}

// 6. Appointments

function displayAppointments() {
    const table = document.getElementById("appointmentsTable");
    if (!table) return;

    table.innerHTML = appointments.map(appointment => `
        <tr>
            <td>${escapeHTML(appointment.fullName)}</td>
            <td>${escapeHTML(appointment.phone)}</td>
            <td>${escapeHTML(getServiceName(appointment.serviceId))}</td>
            <td>${escapeHTML(getDoctorName(appointment.doctorId))}</td>
            <td>${escapeHTML(appointment.date)}</td>
            <td>${escapeHTML(appointment.time)}</td>
            <td>${escapeHTML(appointment.price)} EGP</td>
            <td>${escapeHTML(appointment.status)}</td>
            <td>
                ${appointment.status === "Pending" ? `
                    <button onclick="confirmAppointment(${Number(appointment.id)})">
                        Confirm
                    </button>
                ` : ""}

                <button onclick="editAppointment(${Number(appointment.id)})">
                    Edit
                </button>

                <button onclick="deleteAppointment(${Number(appointment.id)})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

function confirmAppointment(id) {
    const appointment = appointments.find(a => Number(a.id) === Number(id));
    if (!appointment) return;

    appointment.status = "Confirmed";

    saveData();
    displayAllData();
}

function editAppointment(id) {
    const appointment = appointments.find(a => Number(a.id) === Number(id));
    if (!appointment) return;

    const newDate = prompt("Enter new date (YYYY-MM-DD):", appointment.date);
    if (newDate === null) return;

    const newTime = prompt("Enter new time (example: 10:00 AM):", appointment.time);
    if (newTime === null) return;

    const newPrice = prompt("Enter new price:", appointment.price);
    if (newPrice === null) return;

    const newServiceId = prompt(
        "Enter service ID:",
        appointment.serviceId
    );
    if (newServiceId === null) return;

    const newDoctorId = prompt(
        "Enter doctor ID:",
        appointment.doctorId
    );
    if (newDoctorId === null) return;

    const service = services.find(
        s => Number(s.id) === Number(newServiceId)
    );

    const doctor = doctors.find(
        d => Number(d.id) === Number(newDoctorId)
    );

    if (!service || !doctor) {
        alert("Invalid service or doctor ID.");
        return;
    }

    if (Number(service.doctorId) !== Number(doctor.id)) {
        alert("This doctor is not assigned to this service.");
        return;
    }

    const conflict = appointments.some(a =>
        Number(a.id) !== Number(id) &&
        Number(a.doctorId) === Number(doctor.id) &&
        a.date === newDate &&
        a.time === newTime &&
        a.status !== "Cancelled"
    );

    if (conflict) {
        alert("This doctor already has an appointment at this time.");
        return;
    }

    if (Number(newPrice) <= 0) {
        alert("Invalid price.");
        return;
    }

    appointment.date = newDate;
    appointment.time = newTime;
    appointment.price = Number(newPrice);
    appointment.serviceId = Number(service.id);
    appointment.doctorId = Number(doctor.id);

    saveData();
    displayAllData();
}

function deleteAppointment(id) {
    if (!confirm("Delete this appointment?")) return;

    appointments = appointments.filter(
        a => Number(a.id) !== Number(id)
    );

    saveData();
    displayAllData();
}

// 7. Available Times Manager
// This section is created automatically.
// No admin.html changes are needed.

function createAvailableTimesSection() {
    if (document.getElementById("availableTimesSection")) return;

    const section = document.createElement("section");

    section.id = "availableTimesSection";

    section.style.cssText = `
        background: white;
        padding: 20px;
        margin: 25px 0;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    `;

    section.innerHTML = `
        <h2>Manage Available Booking Times</h2>

        <p>Add the times that customers are allowed to book.</p>

        <form id="availableTimeForm">
            <input
                type="time"
                id="availableTimeInput"
                required
            >

            <button type="submit">Add Available Time</button>
        </form>

        <div id="availableTimesList" style="margin-top:15px;"></div>
    `;

    const appointmentsTable = document.getElementById("appointmentsTable");

    if (appointmentsTable && appointmentsTable.parentElement) {
        appointmentsTable.parentElement.insertAdjacentElement("afterend", section);
    } else {
        document.body.appendChild(section);
    }

    document.getElementById("availableTimeForm").addEventListener(
        "submit",
        function (e) {
            e.preventDefault();

            const time = document.getElementById("availableTimeInput").value;

            if (!time) return;

            if (availableTimes.includes(time)) {
                alert("This time already exists.");
                return;
            }

            availableTimes.push(time);

            availableTimes.sort();

            saveData();
            displayAvailableTimes();

            document.getElementById("availableTimeForm").reset();
        }
    );

    displayAvailableTimes();
}

function displayAvailableTimes() {
    const list = document.getElementById("availableTimesList");
    if (!list) return;

    if (availableTimes.length === 0) {
        list.innerHTML = "<p>No available times added yet.</p>";
        return;
    }

    list.innerHTML = availableTimes.map(time => `
        <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            padding:10px;
            margin:7px 0;
            border:1px solid #ddd;
            border-radius:8px;
        ">
            <strong>${escapeHTML(time)}</strong>

            <button onclick="deleteAvailableTime('${time}')">
                Delete
            </button>
        </div>
    `).join("");
}

function deleteAvailableTime(time) {
    if (!confirm("Remove this available time?")) return;

    availableTimes = availableTimes.filter(t => t !== time);

    saveData();
    displayAvailableTimes();
}

// 8. Dashboard

function updateDashboard() {
    const doctorCount = document.getElementById("doctorCount");
    const serviceCount = document.getElementById("serviceCount");
    const appointmentCount = document.getElementById("appointmentCount");
    const pendingCount = document.getElementById("pendingCount");

    if (doctorCount) doctorCount.textContent = doctors.length;
    if (serviceCount) serviceCount.textContent = services.length;
    if (appointmentCount) appointmentCount.textContent = appointments.length;

    if (pendingCount) {
        pendingCount.textContent = appointments.filter(
            a => a.status === "Pending"
        ).length;
    }
}

// 9. Logout

function logoutAdmin() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
    logoutButton.addEventListener("click", logoutAdmin);
}

// 10. Display Everything

function displayAllData() {
    displayDoctors();
    displayServices();
    displayAppointments();
    updateDashboard();
}

// Start

saveData();
displayAllData();
createAvailableTimesSection();