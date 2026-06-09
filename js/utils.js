/* ==========================================================================
   FSSAI Virtual Microbiology Lab - Audio Engine & Canvas Utilities
   ========================================================================= */

// Web Audio API Synthesizer for high-fidelity interactive sound effects
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.microscopeOsc = null;
        this.microscopeGain = null;
        this.steamNoiseNode = null;
        this.steamGain = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Play a crisp click for regular interactions
    playClick() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // Play pipette suction / release whoosh
    playPipette(isAspirating) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const duration = 0.3;
        
        // Noise buffer
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        
        const gain = this.ctx.createGain();

        if (isAspirating) {
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.exponentialRampToValueAtTime(1000, now + duration);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.exponentialRampToValueAtTime(0.06, now + duration - 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        } else {
            filter.frequency.setValueAtTime(1200, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + duration);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        }

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    }

    // Play success sound
    playSuccess() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            
            gain.gain.setValueAtTime(0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
        });
    }

    // Play error buzzer
    playError() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(130, now);
        
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(133, now); // Detuned for harsh beat frequency

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
    }

    // Start a continuous low-level hum for microscope alignment
    startMicroscopeHum(focusAccuracy) {
        this.init();
        if (!this.ctx) return;
        if (this.microscopeOsc) return;

        const now = this.ctx.currentTime;
        this.microscopeOsc = this.ctx.createOscillator();
        this.microscopeGain = this.ctx.createGain();

        this.microscopeOsc.type = 'sine';
        // Base frequency 100Hz, modulated by focus alignment
        this.microscopeOsc.frequency.setValueAtTime(100 + (focusAccuracy * 150), now);
        
        this.microscopeGain.gain.setValueAtTime(0.02, now);

        this.microscopeOsc.connect(this.microscopeGain);
        this.microscopeGain.connect(this.ctx.destination);
        this.microscopeOsc.start(now);
    }

    // Adjust focus hum pitch/volume based on user adjustments
    updateMicroscopeHum(focusAccuracy) {
        if (!this.ctx || !this.microscopeOsc || !this.microscopeGain) return;
        const now = this.ctx.currentTime;
        // Sharper pitch and slight volume boost when fully focused
        this.microscopeOsc.frequency.setTargetAtTime(120 + (focusAccuracy * 160), now, 0.05);
        this.microscopeGain.gain.setTargetAtTime(0.01 + (focusAccuracy * 0.03), now, 0.05);
    }

    stopMicroscopeHum() {
        if (this.microscopeOsc) {
            try {
                this.microscopeOsc.stop();
            } catch(e){}
            this.microscopeOsc = null;
            this.microscopeGain = null;
        }
    }

    // Start autoclave venting steam hiss
    startSteamHiss() {
        this.init();
        if (!this.ctx) return;
        if (this.steamNoiseNode) return;

        const now = this.ctx.currentTime;
        
        // Generate continuous white noise
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds looping
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        this.steamNoiseNode = this.ctx.createBufferSource();
        this.steamNoiseNode.buffer = buffer;
        this.steamNoiseNode.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(1.0, now);

        this.steamGain = this.ctx.createGain();
        this.steamGain.gain.setValueAtTime(0.1, now);

        this.steamNoiseNode.connect(filter);
        filter.connect(this.steamGain);
        this.steamGain.connect(this.ctx.destination);

        this.steamNoiseNode.start(now);
    }

    stopSteamHiss() {
        if (this.steamNoiseNode) {
            try {
                this.steamNoiseNode.stop();
            } catch(e){}
            this.steamNoiseNode = null;
            this.steamGain = null;
        }
    }
}

export const audio = new AudioEngine();

// Canvas helpers for drawing bacterial cells, clumps, and colonies
export const canvasUtils = {
    // Draws a beautiful cell or clump on microscope canvas
    drawBacterium(ctx, x, y, size, type, color, blurPx) {
        ctx.save();
        if (blurPx > 0.5) {
            ctx.filter = `blur(${blurPx}px)`;
        } else {
            ctx.filter = 'none';
        }
        ctx.fillStyle = color;
        
        if (type === 'rod') {
            // Bacillus / Rod shape
            ctx.translate(x, y);
            ctx.rotate(Math.sin(x + y) * Math.PI); // Random but deterministic rotation
            ctx.beginPath();
            ctx.roundRect(-size * 1.5, -size * 0.6, size * 3, size * 1.2, size * 0.6);
            ctx.fill();
            
            // Add a slight internal highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.roundRect(-size * 1.0, -size * 0.3, size * 1.8, size * 0.4, size * 0.2);
            ctx.fill();
        } else if (type === 'coccus') {
            // Coccus / Sphere shape
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'clump') {
            // Cluster (Staphylococcus-like bunch)
            ctx.translate(x, y);
            const numCells = 5 + Math.floor((Math.sin(x * y) * 0.5 + 0.5) * 6); // 5 to 10 cells
            for (let i = 0; i < numCells; i++) {
                const offX = Math.sin(i * 1.5) * (size * 0.8);
                const offY = Math.cos(i * 1.5) * (size * 0.8);
                ctx.beginPath();
                ctx.arc(offX, offY, size * 0.6, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(offX - size * 0.15, offY - size * 0.15, size * 0.15, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = color;
            }
        }
        ctx.restore();
    },

    // Draws agar plate colony morphology
    drawColony(ctx, x, y, radius, type, baseColor) {
        ctx.save();
        ctx.shadowBlur = radius * 0.4;
        ctx.shadowColor = baseColor;
        ctx.fillStyle = baseColor;

        if (type === 'red_bile') {
            // VRBA Coliform: red colony with dark center & bile halo
            // Bile Halo
            ctx.fillStyle = 'rgba(156, 16, 52, 0.35)';
            ctx.beginPath();
            ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Outer colony
            ctx.fillStyle = '#ff1744';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Dark center
            ctx.fillStyle = '#6d0013';
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'green_sheen') {
            // EMB E.coli: metallic green sheen colony
            const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
            grad.addColorStop(0, '#00e5ff');
            grad.addColorStop(0.4, '#00e676');
            grad.addColorStop(0.8, '#0b5b29');
            grad.addColorStop(1, '#000000');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add a metallic highlight streak
            ctx.strokeStyle = '#a7ffeb';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.75, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
        } else if (type === 'black_bp') {
            // Baird Parker S. aureus: black/dark grey shiny colony
            const grad = ctx.createRadialGradient(x - radius*0.2, y - radius*0.2, 1, x, y, radius);
            grad.addColorStop(0, '#555555');
            grad.addColorStop(0.7, '#111111');
            grad.addColorStop(1, '#000000');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Shiny highlight
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.beginPath();
            ctx.arc(x - radius*0.3, y - radius*0.3, radius*0.2, 0, Math.PI*2);
            ctx.fill();
        } else if (type === 'black_metallic_bs') {
            // Bismuth Sulphite Salmonella: black metallic sheen
            const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
            grad.addColorStop(0, '#b2ff59');
            grad.addColorStop(0.3, '#2e7d32');
            grad.addColorStop(0.7, '#1b5e20');
            grad.addColorStop(1, '#000000');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'pseudomonas') {
            // P. aeruginosa: green/blue fluorescent colony
            const grad = ctx.createRadialGradient(x, y, 1, x, y, radius * 1.5);
            grad.addColorStop(0, 'rgba(0, 229, 255, 0.6)');
            grad.addColorStop(0.5, 'rgba(0, 230, 118, 0.3)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius * 1.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#00e5ff';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'yeast') {
            // Yeast: raised, creamy white, opaque, slightly irregular edges
            ctx.fillStyle = '#fff9c4';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2);
            ctx.fill();
            
            // Add a shaded crescent for raised look
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.beginPath();
            ctx.arc(x + radius*0.1, y + radius*0.1, radius*0.9, 0, Math.PI*2);
            ctx.fill();
        } else {
            // Standard colony (APC plate count agar) - creamy white
            const grad = ctx.createRadialGradient(x - radius*0.25, y - radius*0.25, 0.5, x, y, radius);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.8, '#ffe0b2');
            grad.addColorStop(1, '#e0f2f1');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
};

// Premium Toast Notification system
export function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '24px';
        container.style.right = '24px';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '12px';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.style.pointerEvents = 'auto';
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    else if (type === 'error') iconClass = 'fa-triangle-exclamation';
    else if (type === 'warning') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
        <div class="toast-message">${message}</div>
        <button class="toast-close-btn">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);

    const removeToast = () => {
        if (!toast.parentNode) return;
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    };

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
        closeBtn.onclick = removeToast;
    }

    // Automatically remove toast after 4.5s
    setTimeout(removeToast, 4500);
}
