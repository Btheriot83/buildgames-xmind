import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a,0.,1.); }
`

const FRAG = `
precision mediump float;
uniform float u_t;
uniform vec2 u_res;
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float n = fract(sin(dot(uv*u_res*0.35, vec2(12.9898,78.233))) * 43758.5453);
  float grid = smoothstep(0.02, 0.0, abs(fract(uv.x*28.)-0.5)) * 0.045
             + smoothstep(0.02, 0.0, abs(fract(uv.y*18.)-0.5)) * 0.04;
  float pulse = 0.5 + 0.5 * sin(u_t * 0.7 + uv.x * 6.0);
  vec3 ink = vec3(0.07, 0.08, 0.10);
  vec3 teal = vec3(0.11, 0.55, 0.50);
  vec3 copper = vec3(0.85, 0.52, 0.25);
  vec3 col = ink + teal * (0.04 + 0.03 * pulse) * (1.0 - uv.y * 0.4)
           + copper * 0.03 * uv.x * pulse
           + vec3(n * 0.035);
  col += vec3(grid);
  gl_FragColor = vec4(col, 1.0);
}
`

export function ShaderBg() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uT = gl.getUniformLocation(prog, 'u_t')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    let raf = 0
    let start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.floor(window.innerWidth * dpr)
      const h = Math.floor(window.innerHeight * dpr)
      canvas.width = w
      canvas.height = h
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      gl.viewport(0, 0, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frame = (t: number) => {
      gl.uniform1f(uT, reduced ? 0 : (t - start) / 1000)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="shader-bg" aria-hidden="true" />
}
