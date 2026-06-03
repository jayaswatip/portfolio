document.addEventListener('DOMContentLoaded', function () {

    // ─── Navbar scroll effect ────────────────────────
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const sections = ['home', 'about', 'projects', 'achievements', 'certifications'];
        let current = 'home';
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const r = el.getBoundingClientRect();
                if (r.top <= 100 && r.bottom >= 100) current = id;
            }
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    }

    // ─── Smooth scroll ───────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.getElementById(this.getAttribute('href').substring(1));
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // ─── Scroll-in animations ────────────────────────
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.edu-card, .cgpa-card, .skills-card, .philosophy-card, ' +
        '.about-stats, .project-card, .achievement-card, .cert-card, .section-header'
    ).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity .55s ease, transform .55s ease';
        io.observe(el);
    });

    updateActiveNavLink();
});

// ─── Escape key closes modal ─────────────────────────
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCertModalDirect();
});

// ─── Certificate Modal Functions ─────────────────────
// (Certificate image data is loaded from cert-data.js)

function openCertModal(key) {
    var d = CERT_DATA[key];
    document.getElementById('certModalTitle').textContent = d.title;
    document.getElementById('certModalImg').src = d.img;
    document.getElementById('certModalName').textContent = d.name;
    document.getElementById('certModalDates').textContent = d.dates;
    document.getElementById('certModalVerify').href = d.verify;
    document.getElementById('certModalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCertModal(e) {
    if (e.target === document.getElementById('certModalOverlay')) {
        closeCertModalDirect();
    }
}

function closeCertModalDirect() {
    document.getElementById('certModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
}