# Translation guide (English / Canadian French)

The site is bilingual without any third-party translation service. French pages are served under
`/fr/…` (for example `/fr/about/`), using the **same route files** as the English pages.

## How it works

| Piece | What it does |
| --- | --- |
| `src/hooks.js` (`reroute`) | Maps `/fr/<path>` onto the route that renders `<path>`. Montreal case studies and the Montreal report map onto their existing hand-translated `-fr` routes. |
| `src/hooks.server.js` | Sets `<html lang="fr-CA">` and rewrites every internal `<a href="/…">` on a French page to `/fr/…`. |
| `src/routes/+layout.svelte` | On French pages, also localises links created or changed in the browser, just before they are followed. |
| `src/routes/lib/i18n.js` | `getLang()`, `t(en, fr)`, `localizeHref()`, `formatNumber()` and path helpers. |
| `src/routes/lib/data/dataLabels.js` | `localizeRows()` / `translateLabel()` translate category labels inside chart data. |
| `TopBar.svelte` | EN / FR toggle that opens the same page in the other language. |

Internal links do **not** need to be localised by hand. Use `localizeHref()` only for URLs that are
not anchors (`goto`, `window.location`, …).

## Writing bilingual components

```svelte
<script>
	import { getLang } from '../lib/i18n'; // relative path to src/routes/lib/i18n.js
	const fr = getLang() === 'fr'; // top level of <script> only
</script>

<h2>{fr ? 'Vue d’ensemble' : 'Overview'}</h2>

{#if fr}
	<p>Paragraphe en français avec un <a href="/about/">lien</a>.</p>
{:else}
	<p>English paragraph with a <a href="/about/">link</a>.</p>
{/if}

<BarChart title={fr ? 'Composition des commerces (%)' : 'Business Mix (%)'} data={localizeRows(businessmix, fr)} />
```

* Call `getLang()` once, at the top level of `<script>` (it reads the page URL through component
  context, so it cannot be called inside callbacks, timers or effects). Capture the result in a
  constant and use the constant everywhere else, including in event handlers and map popups.
* Short strings: `{fr ? '…' : '…'}`. Paragraphs or markup: `{#if fr}…{:else}…{/if}`.
* Long text in `.js` / `.ts` modules (e.g. `article.js`): add a sibling `article.fr.js` that exports
  the same names and shape, and pick the module in the page:
  `const content = fr ? contentFr : contentEn;`.
* Do not change data keys, CSS classes, ids, Mapbox layer ids or anything used as a lookup key.
  Translate only what is displayed. If displayed text is also used as a key, translate at display
  time.
* Remember attributes people see or hear: `alt`, `title`, `aria-label`, `placeholder`, and
  `<svelte:head>` `<title>` and `<meta name="description">`.

## Style (Canadian French, OQLF conventions)

* Typographic apostrophe `’` (l’accès, d’une).
* Quotation marks `« … »` with non-breaking spaces inside: `« texte »`.
* Non-breaking space before `:` and before `%`, `$`: `45 %`, `12 $`, `Source : …`. No space before
  `; ! ?`.
* Numbers: space as thousands separator, comma as decimal separator: `143 700`, `3,5`. Use
  `formatNumber()` for computed values.
* Times: `9 h`, `14 h 30`, ranges `9 h – 12 h`. Dates: `le 26 novembre 2026`. Ordinals: `1er`,
  `2e`, `13e`.
* Titles and headings in sentence case (`Profil des commerces`, not `Profil Des Commerces`).
* Prefer inclusive, epicene wording where natural (`les personnes résidentes`, `la population`).
* Keep proper names (street names outside Quebec, business names, organisations without an official
  French name) in their original form.

## Glossary

| English | Canadian French |
| --- | --- |
| Measuring Main Streets | Mesures des rues principales |
| Canadian Urban Institute (CUI) | Institut urbain du Canada (IUC) |
| main street | rue principale |
| downtown | centre-ville |
| Resilience on Main | Résilience sur la rue principale |
| TOD on Main | TOD sur la rue principale |
| transit-oriented development (TOD) | aménagement axé sur le transport collectif (TOD) |
| transit station area (TSA) | aire de station de transport collectif (ASTC) |
| major transit station area (MTSA) | aire de station de transport collectif majeure (ASTCM) |
| transit | transport collectif |
| public transit / transit station | transport collectif / station de transport collectif |
| case study | étude de cas |
| report | rapport |
| tool | outil |
| census metropolitan area (CMA) | région métropolitaine de recensement (RMR) |
| census agglomeration (CA) | agglomération de recensement (AR) |
| dissemination area (DA) | aire de diffusion (AD) |
| Statistics Canada | Statistique Canada |
| Housing, Infrastructure and Communities Canada | Logement, Infrastructures et Collectivités Canada |
| Government of Canada | gouvernement du Canada |
| Open North | Nord Ouvert |
| School of Cities (University of Toronto) | School of Cities (Université de Toronto) |
| Environics Analytics, Digital Public Square | unchanged |
| civic infrastructure | infrastructure civique |
| complete communities | collectivités complètes |
| walkability | potentiel piétonnier |
| 10-minute walk | rayon de 10 minutes de marche |
| business mix | composition commerciale |
| business density | densité commerciale |
| independent business | entreprise indépendante |
| chain business | entreprise de chaîne |
| employment size | taille des entreprises (nombre d’employés) |
| built form | cadre bâti |
| green space | espaces verts |
| population density | densité de population |
| visitor / resident | visiteur / résident (personnes visiteuses / résidentes in prose) |
| recurring visitor / infrequent visitor | visiteur récurrent / visiteur occasionnel |
| foot traffic / visits | achalandage / visites |
| recovery | reprise |
| resilience | résilience |
| displacement | déplacement de population (displacement) |
| affordable housing | logement abordable |
| intensification | densification |
| embodied carbon | carbone intrinsèque |
| decarbonization | décarbonation |
| fiscal impacts | retombées fiscales |
| equity | équité |
| digital public engagement | consultation publique numérique |
| Food and Drink / Retail / Local Services | Restauration et boissons / Commerce de détail / Services de proximité |
| Arts and Culture / Education / Healthcare | Arts et culture / Éducation / Santé |
| Government and Community Services | Services gouvernementaux et communautaires |
| Recreation Facilities | Installations récréatives |
| Data Source: | Source des données : |
| Click on a layer to turn it on or off | Cliquez sur une couche pour l’afficher ou la masquer |
| Low / High | Faible / Élevé |
| Learn more | En savoir plus |
| Read the report | Lire le rapport |
| Explore | Explorer |
