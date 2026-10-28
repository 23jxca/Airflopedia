// Baza artykułów. Aby dodać podstronę, dopisz obiekt do tablicy.
// Linki wewnętrzne: [[slug]] lub [[slug|tekst linku]]
window.ARTICLES = [
  {
    slug: "patyczek",
    title: "Patyczek",
    tags: ["Matuszla"],
    summary: "Historia Matuszli",
    info: [
      ["Kategoria", "Historia"],
    ],
    html: `
<p><strong>Patyczek</strong> (l.mn. <em>patyczki</em>) – Historia Matuszli złą sławą owiana.</p>
<h2>Geneza</h2>
<p>Matuszla opowiedział historię o patyczku i jest ona na tyle upokarzająca dla Matuszli, że nie można jej nikomu więcej opowiedzieć, szczególnie [[kumi|Kamilowi Giżyńskiemu]].</p>`
  },
  {
    slug: "kumi",
    title: "Kamil Giżyński",
    tags: ["KamilG"],
    summary: "Wychowawca klasy",
    info: [
      ["Kategoria", "Postać"],
      ["Imię i nazwisko", "Kamil Giżyński"],
      ["Narodowość", "Polska<img src='img/FlagaPolski32.png'>"]
    ],
    html: `
<p><strong>Kamil Giżyński</strong> znany również jako <strong>Kumi Gaming</strong>, <strong>Kamil G</strong> – Wychowawca najlepszej klasy w Zespole Szkół Komunikacjii.</p>
<h2>O nim</h2>
<p>Z wykształcenia Matematyk i Informatyk blablabla trzeba pododawac</p>`
  },
  {
    slug: "dzieciol",
    title: "Sprawa dzięcioła",
    tags: ["dzieciol"],
    summary: "Crashout Jerzego",
    info: [
      ["Kategoria", "Afera"],
      ["Główne postacie", "Kot Jerzego, Dzięcioł, Jerzy, Filip"],
    ],
    html: `
<p><strong>Sprawa dzięcioła</strong> - bestialskie zabójstwo ściśle chronionego dzięcioła przez kota Jerzego.</p>
<h2>Historia</h2
<p></p>`
  }
];
