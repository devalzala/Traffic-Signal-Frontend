export type LightColor = 'green' | 'yellow' | 'red'

interface TrafficLightProps {
  /** Which lamp is on. When omitted, all three lamps are lit. */
  active?: LightColor
  /** The signal's configured time while it is waiting (shown in red). */
  waitingTime?: number
  /** Seconds the signal stays open (shown in green). */
  openTime?: number
  /** Signal name shown beside the light, e.g. "Signal 1". */
  name?: string
  /** Where the name and counter appear relative to the light. */
  labelSide?: 'left' | 'right' | 'top' | 'bottom'
}

const LABEL_POSITION: Record<NonNullable<TrafficLightProps['labelSide']>, string> = {
  left: 'top-1/2 right-full mr-2 -translate-y-1/2 items-end',
  right: 'top-1/2 left-full ml-2 -translate-y-1/2 items-start',
  top: 'bottom-full left-1/2 mb-1 -translate-x-1/2 items-center',
  bottom: 'top-full left-1/2 mt-1 -translate-x-1/2 items-center',
}

const LAMPS: { color: LightColor; className: string }[] = [
  { color: 'green', className: 'bg-[#0ac84d]' },
  { color: 'yellow', className: 'bg-[#d4900a]' },
  { color: 'red', className: 'bg-[#e53935]' },
]

export default function TrafficLight({
  active,
  waitingTime,
  openTime,
  name,
  labelSide = 'right',
}: TrafficLightProps) {
  const label = waitingTime ?? openTime
  const labelColor = waitingTime !== undefined ? 'text-red-600' : 'text-green-600'

  return (
    <div className="relative">
      <div className="flex w-[46px] flex-col items-center gap-1.5 rounded-xl bg-[#222] px-2 py-2">
        {LAMPS.map((lamp) => (
          <span
            key={lamp.color}
            className={`h-4 w-4 rounded-full transition-opacity ${lamp.className} ${
              active && active !== lamp.color ? 'opacity-25' : 'opacity-100'
            }`}
          />
        ))}
      </div>
      {(name || label !== undefined) && (
        // The light background keeps the text readable if it ends up over a road.
        <div
          className={`absolute flex flex-col whitespace-nowrap rounded bg-white/80 px-1 ${LABEL_POSITION[labelSide]}`}
        >
          {name && <span className="text-[11px] font-medium text-gray-700">{name}</span>}
          {label !== undefined && (
            <span className={`text-xs font-semibold ${labelColor}`}>{label}s</span>
          )}
        </div>
      )}
    </div>
  )
}
