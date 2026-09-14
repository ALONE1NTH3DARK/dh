import type { Project } from "@/data/projects";

type ProjectI18n = Pick<
  Project,
  "title" | "cat" | "result" | "time" | "client" | "summary" | "challenge" | "solution"
> & {
  highlights: { title: string; text: string; metric?: string }[];
  features: { title: string; text: string; tech?: string[] }[];
  quote?: { text: string; role: string };
};

export const PROJECTS_EN: Record<string, ProjectI18n> = {
  hype: {
    title: "HYPE creative agency",
    cat: "Corporate website",
    result: "+148% sales",
    time: "1 month",
    client: "Noir Boutique",
    summary:
      "Premium fashion e-commerce that turns a showcase into a sales funnel: from the first screen to checkout — without extra steps.",
    challenge:
      "The old site looked dated, loaded slowly on mobile and lost shoppers in the cart. Conversion sat at 1.8%.",
    solution:
      "We rebuilt the catalog structure, brought load time down to a second, and designed the purchase path around collection visuals and brand trust.",
    highlights: [
      {
        title: "Frictionless cart",
        text: "Checkout on one screen, saved sizes and transparent shipping — fewer abandoned orders.",
      },
      {
        title: "Mobile first",
        text: "70% of traffic is phones. The interface is built for the thumb and a fast collection scroll.",
        metric: "<1 s",
      },
    ],
    features: [
      {
        title: "A living collection catalog",
        text: "Product cards with large shots and instant filters, no page reload. Shoppers see fit, fabric and size availability right away.",
      },
      {
        title: "Checkout on one screen",
        text: "Order flow is compact: shipping, payment and confirmation — no extra steps. Fewer abandoned carts on mobile.",
      },
      {
        title: "Mobile first",
        text: "Built for the thumb: large tap targets, a fast feed scroll and instant photo loading.",
      },
    ],
    quote: {
      text: "The site pays for itself every day. Conversion went from 1.8% to 4.2%, and clients specifically mention the design.",
      role: "Founder, Noir Boutique",
    },
  },
  photograph: {
    title: "Wedding photographer",
    cat: "Portfolio site",
    result: "×3 conversion",
    time: "2 weeks",
    client: "Pulse Finance",
    summary:
      "A digital platform for fintech where complex products read in seconds — and inquiries come in around the clock.",
    challenge:
      "The product looked like an investor deck, not a service for clients. Acquisition cost was rising, and leads were cold.",
    solution:
      "We recast the value in plain scenarios, added calculators and a quiz funnel — from interest to a lead without a manager call.",
    highlights: [
      {
        title: "Numbers, not jargon",
        text: "Every product is explained with a benefit and a figure, not acronyms. Clients immediately see why it matters to them.",
      },
      {
        title: "A quiz instead of a form",
        text: "A short flow captures the client segment and routes them to the right product — higher lead quality.",
      },
      {
        title: "Trust from the first screen",
        text: "Licenses, security and case studies sit in the first glance. Fewer doubts before submitting.",
      },
    ],
    features: [
      {
        title: "Numbers, not jargon",
        text: "Every fintech product is explained with a benefit and a clear metric. Clients understand the value in seconds.",
      },
      {
        title: "A quiz instead of a cold form",
        text: "A short flow segments the user and leads them to the right product. Inquiries arrive already warm.",
      },
      {
        title: "Trust from the first screen",
        text: "Licenses, security and case studies sit in the first glance. Fewer doubts before sending an inquiry.",
      },
    ],
    quote: {
      text: "The new way of presenting numbers worked on both clients and investors. The product finally looks like a market leader.",
      role: "CMO, Pulse Finance",
    },
  },
  "atelier-nord": {
    title: "Deshevle.kz online store",
    cat: "Online store",
    result: "+90% inquiries",
    time: "6 weeks",
    client: "Atelier Nord",
    summary:
      "An architecture studio site that sells the calibre of the work before the first call — through atmosphere and a precise case.",
    challenge:
      "The portfolio looked like a photo archive. Clients couldn’t read the scale and arrived with briefs below the studio’s fee.",
    solution:
      "We built a narrative around each project: context, brief, solution, result. Added filters by building type and a strong first screen.",
    highlights: [
      {
        title: "Cases as stories",
        text: "Each project is a path, not a gallery: brief → concept → build. Clients see the depth of the work immediately.",
      },
      {
        title: "Filter by brief",
        text: "Private house, office, redevelopment — visitors find relevant experience in two clicks.",
      },
      {
        title: "A premium rhythm",
        text: "Type, space and large frames set the tone of expensive projects before the conversation even starts.",
      },
    ],
    features: [
      {
        title: "Cases as stories",
        text: "Each project is a path from brief to delivery. Clients see the studio’s depth before they call.",
      },
      {
        title: "Filter by type of brief",
        text: "Private house, office or redevelopment — relevant work is two clicks away.",
      },
      {
        title: "A premium page rhythm",
        text: "Type, space and large frames set the tone of expensive projects before the first conversation.",
      },
    ],
    quote: {
      text: "Clients now arrive ready to discuss a high-end design brief — trust jumped immediately.",
      role: "Principal architect, Atelier Nord",
    },
  },
  nordhaus: {
    title: "Nordhaus",
    cat: "Online store",
    result: "+64% orders",
    time: "5 weeks",
    client: "Nordhaus",
    summary:
      "A furniture and lighting shop where the collection reads as a showcase: from the first screen to checkout — without extra steps.",
    challenge:
      "The old catalog mixed series and lost shoppers in the cart. Orders often moved to WhatsApp.",
    solution:
      "We built a clear catalog, fast filters and a short checkout with shipping and payment on one screen.",
    highlights: [
      {
        title: "A quiet catalog",
        text: "Series, sizes and stock sit on the card — fewer questions for the team.",
      },
      {
        title: "Checkout in one step",
        text: "Shipping, payment and confirmation on one screen — fewer abandoned carts.",
      },
      {
        title: "Filter by room",
        text: "Living room, bedroom, lighting — the right piece is a couple of clicks away.",
      },
    ],
    features: [
      {
        title: "A living catalog",
        text: "Large photos, instant filters and size availability with no page reload.",
      },
      {
        title: "Pay on one screen",
        text: "Address, delivery and payment stay compact — easy on a phone.",
      },
      {
        title: "Series cards",
        text: "Material, dimensions and related pieces sit nearby — easier to build a set.",
      },
    ],
    quote: {
      text: "Orders finally come from the site, not from chats. People browse the catalog instead of asking if it’s in stock.",
      role: "Founder, Nordhaus",
    },
  },
  umami: {
    title: "Umami",
    cat: "Restaurant landing",
    result: "+72% bookings",
    time: "2 weeks",
    client: "Umami",
    summary:
      "A restaurant site where the atmosphere of the kitchen and easy online booking work together — and tables fill in advance.",
    challenge:
      "Guests booked through socials and messengers. The site didn’t reflect the kitchen and offered no fast path to a table.",
    solution:
      "We made an emotional landing with the menu, a chef story and built-in booking in two steps.",
    highlights: [
      {
        title: "A table in 30 seconds",
        text: "Date, time, guests — and confirmation. No calls, no waiting for the host to reply.",
      },
      {
        title: "The menu as a showcase",
        text: "Seasonal dishes with photos and chef notes — guests arrive already hungry.",
      },
      {
        title: "Evening atmosphere",
        text: "A dark visual language and accent light carry the mood of the room before the visit.",
      },
    ],
    features: [
      {
        title: "A table in 30 seconds",
        text: "Date, time and party size — confirmation without calling the host. Tables fill in advance.",
      },
      {
        title: "The menu as a showcase",
        text: "Seasonal dishes with chef notes. Guests arrive already hungry.",
      },
      {
        title: "Evening atmosphere",
        text: "A dark visual language and accent light carry the mood of the room before the visit.",
      },
    ],
  },
  "borovoe-houses": {
    title: "Borovoe Houses",
    cat: "Resort website",
    result: "+210% leads",
    time: "1 month",
    client: "Beyond Travel",
    summary:
      "A travel platform for custom itineraries: inspiration + a clear brief = an inquiry without extra back-and-forth.",
    challenge:
      "The tour catalog looked generic. Clients asked “how much?” and disappeared — there was no matching flow.",
    solution:
      "We built a funnel around destinations and travel style, added a route quiz and strong visual stories.",
    highlights: [
      {
        title: "Route quiz",
        text: "Budget, season, type of trip — the inquiry arrives already segmented.",
      },
      {
        title: "Destination stories",
        text: "Not hotel lists, but travel scenarios: who it’s for, why, and what you get.",
      },
      {
        title: "A fast reply",
        text: "The form goes to the manager with tags — the client gets an offer the same day.",
      },
    ],
    features: [
      {
        title: "Route quiz",
        text: "Budget, season and trip format are collected in short steps — the inquiry arrives segmented.",
      },
      {
        title: "Destination stories",
        text: "Not a hotel list, but travel scenarios: who it’s for, why, and what you get.",
      },
      {
        title: "A same-day reply",
        text: "The form goes to the manager with tags — the client gets an offer without extra back-and-forth.",
      },
    ],
  },
  lightroom: {
    title: "Lighting products",
    cat: "Store landing",
    result: "×2.6 sign-ups",
    time: "2 weeks",
    client: "lightroom",
    summary:
      "A SaaS marketing site that explains a complex product in a minute and leads to a trial.",
    challenge:
      "Visitors didn’t get the value in 10 seconds. Demo requests were rare, and onboarding started with “so what is this?”",
    solution:
      "We built storytelling around use cases, interactive demo blocks and a clear path: value → proof → trial.",
    highlights: [
      {
        title: "Use-case storytelling",
        text: "Three user roles — three benefit scenarios. Everyone sees themselves in the product.",
      },
      {
        title: "Interactive demo",
        text: "Key product screens right on the landing — fewer doubts before signing up.",
      },
      {
        title: "A frictionless trial",
        text: "A short form, social login and onboarding hints from the first minute.",
      },
    ],
    features: [
      {
        title: "Use-case storytelling",
        text: "Three user roles — three benefit scenarios. Everyone sees themselves in the product within a minute.",
      },
      {
        title: "Interactive demo",
        text: "Key SaaS screens right on the landing — fewer doubts before signing up.",
      },
      {
        title: "A frictionless trial",
        text: "A short form, social login and hints from the first minute of onboarding.",
      },
    ],
  },
  psychologist: {
    title: "Moscow psychologist",
    cat: "Personal website",
    result: "+134% revenue",
    time: "1 month",
    client: "Moscow psychologist",
    summary:
      "A D2C skincare brand: a clean visual, product matching and a purchase with no extra clicks.",
    challenge:
      "The range confused clients. There was no personalization, and product cards didn’t address formula objections.",
    solution:
      "We added a skin-type quiz, strengthened cards with ingredients and evidence, and simplified checkout.",
    highlights: [
      {
        title: "A match in a minute",
        text: "A skin-type quiz recommends 2–3 products — higher average order and fewer returns.",
      },
      {
        title: "Trust in the formula",
        text: "Ingredients, clinical facts and reviews — right next to Add to cart.",
      },
      {
        title: "A clean brand",
        text: "Light aesthetics and calm type set the brand apart from loud mass-market.",
      },
    ],
    features: [
      {
        title: "A clear first screen",
        text: "It clearly names the areas we work with and introduces the person who can help.",
      },
      {
        title: "A list of popular services",
        text: "Helps visitors see that their problem is a common reason to see a psychologist, that it can be resolved, and that this specialist works with exactly that brief.",
        tech: ["Service examples"],
      },
      {
        title: "Extra entry points",
        text: "Short pieces on common life situations and problems a psychologist can help with — they attract potential clients from search on other queries.",
        tech: ["Notes", "SEO"],
      },
      {
        title: "Contact form",
        text: "Light aesthetics and calm type set the brand apart from loud mass-market.",
        tech: ["Telegram", "Max", "Email"],
      },
    ],
  },
  fieldnotes: {
    title: "Field Notes",
    cat: "Editorial blog",
    result: "×4 organic traffic",
    time: "3 weeks",
    client: "Field Notes",
    summary:
      "A magazine about food, cities and the people who cook there. Pieces read like a journal, and search brings long-tail readers — without the template noise.",
    challenge:
      "Writers published in Telegram and on Medium. The archive scattered, search never saw the pieces, and advertisers had nowhere to send readers.",
    solution:
      "We built a dedicated blog: sections, authors, tags, a table of contents for long reads, and a newsletter. Every article is its own page with clear metadata.",
    highlights: [
      {
        title: "Search finds the pieces",
        text: "Titles, descriptions and Article schema — stories rank for queries like “where to eat in Almaty”.",
        metric: "×4",
      },
      {
        title: "Comfortable on a phone",
        text: "Narrow column, large photos and a table of contents. Time on article went up.",
        metric: "+2.4 min",
      },
      {
        title: "Subscribe without friction",
        text: "A form at the end of each piece and in the header. Emails go to the newsroom’s Telegram bot.",
        metric: "1,200",
      },
    ],
    features: [
      {
        title: "Feed by section",
        text: "City, recipes, people, guides. Filters do not reload the page — the reader stays in the flow.",
        tech: ["React", "CMS"],
      },
      {
        title: "Long article",
        text: "Table of contents, captions, pull quotes and a “more on this” block. The text does not get lost in the viewport.",
        tech: ["MDX", "JSON-LD"],
      },
      {
        title: "Author card",
        text: "Who writes, what they do, and which pieces already ran. Trust in the newsroom, not an anonymous feed.",
        tech: ["Authors", "SEO"],
      },
      {
        title: "Newsletter",
        text: "Once a week — three pieces and one guide. Form at the end of the article, email confirmation.",
        tech: ["Telegram", "Email"],
      },
    ],
    quote: {
      text: "Finally all the writing lives in one place. Search now brings people who actually read — not random traffic from pictures.",
      role: "Editor-in-chief, Field Notes",
    },
  },
};
