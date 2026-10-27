import { useState } from 'react'
import type { FormEvent } from 'react'

interface SignalTimeFormProps {
  signals: number
  /** Previously saved times, used to pre-fill the inputs. */
  initialTimes?: number[]
  saving?: boolean
  onSave: (times: number[]) => void
}

export default function SignalTimeForm({
  signals,
  initialTimes,
  saving = false,
  onSave,
}: SignalTimeFormProps) {
  const [times, setTimes] = useState<string[]>(
    Array.from({ length: signals }, (_, i) => String(initialTimes?.[i] ?? ''))
  )

  const handleChange = (index: number, value: string) => {
    setTimes((prev) => prev.map((t, i) => (i === index ? value : t)))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(times.map(Number))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-52 space-y-3 rounded-2xl bg-white p-3 shadow-xl"
    >
      {times.map((value, index) => (
        <label key={index} className="block">
          <span className="mb-1 block text-[10px] font-medium text-gray-900">
            Signal {index + 1} Time
          </span>
          <input
            type="number"
            min={1}
            step={1}
            required
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder="Enter time in seconds"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px] outline-none placeholder:text-gray-400 focus:border-[#0b5f55]"
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-[#0b5f55] py-2 text-[10px] font-medium text-white hover:bg-[#094c44] disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
