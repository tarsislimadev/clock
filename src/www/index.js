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
  fonts: {
    HELVETIKER: './libs/three/examples/fonts/helvetiker_regular.typeface.json'
  }
}

const COLORS = {
  WHITE: 'rgb(255, 255, 255)',
  WHITE1: 'rgb(204, 204, 204)',
  GRAY: 'rgb(153, 153, 153)',
  GRAY1: 'rgb(102, 102, 102)',
  BLACK1: 'rgb(51, 51, 51)',
  BLACK: 'rgb(0, 0, 0)',
}

const scene = new THREE.Scene()

const clock = new THREE.Mesh(
  new THREE.CylinderGeometry(Math.PI * 18 / 12, 2.75, 0.999),
  new THREE.MeshBasicMaterial({ color: COLORS.BLACK1 })
)
scene.add(clock)

const edge = new THREE.Mesh(
  new THREE.CylinderGeometry(+Math.PI / +0.75, +2.75, +1.0),
  new THREE.MeshBasicMaterial({ color: COLORS.WHITE })
)
clock.add(edge)

const origin = new THREE.Mesh(
  new THREE.CylinderGeometry(+Math.PI / +16.0, +0.1, +1.0),
  new THREE.MeshBasicMaterial({ color: COLORS.BLACK1 })
)
origin.position.set(+0.0, +0.4, +0.0)
edge.add(origin)

const hourPointer = new THREE.Mesh(
  new THREE.CylinderGeometry(.05, .01, 4),
  new THREE.MeshBasicMaterial({ color: COLORS.GRAY }),
)
hourPointer.rotation.set(0, 0, -Math.PI / 2)
hourPointer.position.set(0, 0.75, 0)
edge.add(hourPointer)

const minutePointer = new THREE.Mesh(
  new THREE.CylinderGeometry(.05, .01, 4),
  new THREE.MeshBasicMaterial({ color: COLORS.GRAY1 })
)
minutePointer.rotation.set(0, 0, -Math.PI / 2)
minutePointer.position.set(0, 0.75, 0)
edge.add(minutePointer)

const secondPointer = new THREE.Mesh(
  new THREE.CylinderGeometry(.05, .01, 4),
  new THREE.MeshBasicMaterial({ color: COLORS.WHITE1 })
)
secondPointer.rotation.set(0, 0, -Math.PI / 2)
secondPointer.position.set(0, 0.75, 0)
edge.add(secondPointer)

const fonts = {}

const loadFont = (name) => new Promise((res, rej) => {
  if (fonts[name]) return res(fonts[name])
  const loader = new FontLoader()
  loader.load(name, (font) => res(font), () => { }, (err) => rej(err))
})

Array.from(Array(12))
  .forEach((_, angle) => loadFont(__.fonts.HELVETIKER)
    .then((font) => {
      const textGeometry = new TextGeometry((angle == 0 ? '12' : angle).toString(), {
        font,
        size: __.getTextSize(),
        height: __.getTextHeight(),
      })
      textGeometry.center()

      const mesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshBasicMaterial({ color: COLORS.BLACK1 })
      )
      mesh.rotation.set(+Math.PI * +1.5, 0, -Math.PI * +0.5)

      const hyp = Math.PI
      mesh.position.x = hyp * Math.cos(angle * Math.PI / +6.0)
      mesh.position.y = +0.75
      mesh.position.z = hyp * Math.sin(angle * Math.PI / +6.0)

      clock.add(mesh)
    }))

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
  const date = new Date()

  const hourRotation = __.getAngle(-date.getHours() / 12)
  const minuteRotation = __.getAngle(-date.getMinutes() / 60)
  const secondRotation = __.getAngle(-date.getSeconds() / 60)

  hourPointer.rotation.y = hourRotation
  minutePointer.rotation.y = minuteRotation
  secondPointer.rotation.y = secondRotation

  renderer.render(scene, camera)
})
