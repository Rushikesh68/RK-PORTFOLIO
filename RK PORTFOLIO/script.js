/**
 * RUSHIKESH KAMBLE PORTFOLIO - FULL MASTER JS
 */

// --- 0. FIREBASE CONFIGURATION (सर्वात आधी डिक्लेअर करा) ---
const firebaseConfig = {
    apiKey: "AIzaSyA9yZ-UL0zUhdbY-Qk-K82XF8Nck76QYSU",
    authDomain: "portfolio-chat-7fa0b.firebaseapp.com",
    databaseURL: "https://portfolio-chat-7fa0b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "portfolio-chat-7fa0b",
    storageBucket: "portfolio-chat-7fa0b.firebasestorage.app",
    messagingSenderId: "149271038268",
    appId: "1:149271038268:web:465e70386858f9a4a63639",
    measurementId: "G-FK6EFZ80BZ"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// EmailJS Initialize
(function() {
    emailjs.init("FBWlY7n3aNAU9pjln"); 
})();

// --- MAIN DOM CONTENT LOADED ---
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    
    if (hamburger && navLinks) {
        const menuIcon = hamburger.querySelector("i");
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
            menuIcon.classList.toggle("fa-bars");
            menuIcon.classList.toggle("fa-times");
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                if (menuIcon) menuIcon.classList.replace("fa-times", "fa-bars");
            });
        });
    }

    // --- 2. Theme Toggle (With Null Check) ---
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector("i");
        const body = document.body;

        const toggleTheme = () => {
            const isLight = body.getAttribute("data-theme") === "light";
            if (isLight) {
                body.removeAttribute("data-theme");
                if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
                localStorage.setItem("theme", "dark");
            } else {
                body.setAttribute("data-theme", "light");
                if (themeIcon) themeIcon.classList.replace("fa-sun", "fa-moon");
                localStorage.setItem("theme", "light");
            }
        };

        themeBtn.addEventListener("click", toggleTheme);

        // Persist Theme
        if (localStorage.getItem("theme") === "light") {
            body.setAttribute("data-theme", "light");
            if (themeIcon) themeIcon.classList.replace("fa-sun", "fa-moon");
        }
    }

    // --- 3. Typewriter ---
    const typeElement = document.querySelector(".typewriter");
    if (typeElement) {
        const words = ["Web Developer", "Database Administrator", "Frontend Developer", "App Developer"];
        let wordIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const current = words[wordIdx];
            typeElement.textContent = isDeleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
            charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

            let speed = isDeleting ? 100 : 200;
            if (!isDeleting && charIdx === current.length) { speed = 2000; isDeleting = true; }
            else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; speed = 500; }
            setTimeout(type, speed);
        }
        type();
    }

    // --- 4. Skill Bars Observer ---
    const skillSection = document.querySelector(".skills-section");
    if (skillSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll(".bar-fill").forEach(bar => {
                    bar.style.width = bar.getAttribute("data-percent") + "%";
                });
            }
        }, { threshold: 0.5 });
        observer.observe(skillSection);
    }

    // --- 5. Contact Form (Firebase & EmailJS) ---
    const chatForm = document.getElementById('contact-form');
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = chatForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = "Sending...";
            submitBtn.disabled = true;

            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const msg = document.getElementById('user-msg').value;

            // A. Firebase Save
            database.ref('contact_messages').push().set({
                sender_name: name,
                sender_email: email,
                message: msg,
                timestamp: Date.now()
            })
            .then(() => {
                // B. EmailJS Send
                return emailjs.send('service_laqd286', 'template_g9sjhal', {
                    from_name: name,
                    from_email: email,
                    message: msg
                });
            })
            .then(function() {
                alert('Success! Message sent to Firebase and Email received.');
                chatForm.reset();
            })
            .catch(function(error) {
                console.error("Error:", error);
                alert("Something went wrong!");
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});