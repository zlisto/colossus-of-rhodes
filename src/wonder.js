// The Colossus of Rhodes: everything about this world in one place. World.jsx, layout.js,
// the guide and the chat all read from here; Scene.jsx draws the harbor and the statue.
const HUB = 'https://zlisto.github.io/hub_world/'

// the breakwater (mole) running out into the harbor, with the Colossus near its end
export const MOLE = { x0: -8, x1: 8, z0: -64, z1: 0, h: 0.4 }
export const STATUE = { x: 0, z: -52 }

export default {
  id: 'colossus_of_rhodes',
  name: 'Colossus of Rhodes',
  place: 'Rhodes, Greece · c. 280 BCE',
  blurb: 'Walk out along the harbor wall of Rhodes to the feet of the Colossus, the bronze sun god Helios, as tall as the Statue of Liberty. Charebubu the bronzesmith will tell you how it rose, and how it fell.',

  guideName: 'Charebubu',
  guideRole: 'bronzesmith of Rhodes',
  guideIcon: '☀️',
  greeting: (v) =>
    `Kalimera${v ? `, ${v}` : ''}! I'm Charebubu, a bronzesmith from the workshop of Chares of Lindos. Out on the harbor wall stands our masterpiece: Helios, god of the sun, cast in bronze and taller than any statue in the world. Ask me anything.`,
  facts: [
    {
      q: 'Who is the statue?',
      a: `**Helios**, the sun god and patron of the island of Rhodes. He's shown here with a crown of sunrays, holding a torch.

It was made by the sculptor **Chares of Lindos**, a pupil of the great Lysippos. Nobody actually knows the statue's pose; this one is an educated guess.`,
    },
    {
      q: 'How big was it?',
      a: `About **33 m (108 ft)** tall, roughly **70 cubits**, about the height of the **Statue of Liberty** from heel to head. It stood on a tall marble pedestal, so it towered over the harbor.

Pliny the Elder wrote that even fallen, **few people could wrap their arms around its thumb**, and its fingers were bigger than most statues.`,
    },
    {
      q: 'Why did they build it?',
      a: `To celebrate surviving a siege. In **305–304 BCE**, **Demetrius I of Macedon**, nicknamed *Poliorcetes*, "the Besieger," attacked Rhodes for a year with huge siege towers, and failed.

He left his siege equipment behind, and the Rhodians **sold it to pay for the Colossus**, giving thanks to Helios.`,
    },
    {
      q: 'How was it built?',
      a: `It took about **12 years**, roughly 292 to 280 BCE. According to ancient accounts, the statue was built of **bronze plates over an iron framework**, its legs weighted with stone for stability.

One ancient writer says the builders heaped up an **earthen ramp** around it as it rose, then cleared the ramp away at the end.`,
    },
    {
      q: 'Did it really straddle the harbor?',
      a: `Almost certainly not. The famous picture of the Colossus with **one foot on each side of the harbor entrance** comes from medieval and Renaissance artists.

A statue that size couldn't have spanned the harbor, and building it would have closed the port for twelve years. It most likely stood on land or a breakwater near the harbor, as it does here.`,
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
    shirt: '#8a5a3a', // a leather work tunic
    skirt: '#5a3a22', // a smith's apron
    skirtLength: 0.26,
    parts: [['pilos', { a: '#6b4a2a' }], ['hammer']],
  },

  env: { sky: '#8fc3ea', fog: '#cfe2ef', fogNear: 140, fogFar: 520, ground: '#d6c9a8', hemiSky: '#fff4e2', hemiGround: '#5f8aa0', sun: [40, 80, 60], sunIntensity: 1.9 },
  speed: { walk: 6, run: 11 },
  bound: 140,
  spawn: { x: 0, z: 32, yaw: 0 },
  portal: { x: -9, z: 38, rot: Math.PI, href: HUB, spawn: 'by_colossus_of_rhodes' },
  guide: { x: 4, z: 27, rot: Math.atan2(-4, 5) },
  platforms: [{ ...MOLE }],
  boxes: [
    // the sea on either side of the breakwater, and beyond its end
    { x0: -1000, x1: MOLE.x0, z0: -1000, z1: 0 },
    { x0: MOLE.x1, x1: 1000, z0: -1000, z1: 0 },
    { x0: -1000, x1: 1000, z0: -1000, z1: MOLE.z0 },
  ],
  circles: [{ x: STATUE.x, z: STATUE.z, r: 6.6 }],
  areas: [
    { x: STATUE.x, z: STATUE.z, r: 12, label: 'at the feet of the Colossus' },
    { x: 0, z: -30, r: 30, label: 'on the harbor wall' },
    { x: 0, z: 30, r: 40, label: 'on the quay of Rhodes harbor' },
  ],
  elsewhere: 'in the city of Rhodes',
}
