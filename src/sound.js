// Krotkie efekty dzwiekowe generowane w WebAudio - zero plikow mp3 do pobrania.
let ctx = null
let wlaczony = true

function audio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function ton(freq, start, dur, gain = 0.16, typ = 'sine') {
  const ac = audio()
  if (!ac) return
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.type = typ
  o.frequency.setValueAtTime(freq, ac.currentTime + start)
  g.gain.setValueAtTime(0, ac.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur)
  o.connect(g).connect(ac.destination)
  o.start(ac.currentTime + start)
  o.stop(ac.currentTime + start + dur + 0.02)
}

export const dzwiek = {
  ustawWlaczony(v) { wlaczony = v },
  czyWlaczony() { return wlaczony },
  klik() { if (wlaczony) ton(880, 0, 0.09, 0.1, 'triangle') },
  polozenie() { if (wlaczony) { ton(660, 0, 0.09, 0.09, 'sine'); ton(990, 0.05, 0.1, 0.07, 'sine') } },
  kosz() { if (wlaczony) { ton(300, 0, 0.09, 0.12, 'sawtooth'); ton(180, 0.07, 0.14, 0.1, 'sawtooth') } },
  sprzedaz() {
    if (!wlaczony) return
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => ton(f, i * 0.085, 0.28, 0.14, 'triangle'))
  },
  zapis() { if (wlaczony) { ton(587.33, 0, 0.15, 0.12, 'sine'); ton(880, 0.1, 0.22, 0.11, 'sine') } },
  zakup() { if (wlaczony) { ton(784, 0, 0.12, 0.13, 'square'); ton(1046.5, 0.09, 0.2, 0.1, 'triangle') } },
  blad() { if (wlaczony) ton(220, 0, 0.18, 0.1, 'square') },
}
