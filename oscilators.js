// MULTIPLE OSCILATORS IN AN ARRAY. 
// TODO:
// Start, Stop
// Analysernode 

const ac = new AudioContext();

// create an array to hold oscillators
const osc = [];
const numOscillators = 8;

// create an analyser node
const analyser = ac.createAnalyser();
analyser.fftSize = 2048;

// 0 index, could be used for sub bass,
const oscillator = ac.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, ac.currentTime); // different frequency for each
    oscillator.connect(analyser);
    osc.push(oscillator);

for (let i = 1; i < numOscillators; i++) {
    const oscillator = ac.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220 + i * 55, ac.currentTime); // different frequency for each
    oscillator.connect(analyser);
    osc.push(oscillator);
}


// MAIN ANALYSER SETUP

// Canvas setup
const canvas = document.getElementById("analyser");
const ctx = canvas.getContext("2d");

analyser.connect(ac.destination);

function draw() {
    requestAnimationFrame(draw);

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00ff00";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

draw();

// START AND STOP (TODO -THE RIGHT WAY)


const start = document.querySelector("#start");
const stop = document.querySelector("#stop");
start.addEventListener("click", () => {
    osc.forEach(o => o.start());
});
stop.addEventListener("click", () => {
    osc.forEach(o => o.stop());
}
);