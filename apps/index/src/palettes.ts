export type PaletteName = 'chlorophyll' | 'crt' | 'magenta' | 'spectrum' | 'casey'

const ROTATION: PaletteName[] = [
  'chlorophyll',
  'crt',
  'magenta',
  'spectrum',
  'casey',
]

const PALETTES: Record<PaletteName, readonly string[]> = {
  chlorophyll: ['#04140c', '#07271a', '#0b3a24', '#12522e', '#1f7a3d', '#3fbf5a', '#8ee87a', '#e8f7c8', '#0b4f6b', '#12b0c9'],
  crt: ['#050b12', '#08182a', '#0c2c46', '#123f63', '#1b6f9c', '#28a8d8', '#6fe3f2', '#eef6c8', '#136b4a', '#2fbf7a'],
  magenta: ['#1a0418', '#2c0730', '#450b47', '#6b0f5f', '#a3106f', '#e0128f', '#ff5bc8', '#f7f0c8', '#f2e14a', '#ffffff'],
  spectrum: ['#0b1a3a', '#12356e', '#1d6fa8', '#2aa7a0', '#3ddc6f', '#8fe36a', '#c9c6b6', '#f4a05a', '#e85c48', '#e7e6e1'],
  casey: ['#050505', '#0e2a38', '#12538a', '#2f8a3c', '#3fb7e3', '#7fd9ff', '#e9e3a3', '#f6f2c8', '#b7df5a', '#ffffff'],
}

const STORAGE_KEY = 'salad.pidx'

export function rpalette(): readonly string[] {
  const names = ROTATION.length ? ROTATION : (Object.keys(PALETTES) as PaletteName[])
  let idx: number
  try {
    const prev = Number(localStorage.getItem(STORAGE_KEY))
    idx = (Number.isFinite(prev) ? prev + 1 : 0) % names.length
    localStorage.setItem(STORAGE_KEY, String(idx))
  } catch {
    idx = Math.floor(Math.random() * names.length)
  }
  const name = names[idx] ?? 'chlorophyll'
  return PALETTES[name]
}
