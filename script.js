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
    const mainTitle = document.querySelector('.main-title');
    const balloons = document.querySelectorAll('.balloon');

    const isMobile = window.innerWidth <= 768;

    // ========== BALLOON DELAYS (JS fix for mobile) ==========
    balloons.forEach((b, i) => {
        b.style.animationDelay = `${i * 0.15}s, ${0.8 + i * 0.15}s`;
    });

    // ========== BG PARTICLES (fewer on mobile) ==========
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let particles = [];
    const particleCount = isMobile ? 40 : 100;

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 10;
            this.r = 1 + Math.random() * (isMobile ? 1.5 : 2.5);
            this.speed = 0.3 + Math.random() * 0.6;
            this.wind = (Math.random() - 0.5) * 0.2;
            this.alpha = 0.15 + Math.random() * 0.3;
        }
        update() {
            this.y -= this.speed;
            this.x += this.wind;
            if (this.y < -20) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 83, ${this.alpha * 0.6})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ========== PASSWORD BOX ENTRANCE ==========
    if (!sessionStorage.getItem('auth')) {
        setTimeout(() => {
            passBox.style.opacity = '1';
            passBox.style.transform = 'translateY(0)';
        }, 200);
    }

    // ========== PASSWORD ==========
    let isProcessingPassword = false;
    let flippedCount = 0;
    let cardsRevealed = false;

    function checkPassword() {
        if (isProcessingPassword) return;
        isProcessingPassword = true;

        if (passwordInput.value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
            sessionStorage.setItem('auth', 'true');

            passBox.style.transition = 'all 0.4s ease';
            passBox.style.borderColor = 'rgba(46, 204, 113, 0.6)';
            passBox.style.boxShadow = '0 0 60px rgba(46, 204, 113, 0.2)';
            passBox.style.transform = 'scale(1.03)';
            passBox.querySelector('.pass-icon').textContent = '✅';

            setTimeout(() => {
                overlay.style.transition = 'opacity 0.5s ease';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    overlay.style.opacity = '';
                    mainContent.classList.remove('hidden');
                    document.body.style.overflow = 'auto';
                    startHeroAnimation();
                    startCardsObserver();
                    isProcessingPassword = false;
                }, 500);
            }, 400);
        } else {
            errorMsg.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            passBox.style.animation = 'none';
            void passBox.offsetHeight;
            passBox.style.animation = 'shake 0.4s ease';
            passBox.style.borderColor = 'rgba(231, 76, 60, 0.4)';
            setTimeout(() => {
                errorMsg.classList.add('hidden');
                passBox.style.animation = '';
                passBox.style.borderColor = '';
                isProcessingPassword = false;
            }, 2000);
        }
    }

    loginBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    if (sessionStorage.getItem('auth')) {
        overlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        document.body.style.overflow = 'auto';
        startHeroAnimation();
        startCardsObserver();
    }

    // ========== HERO ==========
    function startHeroAnimation() {
        const heroContent = hero.querySelector('.hero-content');
        heroContent.style.animation = 'heroEntrance 0.8s ease forwards';
        setTimeout(() => typewriterEffect(), 400);
        setTimeout(() => {
            nextHint.style.display = 'flex';
            nextHint.style.animation = 'fadeInUp 0.6s ease forwards';
            setTimeout(() => {
                nextHint.style.animation = 'fadeInUp 0.6s ease forwards, float 2s ease-in-out 0.6s infinite';
            }, 600);
        }, 2000);
        startConfetti();
    }

    function typewriterEffect() {
        const text = 'كل سنة وانت طيب يا قلبي 🤍';
        mainTitle.textContent = '';
        mainTitle.classList.add('typewriter');
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            span.style.animationDelay = i * 0.035 + 's';
            mainTitle.appendChild(span);
        });
    }

    // ========== CONFETTI ==========
    function startConfetti() {
        const cCanvas = document.createElement('canvas');
        cCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:998';
        document.body.appendChild(cCanvas);
        const cCtx = cCanvas.getContext('2d');
        let cW, cH, cPieces = [];
        const cCount = isMobile ? 40 : 70;

        function cResize() { cW = cCanvas.width = window.innerWidth; cH = cCanvas.height = window.innerHeight; }
        cResize();
        window.addEventListener('resize', cResize);

        class C {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * cW;
                this.y = Math.random() * cH - cH;
                this.w = 3 + Math.random() * 4;
                this.h = 2 + Math.random() * 3;
                this.c = ['#d4a853','#c08497','#5fa8a0','#f0d080','#e74c3c','#2ecc71','#9b59b6'][Math.floor(Math.random()*7)];
                this.s = 1 + Math.random() * 1.5;
                this.wind = (Math.random() - 0.5) * 0.3;
                this.r = Math.random() * 360;
                this.rs = (Math.random() - 0.5) * 3;
            }
            u() {
                this.y += this.s; this.x += this.wind; this.r += this.rs;
                if (this.y > cH + 20) this.reset();
            }
            d() {
                cCtx.save();
                cCtx.translate(this.x, this.y);
                cCtx.rotate(this.r * Math.PI / 180);
                cCtx.fillStyle = this.c;
                cCtx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
                cCtx.restore();
            }
        }

        for (let i = 0; i < cCount; i++) cPieces.push(new C());

        (function loop() {
            cCtx.clearRect(0, 0, cW, cH);
            cPieces.forEach(p => { p.u(); p.d(); });
            requestAnimationFrame(loop);
        })();
    }

    // ========== CARDS OBSERVER ==========
    function revealCards() {
        if (cardsRevealed) return;
        cardsRevealed = true;
        cardsSection.classList.add('visible');
        setTimeout(() => {
            cards.forEach((card, i) => {
                setTimeout(() => card.classList.add('visible'), i * 200);
            });
        }, 300);
    }

    function startCardsObserver() {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !cardsRevealed) {
                revealCards();
                observer.unobserve(cardsSection);
            }
        }, { threshold: 0.05 });

        setTimeout(() => observer.observe(cardsSection), 500);

        const scrollCheck = () => {
            if (cardsRevealed) { window.removeEventListener('scroll', scrollCheck); return; }
            if (hero.getBoundingClientRect().bottom < window.innerHeight * 0.3) revealCards();
        };
        window.addEventListener('scroll', scrollCheck, { passive: true });
    }

    nextHint.addEventListener('click', () => {
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!cardsRevealed) revealCards();
    });

    // ========== CARDS FLIP ==========
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (this.classList.contains('flipped')) return;
            this.classList.add('flipped');
            flippedCount++;
            updateProgress();

            // Sparkle burst
            const rect = this.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            for (let i = 0; i < (isMobile ? 3 : 6); i++) {
                const s = document.createElement('div');
                s.textContent = '✨';
                s.style.cssText = `position:fixed;font-size:0.8rem;pointer-events:none;z-index:999;left:${cx}px;top:${cy}px;transition:all 0.6s ease;`;
                document.body.appendChild(s);
                const a = (i / (isMobile ? 3 : 6)) * Math.PI * 2;
                const d = 40 + Math.random() * 50;
                requestAnimationFrame(() => {
                    s.style.transform = `translate(${Math.cos(a)*d}px, ${Math.sin(a)*d}px) scale(0)`;
                    s.style.opacity = '0';
                });
                setTimeout(() => s.remove(), 700);
            }

            showModal(parseInt(this.dataset.index));
            if (flippedCount === cards.length) setTimeout(onAllCardsFlipped, 1000);
        });
    });

    function updateProgress() {
        const pct = (flippedCount / cards.length) * 100;
        progressFill.style.setProperty('--pct', pct + '%');
        progressText.textContent = `${flippedCount} / ${cards.length}`;
    }

    // ========== ALL FLIPPED ==========
    function onAllCardsFlipped() {
        cardsComplete.classList.remove('hidden');
        cardsComplete.style.animation = 'scaleIn 0.5s ease forwards';

        for (let i = 0; i < (isMobile ? 15 : 30); i++) {
            const e = document.createElement('div');
            e.textContent = ['🎉','🎊','✨','💫','⭐'][Math.floor(Math.random()*5)];
            e.style.cssText = `position:fixed;font-size:1.2rem;pointer-events:none;z-index:999;left:${40 + Math.random()*20}%;top:40%;transition:all 1.2s ease;`;
            document.body.appendChild(e);
            requestAnimationFrame(() => {
                e.style.transform = `translate(${(Math.random()-0.5)*300}px, ${-150 - Math.random()*200}px) scale(0)`;
                e.style.opacity = '0';
            });
            setTimeout(() => e.remove(), 1500);
        }

        setTimeout(() => {
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-60px) scale(0.4)';
                }, i * 80);
            });

            setTimeout(() => {
                cardsSection.style.transition = 'all 0.5s ease';
                cardsSection.style.opacity = '0';
                setTimeout(() => {
                    cardsSection.classList.remove('visible');
                    cardsSection.classList.add('cards-section-hidden');
                    cardsSection.style.opacity = '';
                    showCTA();
                }, 500);
            }, cards.length * 80 + 400);
        }, 1500);
    }

    // ========== CTA ==========
    function showCTA() {
        ctaSection.classList.remove('hidden');
        setTimeout(() => {
            ctaSection.classList.add('visible');
            ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    ctaBtn.addEventListener('click', () => {
        ctaBtn.textContent = 'يلا بينا 😈';
        ctaBtn.style.transform = 'scale(0.9)';
        setTimeout(() => { window.location.href = 'page2.html'; }, 400);
    });

    // ========== MODAL ==========
    const photoTitles = ['ذكرى أولى 🎯', 'ذكرى ثانية 🎯', 'ذكرى ثالثة 🎯', 'ذكرى رابعة 🎯'];

    function showModal(index) {
        const frame = modal.querySelector('.modal-photo-frame');
        frame.style.animation = 'none';
        void frame.offsetHeight;
        const photoNum = index + 1;
        frame.innerHTML = `
            <img src="photo-${photoNum}.jpg" alt="${photoTitles[index]}"
                 onerror="this.outerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:0.5rem;background:#0a0a0f;border-radius:14px;\'><span style=\'font-size:3rem;\'>🖼️</span><p style=\'color:var(--text-secondary);font-size:0.9rem;\'>الصورة مش موجودة</p></div>'">
        `;
        frame.style.animation = 'scaleIn 0.35s ease forwards';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.animation = 'fadeOut 0.2s ease forwards';
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.animation = '';
            document.body.style.overflow = 'auto';
        }, 200);
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

});
