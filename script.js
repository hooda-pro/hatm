document.addEventListener('DOMContentLoaded', () => {

    const password = 'Haitham';
    const overlay = document.getElementById('passwordOverlay');
    const mainContent = document.getElementById('mainContent');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');
    const cards = document.querySelectorAll('.card');
    const modal = document.getElementById('photoModal');
    const modalClose = document.querySelector('.modal-close');
    const ctaBtn = document.getElementById('ctaBtn');
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    // === PASSWORD ===
    function checkPassword() {
        if (passwordInput.value.trim() === password) {
            overlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            document.body.style.overflow = 'auto';
            startConfetti();
        } else {
            errorMsg.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            setTimeout(() => errorMsg.classList.add('hidden'), 2000);
        }
    }

    loginBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    // === CONFETTI ===
    let confettiPieces = [];
    let confettiRunning = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class ConfettiPiece {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.w = 6 + Math.random() * 6;
            this.h = 4 + Math.random() * 4;
            this.color = ['#d4a853', '#c08497', '#5fa8a0', '#f0d080', '#e74c3c', '#2ecc71', '#9b59b6', '#e67e22'][Math.floor(Math.random() * 8)];
            this.rot = Math.random() * 360;
            this.speed = 1.5 + Math.random() * 2;
            this.wind = (Math.random() - 0.5) * 0.5;
            this.rotSpeed = (Math.random() - 0.5) * 4;
        }
        update() {
            this.y += this.speed;
            this.x += this.wind;
            this.rot += this.rotSpeed;
            if (this.y > canvas.height + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
            ctx.restore();
        }
    }

    for (let i = 0; i < 120; i++) confettiPieces.push(new ConfettiPiece());

    function animateConfetti() {
        if (!confettiRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiPieces.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateConfetti);
    }

    animateConfetti();

    // === CARDS FLIP ===
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            const index = this.dataset.index;
            showModal(index);
        });
    });

    // === MODAL ===
    const photoLabels = ['📸 صورة ١', '📸 صورة ٢', '📸 صورة ٣', '📸 صورة ٤'];

    function showModal(index) {
        const frame = modal.querySelector('.modal-photo-frame');
        frame.innerHTML = `
            <div style="text-align:center;padding:2rem;">
                <div style="font-size:4rem;margin-bottom:1rem;">🖼️</div>
                <h3 style="color:var(--accent-gold);font-size:1.5rem;margin-bottom:0.5rem;">${photoLabels[index]}</h3>
                <p style="color:var(--text-secondary);">حط الصورة هنا بدل النص ده</p>
            </div>
        `;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // === CTA BUTTON ===
    ctaBtn.addEventListener('click', () => {
        window.location.href = 'page2.html';
    });

    // === SMOOTH SCROLL ===
    document.querySelector('.scroll-hint').addEventListener('click', () => {
        document.getElementById('cardsSection').scrollIntoView({ behavior: 'smooth' });
    });

});
