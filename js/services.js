"use strict";

// Filter service cards by category.
var filterButtons = document.querySelectorAll(".filter-btn");
var serviceCards = document.querySelectorAll(".service-card");
var bookButtons = document.querySelectorAll(".book-btn");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        var category = button.getAttribute("data-category");

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active");
        });
        button.classList.add("active");

        serviceCards.forEach(function (card) {
            var serviceCategory = card.getAttribute("data-category");
            card.style.display = (category === "all" || category === serviceCategory)
                ? "block"
                : "none";
        });
    });
});

// Send the selected service to the booking page.
bookButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        var serviceName = button.getAttribute("data-service");
        window.location.href = "booking.html?service=" + encodeURIComponent(serviceName);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const openLogin = document.getElementById("openLogin");
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      // 1. إذا كان هناك مستخدم مسجل، حوّل الزر إلى Logout
      openLogin.textContent = "Logout";
      openLogin.href = "#"; // إلغاء الذهاب لصفحة اللوجين

      // 2. عند الضغط على Logout
      openLogin.addEventListener("click", function (e) {
        e.preventDefault();
        
        // مسح بيانات المستخدم المسجل
        localStorage.removeItem("currentUser");
        
        // إعادة الزر لحالته الأصلية أو تحديث الصفحة
        openLogin.textContent = "Login";
        openLogin.href = "login.html";
        window.location.reload(); // تحديث الصفحة لتأكيد الخروج
      });
    } else {
      // إذا لم يكن هناك مستخدم مسجل
      openLogin.textContent = "Login";
      openLogin.href = "login.html";
    }
  });