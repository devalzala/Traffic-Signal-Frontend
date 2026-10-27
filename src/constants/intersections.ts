export type IntersectionType =
  | 'three_way'
  | 'four_way_type1'
  | 'four_way_type2'
  | 'five_way'

export type TabId = IntersectionType | 'visualize'

/** How long a signal stays open after its Emergency button is pressed. */
export const EMERGENCY_SECONDS = 30

export type SavedTimes = Partial<Record<IntersectionType, number[]>>

export interface Intersection {
  type: IntersectionType
  label: string
  /** Number of signals. Signal N belongs to arms[N - 1]. */
  signals: number
  /** Direction of each road arm in degrees, clockwise from the top (0 = up, 90 = right). */
  arms: number[]
  /**
   * Groups of signals that open together, in the order they take turns
   * (indexes into the signals). A group with one signal opens on its own.
   */
  phases: number[][]
  hub: 'square' | 'circle'
  /** Tailwind position classes, one Emergency button per signal. */
  emergencyPositions: string[]
}

const TOP_LEFT = 'top-4 left-4'
const TOP_RIGHT = 'top-4 right-4'
const BOTTOM_LEFT = 'bottom-4 left-4'
const BOTTOM_RIGHT = 'bottom-4 right-4'
const TOP_CENTER = 'top-4 left-1/2 -translate-x-1/2'
const MIDDLE_LEFT = 'top-1/2 left-4 -translate-y-1/2'
// Centred under the 5-way junction, just below Signal 4's light and its label.
const BELOW_SIGNAL_4 = 'top-[calc(50%_+_212px)] left-1/2 -translate-x-1/2'

export const INTERSECTIONS: Intersection[] = [
  {
    type: 'three_way',
    label: '3-Way',
    signals: 3,
    arms: [90, 180, 270],
    phases: [[0], [1], [2]],
    hub: 'square',
    emergencyPositions: [TOP_CENTER, BOTTOM_LEFT, BOTTOM_RIGHT],
  },
  {
    type: 'four_way_type1',
    label: '4-Way (Type 1)',
    signals: 4,
    arms: [0, 90, 180, 270],
    phases: [[0], [1], [2], [3]],
    hub: 'square',
    emergencyPositions: [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT],
  },
  {
    type: 'four_way_type2',
    label: '4-Way (Type 2)',
    signals: 4,
    arms: [0, 90, 180, 270],
    // Opposite signals open together: 1 and 3, then 2 and 4.
    phases: [
      [0, 2],
      [1, 3],
    ],
    hub: 'square',
    emergencyPositions: [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT],
  },
  {
    type: 'five_way',
    label: '5-Way',
    signals: 5,
    arms: [0, 72, 144, 216, 288],
    phases: [[0], [1], [2], [3], [4]],
    hub: 'circle',
    emergencyPositions: [TOP_LEFT, TOP_RIGHT, MIDDLE_LEFT, BELOW_SIGNAL_4, BOTTOM_RIGHT],
  },
]

/** Layout shown before any intersection is selected. */
export const DEFAULT_INTERSECTION = INTERSECTIONS[1]

export const TABS: { id: TabId; label: string }[] = [
  ...INTERSECTIONS.map((i) => ({ id: i.type, label: i.label })),
  { id: 'visualize', label: 'Visualize' },
]
