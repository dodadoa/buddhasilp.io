let mic;
let smoothing = 0.8; // play with this, between 0 and .99
let binCount = 256; // size of resulting FFT array. Must be a power of 2 between 16 an 1024
let particles = new Array(binCount);

// ===============
// Particle class
// ===============

const Particle = function (position) {
    this.position = position;
    this.scale = random(0, 1);
    this.speed = createVector(0, random(0, 10));
    this.color = [random(100, 130), random(20, 240), random(200, 220)];
}

let theyExpand = 5;

// use FFT bin level to change speed and diameter
Particle.prototype.update = function (someLevel) {
    this.diameter = map(someLevel, 0, 1, 0, 100) * this.scale * theyExpand;
    this.position.x = this.position.x + (10 * someLevel)
    if (this.position.x > width) {
        this.position.x = 0
    }
}

Particle.prototype.draw = function () {
    stroke(this.color);
    ellipse(
        this.position.x, this.position.y,
        this.diameter, this.diameter
    );
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    userStartAudio()

    mic = new p5.AudioIn();
    mic.start();
    getAudioContext().resume();
    fft = new p5.FFT();
    fft.setInput(mic);

    // instantiate the particles.
  for (var i = 0; i < particles.length; i++) {
    const x = map(i, 0, binCount, 0, width * 2);
    const y = random(0, height);
    const position = createVector(x, y);
    particles[i] = new Particle(position);
  }
}

function draw() {
    background(0);
    noStroke()
    const spectrum = fft.analyze(binCount);

    // beginShape();
    // for (i = 0; i < spectrum.length; i++) {
    //     vertex(i + (width / 7), map(spectrum[i], 0 - 200, 255, height, 0));
    // }
    // endShape();

    // update and draw all [binCount] particles!
    // Each particle gets a level that corresponds to
    // the level at one bin of the FFT spectrum. 
    // This level is like amplitude, often called "energy."
    // It will be a number between 0-255.
    for (let i = 0; i < binCount; i++) {
        let thisLevel = map(spectrum[i], 0, 255, 0, 1);
        // update values based on amplitude at this part of the frequency spectrum
        particles[i].update(thisLevel);
        // draw the particle
        particles[i].draw();
    }
}



