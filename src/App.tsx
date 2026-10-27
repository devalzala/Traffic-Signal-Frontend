import { useEffect, useState } from 'react'
import { INTERSECTIONS } from './constants/intersections'
import type { TabId } from './constants/intersections'
import Tabs from './components/Tabs'
import IntersectionView from './components/IntersectionView'
import { clearError, fetchConfigurations } from './store/configurationsSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'

function App() {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.configurations.error)
  const [activeTab, setActiveTab] = useState<TabId>('visualize')
  const intersection = INTERSECTIONS.find((i) => i.type === activeTab)

  useEffect(() => {
    dispatch(fetchConfigurations())
  }, [dispatch])

  return (
    <div className="flex h-full flex-col">
      <Tabs active={activeTab} onChange={setActiveTab} />
      {error && (
        <div className="flex items-center justify-between bg-red-50 px-4 py-2 text-xs text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearError())} className="font-medium">
            Dismiss
          </button>
        </div>
      )}
      <IntersectionView key={activeTab} presetType={intersection?.type} />
    </div>
  )
}

export default App
