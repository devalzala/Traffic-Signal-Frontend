import type { Intersection } from '../constants/intersections'
import { useSignalCycle } from '../hooks/useSignalCycle'
import type { SignalColor } from '../hooks/useSignalCycle'
import { getLightOffset } from '../utils/layout'
import TrafficLight from './TrafficLight'

export interface EmergencyState {
  /** Index of the signal that is held open. */
  signal: number
  secondsLeft: number
}

interface SignalLayerProps {
  intersection: Intersection
  /** Saved times for this intersection. The signal cycle starts once provided. */
  times?: number[]
  /** While set, this signal is green and every other signal is red. */
  emergency?: EmergencyState | null
}

// Lights straight above or below the junction sit between two roads, so their
// label goes above or below them. Other lights put the label on the outer side.
function getLabelSide(x: number, y: number) {
  if (Math.abs(x) < 10) return y < 0 ? 'top' : 'bottom'
  return x < 0 ? 'left' : 'right'
}

export default function SignalLayer({ intersection, times, emergency }: SignalLayerProps) {
  const states = useSignalCycle(times, intersection.phases)

  return (
    <>
      {intersection.arms.map((_, index) => {
        const { x, y } = getLightOffset(intersection.arms, index)

        // Default: all green, no numbers, until the cycle is started.
        let color: SignalColor = 'green'
        let waitingTime: number | undefined
        let openTime: number | undefined

        if (emergency) {
          if (emergency.signal === index) {
            openTime = emergency.secondsLeft
          } else {
            color = 'red'
          }
        } else if (states) {
          color = states[index].color
          waitingTime = states[index].waiting
          openTime = states[index].open
        }

        // Signals that open together are marked as a pair, e.g. "Signal 1 · Pair A".
        const phaseIndex = intersection.phases.findIndex((phase) => phase.includes(index))
        const pairLabel =
          intersection.phases[phaseIndex].length > 1
            ? ` · Pair ${String.fromCharCode(65 + phaseIndex)}`
            : ''

        return (
          <div
            key={index}
            className="absolute"
            style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
          >
            <TrafficLight
              active={color}
              waitingTime={waitingTime}
              openTime={openTime}
              name={`Signal ${index + 1}${pairLabel}`}
              labelSide={getLabelSide(x, y)}
            />
          </div>
        )
      })}
    </>
  )
}
