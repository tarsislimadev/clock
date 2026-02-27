import * as THREE from './libs/three/index.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

import { getWidth, getHeight } from './utils/window.js'
import { createCamera } from './utils/3d.js'

const helvetiker = './fonts/helvetiker_regular.typeface.json'

const scene = new THREE.Scene()
const camera = createCamera()
camera.position.set(+0.0, +10.0, +0.0)
camera.lookAt(+0.0, +0.0, +0.0)
camera.rotation.z = -Math.PI / 2

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(getWidth(), getHeight())
document.body.appendChild(renderer.domElement)
document.body.style.margin = '0em'

const mainGroup = new THREE.Group()
scene.add(mainGroup)

const origin = new THREE.Mesh(
  new THREE.CylinderGeometry(Math.PI / 16, .1, 1),
  new THREE.MeshBasicMaterial({ color: 0x333333 })
)
origin.position.set(0, 0.5, 0)
mainGroup.add(origin)

const clock = new THREE.Mesh(
  new THREE.CylinderGeometry(5, 5, 1, 2 ** 8),
  new THREE.MeshBasicMaterial({ color: 0x333333 })
)
mainGroup.add(clock)

const edge = new THREE.Mesh(
  new THREE.CylinderGeometry(4, 4, 1, 2 ** 8),
  new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
)
edge.position.set(0, 0.1, 0)
clock.add(edge)

const hourPointerGroup = new THREE.Group()
hourPointerGroup.rotation.set(0, 0, -Math.PI / 2)
hourPointerGroup.position.set(0, 0.75, 0)
mainGroup.add(hourPointerGroup)

const hourPointer = new THREE.Mesh(
  new THREE.CylinderGeometry(.03, .03, 2),
  new THREE.MeshBasicMaterial({ color: 0x666666 }),
)
hourPointer.position.x = -1 * 1 / 4
hourPointer.position.y = 1.2
hourPointerGroup.add(hourPointer)

const minutePointerGroup = new THREE.Group()
minutePointerGroup.rotation.set(0, 0, -Math.PI / 2)
minutePointerGroup.position.set(0, 0.75, 0)
mainGroup.add(minutePointerGroup)

const minutePointer = new THREE.Mesh(
  new THREE.CylinderGeometry(.03, .03, 2.5),
  new THREE.MeshBasicMaterial({ color: 0x999999 })
)
minutePointer.position.x = -1 * 1 / 8
minutePointer.position.y = 1.2
minutePointerGroup.add(minutePointer)

const secondPointerGroup = new THREE.Group()
secondPointerGroup.rotation.set(0, 0, -Math.PI / 2)
secondPointerGroup.position.set(0, 0.75, 0)
mainGroup.add(secondPointerGroup)

const secondPointer = new THREE.Mesh(
  new THREE.CylinderGeometry(.03, .03, 3),
  new THREE.MeshBasicMaterial({ color: 0xcccccc })
)
secondPointer.position.x = -1 * 1 / 16
secondPointer.position.y = 1.2
secondPointerGroup.add(secondPointer)

const fonts = {}

const loadFont = (name) => new Promise((res, rej) => {
  if (fonts[name]) return res(fonts[name])
  const loader = new FontLoader()
  loader.load(name, (font) => res(font), () => { }, (err) => rej(err))
})

const size = 1 / 2
const height = 1 / 50

const matcap = new THREE.TextureLoader().load('./textTexture.png')

Array.from(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',])
  .forEach((num, angle) => loadFont(helvetiker)
    .then((font) => {
      const textGeometry = new TextGeometry(num, { font, size, height })
      textGeometry.center()

      const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshMatcapMaterial({ matcap })
      )
      textMesh.rotation.set(Math.PI * 3 / 2, 0, -Math.PI / 2)

      const hyp = Math.PI
      textMesh.position.x = hyp * Math.cos(angle * Math.PI / 6)
      textMesh.position.y = 0.75
      textMesh.position.z = hyp * Math.sin(angle * Math.PI / 6)

      scene.add(textMesh)
    }))

const degreeAngle = (angle) => 2 * Math.PI * angle

renderer.setAnimationLoop(() => {
  const date = new Date()

  hourPointerGroup.rotation.y = degreeAngle(-date.getHours() / 12)
  minutePointerGroup.rotation.y = degreeAngle(-date.getMinutes() / 60)
  secondPointerGroup.rotation.y = degreeAngle(-date.getSeconds() / 60)

  renderer.render(scene, camera)
})
