import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const __ = {
  getWidth: () => window.innerWidth,
  getHeight: () => window.innerHeight,
  getAspect: () => __.getWidth() / __.getHeight(),
  getTextSize: () => (1 / 2),
  getTextHeight: () => 1 / 50,
  getAngle: (angle) => 2 * Math.PI * angle,
  getDate: (date = new Date()) => ({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  }),
  fonts: {
    HELVETIKER: './libs/three/examples/fonts/helvetiker_regular.typeface.json'
  }
}

const COLORS = {
  WHITE: 'rgb(255, 255, 255)',
  GRAY: 'rgb(153, 153, 153)',
  BLACK: 'rgb(0, 0, 0)',
}

const loader = new FontLoader()
const fonts = {}

const loadFont = (name) => new Promise((res, rej) => fonts[name]
  ? res(fonts[name])
  : loader.load(
    name,
    (font) => res(fonts[name] = font),
    undefined,
    (err) => rej(err),
  )
)

const scene = new THREE.Scene()
scene.background = (new THREE.Color(COLORS.WHITE))

const clock = new THREE.Mesh(
  new THREE.CylinderGeometry(+Math.PI * +1.5, +2.75, +0.999),
  new THREE.MeshBasicMaterial({ color: COLORS.BLACK })
)
scene.add(clock)

const edge = new THREE.Mesh(
  new THREE.CylinderGeometry(+4.0, +2.75, +1.0),
  new THREE.MeshBasicMaterial({ color: COLORS.WHITE })
)
clock.add(edge)

const origin = new THREE.Mesh(
  new THREE.CylinderGeometry(+0.2, +0.1, +1.0),
  new THREE.MeshBasicMaterial({ color: COLORS.BLACK })
)
origin.position.set(+0.0, +0.5, +0.0)
edge.add(origin)

const [
  hourPointer,
  minutePointer,
  secondPointer,
] = Array.from(Array(3)).map(() => {
  const p = new THREE.Mesh(
    new THREE.CylinderGeometry(+0.05, +0.01, +4.0),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0xCCCCCC) })
  )

  p.rotation.set(+0.0, +0.0, -Math.PI / +2.0)
  p.position.set(+0.0, +0.75, +0.0)

  edge.add(p)

  return p
}).map((p, ix) => {
  const [r, g, b,] = p.material.color.toArray()
  p.material.color.fromArray([(r / ix), (g / ix), (b / ix),])
  return p
})

const nArray = []
const nGroup = new THREE.Group()
clock.add(nGroup)

function showLetters(arr = []) {
  nArray.map((mesh) => nGroup.remove(mesh))

  return arr
    .map((text, angle) => loadFont(__.fonts.HELVETIKER)
      .then((font) => {
        const textGeometry = new TextGeometry(text, {
          font,
          size: __.getTextSize(),
          height: __.getTextHeight(),
        })
        textGeometry.center()

        const mesh = new THREE.Mesh(
          textGeometry,
          new THREE.MeshBasicMaterial({ color: COLORS.BLACK })
        )
        mesh.rotation.x = +Math.PI * +1.5
        mesh.rotation.z = -Math.PI * +0.5

        const hyp = Math.PI
        mesh.position.x = hyp * Math.cos(angle * Math.PI / +6.0)
        mesh.position.y = +0.5
        mesh.position.z = hyp * Math.sin(angle * Math.PI / +6.0)

        nGroup.add(mesh)
        nArray.push(mesh)
      }))
}


// // //
// // //

const camera = new THREE.PerspectiveCamera(30, __.getAspect())
camera.position.set(-10.0, +20.0, +0.0)
camera.lookAt(+0.0, +0.0, +0.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(__.getWidth(), __.getHeight())
document.body.appendChild(renderer.domElement)

document.body.style.margin = '0rem'

renderer.setAnimationLoop(() => {
  const { hours, minutes, seconds } = __.getDate()

  hourPointer.rotation.y = __.getAngle(-hours / 12)
  minutePointer.rotation.y = __.getAngle(-minutes / 60)
  secondPointer.rotation.y = __.getAngle(-seconds / 60)

  renderer.render(scene, camera)
})

function showNumbers() {
  showLetters(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])
}

function showRomans() {
  showLetters(['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'])
}

window.addEventListener('keypress', ({ key }) => {
  switch (key) {
    case 'a': return showNumbers()
    case 's': return showRomans()
    case 'd': return showLetters([])
  }
})

showNumbers()
