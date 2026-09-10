# Images to add

The site is built so that every image is optional: where a file is missing, a neutral placeholder is shown. Drop the files below into the folders named here (any of .jpg / .png / .webp works; the build finds whichever exists), then rebuild.

Most of them are the images from the old Wix site. In the Wix dashboard, open **Media** (Media Manager), select all files and click **Download** to get them as a zip; the *Wix file* column tells you which one is which. Rename each file to the *target file* name.

## Site-wide

| Target file | Wix file | Used on |
|---|---|---|
| static/img/logo.png | logo transparent-01.png | Header of every page (the lab logo; transparent PNG) |
| static/img/technion-logo.png | TechnionIIT English 3-lines.png | Footer of every page |
| static/img/home-hero.jpg | the square lab photo on the old home page (Wix media id 709014_be6718b0…) | Home page hero |

## Content images

| Target file | Wix file | Used on |
|---|---|---|
| static/img/people/omri-ram.jpg | omri.jpg (the PI photo) | People page |
| static/img/people/yigal-evron.jpg | Yigal.webp | People page |
| static/img/people/jibu-tom-jose.jpg | WhatsApp Image 2024-11-05 at 16.38.26_abcdb974.jpg | People page |
| static/img/people/yoav-gichon.jpg | DSC_0194.jpg | People page |
| static/img/people/avital-reizman.jpg | Avital_Picture.jpeg | People page |
| static/img/people/sahar-zuckerman.jpg | WhatsApp Image 2023-08-31 at 18.04.59.jpg | People page |
| static/img/people/aviel-ben-harush.jpg | DSC_0174-2.jpg | People page |
| static/img/people/dvir-feld.jpg | Untitled_edited.jpg | People page |
| static/img/people/omri-ben-haim.jpg | omri.jpg (the second one, media id 709014_34a7d5b1...) | People page |
| static/img/people/raz-heppner.jpg | RAZ.jpg | People page |
| static/img/people/omri-gurfinkel.jpg | Gurfi.jpg | People page |
| static/img/people/gal-friedmann.jpg | gal.jpg | People page |
| static/img/people/tal-marder.jpg | tal.png | People page |
| static/img/facilities/shock-tube.png | expsys.png | Facilities page |
| static/img/facilities/round-pipe-channel.jpg | 709014_a573bf1bdece4338ab72d014cb41e0c9~mv2.jpg | Facilities page |
| static/img/facilities/octagonal-tank.jpg | 709014_2ca5cae802e646fcb96f72cb0681a5a5~mv2.jpg | Facilities page |
| static/img/facilities/water-tunnel.jpg | WhatsApp Image 2023-12-14 at 09.44.08_d618483a.jpg | Facilities page |
| static/img/research/cavitation-inception.jpg | cavexample.JPG | Research: cavitation-inception |
| static/img/research/oil-water-separation.jpg | filmexample.JPG | Research: oil-water-separation |
| static/img/research/rising-spheres.png | Picture6.png | Research: rising-spheres |
| static/img/research/rising-sphere-1.jpg | 1673512152867.jpg | Research: rising-spheres |
| static/img/research/rising-sphere-2.jpg | Picture2.jpg | Research: rising-spheres |
| static/img/research/rising-sphere-3.png | Picture1.png | Research: rising-spheres |
| static/img/research/shock-constriction.jpg | image_edited.jpg | Research: shock-local-constriction |
| static/img/research/shock-porous-media.jpg | porousexample.JPG | Research: shock-porous-media |
| static/img/research/shock-area-changes.jpg | 1663933987202.jpg | Research: shock-waves-area-changes |
| static/img/research/shock-contraction-series.png | image.png (709014_8ba136e9...) | Research: shock-waves-area-changes |
| static/img/research/shock-contraction-les.png | image.png (709014_0505d75d...) | Research: shock-waves-area-changes |
| static/img/research/solids-in-pipe-flow.png | Screenshot 2023-12-13 164356.png | Research: solids-in-pipe-flow |
| static/img/research/tomographic-setup.jpg | expsys.jpg | Research: solids-in-pipe-flow |
| static/img/research/turbulence-round-pipes.png | Picture5.png | Research: turbulence-in-round-pipes |
| static/img/research/turbulence-fields.png | 709014_904fa293...png | Research: turbulence-in-round-pipes |
| static/img/research/turbulence-modes.png | Screenshot 2023-12-13 152450.png | Research: turbulence-in-round-pipes |
| static/img/news/aviel-ben-harush.jpg | DSC_0174-2.jpg | News: aviel-ben-harush-joined-our-group |
| static/img/news/acs-prf.jpg | 709014_f36a63ad...jpg | News: our-lab-was-selected-for-funding-by-the-american-chemical-society |
| static/img/news/shock-tube-first-test.jpg | 709014_91ed904d...jpg | News: our-shock-tube-is-operational |
| static/img/news/tomo-piv-system.jpg | 709014_5c2ebb60...jpg | News: we-measure-3d-flow-fields |
| static/img/news/tomo-setup-pipe.jpg | 709014_322c874b...jpg | News: we-measure-3d-flow-fields |
| static/img/news/tomo-jet.jpg | 709014_3adfc10e...jpg | News: we-measure-3d-flow-fields |
| static/img/news/yoav-gichon.jpg | DSC_0194.jpg | News: yoav-is-now-a-ph-d-candidate |
| static/img/news/etc-2023.png | 709014_971930f2...png | News: first-international-appearance-for-tfml-18th-european-turbulence-conference |
| static/img/news/aps-dfd-2023.png | 709014_8ad7dff1...png | News: tfml-in-the-usa-76th-aps-dfd-annual-meeting-washington-dc |

## Notes

- Rami Yanai has no photo yet (the old site used a stock image). Add `static/img/people/rami-yanai.jpg` and uncomment the `image:` line in `content/people.yml`.
- Aim for people photos in portrait orientation (about 4:5, at least 600 px wide) and research/facility images at least 1200 px wide. JPEG for photos, PNG for screenshots and diagrams.
- Two videos on the old project pages (raw PIV, Shake-The-Box, rising sphere, shock evolution) cannot be copied from Wix in usable form. Upload them to YouTube or Vimeo and I can embed them, or export them from your own files.
