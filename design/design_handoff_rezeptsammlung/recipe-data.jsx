// Recipe data + placeholder image generator
// All images are "warm gradient" placeholders since we have no real photos —
// each recipe gets a unique appetizing hue + monospace caption.

const RECIPES = [
  {
    id: 'zucchini',
    title: 'Zucchinipuffer',
    minutes: 25,
    portions: 4,
    labels: ['Mittagessen', 'vegetarisch', 'warm', 'schnell'],
    photo: 'images/zucchini.png',
    // warm sage → golden butter
    tint: ['#bcc28a', '#e8d59b', '#a8a05c'],
    ingredients: [
      ['Zucchini', '500 g'],
      ['Eier', '2'],
      ['Mehl', '4 EL'],
      ['Parmesan', '60 g'],
      ['Knoblauchzehe', '1'],
      ['Petersilie', '½ Bund'],
      ['Olivenöl', '3 EL'],
      ['Salz, Pfeffer, Muskat', 'n. B.'],
    ],
    steps: [
      'Zucchini grob raspeln, mit 1 TL Salz mischen und 10 Min. ziehen lassen. Dann kräftig ausdrücken.',
      'Eier, Mehl, geriebenen Parmesan, gehackten Knoblauch und Petersilie zur Masse geben. Mit Pfeffer und Muskat würzen.',
      'Olivenöl in beschichteter Pfanne erhitzen. Pro Puffer 1 EL Masse hineingeben, leicht flach drücken.',
      'Bei mittlerer Hitze pro Seite 3–4 Min. goldbraun braten. Auf Küchenpapier abtropfen lassen.',
      'Mit Kräuterquark oder Joghurtdip servieren.',
    ],
  },
  {
    id: 'kraut',
    title: 'Krautnudeln',
    minutes: 35,
    portions: 4,
    labels: ['Abendessen', 'vegetarisch', 'warm'],
    // butter cream → pale gold
    tint: ['#efe3c4', '#d7b27a', '#c69558'],
    ingredients: [
      ['Spitzkohl', '½ Kopf'],
      ['Bandnudeln', '400 g'],
      ['Zwiebel', '1'],
      ['Butter', '40 g'],
      ['Kümmel', '1 TL'],
      ['Sauerrahm', '150 g'],
      ['Schnittlauch', '½ Bund'],
      ['Salz, Pfeffer', 'n. B.'],
    ],
    steps: [
      'Spitzkohl in feine Streifen schneiden, Zwiebel würfeln.',
      'Butter in einer grossen Pfanne schmelzen. Zwiebel und Kümmel anschwitzen.',
      'Spitzkohl zugeben, salzen und bei mittlerer Hitze 15 Min. weich schmoren — er soll Farbe bekommen.',
      'Bandnudeln nach Packungsanleitung al dente kochen, etwas Nudelwasser auffangen.',
      'Nudeln zum Kraut geben, mit Sauerrahm und 2 EL Nudelwasser cremig binden. Mit Schnittlauch bestreuen.',
    ],
  },
  {
    id: 'kasknoedel',
    title: 'Kaspressknödel',
    minutes: 40,
    portions: 4,
    labels: ['Mittagessen', 'vegetarisch', 'warm', 'Schweizer Küche'],
    // golden crust
    tint: ['#d49858', '#b87338', '#8a4a1f'],
    ingredients: [
      ['Knödelbrot', '250 g'],
      ['Milch', '250 ml'],
      ['Eier', '3'],
      ['Bergkäse, gerieben', '180 g'],
      ['Zwiebel', '1'],
      ['Schnittlauch', '1 Bund'],
      ['Butterschmalz', '3 EL'],
      ['Salz, Pfeffer, Muskat', 'n. B.'],
    ],
    steps: [
      'Milch erwärmen, über das Knödelbrot giessen und 15 Min. ziehen lassen.',
      'Zwiebel fein würfeln und in etwas Butter glasig dünsten.',
      'Eier, Bergkäse, Zwiebel und gehackten Schnittlauch zur Brotmasse geben. Mit Salz, Pfeffer und Muskat würzen.',
      'Aus der Masse flache Knödel formen (ca. 8 Stück).',
      'Butterschmalz in einer Pfanne erhitzen. Knödel pro Seite 4–5 Min. goldbraun braten.',
      'Mit Sauerkraut oder grünem Salat servieren.',
    ],
  },
  {
    id: 'gratin',
    title: 'Gemüsegratin',
    minutes: 55,
    portions: 4,
    labels: ['Abendessen', 'vegetarisch', 'warm'],
    // tomato/paprika orange
    tint: ['#e2a96b', '#c45a2c', '#8b3416'],
    ingredients: [
      ['Kartoffeln', '500 g'],
      ['Zucchini', '2'],
      ['Tomaten', '3'],
      ['Sahne', '200 ml'],
      ['Milch', '100 ml'],
      ['Gruyère, gerieben', '120 g'],
      ['Knoblauchzehen', '2'],
      ['Thymian', '4 Zweige'],
      ['Salz, Pfeffer', 'n. B.'],
    ],
    steps: [
      'Ofen auf 200 °C vorheizen. Auflaufform mit Butter ausstreichen.',
      'Kartoffeln, Zucchini und Tomaten in 3–4 mm dünne Scheiben schneiden.',
      'Gemüse abwechselnd dachziegelartig in die Form schichten. Mit Salz, Pfeffer und Thymianblättchen würzen.',
      'Sahne mit Milch und gepresstem Knoblauch verrühren, über das Gemüse giessen.',
      'Mit Gruyère bestreuen. 40 Min. backen, bis die Oberfläche goldbraun ist.',
      'Vor dem Servieren 5 Min. ruhen lassen.',
    ],
  },
  {
    id: 'porreepesto',
    title: 'Nudeln mit Porree und Walnusspesto',
    minutes: 30,
    portions: 4,
    labels: ['Mittagessen', 'vegetarisch', 'warm', 'schnell'],
    // leek green → walnut brown
    tint: ['#a8b878', '#7a6448', '#3e3324'],
    ingredients: [
      ['Bandnudeln', '400 g'],
      ['Porree (Lauch)', '2 Stangen'],
      ['Walnusskerne', '100 g'],
      ['Parmesan, gerieben', '50 g'],
      ['Olivenöl', '80 ml'],
      ['Knoblauchzehe', '1'],
      ['Zitrone (Abrieb + Saft)', '½'],
      ['Petersilie', '½ Bund'],
      ['Butter', '20 g'],
      ['Salz, Pfeffer', 'n. B.'],
    ],
    steps: [
      'Walnusskerne in einer trockenen Pfanne bei mittlerer Hitze 3–4 Min. rösten, bis sie duften. Abkühlen lassen, ein paar Stück für die Deko zur Seite legen.',
      'Für das Pesto: Walnüsse, Knoblauch, Parmesan, Petersilie, Zitronenabrieb und Olivenöl im Mixer grob pürieren — die Konsistenz darf rustikal-stückig sein. Mit Salz und Pfeffer abschmecken.',
      'Porree halbieren, gründlich waschen und in feine Halbringe schneiden.',
      'Butter in einer breiten Pfanne schmelzen. Porree mit einer Prise Salz bei mittlerer Hitze 8–10 Min. weich dünsten, nicht bräunen.',
      'Nudeln in reichlich Salzwasser al dente kochen. Eine Tasse Nudelwasser auffangen, dann abgiessen.',
      'Nudeln zum Porree in die Pfanne geben, Pesto und einen Schuss Nudelwasser zugeben, kurz schwenken — alles soll cremig glänzen.',
      'Mit Zitronensaft abschmecken. Auf Teller anrichten, mit den reservierten Walnüssen und etwas extra Parmesan bestreuen.',
    ],
  },
  {
    id: 'lachs',
    title: 'Lachs im Ofen',
    minutes: 25,
    portions: 2,
    labels: ['Abendessen', 'warm', 'schnell'],
    // salmon pink → dill green
    tint: ['#e8a892', '#d77860', '#7e9168'],
    ingredients: [
      ['Lachsfilet mit Haut', '2× 180 g'],
      ['Zitrone', '1'],
      ['Dill', '½ Bund'],
      ['Olivenöl', '2 EL'],
      ['Honig', '1 TL'],
      ['Dijon-Senf', '1 TL'],
      ['Knoblauchzehe', '1'],
      ['Salz, Pfeffer', 'n. B.'],
    ],
    steps: [
      'Ofen auf 180 °C Umluft vorheizen. Backblech mit Backpapier belegen.',
      'Olivenöl, Honig, Senf, gepressten Knoblauch und Saft einer halben Zitrone verrühren.',
      'Lachsfilets salzen, pfeffern und mit der Marinade einpinseln.',
      'Lachs mit Hautseite nach unten aufs Blech legen. 12–14 Min. backen — die Mitte darf glasig bleiben.',
      'Mit gehacktem Dill und Zitronenspalten servieren. Dazu passt Wildreis oder Ofengemüse.',
    ],
  },
];

// Build a CSS background for the recipe "photo" placeholder.
// Layered radial gradients in the recipe's warm palette.
function recipeBackground(tint) {
  const [a, b, c] = tint;
  return [
    `radial-gradient(at 22% 28%, ${a} 0%, transparent 55%)`,
    `radial-gradient(at 78% 18%, ${b} 0%, transparent 50%)`,
    `radial-gradient(at 55% 85%, ${c} 0%, transparent 60%)`,
    `linear-gradient(180deg, ${a} 0%, ${b} 100%)`,
  ].join(', ');
}

// A faint "noise" stripe pattern overlay (so placeholders feel like a textured
// photo placeholder, not a flat gradient).
const PHOTO_STRIPES = {
  backgroundImage:
    'repeating-linear-gradient(127deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px), repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 6px)',
};

Object.assign(window, { RECIPES, recipeBackground, PHOTO_STRIPES });
