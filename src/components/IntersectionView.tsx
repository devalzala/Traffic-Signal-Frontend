import { useEffect, useState } from 'react'
import {
  DEFAULT_INTERSECTION,
  EMERGENCY_SECONDS,
  INTERSECTIONS,
} from '../constants/intersections'
import type { IntersectionType } from '../constants/intersections'
import { saveConfiguration } from '../store/configurationsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import SignalLayer from './SignalLayer'
import SignalTimeForm from './SignalTimeForm'

const ROAD_WIDTH = 72
const DASH_LINE =
  'bg-[repeating-linear-gradient(to_bottom,white_0px,white_70px,transparent_70px,transparent_90px)]'

interface IntersectionViewProps {
  /** Pre-selects an intersection. The time form stays closed until Set Time is clicked. */
  presetType?: IntersectionType
}

export default function IntersectionView({ presetType }: IntersectionViewProps) {
  const dispatch = useAppDispatch()
  const savedTimes = useAppSelector((state) => state.configurations.times)
  const saving = useAppSelector((state) => state.configurations.saving)

  const [ways, setWays] = useState<IntersectionType | ''>(presetType ?? '')
  const [showForm, setShowForm] = useState(false)
  const [cycleRun, setCycleRun] = useState(0)
  // The timer stays off until Start is clicked or times are saved.
  const [running, setRunning] = useState(false)
  // Set while an Emergency button is active: which signal is open and how long it has been.
  const [emergency, setEmergency] = useState<{ signal: number; elapsed: number } | null>(null)
  const emergencyActive = emergency !== null

  const selected = INTERSECTIONS.find((i) => i.type === ways)
  const layout = selected ?? DEFAULT_INTERSECTION
  const times = selected ? savedTimes[selected.type] : undefined

  useEffect(() => {
    if (!emergencyActive) return
    const id = setInterval(() => {
      setEmergency((prev) =>
        !prev || prev.elapsed + 1 >= EMERGENCY_SECONDS
          ? null
          : { ...prev, elapsed: prev.elapsed + 1 }
      )
    }, 1000)
    return () => clearInterval(id)
  }, [emergencyActive])

  // Reset keeps the selected intersection and only restarts the signal timer.
  // Saved configurations stay in the database.
  const handleReset = () => {
    setEmergency(null)
    setCycleRun((run) => run + 1)
    setShowForm(false)
  }

  const handleEmergency = (signal: number) => {
    setShowForm(false)
    setEmergency({ signal, elapsed: 0 })
  }

  const handleSave = (signalTimes: number[]) => {
    if (!selected) return
    dispatch(saveConfiguration({ type: selected.type, signalTimes }))
      .unwrap()
      .then(() => {
        setShowForm(false)
        // Start the timer from the freshly saved values.
        setCycleRun((run) => run + 1)
        setRunning(true)
      })
      .catch(() => {
        // The error message is shown by the banner in App.
      })
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-[#e0e0e0]">
      {/* Everything inside is positioned from the centre of the junction */}
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {/* Road arms */}
        {layout.arms.map((angle) => (
          <div
            key={angle}
            className="absolute bg-black"
            style={{
              width: ROAD_WIDTH,
              height: '100vmax',
              left: -ROAD_WIDTH / 2,
              top: 0,
              transformOrigin: `${ROAD_WIDTH / 2}px 0`,
              transform: `rotate(${angle - 180}deg)`,
            }}
          >
            <div className={`absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 ${DASH_LINE}`} />
          </div>
        ))}

        {/* Junction box hides the dashed lines in the middle */}
        <div
          className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 bg-black ${
            layout.hub === 'circle' ? 'h-[124px] w-[124px] rounded-full' : 'h-[72px] w-[72px]'
          }`}
        />

        {/* Traffic lights. Re-mounts when the layout or times change so the cycle restarts. */}
        <SignalLayer
          key={`${layout.type}-${running}-${times?.join(',') ?? 'static'}-${cycleRun}-${emergencyActive}`}
          intersection={layout}
          times={running && !emergencyActive ? times : undefined}
          emergency={
            emergency
              ? { signal: emergency.signal, secondsLeft: EMERGENCY_SECONDS - emergency.elapsed }
              : null
          }
        />
      </div>

      {/* Emergency buttons */}
      {layout.emergencyPositions.map((position, index) => {
        const isActive = emergency?.signal === index
        return (
          <button
            key={position}
            type="button"
            title={`Emergency for Signal ${index + 1}`}
            onClick={() => handleEmergency(index)}
            className={`absolute ${position} rounded-lg px-5 py-2 text-[10px] font-medium shadow-sm ${
              isActive ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            Emergency
          </button>
        )
      })}

      {/* Control bar */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-2xl bg-white p-3 shadow-lg">
        <select
          value={ways}
          onChange={(e) => {
            setWays(e.target.value as IntersectionType)
            setShowForm(false)
            setRunning(false)
            setEmergency(null)
          }}
          className="w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 outline-none focus:border-[#0b5f55]"
        >
          <option value="" disabled>
            Select Ways
          </option>
          {INTERSECTIONS.map((i) => (
            <option key={i.type} value={i.type}>
              {i.label}
            </option>
          ))}
        </select>

        <div className="relative">
          {showForm && selected && (
            <div className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2">
              <SignalTimeForm
                key={selected.type}
                signals={selected.signals}
                initialTimes={times}
                saving={saving}
                onSave={handleSave}
              />
            </div>
          )}
          <button
            type="button"
            disabled={!selected}
            onClick={() => setShowForm((open) => !open)}
            className="rounded-lg bg-[#0b5f55] px-8 py-2 text-xs font-medium text-white hover:bg-[#094c44] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Set Time
          </button>
        </div>

        <button
          type="button"
          disabled={!times}
          onClick={() => {
            setCycleRun((run) => run + 1)
            setRunning(true)
            setShowForm(false)
          }}
          className="rounded-lg border border-[#0b5f55] bg-white px-8 py-2 text-xs font-medium text-[#0b5f55] hover:bg-[#0b5f55]/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-gray-200 bg-white px-8 py-2 text-xs font-medium hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
