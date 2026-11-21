
// Page navigation
const pageViews = document.querySelectorAll(".page-view");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const menuToggle = document.getElementById("menuToggle");

function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    sidebarBackdrop.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

function showPage(pageId) {
    const activePage = document.getElementById(pageId);

    if (!activePage || !activePage.classList.contains("page-view")) {
        return false;
    }

    pageViews.forEach(page => {
        const isActive = page === activePage;
        page.classList.toggle("hidden", !isActive);
        page.setAttribute("aria-hidden", String(!isActive));
    });

    sidebarLinks.forEach(link => {
        const isActive = link.dataset.page === pageId;
        link.classList.toggle("bg-blue-600", isActive);
        link.classList.toggle("text-white", isActive);
        link.classList.toggle("text-slate-600", !isActive);
        link.classList.toggle("dark:text-slate-300", !isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
    });

    if (window.location.hash !== `#${pageId}`) {
        window.history.pushState(null, "", `#${pageId}`);
    }

    window.scrollTo(0, 0);
    closeSidebar();
    return true;
}

document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const pageId = link.getAttribute("href").slice(1);
    const page = document.getElementById(pageId);
    if (page && page.classList.contains("page-view")) {
        event.preventDefault();
        showPage(pageId);
    }
});

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    sidebar.classList.toggle("-translate-x-full", isOpen);
    sidebarBackdrop.classList.toggle("hidden", isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-bars"></i>'
        : '<i class="fa-solid fa-xmark"></i>';
});

sidebarBackdrop.addEventListener("click", closeSidebar);
window.addEventListener("popstate", () => {
    const pageId = window.location.hash.slice(1) || "home";
    if (!showPage(pageId)) showPage("home");
});

const initialPage = window.location.hash.slice(1) || "home";
if (!showPage(initialPage)) showPage("home");

// Dark Mode
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("portfolio-theme") === "dark") {
    document.documentElement.classList.add("dark");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun w-5 text-center"></i><span>Toggle theme</span>';
}

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    const isDark = document.documentElement.classList.contains("dark");

    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");

    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun w-5 text-center"></i><span>Toggle theme</span>'
        : '<i class="fa-solid fa-moon w-5 text-center"></i><span>Toggle theme</span>';
});

// Project Filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("bg-blue-600", "text-white");
            btn.classList.add("bg-slate-200", "dark:bg-slate-800");
        });

        button.classList.add("bg-blue-600", "text-white");
        button.classList.remove("bg-slate-200", "dark:bg-slate-800");

        projectCards.forEach(card => {
            const matches = filter === "all" ||
                card.dataset.category === filter;

            card.classList.toggle("hidden", !matches);
        });
    });
});

// Contact Form Validation
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name.length < 2) {
        formMessage.textContent = "Please enter a valid name.";
        formMessage.className = "text-sm text-red-500";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.className = "text-sm text-red-500";
        return;
    }

    if (message.length < 10) {
        formMessage.textContent =
            "Your message must contain at least 10 characters.";
        formMessage.className = "text-sm text-red-500";
        return;
    }

    formMessage.textContent =
        "Your details are valid. This demonstration form does not send messages yet.";

    formMessage.className = "text-sm text-green-600";

    contactForm.reset();
});

// Scroll to Top Button
const scrollTopButton = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
    scrollTopButton.classList.toggle("hidden", window.scrollY < 400);
});

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Automatic Copyright Year
document.getElementById("year").textContent = new Date().getFullYear();
