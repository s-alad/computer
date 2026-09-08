import { Aurora } from './aurora'

type InitMsg = {
  type: 'init'
  canvas: OffscreenCanvas
  palette: readonly string[]
  width: number
  height: number
  dpr: number
}
type ResizeMsg = { type: 'resize'; width: number; height: number; dpr: number }
type StopMsg = { type: 'stop' }
type AuroraMessage = InitMsg | ResizeMsg | StopMsg

let engine: Aurora | null = null

self.onmessage = (event: MessageEvent): void => {
  const msg = event.data as AuroraMessage
  if (msg.type === 'init') {
    engine = new Aurora(msg.canvas, msg.palette)
    engine.setSize(msg.width, msg.height, msg.dpr)
    engine.start()
  } else if (msg.type === 'resize') {
    engine?.setSize(msg.width, msg.height, msg.dpr)
  } else if (msg.type === 'stop') {
    engine?.stop()
    engine = null
  }
}
