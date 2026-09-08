import { useEffect, useRef } from 'react'
import * as stylex from '@stylexjs/stylex'
import { fonts } from '@salad/fonts/fonts.stylex'
import { Aurora } from './aurora'

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
    alignItems: 'center',
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
})

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const aurora = new Aurora(canvas)
    aurora.start()
    return () => aurora.stop()
  }, [])

  return (
    <div {...stylex.props(styles.page)}>
      <canvas ref={canvasRef} {...stylex.props(styles.canvas)} />
      <div {...stylex.props(styles.fine)} />
      <div {...stylex.props(styles.coarse)} />
      <div {...stylex.props(styles.wordmark)}>
        <div>SALAD.COMPUTER</div>
      </div>
    </div>
  )
}

export default App
