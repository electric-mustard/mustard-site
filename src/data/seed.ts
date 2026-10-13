// Sample content — v2.0 — Made by Electric Mustard
// Used when no Sanity project is configured, on the /specimen page, and by
// `npm run seed` to load starter content into Sanity. Every text has an
// English and a Norwegian version, like the Sanity fields. Images live in
// public/seed/.
import type { Localised } from '../lib/i18n';
import type { Background, GalleryLayout, Padding } from '../lib/types';

export interface SeedPicture {
  src: string;
  alt: Localised;
  width: number;
  height: number;
}

export interface SeedProject {
  title: Localised;
  slug: string;
  cover: SeedPicture;
  hero: {
    eyebrow: Localised;
    client: string;
    year: string;
    image: SeedPicture;
    padding: Padding;
    background: Background;
  };
  about: {
    heading: Localised;
    body: Localised;
    credits: string[];
    padding: Padding;
    background: Background;
  };
  impact: {
    heading: Localised;
    items: { value: string; label: Localised; note?: Localised }[];
    padding: Padding;
    background: Background;
  };
  gallery: {
    images: SeedPicture[];
    layout: GalleryLayout;
    padding: Padding;
    background: Background;
  };
}

export interface SeedSite {
  siteName: string;
  description: Localised;
  contactEmail: string;
  autoplay: number;
  projects: SeedProject[];
}

function pic(slug: string, name: string, alt: Localised, width: number, height: number): SeedPicture {
  return { src: `/seed/${slug}-${name}.jpg`, alt, width, height };
}

function gallery(slug: string, title: string): SeedPicture[] {
  return [
    pic(slug, '1', { en: `${title} — detail one`, no: `${title} — detalj én` }, 2000, 1333),
    pic(slug, '2', { en: `${title} — detail two`, no: `${title} — detalj to` }, 1600, 2000),
    pic(slug, '3', { en: `${title} — detail three`, no: `${title} — detalj tre` }, 2000, 1250),
  ];
}

const impactHeading: Localised = { en: 'Impact', no: 'Effekt' };

export const seedProjects: SeedProject[] = [
  {
    title: { en: 'Northwind Coffee', no: 'Northwind Coffee' },
    slug: 'northwind',
    cover: pic(
      'northwind',
      'cover',
      { en: 'Northwind Coffee packaging on a warm wooden counter', no: 'Northwind Coffee-emballasje på en varm trebenk' },
      1200,
      1500
    ),
    hero: {
      eyebrow: { en: 'Brand identity', no: 'Visuell identitet' },
      client: 'Northwind Coffee Roasters',
      year: '2025',
      image: pic(
        'northwind',
        'hero',
        { en: 'Northwind Coffee bags lined up in the roastery', no: 'Northwind Coffee-poser på rekke i brenneriet' },
        2400,
        1500
      ),
      padding: 'lg',
      background: 'light',
    },
    about: {
      heading: {
        en: 'A roastery brand built to travel from the bag to the billboard.',
        no: 'Et brennerimerke laget for å gå fra posen til plakatveggen.',
      },
      body: {
        en: 'Northwind had outgrown a logo drawn on a napkin in 2016. The business now spanned three cafés, wholesale and a subscription, and nothing held it together.\n\nWe rebuilt the identity around one idea: the compass. A custom wordmark, a flexible mark that works at stamp size, and a packaging system that lets each origin own a colour without losing the family.\n\nEverything was designed for the hands it ends up in — baristas, delivery drivers and people opening a bag on a Monday morning.',
        no: 'Northwind hadde vokst ut av en logo tegnet på en serviett i 2016. Virksomheten omfattet nå tre kafeer, engros og et abonnement, og ingenting holdt det sammen.\n\nVi bygde identiteten opp igjen rundt én idé: kompasset. Et skreddersydd ordmerke, et fleksibelt symbol som fungerer i frimerkestørrelse, og et emballasjesystem der hvert opprinnelsesland får sin egen farge uten å miste familien.\n\nAlt ble designet for hendene det ender opp i — baristaer, sjåfører og folk som åpner en pose en mandag morgen.',
      },
      credits: ['Strategy & identity — Electric Mustard', 'Photography — Ida Kvale', 'Print — Hartmann & Sons'],
      padding: 'lg',
      background: 'light',
    },
    impact: {
      heading: impactHeading,
      items: [
        {
          value: '3.2×',
          label: { en: 'Subscription sign-ups', no: 'Nye abonnenter' },
          note: {
            en: 'In the six months after launch, compared with the six before.',
            no: 'I de seks månedene etter lansering, sammenlignet med de seks før.',
          },
        },
        {
          value: '41%',
          label: { en: 'Wholesale enquiries', no: 'Engrosforespørsler' },
          note: { en: 'Year on year, with no change to ad spend.', no: 'År over år, uten endring i annonsebudsjettet.' },
        },
        {
          value: '12',
          label: { en: 'New stockists', no: 'Nye forhandlere' },
          note: {
            en: 'Including two national grocers that had declined before.',
            no: 'Inkludert to landsdekkende dagligvarekjeder som hadde sagt nei tidligere.',
          },
        },
        {
          value: 'No. 1',
          label: { en: 'Design Week packaging', no: 'Design Week emballasje' },
          note: { en: 'Readers’ choice, independent category.', no: 'Lesernes favoritt, kategori for uavhengige.' },
        },
      ],
      padding: 'lg',
      background: 'light',
    },
    gallery: { images: gallery('northwind', 'Northwind Coffee'), layout: 'alternate', padding: 'md', background: 'light' },
  },
  {
    title: { en: 'Orbital Audio', no: 'Orbital Audio' },
    slug: 'orbital',
    cover: pic(
      'orbital',
      'cover',
      { en: 'Orbital Audio headphones against a deep blue backdrop', no: 'Orbital Audio-hodetelefoner mot en dyp blå bakgrunn' },
      1200,
      1500
    ),
    hero: {
      eyebrow: { en: 'Product launch', no: 'Produktlansering' },
      client: 'Orbital Audio',
      year: '2025',
      image: pic(
        'orbital',
        'hero',
        { en: 'Orbital Audio launch campaign hero image', no: 'Hovedbilde fra Orbital Audios lanseringskampanje' },
        2400,
        1500
      ),
      padding: 'lg',
      background: 'light',
    },
    about: {
      heading: {
        en: 'Launching a first product for a company nobody had heard of yet.',
        no: 'Å lansere et første produkt for et selskap ingen hadde hørt om ennå.',
      },
      body: {
        en: 'Orbital came to us nine months before their first pair of headphones shipped, with engineering finished and no story.\n\nWe named the product, wrote the launch narrative and designed the site, the unboxing and the film. The language stays technical where it earns it and plain everywhere else.\n\nThe site was built as a single scrolling piece so the product is never more than one gesture away from the buy button.',
        no: 'Orbital kom til oss ni måneder før deres første hodetelefoner ble sendt ut, med ferdig teknikk og ingen historie.\n\nVi ga produktet navn, skrev lanseringsfortellingen og designet nettsiden, utpakkingen og filmen. Språket er teknisk der det fortjener det, og enkelt overalt ellers.\n\nNettsiden ble bygget som én sammenhengende rulle, slik at produktet aldri er mer enn én bevegelse unna kjøpsknappen.',
      },
      credits: ['Naming, identity & web — Electric Mustard', 'Film — Studio Parallel'],
      padding: 'lg',
      background: 'light',
    },
    impact: {
      heading: impactHeading,
      items: [
        {
          value: '18k',
          label: { en: 'Pre-orders in week one', no: 'Forhåndsbestillinger første uke' },
          note: { en: 'Against a target of five thousand.', no: 'Mot et mål på fem tusen.' },
        },
        {
          value: '4.1%',
          label: { en: 'Site conversion', no: 'Konvertering på nettsiden' },
          note: { en: 'Launch month, all traffic sources.', no: 'Lanseringsmåneden, alle trafikkilder.' },
        },
        {
          value: '2.6m',
          label: { en: 'Film views', no: 'Filmvisninger' },
          note: { en: 'Organic, across all platforms, first month.', no: 'Organisk, på alle plattformer, første måned.' },
        },
      ],
      padding: 'lg',
      background: 'light',
    },
    gallery: { images: gallery('orbital', 'Orbital Audio'), layout: 'full', padding: 'md', background: 'light' },
  },
  {
    title: { en: 'Fjord & Pine', no: 'Fjord & Pine' },
    slug: 'fjord',
    cover: pic(
      'fjord',
      'cover',
      { en: 'Fjord & Pine cabin exterior in soft morning light', no: 'Fjord & Pine-hytte utvendig i mykt morgenlys' },
      1200,
      1500
    ),
    hero: {
      eyebrow: { en: 'Hospitality', no: 'Overnatting' },
      client: 'Fjord & Pine Cabins',
      year: '2024',
      image: pic('fjord', 'hero', { en: 'A Fjord & Pine cabin above the water', no: 'En Fjord & Pine-hytte over vannet' }, 2400, 1500),
      padding: 'lg',
      background: 'light',
    },
    about: {
      heading: {
        en: 'Six cabins, one quiet brand, and a booking flow that gets out of the way.',
        no: 'Seks hytter, ett stillferdig merke, og en bestilling som ikke står i veien.',
      },
      body: {
        en: 'Fjord & Pine is a small family business with cabins along the western coast. They did not want to look like a hotel chain, and they did not want guests to need a phone call to book.\n\nWe designed an identity that borrows from land-survey maps and hand-painted signage, then built a site where availability, pricing and the view are all on one screen.',
        no: 'Fjord & Pine er en liten familiebedrift med hytter langs vestkysten. De ville ikke se ut som en hotellkjede, og de ville ikke at gjestene skulle måtte ringe for å bestille.\n\nVi designet en identitet som låner fra kartverkets kart og håndmalte skilt, og bygde deretter en nettside der ledighet, pris og utsikten er samlet på én skjerm.',
      },
      credits: ['Identity & web — Electric Mustard', 'Photography — Mats Berge'],
      padding: 'lg',
      background: 'light',
    },
    impact: {
      heading: impactHeading,
      items: [
        {
          value: '92%',
          label: { en: 'Bookings now online', no: 'Bestillinger på nett' },
          note: { en: 'Up from roughly a third by phone and email.', no: 'Opp fra omtrent en tredjedel via telefon og e-post.' },
        },
        {
          value: '2.4',
          label: { en: 'Average nights per stay', no: 'Netter per opphold i snitt' },
          note: { en: 'Up from 1.7 the previous season.', no: 'Opp fra 1,7 sesongen før.' },
        },
        {
          value: '−60%',
          label: { en: 'Time to book', no: 'Tid brukt på å bestille' },
          note: { en: 'Measured from landing to confirmation.', no: 'Målt fra landing til bekreftelse.' },
        },
      ],
      padding: 'lg',
      background: 'light',
    },
    gallery: { images: gallery('fjord', 'Fjord & Pine'), layout: 'pairs', padding: 'md', background: 'light' },
  },
  {
    title: { en: 'Halo Health', no: 'Halo Health' },
    slug: 'halo',
    cover: pic(
      'halo',
      'cover',
      { en: 'Halo Health app screens on a pale background', no: 'Halo Health-appskjermer på lys bakgrunn' },
      1200,
      1500
    ),
    hero: {
      eyebrow: { en: 'Product design', no: 'Produktdesign' },
      client: 'Halo Health',
      year: '2024',
      image: pic(
        'halo',
        'hero',
        { en: 'The Halo Health app on a phone, held in one hand', no: 'Halo Health-appen på en telefon, holdt i én hånd' },
        2400,
        1500
      ),
      padding: 'lg',
      background: 'light',
    },
    about: {
      heading: {
        en: 'Redesigning a health app so people actually open it on a bad day.',
        no: 'Å redesigne en helseapp slik at folk faktisk åpner den på en dårlig dag.',
      },
      body: {
        en: 'Halo helps people manage long-term conditions. The existing app was accurate, thorough and abandoned within a fortnight by most new users.\n\nWe stripped the first run down to one question, moved the heavy data behind a calm daily view, and built a type and colour system that stays readable with shaking hands and low light.',
        no: 'Halo hjelper folk med å håndtere langvarige sykdommer. Den eksisterende appen var presis, grundig og forlatt innen to uker av de fleste nye brukere.\n\nVi skrellet første gangs bruk ned til ett spørsmål, flyttet de tunge dataene bak en rolig daglig visning, og bygde et typografi- og fargesystem som forblir lesbart med skjelvende hender og lite lys.',
      },
      credits: ['Product design & design system — Electric Mustard'],
      padding: 'lg',
      background: 'light',
    },
    impact: {
      heading: impactHeading,
      items: [
        {
          value: '2.1×',
          label: { en: 'Day-30 retention', no: 'Brukere igjen etter 30 dager' },
          note: { en: 'Cohort comparison, before and after redesign.', no: 'Sammenligning av kohorter før og etter redesign.' },
        },
        {
          value: '4.8',
          label: { en: 'App Store rating', no: 'Vurdering i App Store' },
          note: { en: 'Up from 3.6, same twelve-month window.', no: 'Opp fra 3,6 i samme tolvmånedersperiode.' },
        },
        {
          value: '72%',
          label: { en: 'Daily check-in completion', no: 'Fullførte daglige innsjekk' },
          note: { en: 'Up from 38 percent.', no: 'Opp fra 38 prosent.' },
        },
        {
          value: 'AA',
          label: { en: 'Accessibility', no: 'Tilgjengelighet' },
          note: { en: 'Every screen meets WCAG 2.2 AA.', no: 'Hver skjerm oppfyller WCAG 2.2 AA.' },
        },
      ],
      padding: 'lg',
      background: 'light',
    },
    gallery: { images: gallery('halo', 'Halo Health'), layout: 'alternate', padding: 'md', background: 'light' },
  },
  {
    title: { en: 'Meridian Hotels', no: 'Meridian Hotels' },
    slug: 'meridian',
    cover: pic(
      'meridian',
      'cover',
      { en: 'Meridian Hotels campaign poster in terracotta tones', no: 'Kampanjeplakat for Meridian Hotels i terrakottatoner' },
      1200,
      1500
    ),
    hero: {
      eyebrow: { en: 'Campaign', no: 'Kampanje' },
      client: 'Meridian Hotels',
      year: '2023',
      image: pic(
        'meridian',
        'hero',
        { en: 'Meridian Hotels campaign image, a lobby at dusk', no: 'Kampanjebilde for Meridian Hotels, en lobby i skumringen' },
        2400,
        1500
      ),
      padding: 'lg',
      background: 'light',
    },
    about: {
      heading: {
        en: 'A city-break campaign that sold the hour before dinner, not the room.',
        no: 'En storbykampanje som solgte timen før middag, ikke rommet.',
      },
      body: {
        en: 'Meridian runs fourteen city hotels that are all slightly different and all photographed the same way. The brief was a campaign that made people choose Meridian over the booking-site default.\n\nWe built the campaign around the hour between arriving and going out, with film and print shot in three cities and a toolkit each hotel could use for its own channels.',
        no: 'Meridian driver fjorten byhoteller som alle er litt forskjellige og alle fotografert på samme måte. Oppdraget var en kampanje som fikk folk til å velge Meridian fremfor standardvalget på bestillingssidene.\n\nVi bygde kampanjen rundt timen mellom ankomst og det å gå ut, med film og trykk fotografert i tre byer og en verktøykasse hvert hotell kunne bruke i egne kanaler.',
      },
      credits: ['Campaign & art direction — Electric Mustard', 'Photography — Léa Fournier'],
      padding: 'lg',
      background: 'light',
    },
    impact: {
      heading: impactHeading,
      items: [
        {
          value: '27%',
          label: { en: 'Direct bookings', no: 'Direktebestillinger' },
          note: { en: 'Campaign period, versus same period prior year.', no: 'Kampanjeperioden, mot samme periode året før.' },
        },
        {
          value: '3',
          label: { en: 'Cities, one toolkit', no: 'Byer, én verktøykasse' },
          note: { en: 'Every hotel shipped local work within a month.', no: 'Hvert hotell leverte lokalt materiell innen en måned.' },
        },
        {
          value: '1.9m',
          label: { en: 'Reach', no: 'Rekkevidde' },
          note: { en: 'Paid and organic, all channels.', no: 'Betalt og organisk, alle kanaler.' },
        },
      ],
      padding: 'lg',
      background: 'light',
    },
    gallery: { images: gallery('meridian', 'Meridian Hotels'), layout: 'alternate', padding: 'md', background: 'light' },
  },
];

export const seedSite: SeedSite = {
  siteName: 'Electric Mustard',
  description: { en: 'A design studio. Selected work.', no: 'Et designstudio. Utvalgte arbeider.' },
  contactEmail: 'hello@electricmustard.co.uk',
  autoplay: 5,
  projects: seedProjects,
};
