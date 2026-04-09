// ---- Page Navigation Logic ----
function nextPage(targetId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
        sec.classList.remove('active-page');
    });
    
    // Show target section
    const targetSection = document.getElementById(targetId);
    if(targetSection) {
        targetSection.classList.add('active-page');
    }

    if (targetId === 'hero') {
        startSimpleCountdown();
    }
}


// ---- Simple 3-2-1 Countdown Logic ----
let countdownInterval;
function startSimpleCountdown() {
    clearInterval(countdownInterval);
    let count = 3;
    const countEl = document.getElementById('simple-countdown');
    const textEl = document.getElementById('countdown-text');
    const btn = document.getElementById('hero-next-btn');

    if (!countEl) return;

    countEl.innerText = count;
    textEl.innerText = "Get Ready!";
    btn.style.display = 'none';
    
    countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countEl.innerText = count;
            countEl.style.animation = 'none';
            void countEl.offsetWidth; // trigger reflow
            countEl.style.animation = 'fadeInPage 0.5s forwards';
        } else {
            clearInterval(countdownInterval);
            countEl.innerText = "🎉";
            textEl.innerText = "It's time!";
            btn.style.display = 'inline-flex';
            triggerConfetti(); // pop confetti when countdown hits 0!
        }
    }, 1000);
}

// Start countdown on initial load
startSimpleCountdown();


// ---- Render Candles ----
const candlesContainer = document.getElementById('candles-container');
const numCandles = 3; // Change this for more candles
if (candlesContainer) {
    for(let i=0; i<numCandles; i++) {
        const candle = document.createElement('div');
        candle.classList.add('candle');
        const flame = document.createElement('div');
        flame.classList.add('flame');
        candle.appendChild(flame);
        candlesContainer.appendChild(candle);
    }
}

// ---- Microphone / Blow Out Candles Logic ----
const micBtn = document.getElementById('mic-btn');
let audioContext;
let analyser;
let microphone;

if (micBtn) {
    micBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 256;
            
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            const checkVolume = () => {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for(let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                }
                let average = sum / dataArray.length;
                
                if (average > 40) {
                    const flames = document.querySelectorAll('.flame');
                    flames.forEach(flame => {
                        flame.classList.add('extinguished');
                    });
                    
                    micBtn.innerText = "✨ Yay! Happy Birthday Mahek ! ✨";
                    micBtn.style.background = "linear-gradient(45deg, #00b09b, #96c93d)";
                    micBtn.style.boxShadow = "none";
                    micBtn.disabled = true;
                    
                    document.getElementById('cake-next-btn').style.display = 'inline-flex';
                    triggerConfetti();
                    
                } else {
                    requestAnimationFrame(checkVolume);
                }
            };
            
            micBtn.innerText = "Listening... Blow into the mic!";
            micBtn.style.animation = "gentleBob 1s infinite alternate";
            checkVolume();
            
        } catch (err) {
            alert("Microphone access denied or error occurred. Please allow microphone access to blow out the candles!");
            console.error(err);
            document.getElementById('cake-next-btn').style.display = 'inline-flex';
        }
    });
}

// ---- Photo Stack Logic ----
const photoStack = document.getElementById('photo-stack');
if (photoStack) {
    photoStack.addEventListener('click', () => {
        const cards = photoStack.querySelectorAll('.stacked-card');
        if (cards.length === 0) return;
        
        // Take the top card
        const topCard = cards[0];
        topCard.classList.add('move-to-back');
        
        // After CSS animation, move the node to the end 
        setTimeout(() => {
            topCard.classList.remove('move-to-back');
            photoStack.appendChild(topCard);
        }, 500); // matching CSS animation duration
    });
}

// ---- Basic Confetti ----
function triggerConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#ff4d6d', '#ffcf00', '#00b09b', '#96c93d', '#fff0f3'][Math.floor(Math.random() * 5)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10vh';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.zIndex = '1000';
        document.body.appendChild(confetti);

        const fall = confetti.animate([
            { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate3d(${Math.random() * 100 - 50}px, 110vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 2000,
            easing: 'cubic-bezier(.37,0,.63,1)'
        });

        fall.onfinish = () => confetti.remove();
    }
}
