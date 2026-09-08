export const CELL_SIZE = 20 // px per pixel-block; smaller = finer
export const SPEED = 1 // 0..10; 0 freezes

const LATTICE = 4

export class Aurora {
  private readonly canvas: OffscreenCanvas
  private readonly ctx: OffscreenCanvasRenderingContext2D
  private readonly pal: readonly string[]
  private raf = 0
  private last = 0
  private t = 0
  private dpr = 1

  private off: OffscreenCanvas | null = null
  private offCtx: OffscreenCanvasRenderingContext2D | null = null
  private img: ImageData | null = null
  private lut: Uint8ClampedArray | null = null
  private lutPal: readonly string[] | null = null
  private lat: Float32Array | null = null
  private gw = 0
  private gh = 0
  private blk: Float32Array | null = null
  private msk: Uint8Array | null = null
  private grainSeed = 2463534242

  constructor(canvas: OffscreenCanvas, pal: readonly string[]) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Aurora: 2d canvas context unavailable')
    this.canvas = canvas
    this.ctx = ctx
    this.pal = pal
  }

  setSize(width: number, height: number, dpr: number): void {
    this.canvas.width = Math.round((width || 1200) * dpr)
    this.canvas.height = Math.round((height || 800) * dpr)
    this.dpr = dpr
    this.draw()
  }

  start(): void {
    this.raf = requestAnimationFrame(this.loop)
  }

  stop(): void {
    cancelAnimationFrame(this.raf)
  }

  private readonly loop = (now: number): void => {
    this.raf = requestAnimationFrame(this.loop)
    const sp = SPEED
    if (sp <= 0) {
      if (this.t === 0) {
        this.t = 1
        this.draw()
      }
      return
    }
    const fps = Math.min(60, 8 + sp * 6)
    if (now - this.last < 1000 / fps) return
    this.last = now
    this.t += sp > 8 ? 2 : 1
    this.draw()
  }

  private vnoise(x: number, y: number): number {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
    const hash = (a: number, b: number): number => {
      const s = Math.sin(a * 127.1 + b * 311.7 + 0.37) * 43758.5453
      return s - Math.floor(s)
    }
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }

  private fbm(x: number, y: number): number {
    let s = 0, a = 0.5, f = 1
    for (let o = 0; o < 4; o++) {
      s += a * this.vnoise(x * f, y * f)
      f *= 2.03
      a *= 0.5
    }
    return s / 0.9375
  }

  private ensureBuffers(lw: number, lh: number): boolean {
    const cur = this.off
    if (cur && this.offCtx && this.img && cur.width === lw && cur.height === lh) return true
    const off = new OffscreenCanvas(lw, lh)
    const ctx = off.getContext('2d')
    if (!ctx) return false
    this.off = off
    this.offCtx = ctx
    this.img = ctx.createImageData(lw, lh)
    return true
  }

  private ensureLut(pal: readonly string[]): void {
    if (this.lutPal === pal && this.lut) return
    const stops = pal.slice(0, 8).map((hex) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ])
    const lut = new Uint8ClampedArray(256 * 3)
    for (let i = 0; i < 256; i++) {
      const p = (i / 255) * (stops.length - 1)
      const k = Math.min(stops.length - 2, Math.floor(p))
      const f = p - k
      const lo = stops[k]!, hi = stops[k + 1]!
      for (let ch = 0; ch < 3; ch++) lut[i * 3 + ch] = lo[ch]! + (hi[ch]! - lo[ch]!) * f
    }
    this.lut = lut
    this.lutPal = pal
  }

  private buildField(lw: number, lh: number, t: number): void {
    const gw = Math.ceil(lw / LATTICE) + 1, gh = Math.ceil(lh / LATTICE) + 1
    let lat = this.lat
    if (!lat || lat.length !== gw * gh) lat = new Float32Array(gw * gh)
    const asp = lw / lh
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        const x = (gx * LATTICE) / lw, y = (gy * LATTICE) / lh
        const px = x * 2.6 * asp * 0.55, py = y * 2.2
        const qx = this.fbm(px * 0.7 + t * 0.45, py * 0.7 - t * 0.12)
        const qy = this.fbm(px * 0.7 + 5.2, py * 0.7 + 1.3 + t * 0.18)
        const wx = px + 1.7 * (qx - 0.5) + t * 0.3, wy = py * 0.55 + 1.7 * (qy - 0.5)
        const n = this.fbm(wx, wy)
        const base = 0.15 + 0.7 * (y * 0.75 + x * 0.25) - 0.25 * Math.sin(y * 3.1 - x * 1.4 + t * 0.4)
        lat[gy * gw + gx] = Math.max(0, Math.min(1, 0.55 * ((n - 0.2) / 0.6) + 0.45 * base))
      }
    }
    this.lat = lat
    this.gw = gw
    this.gh = gh
  }

  private sample(x: number, y: number): number {
    const lat = this.lat
    if (!lat) return 0
    const gw = this.gw, gh = this.gh
    const fx = Math.min(gw - 1.001, x / LATTICE), fy = Math.min(gh - 1.001, y / LATTICE)
    const x0 = Math.floor(fx), y0 = Math.floor(fy), u = fx - x0, v = fy - y0, i = y0 * gw + x0
    const a = lat[i]!, b = lat[i + 1]!, cc = lat[i + gw]!, d = lat[i + gw + 1]!
    return a + (b - a) * u + (cc - a) * v + (a - b - cc + d) * u * v
  }

  private buildBlocks(lw: number, lh: number, cell: number, t: number): { bs: number; bw: number } {
    const dpr = this.dpr || 1
    const asp = lw / lh
    const bs = Math.max(3, Math.round(cell / (dpr * 2)))
    const bw = Math.ceil(lw / bs), bh = Math.ceil(lh / bs)
    let blk = this.blk, msk = this.msk
    if (!blk || !msk || blk.length !== bw * bh) {
      blk = new Float32Array(bw * bh)
      msk = new Uint8Array(bw * bh)
    }
    for (let by = 0; by < bh; by++) {
      for (let bx = 0; bx < bw; bx++) {
        const cx = bx * bs + bs / 2, cy = by * bs + bs / 2, i = by * bw + bx
        const nb = this.sample(cx, cy)
        const m = this.fbm((cx / lw) * 1.6 * asp * 0.55 + 3.1 + t * 0.08, (cy / lh) * 1.6 + 7.7 - t * 0.05)
        msk[i] = m > 0.56 || (m > 0.5 && Math.abs(nb - 0.5) < 0.12) ? 1 : 0
        blk[i] = Math.floor(nb * 11) / 11 + 0.045
      }
    }
    this.blk = blk
    this.msk = msk
    return { bs, bw }
  }

  private renderPixels(lw: number, lh: number, bs: number, bw: number): void {
    const img = this.img, lut = this.lut, blk = this.blk, msk = this.msk
    if (!img || !lut || !blk || !msk) return
    const data = img.data
    let rs = this.grainSeed || 2463534242
    for (let y = 0; y < lh; y++) {
      const byRow = Math.floor(y / bs) * bw
      for (let x = 0; x < lw; x++) {
        const bi = byRow + Math.floor(x / bs)
        const val = msk[bi] ? blk[bi]! : this.sample(x, y)
        rs ^= rs << 13
        rs ^= rs >>> 17
        rs ^= rs << 5
        const g = ((rs & 255) - 128) * 0.16
        const li = Math.max(0, Math.min(255, Math.round(val * 255))) * 3
        const o = (y * lw + x) * 4
        data[o] = lut[li]! + g
        data[o + 1] = lut[li + 1]! + g
        data[o + 2] = lut[li + 2]! + g
        data[o + 3] = 255
      }
    }
    this.grainSeed = rs
  }

  private drawGrid(cell: number): void {
    const c = this.canvas, ctx = this.ctx, dpr = this.dpr || 1
    ctx.fillStyle = 'rgba(255,255,255,0.075)'
    for (let x = 0; x < c.width; x += cell) ctx.fillRect(x, 0, dpr, c.height)
    for (let y = 0; y < c.height; y += cell) ctx.fillRect(0, y, c.width, dpr)
    ctx.fillStyle = 'rgba(0,0,0,0.10)'
    for (let x = dpr; x < c.width; x += cell) ctx.fillRect(x, 0, dpr, c.height)
    for (let y = dpr; y < c.height; y += cell) ctx.fillRect(0, y, c.width, dpr)
  }

  private draw(): void {
    const c = this.canvas, ctx = this.ctx, dpr = this.dpr || 1
    const cell = Math.max(4, CELL_SIZE) * dpr
    const lw = Math.max(4, Math.round(c.width / (dpr * 2)))
    const lh = Math.max(4, Math.round(c.height / (dpr * 2)))
    if (!this.ensureBuffers(lw, lh)) return
    this.ensureLut(this.pal)
    const t = this.t * 0.02
    this.buildField(lw, lh, t)
    const { bs, bw } = this.buildBlocks(lw, lh, cell, t)
    this.renderPixels(lw, lh, bs, bw)
    const off = this.off, offCtx = this.offCtx, img = this.img
    if (!off || !offCtx || !img) return
    offCtx.putImageData(img, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(off, 0, 0, c.width, c.height)
    this.drawGrid(cell)
  }
}
