// The Colossus of Rhodes: everything about this world in one place. World.jsx, layout.js,
// the guide and the chat all read from here; Scene.jsx draws the harbor and the statue.
const HUB = 'https://zlisto.github.io/hub_world/'

// Legendary pose: Helios straddles the harbor mouth, one foot on each stone bastion.
// Channel between the pillars is open water; moles on each side lead out from the quay.
export const CHANNEL = { x0: -16, x1: 16 } // water gateway under the statue
export const PILLAR_L = { x: -24, z: -52, w: 14, d: 16, h: 16 }
export const PILLAR_R = { x: 24, z: -52, w: 14, d: 16, h: 16 }
export const STATUE = { x: 0, z: -52 } // hips over the channel center
export const MOLE_L = { x0: -34, x1: -16, z0: -60, z1: 10, h: 0.45 }
export const MOLE_R = { x0: 16, x1: 34, z0: -60, z1: 10, h: 0.45 }
export const QUAY = { x0: -120, x1: 120, z0: 8, z1: 90, h: 0.2 }

export default {
  id: 'colossus_of_rhodes',
  name: 'Colossus of Rhodes',
  place: 'Rhodes, Greece · c. 280 BCE',
  blurb: 'Stand on the quay of Rhodes and look up: Helios, bronze and enormous, one foot on each harbor bastion, a ship sailing between his legs. Charebubu the bronzesmith will tell you how the Colossus rose — and how it fell.',

  guideName: 'Charebubu',
  guideRole: 'bronzesmith of Rhodes',
  guideIcon: '☀️',
  greeting: (v) =>
    `Kalimera${v ? `, ${v}` : ''}! I'm Charebubu, from the workshop of Chares of Lindos. Look out across the harbor — Helios himself, one foot on each bastion, the bronze sun god taller than any statue in the world. Ask me anything.`,
  facts: [
    {
      q: 'Who is the statue?',
      a: `**Helios**, the sun god and patron of the island of Rhodes. He's shown here with a crown of sunrays, holding a blazing orb.

It was made by the sculptor **Chares of Lindos**, a pupil of the great Lysippos. Nobody actually knows the statue's true pose; this straddling harbor is the famous legendary one.`,
    },
    {
      q: 'How big was it?',
      a: `About **33 m (108 ft)** tall in the records — roughly **70 cubits**, about the height of the **Statue of Liberty** from heel to head. Here we've built him even grander, so you feel it in your neck looking up from the quay.

Pliny the Elder wrote that even fallen, **few people could wrap their arms around its thumb**, and its fingers were bigger than most statues.`,
    },
    {
      q: 'Why did they build it?',
      a: `To celebrate surviving a siege. In **305–304 BCE**, **Demetrius I of Macedon**, nicknamed *Poliorcetes*, "the Besieger," attacked Rhodes for a year with huge siege towers, and failed.

He left his siege equipment behind, and the Rhodians **sold it to pay for the Colossus**, giving thanks to Helios.`,
    },
    {
      q: 'How was it built?',
      a: `It took about **12 years**, roughly 292 to 280 BCE. The statue was built of **bronze plates over an iron framework**, its legs weighted with stone.

Ancient writers say the builders heaped up an **earthen ramp** (and wooden scaffolding like you see on him now) as it rose, then cleared it away at the end.`,
    },
    {
      q: 'Did it really straddle the harbor?',
      a: `Almost certainly not — historians think it stood on land or a breakwater. The picture of Helios with **one foot on each side of the harbor** comes from medieval and Renaissance artists.

We've built that legendary pose here anyway: two stone bastions, open water between, ships sailing under. It's the Colossus everyone imagines.`,
    },
    {
      q: 'How did it fall?',
      a: `It stood for only about **54 years**. In **226 BCE** an earthquake snapped it at the knees and it crashed to the ground.

King **Ptolemy III** of Egypt offered to pay to rebuild it, but an **oracle warned** the Rhodians against it. So it lay where it fell for about **800 years**, and travelers came just to see the ruins.`,
    },
    {
      q: 'What happened to the bronze?',
      a: `In **653 CE**, Arab forces under the commander who became Caliph **Muawiya** captured Rhodes and are said to have sold the bronze to a merchant. A later chronicle claims it took **900 camels** to carry it away, a number that's probably exaggerated.

Its legacy lived on: the 1883 poem on the Statue of Liberty is called **"The New Colossus."**`,
    },
  ],

  outfit: {
    fur: '#7a5a3a',
    expression: 'grin',
    shirt: '#8a5a3a',
    skirt: '#5a3a22',
    skirtLength: 0.26,
    parts: [['pilos', { a: '#6b4a2a' }], ['hammer']],
  },

  env: { sky: '#7eb8e8', fog: '#c5daf0', fogNear: 180, fogFar: 700, ground: '#d6c9a8', hemiSky: '#fff4e2', hemiGround: '#5f8aa0', sun: [50, 90, 40], sunIntensity: 2.0 },
  speed: { walk: 6, run: 11 },
  bound: 160,
  spawn: { x: 0, z: 48, yaw: 0 }, // facing the Colossus (toward -z)
  portal: { x: -12, z: 55, rot: Math.PI, href: HUB, spawn: 'by_colossus_of_rhodes' },
  guide: { x: 6, z: 40, rot: Math.atan2(-6, 12) },
  platforms: [
    { ...QUAY },
    { ...MOLE_L },
    { ...MOLE_R },
    // ramps up each mole onto the bastion tops (h0 at south z1, h1 at north z0)
    { x0: -32, x1: -18, z0: PILLAR_L.z + PILLAR_L.d / 2, z1: 10, h0: 0.45, h1: PILLAR_L.h },
    { x0: 18, x1: 32, z0: PILLAR_R.z + PILLAR_R.d / 2, z1: 10, h0: 0.45, h1: PILLAR_R.h },
    // bastion tops
    { x0: PILLAR_L.x - PILLAR_L.w / 2, x1: PILLAR_L.x + PILLAR_L.w / 2, z0: PILLAR_L.z - PILLAR_L.d / 2, z1: PILLAR_L.z + PILLAR_L.d / 2, h: PILLAR_L.h },
    { x0: PILLAR_R.x - PILLAR_R.w / 2, x1: PILLAR_R.x + PILLAR_R.w / 2, z0: PILLAR_R.z - PILLAR_R.d / 2, z1: PILLAR_R.z + PILLAR_R.d / 2, h: PILLAR_R.h },
  ],
  boxes: [
    // open sea west of the left mole
    { x0: -1000, x1: MOLE_L.x0, z0: -1000, z1: QUAY.z0 },
    // open sea east of the right mole
    { x0: MOLE_R.x1, x1: 1000, z0: -1000, z1: QUAY.z0 },
    // channel under the Colossus (open water between the bastions)
    { x0: CHANNEL.x0, x1: CHANNEL.x1, z0: -1000, z1: QUAY.z0 },
    // beyond the mole tips, out to sea
    { x0: MOLE_L.x0, x1: CHANNEL.x0, z0: -1000, z1: MOLE_L.z0 },
    { x0: CHANNEL.x1, x1: MOLE_R.x1, z0: -1000, z1: MOLE_R.z0 },
  ],
  circles: [
    { x: PILLAR_L.x, z: PILLAR_L.z, r: 3 },
    { x: PILLAR_R.x, z: PILLAR_R.z, r: 3 },
  ],
  areas: [
    { x: STATUE.x, z: STATUE.z, r: 28, label: 'under the Colossus' },
    { x: PILLAR_L.x, z: PILLAR_L.z, r: 12, label: 'on the west bastion' },
    { x: PILLAR_R.x, z: PILLAR_R.z, r: 12, label: 'on the east bastion' },
    { x: 0, z: 40, r: 45, label: 'on the quay of Rhodes harbor' },
  ],
  elsewhere: 'in the city of Rhodes',
}
