import { useEffect, useRef } from 'react'
import * as stylex from '@stylexjs/stylex'
import { fonts } from '@salad/fonts/fonts.stylex'
import { rpalette } from './palettes'
import { Menu } from './menu'
import userIcon from './assets/user-icon.png'

const styles = stylex.create({
  page: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    overflow: 'hidden',
    margin: 0,
    backgroundColor: '#111213',
    fontFamily: fonts.display,
    color: '#ececea',
  },
  wordmark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: '28px',
    marginRight: '28px',
    marginBottom: 0,
    marginLeft: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    fontWeight: 400,
    fontSize: 'clamp(26px, 3vw, 40px)',
    lineHeight: 1,
    letterSpacing: '-0.01em',
    color: '#f1f1ee',
    pointerEvents: 'none',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
  },
  fine: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.22,
    backgroundImage:
      'repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 1px, rgba(0,0,0,0) 1px 3px)',
    mixBlendMode: 'multiply',
    pointerEvents: 'none',
  },
  coarse: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0) 1px 4px)',
    pointerEvents: 'none',
  },
  group: {
    display: 'grid',
    gap: '18px',
    justifyItems: 'start',
  },
  userIcon: {
    flexShrink: 0,
    width: 'clamp(26px, 3vw, 40px)',
    height: 'clamp(26px, 3vw, 40px)',
    borderRadius: '50%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(180, 245, 255, 0.75)',
    boxShadow: '0 0 10px rgba(127, 217, 255, 0.55), 0 0 3px rgba(255, 255, 255, 0.6)',
    objectFit: 'cover',
    display: 'block',
    pointerEvents: 'auto',
    cursor: 'pointer',
  },
})

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let worker: Worker | null = null
    let ro: ResizeObserver | null = null
    let cancelled = false
    const dpr = (): number => Math.min(window.devicePixelRatio || 1, 2)

    // A canvas can only transfer to an OffscreenCanvas once; deferring lets
    // StrictMode's dev double-mount cancel the throwaway first pass.
    queueMicrotask(() => {
      if (cancelled) return
      worker = new Worker(new URL('./aurora.worker.ts', import.meta.url), {
        type: 'module',
      })
      const offscreen = canvas.transferControlToOffscreen()
      worker.postMessage(
        {
          type: 'init',
          canvas: offscreen,
          palette: rpalette(),
          width: canvas.clientWidth,
          height: canvas.clientHeight,
          dpr: dpr(),
        },
        [offscreen],
      )
      ro = new ResizeObserver(() => {
        worker?.postMessage({
          type: 'resize',
          width: canvas.clientWidth,
          height: canvas.clientHeight,
          dpr: dpr(),
        })
      })
      ro.observe(canvas)
    })

    return () => {
      cancelled = true
      ro?.disconnect()
      worker?.postMessage({ type: 'stop' })
      worker?.terminate()
    }
  }, [])

  return (
    <div {...stylex.props(styles.page)}>
      <canvas ref={canvasRef} {...stylex.props(styles.canvas)} />
      <div {...stylex.props(styles.fine)} />
      <div {...stylex.props(styles.coarse)} />
      <div {...stylex.props(styles.wordmark)}>
        <div {...stylex.props(styles.group)}>
          <div>SALAD.COMPUTER</div>
          <Menu />
        </div>
        <img src={userIcon} alt="user" {...stylex.props(styles.userIcon)} />
      </div>
    </div>
  )
}

export default App
