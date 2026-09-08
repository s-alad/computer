import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import stylexPlugin from '@stylexjs/unplugin/vite'
import { defineConfig } from 'vite'

type StylexViteOptions = {
  useCSSLayers?: boolean
  include?: string[]
  unstable_moduleResolution?: { type: string; rootDir: string }
}
const stylex = stylexPlugin as unknown as (
  options?: StylexViteOptions,
) => import('vite').PluginOption

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    stylex({
      useCSSLayers: true,
      include: ['src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
      unstable_moduleResolution: { type: 'commonJS', rootDir: '../..' },
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})
