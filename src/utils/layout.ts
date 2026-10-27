// Distance a light box needs to keep from the road arms next to it.
const ARM_CLEARANCE = 77

/**
 * Returns where the traffic light for an arm should sit, relative to the
 * centre of the junction. The light goes in the gap between the arm and the
 * previous arm (counter-clockwise), so it never sits on a road.
 */
export function getLightOffset(arms: number[], index: number) {
  const angle = arms[index]
  const sorted = [...arms].sort((a, b) => a - b)
  const position = sorted.indexOf(angle)
  const previous = sorted[(position - 1 + sorted.length) % sorted.length]

  const gap = (angle - previous + 360) % 360 || 360
  const half = gap / 2

  const direction = ((angle - half) * Math.PI) / 180
  const radius = ARM_CLEARANCE / Math.sin((Math.min(half, 90) * Math.PI) / 180)

  return {
    x: Math.sin(direction) * radius,
    y: -Math.cos(direction) * radius,
  }
}
