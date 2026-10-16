import { useMemo } from 'react'
import * as THREE from 'three'
import { BRONZE, Boat, Box, Cypress, GEO, GOLD, Hills, Instanced, Water, mat } from './kit.jsx'
import { MOLE, STATUE } from './wonder.js'

// The harbor of Rhodes: a stone breakwater running out into the sea, and on a marble pedestal near
// its end, the bronze Colossus of Helios with a crown of sunrays and a raised torch. Behind you,
// the white houses of the city climb the hill; ships ride at anchor in the harbor.

const H = 10 // pedestal height; the statue itself is about 33 m
const P = H + MOLE.h

function Limb({ a, b, r, m }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a)
    const vb = new THREE.Vector3(...b)
    const dir = vb.clone().sub(va)
    const len = dir.length()
    return { pos: va.add(vb).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()), len }
  }, [a, b])
  return (
    <>
      <mesh geometry={GEO.cyl} material={m} position={pos} quaternion={quat} scale={[r, len, r]} />
      <mesh geometry={GEO.sph} material={m} position={b} scale={r} />
    </>
  )
}

function Colossus() {
  const bronze = mat('#b98544', BRONZE)
  const dark = mat('#8a5f2e', BRONZE)
  return (
    <group position={[STATUE.x, 0, STATUE.z]}>
      {/* the white marble pedestal, stepped */}
      <mesh geometry={GEO.cyl} material={mat('#f1ece2')} position={[0, MOLE.h + H / 2, 0]} scale={[5.6, H, 5.6]} />
      <mesh geometry={GEO.cyl} material={mat('#e4ddd0')} position={[0, MOLE.h + 0.6, 0]} scale={[6.4, 1.2, 6.4]} />
      <mesh geometry={GEO.cyl} material={mat('#e4ddd0')} position={[0, P - 0.3, 0]} scale={[6, 0.6, 6]} />
      {/* legs in a relaxed stance, feet on the pedestal */}
      <Limb a={[-1.6, P + 0.8, 0.3]} b={[-1.7, P + 15, 0]} r={1.45} m={bronze} />
      <Limb a={[1.8, P + 0.8, -0.4]} b={[1.6, P + 15, 0]} r={1.45} m={bronze} />
      {[-1.6, 1.8].map((x, i) => (
        <Box key={x} p={[x, P + 0.5, i ? 0.2 : 0.9]} s={[2, 1, 3.8]} m={dark} />
      ))}
      {/* torso: hips, chest, shoulders */}
      <mesh geometry={GEO.cyl} material={bronze} position={[0, P + 16.5, 0]} scale={[3, 4, 2.1]} />
      <mesh geometry={GEO.cyl} material={bronze} position={[0, P + 21, 0]} scale={[3.5, 5.5, 2.3]} />
      <mesh geometry={GEO.sph} material={bronze} position={[0, P + 24, 0]} scale={[4.2, 1.4, 2.4]} />
      {/* head, with a crown of sunrays */}
      <mesh geometry={GEO.cyl} material={bronze} position={[0, P + 25.4, 0]} scale={[1.1, 1.6, 1.1]} />
      <mesh geometry={GEO.sph} material={bronze} position={[0, P + 27.6, 0.1]} scale={[1.9, 2.3, 2]} />
      <mesh geometry={GEO.sph} material={dark} position={[0, P + 28.4, -0.2]} scale={[2, 1.7, 2]} />
      {Array.from({ length: 11 }, (_, i) => {
        const t = -1.5 + (i / 10) * 3
        return (
          <mesh key={i} geometry={GEO.cone} material={mat('#e7b85a', GOLD)} position={[Math.sin(t) * 2.1, P + 29.6, Math.cos(t) * 2.0]} rotation={[Math.cos(t) * 0.45, 0, -Math.sin(t) * 0.45]} scale={[0.35, 2.6, 0.35]} />
        )
      })}
      {/* right arm raised with a torch; left arm lowered, cloak hanging from it */}
      <Limb a={[-3.4, P + 23.8, 0]} b={[-5.0, P + 28.5, 0.4]} r={1.0} m={bronze} />
      <Limb a={[-5.0, P + 28.5, 0.4]} b={[-5.3, P + 33.5, 0.6]} r={0.85} m={bronze} />
      <mesh geometry={GEO.cyl} material={dark} position={[-5.3, P + 35, 0.6]} scale={[0.45, 3.4, 0.45]} />
      <mesh geometry={GEO.cone} material={mat('#ffb347', { emissive: '#ff8a1a', emissiveIntensity: 2.2 })} position={[-5.3, P + 37.6, 0.6]} scale={[0.9, 2.2, 0.9]} />
      <Limb a={[3.4, P + 23.8, 0]} b={[4.4, P + 19, 0.4]} r={1.0} m={bronze} />
      <Limb a={[4.4, P + 19, 0.4]} b={[4.6, P + 14.5, 1.2]} r={0.85} m={bronze} />
      <Box p={[4.9, P + 12.5, 0.6]} s={[1.6, 7, 2.4]} m={dark} />
      <pointLight position={[-5.3, P + 38.5, 2]} color="#ffb060" intensity={40} distance={30} decay={1.6} />
    </group>
  )
}

function City() {
  // white houses with red roofs climbing the hillside behind the quay
  const { walls, roofs } = useMemo(() => {
    const walls = []
    const roofs = []
    let s = 11
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 90; i++) {
      const x = -110 + rnd() * 220
      const z = 55 + rnd() * 110
      if (Math.abs(x) < 16 && z < 70) continue
      const w = 5 + rnd() * 6
      const d = 5 + rnd() * 6
      const h = 4 + rnd() * 5
      const y = (z - 55) * 0.18 // the hill rises away from the harbor
      walls.push({ p: [x, y + h / 2, z], s: [w, h, d] })
      roofs.push({ p: [x, y + h + 0.35, z], s: [w + 0.4, 0.7, d + 0.4] })
    }
    return { walls, roofs }
  }, [])
  return (
    <>
      <mesh rotation={[-Math.PI / 2 + 0.18, 0, 0]} position={[0, 8, 110]}>
        <planeGeometry args={[400, 130]} />
        <meshStandardMaterial color="#cfc29e" roughness={1} />
      </mesh>
      <Instanced items={walls} geometry={GEO.box} material={mat('#f2efe8')} />
      <Instanced items={roofs} geometry={GEO.box} material={mat('#c0603a')} />
    </>
  )
}

export default function Scene() {
  return (
    <>
      <Hills color="#9aa880" r={420} h={40} />
      <Water x0={-500} x1={500} z0={-500} z1={0} y={0.05} color="#2f7fb0" />
      {/* the quay along the shore, and the breakwater out to the statue */}
      <Box p={[0, 0.2, 2]} s={[220, 0.4, 4]} c="#cbbf9f" />
      <Box p={[0, MOLE.h / 2, (MOLE.z0 + MOLE.z1) / 2]} s={[MOLE.x1 - MOLE.x0, MOLE.h, MOLE.z1 - MOLE.z0]} c="#cdc3a6" />
      {/* bollards along the breakwater */}
      {Array.from({ length: 8 }, (_, i) => [-1, 1].map((s) => <mesh key={`${i}${s}`} geometry={GEO.cyl} material={mat('#8a7a5a')} position={[s * 7.3, MOLE.h + 0.4, -6 - i * 6]} scale={[0.25, 0.8, 0.25]} />))}
      {/* the far harbor wall with a round tower */}
      <Box p={[60, 2, -70]} s={[90, 4, 5]} c="#c9bd9b" />
      <mesh geometry={GEO.cyl} material={mat('#c9bd9b')} position={[105, 6, -70]} scale={[6, 12, 6]} />
      <Colossus />
      <City />
      <Boat x={-30} z={-40} r={0.6} />
      <Boat x={34} z={-30} r={-0.4} sail="#e6c9a0" phase={1.3} />
      <Boat x={-55} z={-90} r={1.4} sail="#d9a0a0" phase={2.1} />
      <Boat x={45} z={-110} r={-1.0} phase={0.7} />
      {[
        [-20, 20],
        [22, 18],
        [-40, 30],
        [40, 32],
      ].map(([x, z], i) => (
        <Cypress key={i} x={x} z={z} h={8} />
      ))}
    </>
  )
}
