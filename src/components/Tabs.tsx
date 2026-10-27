import { TABS } from '../constants/intersections'
import type { TabId } from '../constants/intersections'

interface TabsProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav className="flex gap-1 border-b border-gray-200 bg-white px-4">
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-[#0b5f55] text-[#0b5f55]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
