// Web Audio API lightweight sound synthesizer (Kawaii & Arcade Game Edition)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Cute popping bubble sound
export function playKawaiiPop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

// Cute coin/catch sound
export function playKawaiiCoin() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(987.77, now); // B5
  osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.26);
}

// Cute wobble boing
export function playKawaiiOuch() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.22);
}

// Subway Station Announcement Tone (捷運報站經典叮咚鐘聲)
export function playSubwayStationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Classic Taipei / MRT station arrival chime chords (G4 -> C5 -> E5 -> G5)
  const notes = [
    { freq: 392.0, time: 0.0, dur: 0.35 },    // G4
    { freq: 523.25, time: 0.18, dur: 0.4 },  // C5
    { freq: 659.25, time: 0.36, dur: 0.45 }, // E5
    { freq: 783.99, time: 0.54, dur: 0.7 }   // G5 (Long sustaining chime)
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sine with overtone for marimba/chime warmth
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.22, now + time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + dur + 0.05);
  });
}

// Metro Door Warning Beeps (嗶嗶嗶~ 列車即將關門)
export function playMetroDoorBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  [0, 0.15, 0.3].forEach((t) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1760, now + t); // A6
    gain.gain.setValueAtTime(0.12, now + t);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + t);
    osc.stop(now + t + 0.09);
  });
}

// Broadcast callbacks without synthetic voices
export function playGuanduStationBroadcast(onTextUpdate?: (text: string) => void) {
  // Pure visual marquee updater - zero synthetic voice added
  if (onTextUpdate) {
    onTextUpdate('國語：關渡。下車時請注意間隙。');
    setTimeout(() => onTextUpdate('English: Guandu Station. Mind the gap.'), 5000);
    setTimeout(() => onTextUpdate('台語：關渡，落車的時陣請注意空隙。'), 9000);
    setTimeout(() => onTextUpdate('客語：關渡，下車个時節請注意縫仔。'), 13000);
    setTimeout(() => onTextUpdate('右側開門 · 下車時請注意間隙'), 17000);
  }
}

// Authentic Guandu Station Arrival Broadcast
export function playGuanduArrivalBroadcast(onTextUpdate?: (text: string) => void) {
  if (onTextUpdate) {
    onTextUpdate('📢 關渡到了，右側開門。下車時請注意間隙。');
  }
}

// Quiz Correct Answer Chime (答題正確！清脆悅耳叮咚聲)
export function playQuizCorrectChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Ascending cheerful bells: C5 -> G5 -> C6
  const bells = [
    { f: 523.25, t: 0, d: 0.25 },
    { f: 783.99, t: 0.08, d: 0.3 },
    { f: 1046.5, t: 0.16, d: 0.45 }
  ];

  bells.forEach(({ f, t, d }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, now + t);

    gain.gain.setValueAtTime(0.25, now + t);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + t);
    osc.stop(now + t + d + 0.05);
  });
}

// Quiz Wrong Answer Chime (答題錯誤！低沉警告嗡嗡聲)
export function playQuizWrongChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Descending discordant warning tone
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';

  // Dissonant interval
  osc1.frequency.setValueAtTime(220, now); // A3
  osc1.frequency.linearRampToValueAtTime(160, now + 0.28);

  osc2.frequency.setValueAtTime(233, now); // Bb3 (discordant tension)
  osc2.frequency.linearRampToValueAtTime(170, now + 0.28);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.32);
  osc2.stop(now + 0.32);
}

// Morning Nausea Gurgle & Queasy Sound (孕吐反胃咕嚕咕嚕唔唔聲)
export function playMorningSicknessGurgle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Modulated low bubbling frequency
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.linearRampToValueAtTime(75, now + 0.15);
  osc.frequency.linearRampToValueAtTime(110, now + 0.3);
  osc.frequency.linearRampToValueAtTime(60, now + 0.45);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(250, now);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.5);
}

// Gentle Morning Ambient Hum (輕柔清晨臥室環境微音)
let morningAmbientOsc: OscillatorNode | null = null;
let morningAmbientGain: GainNode | null = null;

export function startMorningAmbientHum() {
  const ctx = getAudioContext();
  if (!ctx || morningAmbientOsc) return;

  const now = ctx.currentTime;
  morningAmbientOsc = ctx.createOscillator();
  morningAmbientGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  morningAmbientOsc.type = 'sine';
  morningAmbientOsc.frequency.setValueAtTime(110, now); // Gentle low A2 hum

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(160, now);

  // Very subtle background volume (5%)
  morningAmbientGain.gain.setValueAtTime(0.001, now);
  morningAmbientGain.gain.linearRampToValueAtTime(0.04, now + 1.2);

  morningAmbientOsc.connect(filter);
  filter.connect(morningAmbientGain);
  morningAmbientGain.connect(ctx.destination);

  morningAmbientOsc.start(now);
}

export function stopMorningAmbientHum() {
  if (!morningAmbientGain || !morningAmbientOsc || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    morningAmbientGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    setTimeout(() => {
      if (morningAmbientOsc) {
        morningAmbientOsc.stop();
        morningAmbientOsc.disconnect();
        morningAmbientOsc = null;
      }
      morningAmbientGain = null;
    }, 600);
  } catch {
    morningAmbientOsc = null;
    morningAmbientGain = null;
  }
}

// Rhythm hit sound
export function playRhythmHit(perfect: boolean = true) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(perfect ? 1046.5 : 783.99, now); // C6 or G5
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.13);
}

// Heartbeat
export function playHeartbeat() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(70, now);
  osc1.frequency.exponentialRampToValueAtTime(45, now + 0.08);

  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.09);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(60, now + 0.12);
  osc2.frequency.exponentialRampToValueAtTime(40, now + 0.22);

  gain2.gain.setValueAtTime(0.22, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.23);
}

// Victory fanfare
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + idx * 0.07;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.18, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

export function playGentleClick() {
  playKawaiiPop();
}

export function playWarningBeep() {
  playQuizWrongChime();
}

export function playCalmBreathChime() {
  playKawaiiCoin();
}
