/**
 * Web Audio API procedural sound synthesizer for distraction-free focus.
 * Zero external audio files or network requests.
 */

let audioCtx: AudioContext | null = null;
let activeSourceNode: AudioNode | null = null;
let gainNode: GainNode | null = null;
let tickInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAmbientSound(): void {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  if (activeSourceNode) {
    try {
      if ('stop' in activeSourceNode && typeof (activeSourceNode as AudioScheduledSourceNode).stop === 'function') {
        (activeSourceNode as AudioScheduledSourceNode).stop();
      }
      activeSourceNode.disconnect();
    } catch {
      // Ignore disconnect errors
    }
    activeSourceNode = null;
  }
}

export function playAmbientSound(
  type: 'brown_noise' | 'pink_noise' | 'focus_drone' | 'clock_tick',
  volume: number = 0.2
): void {
  stopAmbientSound();
  const ctx = getAudioContext();

  gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.connect(ctx.destination);

  if (type === 'brown_noise') {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.connect(gainNode);
    whiteNoise.start();
    activeSourceNode = whiteNoise;
  } else if (type === 'pink_noise') {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const pinkSource = ctx.createBufferSource();
    pinkSource.buffer = noiseBuffer;
    pinkSource.loop = true;
    pinkSource.connect(gainNode);
    pinkSource.start();
    activeSourceNode = pinkSource;
  } else if (type === 'focus_drone') {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const droneGain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(108, ctx.currentTime); // Fundamental 108Hz

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(162, ctx.currentTime); // Perfect fifth 162Hz

    droneGain.gain.setValueAtTime(0.5, ctx.currentTime);

    osc1.connect(droneGain);
    osc2.connect(droneGain);
    droneGain.connect(gainNode);

    osc1.start();
    osc2.start();

    // Store dummy node to control stop
    activeSourceNode = droneGain;
  } else if (type === 'clock_tick') {
    const playTick = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const tickGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      tickGain.gain.setValueAtTime(volume * 0.4, now);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(tickGain);
      tickGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    };

    playTick();
    tickInterval = window.setInterval(playTick, 1000);
  }
}
