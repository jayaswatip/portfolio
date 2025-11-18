// Smooth scrolling and navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavLink();
    });
    
    // Function to update active navigation link
    function updateActiveNavLink() {
        const sections = ['home', 'about', 'projects', 'achievements'];
        let currentSection = 'home';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections for animation
    const animatedElements = document.querySelectorAll(
        '.stat-card, .info-card, .tech-card, .project-card, .achievement-card, .section-header'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
    
    // Button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.stat-card, .project-card, .achievement-card, .info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Tech badge hover effects
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Initial check for active nav link
    updateActiveNavLink();
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Console welcome message
    console.log('%cWelcome to Jayaswati\'s Portfolio! 👋', 'color: #22c5ce; font-size: 20px; font-weight: bold;');
    console.log('%cFeel free to explore the code!', 'color: #48bb78; font-size: 14px;');

    // Fetch live LeetCode stats and update the cards
    const LC_USERNAME = 'jayaswati_p';
    const LC_API = `https://leetcode-stats-api.vercel.app/${LC_USERNAME}`;

    fetch(LC_API)
      .then(res => res.json())
      .then(data => {
        try {
          const cards = document.querySelectorAll('.leetcode-section .stat-card');
          if (cards.length >= 3) {
            // 1) Problems Solved
            const totalSolved = Number(data.totalSolved) || 0;
            const cardSolved = cards[0];
            const numSolvedEl = cardSolved.querySelector('.stat-number');
            if (numSolvedEl) numSolvedEl.textContent = totalSolved.toLocaleString();

            // 2) Global Ranking
            const ranking = Number(data.ranking);
            const cardRank = cards[1];
            const numRankEl = cardRank.querySelector('.stat-number');
            const labelRankEl = cardRank.querySelector('.stat-label');
            if (numRankEl && !Number.isNaN(ranking)) numRankEl.textContent = `#${ranking.toLocaleString()}`;
            if (labelRankEl) labelRankEl.textContent = 'Global Rank';

            // 3) Current Streak (days)
            const streak = calculateStreakDays(data.submissionCalendar || {});
            const cardStreak = cards[2];
            const numStreakEl = cardStreak.querySelector('.stat-number');
            const labelStreakEl = cardStreak.querySelector('.stat-label');
            if (numStreakEl) numStreakEl.textContent = `${streak} day${streak === 1 ? '' : 's'}`;
            if (labelStreakEl) labelStreakEl.textContent = 'Current Streak';
          }
        } catch (err) {
          console.warn('Failed to update LeetCode stats UI:', err);
        }
      })
      .catch(() => {
        // Silently fail; UI stays with default placeholders
      });
});

// Compute current consecutive-day streak from a LeetCode submissionCalendar
// submissionCalendar is an object with unix-day-start (seconds) => count
function calculateStreakDays(submissionCalendar) {
    try {
        const DAY_SEC = 86400;
        // Normalize to a set of day indices (UTC days)
        const daysWithSubs = new Set(
            Object.entries(submissionCalendar)
                .filter(([, count]) => Number(count) > 0)
                .map(([sec]) => Math.floor(Number(sec) / DAY_SEC))
        );

        // Today in UTC day index
        const now = new Date();
        const utcDayIndex = Math.floor(now.getTime() / 1000 / DAY_SEC);

        let streak = 0;
        let cursor = utcDayIndex;
        // Count back consecutive days that exist in the set
        while (daysWithSubs.has(cursor)) {
            streak += 1;
            cursor -= 1;
        }
        return streak;
    } catch (e) {
        return 0;
    }
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate positions after resize
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }, 250);
});

// Prevent default behavior for demo buttons (you can replace with actual links)
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    // If it's an anchor with a real link, allow normal navigation
    if (btn.tagName && btn.tagName.toLowerCase() === 'a') {
        const href = btn.getAttribute('href') || '';
        if (href.startsWith('http') || href.startsWith('mailto:')) {
            return; // do not block real links
        }
    }

    const text = btn.textContent.trim();
    // Only block placeholder Demo buttons
    if (text.includes('Demo')) {
        e.preventDefault();
        console.log(`${text} button clicked - Add your actual link here!`);
    }
});
