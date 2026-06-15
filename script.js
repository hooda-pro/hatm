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

    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let W, H;

    let flippedCount = 0;
    let isProcessingPassword = false;
    let cardsRevealed = false;
    let scrollListenerActive = false;

    // ========== RESIZE ==========
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    // ========== BG PARTICLES ==========
    let particles = [];

    class Particle {
        constructor() { this.reset(true); }
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
            ctx.fillStyle = `rgba(212, 168, 83, ${alpha * 0.06})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ========== FLOATING EMOJIS ==========
    const emojis = ['✨', '🌟', '⭐', '💫', '🎵', '🎶'];
    function createFloatingEmoji() {
        const el = document.createElement('div');
        el.className = 'floating-emoji';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.top = Math.random() * 100 + '%';
        el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        el.style.animationDuration = (4 + Math.random() * 4) + 's';
        el.style.animationDelay = (Math.random() * 4) + 's';
        document.body.appendChild(el);
    }
    for (let i = 0; i < 8; i++) createFloatingEmoji();

    // ========== MOUSE GLOW ==========
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // ========== PASS BOX ENTRANCE ==========
    setTimeout(() => {
        passBox.style.opacity = '1';
        passBox.style.transform = 'translateY(0)';
    }, 200);

    // ========== PASSWORD ==========
    function checkPassword() {
        if (isProcessingPassword) return;
        isProcessingPassword = true;

        if (passwordInput.value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
            passBox.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            passBox.style.borderColor = 'rgba(46, 204, 113, 0.7)';
            passBox.style.boxShadow = '0 0 100px rgba(46, 204, 113, 0.3), 0 0 60px var(--shadow-gold)';
            passBox.style.transform = 'scale(1.05)';
            passBox.querySelector('.pass-icon').textContent = '✅';
            passBox.querySelector('.pass-icon').style.animation = 'pulse 0.5s ease-in-out 3';

            for (let i = 0; i < 20; i++) {
                const spark = document.createElement('div');
                spark.textContent = '✨';
                const rect = passBox.getBoundingClientRect();
                spark.style.cssText = `
                    position: fixed; font-size: 1.2rem; pointer-events: none; z-index: 1001;
                    left: ${rect.left + rect.width/2}px;
                    top: ${rect.top + rect.height/2}px;
                    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                document.body.appendChild(spark);
                const angle = (i / 20) * Math.PI * 2;
                const dist = 100 + Math.random() * 200;
                requestAnimationFrame(() => {
                    spark.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0)`;
                    spark.style.opacity = '0';
                });
                setTimeout(() => spark.remove(), 1500);
            }

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
                    startCardsObserver();
                    isProcessingPassword = false;
                }, 700);
            }, 600);
        } else {
            errorMsg.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            passBox.style.animation = 'none';
            void passBox.offsetHeight;
            passBox.style.animation = 'shake 0.6s ease';
            passBox.style.borderColor = 'rgba(231, 76, 60, 0.5)';
            setTimeout(() => {
                errorMsg.classList.add('hidden');
                passBox.style.animation = '';
                passBox.style.borderColor = '';
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

        setTimeout(() => typewriterEffect(), 600);

        setTimeout(() => {
            nextHint.style.display = 'flex';
            nextHint.style.animation = 'fadeInUp 0.8s ease forwards, bounce 2s 0.8s infinite';
        }, 2200);

        startHeroConfetti();
    }

    // ========== TYPEWRITER EFFECT ==========
    function typewriterEffect() {
        const text = 'كل سنة وانت طيب يا قلبي 🤍';
        mainTitle.textContent = '';
        mainTitle.classList.add('typewriter');
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            span.style.animationDelay = i * 0.04 + 's';
            mainTitle.appendChild(span);
        });
    }

    // ========== HERO CONFETTI ==========
    let heroConfettiRunning = true;
    function startHeroConfetti() {
        const cCanvas = document.createElement('canvas');
        cCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:998';
        document.body.appendChild(cCanvas);
        const cCtx = cCanvas.getContext('2d');
        let cW, cH, cPieces = [];

        function cResize() { cW = cCanvas.width = window.innerWidth; cH = cCanvas.height = window.innerHeight; }
        cResize();
        window.addEventListener('resize', cResize);

        class CPiece {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * cW;
                this.y = Math.random() * cH - cH;
                this.w = 4 + Math.random() * 5;
                this.h = 3 + Math.random() * 4;
                this.c = ['#d4a853','#c08497','#5fa8a0','#f0d080','#e74c3c','#2ecc71','#9b59b6','#e67e22'][Math.floor(Math.random()*8)];
                this.s = 1.5 + Math.random() * 2;
                this.wind = (Math.random() - 0.5) * 0.4;
                this.r = Math.random() * 360;
                this.rs = (Math.random() - 0.5) * 4;
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

        for (let i = 0; i < 80; i++) cPieces.push(new CPiece());

        function cLoop() {
            if (!heroConfettiRunning) { cCanvas.remove(); return; }
            cCtx.clearRect(0, 0, cW, cH);
            cPieces.forEach(p => { p.u(); p.d(); });
            requestAnimationFrame(cLoop);
        }
        cLoop();
    }

    // ========== CARDS OBSERVER ==========
    function revealCards() {
        if (cardsRevealed) return;
        cardsRevealed = true;
        cardsSection.classList.add('visible');
        setTimeout(() => showCardsOneByOne(), 300);
    }

    function showCardsOneByOne() {
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
                card.style.animation = 'cardSway 6s ease-in-out infinite';
                card.style.animationDelay = (i * 1.5) + 's';
            }, i * 300);
        });
    }

    function startCardsObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !cardsRevealed) {
                    revealCards();
                    observer.unobserve(cardsSection);
                }
            });
        }, { threshold: 0.05, rootMargin: '50px' });

        setTimeout(() => {
            observer.observe(cardsSection);
        }, 500);

        // Scroll fallback: detect when hero is scrolled past
        function scrollCheck() {
            if (cardsRevealed) { window.removeEventListener('scroll', scrollCheck); return; }
            const heroBottom = hero.getBoundingClientRect().bottom;
            if (heroBottom < window.innerHeight * 0.3) {
                revealCards();
                window.removeEventListener('scroll', scrollCheck);
            }
        }
        window.addEventListener('scroll', scrollCheck, { passive: true });
    }

    // Next hint click scrolls to cards
    nextHint.addEventListener('click', () => {
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!cardsRevealed) revealCards();
    });

    // ========== CARDS FLIP ==========
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            if (this.classList.contains('flipped')) return;
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.querySelector('.card-front').style.setProperty('--mx', x + '%');
            this.querySelector('.card-front').style.setProperty('--my', y + '%');
        });

        card.addEventListener('click', function(e) {
            if (this.classList.contains('flipped')) return;
            this.classList.add('flipped');
            flippedCount++;
            updateProgress();

            const rect = this.getBoundingClientRect();
            const cx = e.clientX || rect.left + rect.width/2;
            const cy = e.clientY || rect.top + rect.height/2;
            for (let i = 0; i < 6; i++) {
                const s = document.createElement('div');
                s.textContent = '✨';
                s.style.cssText = `
                    position: fixed; font-size: 1rem; pointer-events: none; z-index: 999;
                    left: ${cx}px; top: ${cy}px;
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                document.body.appendChild(s);
                const a = (i / 6) * Math.PI * 2 + (Math.random() - 0.5);
                const d = 60 + Math.random() * 80;
                requestAnimationFrame(() => {
                    s.style.transform = `translate(${Math.cos(a)*d}px, ${Math.sin(a)*d}px) scale(0) rotate(${Math.random()*360}deg)`;
                    s.style.opacity = '0';
                });
                setTimeout(() => s.remove(), 1000);
            }

            const index = parseInt(this.dataset.index);
            showModal(index);
            if (flippedCount === cards.length) {
                setTimeout(onAllCardsFlipped, 1000);
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

        for (let i = 0; i < 30; i++) {
            const e = document.createElement('div');
            e.textContent = ['🎉','🎊','✨','💫','⭐'][Math.floor(Math.random()*5)];
            e.style.cssText = `
                position:fixed;font-size:1.5rem;pointer-events:none;z-index:999;
                left:${50 + (Math.random()-0.5)*60}%;top:40%;
                transition:all 1.5s cubic-bezier(0.4,0,0.2,1);
            `;
            document.body.appendChild(e);
            requestAnimationFrame(() => {
                e.style.transform = `translate(${(Math.random()-0.5)*400}px, ${-200 - Math.random()*300}px) scale(0)`;
                e.style.opacity = '0';
            });
            setTimeout(() => e.remove(), 2000);
        }

        setTimeout(() => {
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-100px) scale(0.3) rotateY(40deg)';
                }, i * 100);
            });

            setTimeout(() => {
                cardsSection.style.transition = 'all 0.6s ease';
                cardsSection.style.opacity = '0';
                cardsSection.style.transform = 'translateY(-50px)';
                setTimeout(() => {
                    cardsSection.classList.remove('visible');
                    cardsSection.classList.add('cards-section-hidden');
                    cardsSection.style.opacity = '';
                    cardsSection.style.transform = '';
                    showCTA();
                }, 600);
            }, cards.length * 100 + 500);
        }, 1800);
    }

    // ========== SHOW CTA ==========
    function showCTA() {
        ctaSection.classList.remove('hidden');
        setTimeout(() => {
            ctaSection.classList.add('visible');
            ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        for (let i = 0; i < 15; i++) {
            const s = document.createElement('div');
            s.textContent = '✨';
            s.style.cssText = `
                position:fixed;font-size:1.2rem;pointer-events:none;z-index:999;
                left:${20 + Math.random()*60}%;top:${20 + Math.random()*60}%;
                animation:sparklePop 1s ease forwards;
            `;
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 1500);
        }
    }

    // ========== CTA CLICK ==========
    ctaBtn.addEventListener('mousedown', () => {
        ctaBtn.style.transform = 'scale(0.9) rotate(-3deg)';
    });

    ctaBtn.addEventListener('mouseup', () => {
        ctaBtn.style.transform = 'scale(1.08) rotate(-2deg)';
    });

    ctaBtn.addEventListener('click', () => {
        ctaBtn.textContent = 'يلا بينا 😈';
        ctaBtn.style.transform = 'scale(0.85) rotate(-5deg)';

        for (let i = 0; i < 30; i++) {
            const e = document.createElement('div');
            e.textContent = ['🎉','🎊','💥','🔥','⭐'][Math.floor(Math.random()*5)];
            e.style.cssText = `
                position:fixed;font-size:1.5rem;pointer-events:none;z-index:9999;
                left:${window.innerWidth/2}px;top:${window.innerHeight/2}px;
                transition:all 1s cubic-bezier(0.4,0,0.2,1);
            `;
            document.body.appendChild(e);
            const a = (i / 30) * Math.PI * 2;
            const d = 100 + Math.random() * 200;
            requestAnimationFrame(() => {
                e.style.transform = `translate(${Math.cos(a)*d}px, ${Math.sin(a)*d}px) scale(0) rotate(${Math.random()*720}deg)`;
                e.style.opacity = '0';
            });
            setTimeout(() => e.remove(), 1200);
        }

        setTimeout(() => {
            window.location.href = 'page2.html';
        }, 500);
    });

    // ========== MODAL ==========
    const photoTitles = ['ذكرى أولى 🎯', 'ذكرى ثانية 🎯', 'ذكرى ثالثة 🎯', 'ذكرى رابعة 🎯'];

    function showModal(index) {
        const frame = modal.querySelector('.modal-photo-frame');
        frame.style.animation = 'none';
        void frame.offsetHeight;
        const photoNum = index + 1;
        frame.innerHTML = `
            <div style="width:100%;height:100%;overflow:hidden;border-radius:18px;">
                <img src="photo-${photoNum}.jpg" alt="${photoTitles[index]}"
                     style="width:100%;height:100%;object-fit:cover;display:block;"
                     onerror="this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:0.5rem;\'><span style=\'font-size:3rem;\'>🖼️</span><p style=\'color:var(--text-secondary);\'>الصورة مش موجودة</p></div>'">
            </div>
        `;
        frame.style.animation = 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
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
