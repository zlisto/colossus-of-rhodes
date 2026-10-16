import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BRONZE, Boat, Box, Cypress, GEO, GOLD, Hills, Instanced, Water, mat } from './kit.jsx'
import Labubu from './guide/Labubu.jsx'
import { MOLE_L, MOLE_R, PILLAR_L, PILLAR_R, QUAY, STATUE } from './wonder.js'

// Legendary Colossus: Helios straddles the harbor mouth on two stone bastions, scaffolding still
// clinging to his legs, while a red-sailed ship (with a Labubu aboard) loops through the channel.

const WOOD = '#6b4a28'
const WOOD_LT = '#8a6236'
const STONE = '#c9bd9b'
const STONE_DK = '#b0a488'
const BRONZE_C = '#b98544'
const BRONZE_DK = '#8a5f2e'

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

function Bastion({ x, z, w, d, h, tower = false }) {
  // stepped stone harbor fortification the Colossus stands on
  const tiers = [
    { y: h * 0.22, s: [w * 1.15, h * 0.44, d * 1.1] },
    { y: h * 0.55, s: [w, h * 0.28, d] },
    { y: h * 0.82, s: [w * 0.88, h * 0.28, d * 0.88] },
  ]
  return (
    <group position={[x, 0, z]}>
      {tiers.map((t, i) => (
        <Box key={i} p={[0, t.y, 0]} s={t.s} c={i % 2 ? STONE_DK : STONE} />
      ))}
      {/* battlement teeth along the top */}
      {[-1, 1].flatMap((sx) =>
        [-1, 0, 1].map((sz) => (
          <Box key={`${sx}${sz}`} p={[(w * 0.4) * sx, h + 0.7, (d * 0.32) * sz]} s={[w * 0.18, 1.4, d * 0.16]} c={STONE} />
        )),
      )}
      {tower && (
        <>
          <mesh geometry={GEO.cyl} material={mat(STONE)} position={[0, h + 4, -d * 0.15]} scale={[w * 0.28, 8, w * 0.28]} />
          <mesh geometry={GEO.cyl} material={mat(STONE_DK)} position={[0, h + 8.4, -d * 0.15]} scale={[w * 0.32, 0.8, w * 0.32]} />
        </>
      )}
      {/* foot plinth on top */}
      <Box p={[0, h + 0.5, 0]} s={[6.5, 1, 8]} c="#e4ddd0" />
    </group>
  )
}

function Scaffolding({ footL, footR, hipY }) {
  // wooden lattice around the legs and up the left side of the torso (as in the engraving)
  const beams = useMemo(() => {
    const out = []
    const wood = (p, s, r = 0) => out.push({ p, s, r })
    const cage = (cx, cz, y0, y1, rx, rz) => {
      for (let y = y0; y <= y1; y += 3.2) {
        wood([cx - rx, y, cz], [0.35, 0.35, rz * 2])
        wood([cx + rx, y, cz], [0.35, 0.35, rz * 2])
        wood([cx, y, cz - rz], [rx * 2, 0.35, 0.35])
        wood([cx, y, cz + rz], [rx * 2, 0.35, 0.35])
      }
      for (let i = 0; i < 5; i++) {
        const t = i / 4
        const x = cx - rx + t * rx * 2
        wood([x, (y0 + y1) / 2, cz - rz], [0.28, y1 - y0, 0.28])
        wood([x, (y0 + y1) / 2, cz + rz], [0.28, y1 - y0, 0.28])
      }
    }
    cage(footL[0], footL[2], footL[1] + 2, hipY - 2, 4.5, 4)
    cage(footR[0], footR[2], footR[1] + 2, hipY - 4, 4.5, 4)
    // left torso cage
    cage(-5, STATUE.z, hipY, hipY + 22, 5, 4.5)
    // diagonal braces between legs
    for (let i = 0; i < 6; i++) {
      const y = footL[1] + 6 + i * 5
      wood([0, y, STATUE.z], [Math.abs(footR[0] - footL[0]) * 0.85, 0.3, 0.3])
    }
    return out
  }, [footL, footR, hipY])
  return <Instanced items={beams} geometry={GEO.box} material={mat(WOOD, { roughness: 0.95 })} />
}

function Colossus() {
  const bronze = mat(BRONZE_C, BRONZE)
  const dark = mat(BRONZE_DK, BRONZE)
  const cloth = mat('#9a6b3c', { roughness: 0.9 })
  // feet on bastion tops; hips over the channel — deliberately enormous
  const fl = [PILLAR_L.x, PILLAR_L.h + 1.2, PILLAR_L.z]
  const fr = [PILLAR_R.x, PILLAR_R.h + 1.2, PILLAR_R.z]
  const kneeL = [PILLAR_L.x + 2, PILLAR_L.h + 28, STATUE.z + 1]
  const kneeR = [PILLAR_R.x - 2, PILLAR_R.h + 28, STATUE.z - 1]
  const hipY = PILLAR_L.h + 48
  const hip = [0, hipY, STATUE.z]
  const chestY = hipY + 18
  const shoulderY = chestY + 10
  const headY = shoulderY + 10

  return (
    <group>
      <Bastion {...PILLAR_L} tower />
      <Bastion {...PILLAR_R} />

      {/* legs straddling the channel */}
      <Limb a={fl} b={kneeL} r={3.2} m={bronze} />
      <Limb a={kneeL} b={hip} r={3.6} m={bronze} />
      <Limb a={fr} b={kneeR} r={3.2} m={bronze} />
      <Limb a={kneeR} b={hip} r={3.6} m={bronze} />
      {/* feet */}
      <Box p={[fl[0], fl[1] + 0.6, fl[2] + 1.2]} s={[5.5, 2.2, 9]} m={dark} />
      <Box p={[fr[0], fr[1] + 0.6, fr[2] + 1.2]} s={[5.5, 2.2, 9]} m={dark} />

      {/* hips, tunic, torso */}
      <mesh geometry={GEO.cyl} material={bronze} position={[0, hipY + 2, STATUE.z]} scale={[7.5, 6, 5]} />
      <mesh geometry={GEO.sph} material={cloth} position={[0, hipY + 4, STATUE.z + 0.5]} scale={[8.2, 5, 5.5]} />
      <mesh geometry={GEO.cyl} material={bronze} position={[0, chestY, STATUE.z]} scale={[8.5, 14, 5.5]} />
      <mesh geometry={GEO.sph} material={bronze} position={[0, shoulderY, STATUE.z]} scale={[10, 3.5, 5.8]} />

      {/* head + sunburst crown */}
      <mesh geometry={GEO.cyl} material={bronze} position={[0, headY - 2, STATUE.z]} scale={[2.4, 3.5, 2.4]} />
      <mesh geometry={GEO.sph} material={bronze} position={[0, headY + 2.5, STATUE.z + 0.4]} scale={[4.2, 5, 4.4]} />
      <mesh geometry={GEO.sph} material={dark} position={[0, headY + 4.5, STATUE.z - 0.6]} scale={[4.4, 3.2, 4.2]} />
      {Array.from({ length: 12 }, (_, i) => {
        const t = (i / 12) * Math.PI * 2
        return (
          <mesh
            key={i}
            geometry={GEO.cone}
            material={mat('#e7b85a', GOLD)}
            position={[Math.sin(t) * 4.4, headY + 7.2, STATUE.z + Math.cos(t) * 4.0]}
            rotation={[Math.cos(t) * 0.5, 0, -Math.sin(t) * 0.5]}
            scale={[0.55, 4.2, 0.55]}
          />
        )
      })}

      {/* right arm out with blazing orb; left arm bent at the side */}
      <Limb a={[-9, shoulderY, STATUE.z]} b={[-22, shoulderY - 2, STATUE.z + 4]} r={2.2} m={bronze} />
      <Limb a={[-22, shoulderY - 2, STATUE.z + 4]} b={[-30, shoulderY - 8, STATUE.z + 6]} r={1.9} m={bronze} />
      <mesh geometry={GEO.sph} material={mat('#ff9a2a', { emissive: '#ff6a00', emissiveIntensity: 3.2, roughness: 0.25 })} position={[-30, shoulderY - 8, STATUE.z + 6]} scale={3.2} />
      {Array.from({ length: 10 }, (_, i) => {
        const t = (i / 10) * Math.PI * 2
        return (
          <mesh
            key={i}
            geometry={GEO.cone}
            material={mat('#ffb347', { emissive: '#ff8a1a', emissiveIntensity: 2 })}
            position={[-30 + Math.cos(t) * 3.6, shoulderY - 8 + Math.sin(t) * 3.6, STATUE.z + 6]}
            rotation={[0, 0, t + Math.PI / 2]}
            scale={[0.35, 3.8, 0.35]}
          />
        )
      })}
      <pointLight position={[-30, shoulderY - 8, STATUE.z + 8]} color="#ffb060" intensity={120} distance={80} decay={1.4} />

      <Limb a={[9, shoulderY, STATUE.z]} b={[14, shoulderY - 10, STATUE.z + 2]} r={2.2} m={bronze} />
      <Limb a={[14, shoulderY - 10, STATUE.z + 2]} b={[12, hipY + 8, STATUE.z + 4]} r={1.9} m={bronze} />

      <Scaffolding footL={fl} footR={fr} hipY={hipY} />
    </group>
  )
}

function HarborShip() {
  // fixed oval patrol through the channel under the Colossus; Labubu rides the deck
  const ref = useRef()
  const bob = useRef(0)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.12 // full loop ~52s
    const x = Math.sin(t) * 7
    const z = STATUE.z + Math.cos(t) * 48
    const dx = Math.cos(t) * 7
    const dz = -Math.sin(t) * 48
    bob.current = Math.sin(clock.elapsedTime * 1.4) * 0.14
    ref.current.position.set(x, 0.2 + bob.current, z)
    ref.current.rotation.y = Math.atan2(dx, dz)
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.9) * 0.04
  })
  return (
    <group ref={ref}>
      {/* hull */}
      <Box p={[0, 0.45, 0]} s={[3.2, 1.1, 11]} c="#6a3d1c" />
      <Box p={[0, 0.95, 4.2]} r={[0.45, 0, 0]} s={[2.6, 0.4, 2.2]} c="#6a3d1c" />
      <Box p={[0, 0.95, -4.4]} r={[-0.35, 0, 0]} s={[2.4, 0.35, 1.8]} c="#5a3218" />
      {/* deck rail */}
      <Box p={[1.4, 1.15, 0]} s={[0.15, 0.4, 9]} c="#8a5a30" />
      <Box p={[-1.4, 1.15, 0]} s={[0.15, 0.4, 9]} c="#8a5a30" />
      {/* mast + red square sail with a sun disc */}
      <mesh geometry={GEO.cyl} material={mat('#4a2e18')} position={[0, 5.2, 0.4]} scale={[0.14, 8.2, 0.14]} />
      <Box p={[0, 5.4, 0.55]} s={[6.4, 5.8, 0.08]} c="#c0392b" />
      <mesh geometry={GEO.cyl} material={mat('#e8c547')} position={[0, 5.4, 0.62]} scale={[1.1, 0.15, 1.1]} rotation={[Math.PI / 2, 0, 0]} />
      {/* Labubu sailor on the foredeck */}
      <Labubu position={[0.35, 1.15, 2.4]} rotation={0} height={0.85} fur="#5a3d2e" expression="grin" shirt="#c0392b" anim="wave" phase={0.4} />
    </group>
  )
}

function City() {
  // white houses with red roofs on flat ground behind the quay — bottoms sit on y = 0
  const { walls, roofs } = useMemo(() => {
    const walls = []
    const roofs = []
    let s = 11
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 90; i++) {
      const x = -110 + rnd() * 220
      const z = 70 + rnd() * 100
      if (Math.abs(x) < 18 && z < 95) continue // keep the approach clear
      const w = 5 + rnd() * 6
      const d = 5 + rnd() * 6
      const h = 4 + rnd() * 5
      walls.push({ p: [x, h / 2, z], s: [w, h, d] })
      roofs.push({ p: [x, h + 0.35, z], s: [w + 0.4, 0.7, d + 0.4] })
    }
    return { walls, roofs }
  }, [])
  return (
    <>
      {/* gentle rise of land behind the houses (flat slab, not a tilted plane that misses their feet) */}
      <Box p={[0, 0.15, 130]} s={[280, 0.3, 140]} c="#cfc29e" />
      <Instanced items={walls} geometry={GEO.box} material={mat('#f2efe8')} />
      <Instanced items={roofs} geometry={GEO.box} material={mat('#c0603a')} />
    </>
  )
}

function Moles() {
  return (
    <>
      <Box
        p={[(MOLE_L.x0 + MOLE_L.x1) / 2, MOLE_L.h / 2, (MOLE_L.z0 + MOLE_L.z1) / 2]}
        s={[MOLE_L.x1 - MOLE_L.x0, MOLE_L.h, MOLE_L.z1 - MOLE_L.z0]}
        c="#cdc3a6"
      />
      <Box
        p={[(MOLE_R.x0 + MOLE_R.x1) / 2, MOLE_R.h / 2, (MOLE_R.z0 + MOLE_R.z1) / 2]}
        s={[MOLE_R.x1 - MOLE_R.x0, MOLE_R.h, MOLE_R.z1 - MOLE_R.z0]}
        c="#cdc3a6"
      />
      <Box p={[0, QUAY.h / 2, (QUAY.z0 + QUAY.z1) / 2]} s={[QUAY.x1 - QUAY.x0, QUAY.h, QUAY.z1 - QUAY.z0]} c="#cbbf9f" />
      {/* bollards */}
      {Array.from({ length: 7 }, (_, i) =>
        [-1, 1].map((side) => (
          <mesh key={`${i}${side}`} geometry={GEO.cyl} material={mat('#8a7a5a')} position={[side * 17.5, MOLE_L.h + 0.4, -4 - i * 7]} scale={[0.28, 0.8, 0.28]} />
        )),
      )}
    </>
  )
}

export default function Scene() {
  return (
    <>
      <Hills color="#9aa880" r={480} h={45} />
      <Water x0={-600} x1={600} z0={-600} z1={QUAY.z0} y={0.05} color="#2f7fb0" />
      {/* water also fills the channel under the Colossus (already in the plane above) */}
      <Moles />
      <Colossus />
      <HarborShip />
      {/* a few idle boats further out */}
      <Boat x={-55} z={-110} r={1.2} sail="#e6c9a0" phase={1.1} />
      <Boat x={60} z={-95} r={-0.7} sail="#d9a0a0" phase={2.0} />
      <City />
      {[
        [-28, 28],
        [30, 26],
        [-50, 38],
        [48, 40],
        [-15, 60],
        [18, 62],
      ].map(([x, z], i) => (
        <Cypress key={i} x={x} z={z} h={8 + (i % 3)} />
      ))}
    </>
  )
}
