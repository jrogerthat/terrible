import { useEffect, useState } from 'react'

type TimerMode = 'work' | 'break'

interface TimerProps {
  workMinutes?: number
  breakMinutes?: number
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return (
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0')
  )
}

// Simple beep using Web Audio API
function playBeep() {
  try {
    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 880 // A5
    gain.gain.value = 0.05 // fairly quiet

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start()

    setTimeout(() => {
      oscillator.stop()
      ctx.close()
    }, 500)
  } catch {
    // fail silently if audio is blocked
  }
}

export function Timer({
  workMinutes = 20,
  breakMinutes = 5,
}: TimerProps) {
  const WORK_DURATION_SECONDS = workMinutes * 60
  const BREAK_DURATION_SECONDS = breakMinutes * 60

  const [mode, setMode] = useState<TimerMode>('work')
  const [secondsRemaining, setSecondsRemaining] = useState(
    WORK_DURATION_SECONDS,
  )
  const [running, setRunning] = useState(false)

   // Remember the original page title once
  const [baseTitle] = useState(() => document.title)

  // Keep seconds in sync if durations change (e.g., via props)
  useEffect(() => {
    setSecondsRemaining(
      mode === 'work' ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workMinutes, breakMinutes])

    // NEW: update the browser tab title with the timer
  useEffect(() => {

    document.title = `${formatTime(secondsRemaining)}`
    // · ${label} – ${baseTitle}`

    return () => {
      // When Timer unmounts, restore original title
      document.title = baseTitle
    }
  }, [secondsRemaining, mode, baseTitle])

   useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Period finished
          if (mode === 'work') {
            // Only beep at the end of a work period
            playBeep()
          }

          const nextMode: TimerMode = mode === 'work' ? 'break' : 'work'

          // Switch mode and STOP the timer — user must press Start again
          setMode(nextMode)
          setRunning(false)

          // Prepare the next period's duration, but don't start counting it down yet
          return nextMode === 'work'
            ? WORK_DURATION_SECONDS
            : BREAK_DURATION_SECONDS
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [running, mode, WORK_DURATION_SECONDS, BREAK_DURATION_SECONDS])

  const handleStartStop = () => {
    setRunning((r) => !r)
  }

  const handleReset = () => {
    setRunning(false)
    setMode('work')
    setSecondsRemaining(WORK_DURATION_SECONDS)
  }

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>{mode === 'work' ? 'Work' : 'Break'} timer</h2>

      <p style={{ fontSize: '2rem', fontFamily: 'monospace' }}>
        {formatTime(secondsRemaining)}
      </p>

      <button type="button" onClick={handleStartStop}>
        {running ? 'Pause' : 'Start'}
      </button>
      <button
        type="button"
        onClick={handleReset}
        style={{ marginLeft: '0.5rem' }}
      >
        Reset
      </button>
    </section>
  )
}