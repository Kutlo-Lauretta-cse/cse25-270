/**
 * PULA SCHOLARS - MASTER SCRIPT
 * Organized by Page & Functionality
 */

// --- 0. SCHOLARSHIP SEARCH FILTER (GLOBAL) ---
// This function must be outside the DOMContentLoaded to be seen by the HTML
window.filterScholarships = function(query) {
    const searchTerm = query.toLowerCase();
    const local = document.getElementById('local');
    const international = document.getElementById('international');
    
    if (local) {
        local.style.display = local.innerText.toLowerCase().includes(searchTerm) ? "" : "none";
    }
    if (international) {
        international.style.display = international.innerText.toLowerCase().includes(searchTerm) ? "" : "none";
    }
};

// --- 1. GLOBAL & SHARED UTILITIES ---
document.addEventListener("DOMContentLoaded", () => {
    
    // NAVIGATION ACTIVE LINK INDICATOR
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.color = "#FFD700"; // Gold for active link
        }
    });

    // --- 2. HOME PAGE SEARCH LOGIC ---
    // Make sure your Search button calls goToScholarships()
    window.goToScholarships = function() {
        let query = document.getElementById('homeSearchInput').value.toLowerCase();
        localStorage.setItem('searchQuery', query);
        window.location.href = 'scholarships.html';
    };

    // --- 3. SCHOLARSHIPS PAGE FILTERING ---
    if (window.location.pathname.includes('scholarships.html')) {
        let savedQuery = localStorage.getItem('searchQuery');
        if (savedQuery) {
            const searchInput = document.querySelector('.rounded-search');
            if (searchInput) searchInput.value = savedQuery;
            window.filterScholarships(savedQuery);
            localStorage.removeItem('searchQuery'); // Clear after use
        }
    }

    // --- 4. ABOUT PAGE SCROLL ANIMATIONS ---
    const aboutSections = document.querySelectorAll('#Mission, #Vision, #values');
    if (aboutSections.length > 0) {
        // Set initial state
        aboutSections.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(50px)";
            el.style.transition = "all 0.8s ease-out";
        });

        window.addEventListener('scroll', () => {
            aboutSections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (sectionTop < windowHeight - 100) {
                    section.style.opacity = "1";
                    section.style.transform = "translateY(0)";
                }
            });
        });
    }

    // --- 5. SIGN UP PAGE LOGIC ---
    const signupForm = document.querySelector('#signupForm');
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');

    // Password Visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            }
        });
    }

    // Signup Submission
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            const pwdValue = document.querySelector('#password').value;
            const fullNameInput = document.querySelector('#fullName') || document.querySelector('#fullname');
            
            if (pwdValue.length < 8) {
                e.preventDefault();
                alert("Password must be at least 8 characters long!");
            } else {
                e.preventDefault(); // Prevent immediate redirect to save data first
                const studentName = fullNameInput ? fullNameInput.value : "Student";
                localStorage.setItem('pulaStudentName', studentName); 
                alert("Welcome to the community, " + studentName + "! Account created successfully. Please login.");
                window.location.href = "login.html";
            }
        });
    }

    // --- 6. LOGIN PAGE LOGIC ---
    const loginForm = document.querySelector('#pulaLoginForm') || document.querySelector('#loginForm');
    const forgotPass = document.querySelector('#forgotPass');

    if (loginForm) {
        // Remember Me - Auto Fill
        const savedEmail = localStorage.getItem('rememberedEmail');
        const emailField = document.querySelector('#email');
        const rememberCheck = document.querySelector('#remember');

        if (savedEmail && emailField) {
            emailField.value = savedEmail;
            if (rememberCheck) rememberCheck.checked = true;
        }

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailField.value;
            const isRemembered = rememberCheck ? rememberCheck.checked : false;

            if (isRemembered) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            alert("Logging in as " + email + "...");
            window.location.href = "dashboard.html";
        });
    }

    if (forgotPass) {
        forgotPass.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Password reset instructions have been sent to your email!");
        });
    }

    // --- 7. APPLY NOW / DTEF / UK LOGIC ---
    const applyButtons = document.querySelectorAll('.scholarship-btn, #dtefApplyBtn, #ukApplyBtn');
    const prepNote = document.querySelector('#prep-note');

    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            let type = this.getAttribute('data-type');
            // Check specific IDs if data-type is missing
            if (!type && this.id === 'dtefApplyBtn') type = 'DTEF';
            if (!type && this.id === 'ukApplyBtn') type = 'International/UK';
            
            localStorage.setItem('selectedScholarship', type);
            localStorage.setItem('selectedScholarshipType', type);
            console.log("User selected: " + type);
        });
    });

    if (prepNote) {
        prepNote.addEventListener('mouseenter', () => {
            prepNote.style.backgroundColor = "rgba(255, 193, 7, 0.2)";
            prepNote.style.transition = "0.5s";
        });
        prepNote.addEventListener('mouseleave', () => {
            prepNote.style.backgroundColor = "transparent";
        });
    }

    // --- 8. DASHBOARD LOGIC ---
    const welcomeHeading = document.querySelector('.display-5');
    if (welcomeHeading && window.location.pathname.includes('dashboard')) {
        const hour = new Date().getHours();
        let greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
        const studentName = localStorage.getItem('pulaStudentName') || "Student";
        
        welcomeHeading.textContent = `${greeting}, ${studentName}!`;
    }

    // --- 9. HELP PAGE INTERACTION ---
    const faqArticles = document.querySelectorAll('#faq article');
    faqArticles.forEach(article => {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = "mt-2 pt-2 border-top small text-end";
        feedbackDiv.innerHTML = `
            Was this helpful? 
            <button class="btn btn-sm btn-outline-success border-0 py-0 px-1">Yes</button> 
            <button class="btn btn-sm btn-outline-secondary border-0 py-0 px-1">No</button>
        `;
        article.appendChild(feedbackDiv);
        
        feedbackDiv.addEventListener('click', (e) => {
            if(e.target.tagName === 'BUTTON') {
                feedbackDiv.innerHTML = '<span class="text-success italic">Thank you for your feedback!</span>';
            }
        });
    });
});