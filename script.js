document.addEventListener('DOMContentLoaded', () => {

    const PASSWORD = 'Haitham';
    const overlay = document.getElementById('passwordOverlay');
    const mainContent = document.getElementById('mainContent');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');
    const cards = document.querySelectorAll('.card');
    const modal = document.getElementById('photoModal');
    const modalClose = document.querySelector('.modal-close');
    const ctaBtn = document.getElementById('ctaBtn');
    const ctaSection = document.getElementById('ctaSection');
    const nextHint = document.getElementById('nextHint');
    const cardsSection = document.getElementById('cardsSection');
    const cardsComplete = document.getElementById('cardsComplete');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressText');
    const hero = document.getElementById('hero');
    const passBox = document.querySelector('.password-box');

    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let W, H;

    let flippedCount = 0;
    let isProcessingPassword = false;

    // ========== RESIZE ==========
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ========== BG PARTICLES ==========
    let particles = [];

    class Particle {
        constructor() {
            this.reset(true);
        }
        reset(init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 10;
            this.r = 1 + Math.random() * 2.5;
            this.speed = 0.3 + Math.random() * 0.8;
            this.wind = (Math.random() - 0.5) * 0.3;
            this.alpha = 0.2 + Math.random() * 0.5;
            this.pulseSpeed = 0.01 + Math.random() * 0.02;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        update() {
            this.y -= this.speed;
            this.x += this.wind;
            if (this.y < -20) this.reset();
        }
        draw() {
            const alpha = this.alpha * (0.7 + 0.3 * Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 83, ${alpha * 0.5})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 83, ${alpha * 0.08})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ========== PASS BOX ENTRANCE ==========
    setTimeout(() => {
        passBox.style.opacity = '1';
        passBox.style.transform = 'translateY(0)';
    }, 300);

    // ========== PASSWORD ==========
    function checkPassword() {
        if (isProcessingPassword) return;
        isProcessingPassword = true;

        if (passwordInput.value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
            passBox.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            passBox.style.borderColor = 'rgba(46, 204, 113, 0.6)';
            passBox.style.boxShadow = '0 0 80px rgba(46, 204, 113, 0.2), 0 0 40px var(--shadow-gold)';
            passBox.querySelector('.pass-icon').textContent = '✅';

            setTimeout(() => {
                overlay.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                overlay.style.opacity = '0';
                overlay.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    overlay.style.opacity = '';
                    overlay.style.transform = '';
                    mainContent.classList.remove('hidden');
                    document.body.style.overflow = 'auto';
                    startHeroAnimation();
                    isProcessingPassword = false;
                }, 700);
            }, 500);
        } else {
            errorMsg.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            passBox.style.animation = 'none';
            void passBox.offsetHeight;
            passBox.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                errorMsg.classList.add('hidden');
                passBox.style.animation = '';
                isProcessingPassword = false;
            }, 2500);
        }
    }

    loginBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    passwordInput.addEventListener('focus', () => {
        passBox.style.borderColor = 'var(--border-glow)';
        passBox.style.boxShadow = '0 0 80px var(--shadow-gold), 0 20px 60px rgba(0,0,0,0.6)';
    });

    passwordInput.addEventListener('blur', () => {
        passBox.style.borderColor = 'var(--border-glow)';
        passBox.style.boxShadow = '0 0 60px var(--shadow-gold), 0 20px 60px rgba(0,0,0,0.6)';
    });

    // ========== HERO ANIMATION ==========
    function startHeroAnimation() {
        const heroContent = hero.querySelector('.hero-content');
        heroContent.style.animation = 'none';
        void heroContent.offsetHeight;
        heroContent.style.animation = 'heroEntrance 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';

        setTimeout(() => {
            nextHint.style.display = 'flex';
            nextHint.style.animation = 'fadeInUp 0.8s ease forwards, bounce 2s 0.8s infinite';
        }, 1500);
    }

    // ========== HERO SCROLL ==========
    nextHint.addEventListener('click', () => {
        cardsSection.classList.remove('hidden');
        cardsSection.style.animation = 'fadeInUp 0.8s ease forwards';
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => showCardsOneByOne(), 500);
    });

    // ========== CARDS APPEAR ==========
    function showCardsOneByOne() {
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, i * 250);
        });
    }

    // ========== CARDS FLIP ==========
    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('flipped')) return;
            this.classList.add('flipped');
            flippedCount++;
            updateProgress();
            const index = parseInt(this.dataset.index);
            showModal(index);
            if (flippedCount === cards.length) {
                setTimeout(onAllCardsFlipped, 800);
            }
        });
    });

    function updateProgress() {
        const pct = (flippedCount / cards.length) * 100;
        progressFill.style.setProperty('--pct', pct + '%');
        progressText.textContent = `${flippedCount} / ${cards.length}`;
    }

    // ========== ALL CARDS FLIPPED ==========
    function onAllCardsFlipped() {
        cardsComplete.classList.remove('hidden');
        cardsComplete.style.animation = 'scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';

        setTimeout(() => {
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-80px) scale(0.5) rotateY(30deg)';
                }, i * 120);
            });

            setTimeout(() => {
                cardsSection.style.transition = 'all 0.6s ease';
                cardsSection.style.opacity = '0';
                cardsSection.style.transform = 'translateY(-50px)';
                setTimeout(() => {
                    cardsSection.classList.add('hidden');
                    cardsSection.style.opacity = '';
                    cardsSection.style.transform = '';
                    showCTA();
                }, 600);
            }, cards.length * 120 + 500);

        }, 1500);
    }

    // ========== SHOW CTA ==========
    function showCTA() {
        ctaSection.classList.remove('hidden');
        ctaSection.style.animation = 'fadeInUp 0.8s ease forwards';
        setTimeout(() => ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }

    ctaBtn.addEventListener('click', () => {
        ctaBtn.style.transform = 'scale(0.85) rotate(-5deg)';
        ctaBtn.textContent = 'يلا بينا 😈';
        setTimeout(() => {
            window.location.href = 'page2.html';
        }, 400);
    });

    // ========== MODAL ==========
    const photoTitles = ['ذكرى أولى 🎯', 'ذكرى ثانية 🎯', 'ذكرى ثالثة 🎯', 'ذكرى رابعة 🎯'];

    function showModal(index) {
        const frame = modal.querySelector('.modal-photo-frame');
        frame.style.animation = 'none';
        void frame.offsetHeight;
        frame.innerHTML = `
            <div class="modal-photo-inner">
                <div class="modal-icon">🖼️</div>
                <h3 class="modal-photo-title">${photoTitles[index]}</h3>
                <p class="modal-photo-sub">حط الصورة هنا بدل النص ده</p>
            </div>
        `;
        frame.style.animation = 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.animation = '';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

});
