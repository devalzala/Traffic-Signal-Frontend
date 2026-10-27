import { useEffect, useState } from 'react'

export type SignalColor = 'green' | 'yellow' | 'red'

export interface SignalState {
  color: SignalColor
  /** The signal's configured time, shown in red while it waits. */
  waiting?: number
  /** Seconds of green left, shown in green while it is open. */
  open?: number
}

// Yellow is shown during the last seconds of every phase, while signals change over.
const YELLOW_SECONDS = 3

/**
 * Runs the signal cycle once per second. `phases` lists the groups of signals
 * that open together, in the order they take turns. A phase lasts as long as
 * its longest signal. Inside a phase every signal is green for its own time
 * and then red, so shorter signals close first.
 *
 * Each change goes through yellow: green, yellow, red for a signal that
 * closes and red, yellow, green for one that opens. Returns null until times
 * are provided.
 */
export function useSignalCycle(
  times: number[] | undefined,
  phases: number[][]
): SignalState[] | null {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!times) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [times])

  if (!times) return null

  const lengths = phases.map((phase) => Math.max(...phase.map((signal) => times[signal])))
  const cycle = lengths.reduce((sum, t) => sum + t, 0)
  if (cycle <= 0) return null

  const t = elapsed % cycle
  let current = 0
  let phaseStart = 0
  for (let k = 0; k < lengths.length; k++) {
    if (t < phaseStart + lengths[k]) {
      current = k
      break
    }
    phaseStart += lengths[k]
  }

  const intoPhase = t - phaseStart
  const phaseRemaining = lengths[current] - intoPhase
  const changingOver = lengths[current] > YELLOW_SECONDS && phaseRemaining <= YELLOW_SECONDS
  const next = (current + 1) % phases.length

  return times.map((own, signal): SignalState => {
    const phase = phases.findIndex((p) => p.includes(signal))

    if (phase === current) {
      const remaining = own - intoPhase
      if (remaining > 0) {
        const yellow = own > YELLOW_SECONDS && remaining <= YELLOW_SECONDS
        return { color: yellow ? 'yellow' : 'green', open: remaining }
      }
      return { color: 'red', waiting: own }
    }

    if (changingOver && phase === next) {
      return { color: 'yellow', waiting: own }
    }
    return { color: 'red', waiting: own }
  })
}
