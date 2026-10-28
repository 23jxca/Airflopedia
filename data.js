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
<p>Matuszla opowiedział historię o patyczku i jest ona na tyle upokarzająca dla Matuszli, że nie można jej nikomu więcej odpowiedzieć, szczególnie [[kumi|Kamilowi Giżyńskiemu]].</p>`
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
  }
];
