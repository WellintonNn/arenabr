let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export type SoundType =
  | 'strike'
  | 'water_jet'
  | 'ice_spear'
  | 'fireball'
  | 'flame_wave'
  | 'wind_gust'
  | 'purple_lightning'
  | 'awaken'
  | 'orb_barrage'
  | 'click';

export function playSound(type: SoundType) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  switch (type) {
    case 'strike': {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
      break;
    }
    case 'water_jet': {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.45);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
      break;
    }
    case 'ice_spear': {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.38);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.38);
      break;
    }
    case 'fireball': {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;
    }
    case 'flame_wave': {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.65);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.65);
      osc.start(now);
      osc.stop(now + 0.65);
      break;
    }
    case 'wind_gust': {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.32);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);
      break;
    }
    case 'purple_lightning': {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.52);
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.52);
      osc.start(now);
      osc.stop(now + 0.52);
      break;
    }
    case 'awaken': {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(960, now + 0.48);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.48);
      osc.start(now);
      osc.stop(now + 0.48);
      break;
    }
    case 'orb_barrage': {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
      break;
    }
    case 'click': {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }
  }
}
