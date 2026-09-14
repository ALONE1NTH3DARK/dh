import { PROJECTS_EN } from "./projects.en";

export interface ProjectHighlight {
  title: string;
  text: string;
  metric?: string;
}

export interface ProjectFeature {
  title: string;
  text: string;
  /** Путь к gif/картинке фичи — public/projects/{slug}/N.gif */
  media: string;
  /** Пара технологий для примера */
  tech: string[];
}

export type ProjectKind = "latest" | "landing" | "site" | "shop" | "blog";

export interface Project {
  slug: string;
  /** Карточка в «Последние работы» */
  preview: string;
  /** Крупный скрин на странице кейса */
  full: string;
  title: string;
  cat: string;
  /** Категории ленты: последние / лендинг / сайт / магазин / блог */
  kinds: ProjectKind[];
  url: string;
  result: string;
  time: string;
  year: string;
  client: string;
  summary: string;
  challenge: string;
  solution: string;
  highlights: ProjectHighlight[];
  features: ProjectFeature[];
  /** Google PageSpeed Insights — свои цифры у каждого проекта */
  pagespeed: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  stack: string[];
  quote?: { text: string; author: string; role: string };
}


export const PROJECTS: Project[] = [
  {
    slug: "hype",
    preview: "/projects/hype/preview.webp",
    full: "/projects/hype/full.jpg",
    title: "Креативное агенство HYPE",
    cat: "Корпоративный сайт",
    kinds: ["latest", "site"],
    url: "hype.kz",
    result: "+148% продаж",
    time: "1 месяц",
    year: "2025",
    client: "Noir Boutique",
    summary:
      "Премиальный fashion e-commerce, который превращает витрину в воронку продаж: от первого экрана до оплаты — без лишних шагов.",
    challenge:
      "Старый сайт выглядел устаревшим, медленно грузился на мобильных и терял клиентов на корзине. Конверсия держалась на уровне 1,8%.",
    solution:
      "Собрали новую структуру каталога, ускорили загрузку до секунды и выстроили сценарий покупки вокруг визуала коллекции и доверия к бренду.",
    highlights: [
      {
        title: "Корзина без трения",
        text: "Оплата в один экран, сохранённые размеры и прозрачная доставка — меньше брошенных заказов.",
        metric: "−41%",
      },
      {
        title: "Мобильный приоритет",
        text: "70% трафика — смартфоны. Интерфейс заточен под большой палец и быстрый скролл коллекции.",
        metric: "<1 с",
      },
    ],
    features: [
      {
        title: "Живой каталог коллекции",
        text: "Карточки товаров с крупными кадрами и быстрыми фильтрами без перезагрузки страницы. Покупатель сразу видит посадку, ткань и наличие размеров.",
        media: `/projects/hype/1.gif`,

        tech: ["React", "Headless CMS"],
      },
      {
        title: "Корзина в один экран",
        text: "Оформление заказа собрано компактно: доставка, оплата и подтверждение — без лишних шагов. Меньше брошенных корзин на мобильных.",
        media: `/projects/hype/2.gif`,

        tech: ["YooKassa", "TypeScript"],
      },
      {
        title: "Мобильный приоритет",
        text: "Интерфейс заточен под большой палец: крупные зоны нажатия, быстрый скролл ленты и мгновенная подгрузка фото.",
        media: `/projects/hype/3.gif`,

        tech: ["Vite", "CSS"],
      },
    ],
    pagespeed: {
      performance: 98,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    },
    stack: ["React", "Headless CMS", "YooKassa", "SEO"],
    quote: {
      text: "Сайт окупается ежедневно. Конверсия выросла с 1,8% до 4,2%, а клиенты отдельно отмечают дизайн.",
      author: "Александр Громов",
      role: "Основатель Noir Boutique",
    },
  },
  {
    slug: "photograph",
    preview: "/projects/photograph/preview.webp",
    full: "/projects/photograph/full.webp",
    title: "Свадебный фотограф",
    cat: "Сайт портфолио",
    kinds: ["latest", "site"],
    url: "фотограф.kz",
    result: "×3 конверсия",
    time: "2 недели",
    year: "2025",
    client: "Pulse Finance",
    summary:
      "Цифровая платформа для финтеха, где сложные продукты читаются за секунды — и заявки идут круглосуточно.",
    challenge:
      "Продукт выглядел как презентация для инвесторов, а не как сервис для клиентов. Стоимость привлечения росла, заявки были холодными.",
    solution:
      "Переупаковали ценность в понятные сценарии, добавили калькуляторы и воронку из квиза — от интереса до заявки без звонка менеджера.",
    highlights: [
      {
        title: "Цифры вместо жаргона",
        text: "Каждый продукт объясняется выгодой и цифрой, а не аббревиатурами. Клиент сразу понимает, зачем это ему.",
        metric: "×3",
      },
      {
        title: "Квиз вместо формы",
        text: "Короткий сценарий собирает сегмент клиента и отправляет в нужный продукт — выше качество лидов.",
        metric: "−35%",
      },
      {
        title: "Доверие с первого экрана",
        text: "Лицензии, безопасность и кейсы — в зоне первого взгляда. Меньше сомнений перед заявкой.",
        metric: "24/7",
      },
    ],
    features: [
      {
        title: "Цифры вместо жаргона",
        text: "Каждый финтех-продукт объясняется выгодой и понятной метрикой. Клиент за секунды понимает, зачем ему сервис.",
        media: `/projects/photograph/1.gif`,

        tech: ["Next.js", "Analytics"],
      },
      {
        title: "Квиз вместо холодной формы",
        text: "Короткий сценарий сегментирует пользователя и ведёт в нужный продукт. Заявки приходят уже «тёплыми».",
        media: `/projects/photograph/2.gif`,

        tech: ["TypeScript", "CRM"],
      },
      {
        title: "Доверие с первого экрана",
        text: "Лицензии, безопасность и кейсы — в зоне первого взгляда. Меньше сомнений перед отправкой заявки.",
        media: `/projects/photograph/3.gif`,

        tech: ["React", "SEO"],
      },
    ],
    pagespeed: {
      performance: 100,
      accessibility: 98,
      bestPractices: 100,
      seo: 97,
    },
    stack: ["Next.js", "TypeScript", "Analytics", "CRM"],
    quote: {
      text: "Новая подача цифр сработала и на клиентов, и на инвесторов. Продукт наконец выглядит на уровне лидеров рынка.",
      author: "Екатерина Соколова",
      role: "CMO Pulse Finance",
    },
  },
  {
    slug: "atelier-nord",
    preview: "/projects/atelier-nord/preview.webp",
    full: "/projects/atelier-nord/full.jpg",
    title: "Дешевле.kz интернет-магазин",
    cat: "Интернет-магазин",
    kinds: ["latest", "shop"],
    url: "дешевле.kz",
    result: "+90% запросов",
    time: "6 недель",
    year: "2024",
    client: "Atelier Nord",
    summary:
      "Сайт архитектурного бюро, который продаёт уровень проектов ещё до звонка — через атмосферу и точный кейс.",
    challenge:
      "Портфолио выглядело как архив фотографий. Заказчики не понимали масштаб и приходили с запросами ниже чека бюро.",
    solution:
      "Собрали нарратив вокруг проектов: контекст, задача, решение, результат. Добавили фильтры по типу объектов и сильный первый экран.",
    highlights: [
      {
        title: "Кейсы как истории",
        text: "Каждый проект — не галерея, а путь: бриф → концепт → реализация. Клиент сразу видит глубину работы.",
        metric: "+90%",
      },
      {
        title: "Фильтр по задачам",
        text: "Частный дом, офис, редевелопмент — посетитель находит релевантный опыт за два клика.",
      },
      {
        title: "Премиальный ритм",
        text: "Типографика, воздух и крупные кадры задают тон дорогих проектов ещё до разговора.",
      },
    ],
    features: [
      {
        title: "Кейсы как истории",
        text: "Каждый проект — путь от брифа до реализации. Заказчик видит глубину бюро ещё до звонка.",
        media: `/projects/atelier-nord/1.gif`,

        tech: ["React", "CMS"],
      },
      {
        title: "Фильтр по типу задачи",
        text: "Частный дом, офис или редевелопмент — релевантные работы находятся за два клика.",
        media: `/projects/atelier-nord/2.gif`,

        tech: ["Motion", "TypeScript"],
      },
      {
        title: "Премиальный ритм страницы",
        text: "Типографика, воздух и крупные кадры задают тон дорогих проектов до первого разговора.",
        media: `/projects/atelier-nord/3.gif`,

        tech: ["CSS", "SEO"],
      },
    ],
    pagespeed: {
      performance: 96,
      accessibility: 100,
      bestPractices: 98,
      seo: 100,
    },
    stack: ["React", "CMS", "Motion", "SEO"],
    quote: {
      text: "Теперь заказчики приходят уже готовыми обсуждать дорогой дизайн-проект — уровень доверия вырос моментально.",
      author: "Михаил Вершинин",
      role: "Главный архитектор Atelier Nord",
    },
  },
  {
    slug: "nordhaus",
    preview: "/projects/atelier-nord/preview.webp",
    full: "/projects/atelier-nord/full.jpg",
    title: "Nordhaus",
    cat: "Интернет-магазин",
    kinds: ["shop"],
    url: "nordhaus.kz",
    result: "+64% заказов",
    time: "6 недель",
    year: "2026",
    client: "Nordhaus",
    summary:
      "Магазин мебели и света, где коллекция читается как витрина: от первого экрана до оплаты — без лишних шагов.",
    challenge:
      "Старый каталог путал серии и терял покупателей в корзине. Заказы часто уходили в WhatsApp.",
    solution:
      "Собрали понятный каталог, быстрые фильтры и короткое оформление заказа с доставкой и оплатой на одном экране.",
    highlights: [
      {
        title: "Каталог без шума",
        text: "Серии, размеры и наличие сразу на карточке — меньше вопросов менеджеру.",
        metric: "+64%",
      },
      {
        title: "Корзина в один шаг",
        text: "Доставка, оплата и подтверждение на одном экране — меньше брошенных заказов.",
        metric: "−28%",
      },
      {
        title: "Фильтры по комнате",
        text: "Гостиная, спальня, свет — нужная позиция находится за пару кликов.",
      },
    ],
    features: [
      {
        title: "Живой каталог",
        text: "Крупные фото, быстрые фильтры и наличие размеров без перезагрузки страницы.",
        media: `/projects/atelier-nord/1.gif`,
        tech: ["React", "Headless CMS"],
      },
      {
        title: "Оплата на одном экране",
        text: "Адрес, способ получения и оплата собраны компактно — удобно с телефона.",
        media: `/projects/atelier-nord/2.gif`,
        tech: ["Kaspi", "TypeScript"],
      },
      {
        title: "Карточки серий",
        text: "Материал, габариты и похожие позиции рядом — проще собрать комплект.",
        media: `/projects/atelier-nord/3.gif`,
        tech: ["Vite", "SEO"],
      },
    ],
    pagespeed: {
      performance: 97,
      accessibility: 99,
      bestPractices: 100,
      seo: 100,
    },
    stack: ["React", "Headless CMS", "Kaspi", "SEO"],
    quote: {
      text: "Заказы наконец идут с сайта, а не из переписок. Каталог стали листать, а не спрашивать «есть ли в наличии».",
      author: "Дарья Белова",
      role: "Основательница Nordhaus",
    },
  },
  {
    slug: "umami",
    preview: "/projects/umami/preview.webp",
    full: "/projects/umami/full.jpg",
    title: "Umami",
    cat: "Лэндинг ресторана",
    kinds: ["latest", "landing"],
    url: "umami.rest",
    result: "+72% броней",
    time: "2 недели",
    year: "2025",
    client: "Umami",
    summary:
      "Сайт ресторана, где атмосфера кухни и удобный онлайн-booking работают вместе — и столы заполняются заранее.",
    challenge:
      "Гости бронировали через соцсети и мессенджеры. Сайт не отражал кухню и не давал быстрого пути к столику.",
    solution:
      "Сделали эмоциональный лендинг с меню, шеф-историей и встроенным бронированием в два шага.",
    highlights: [
      {
        title: "Бронь за 30 секунд",
        text: "Дата, время, гости — и подтверждение. Без звонков и ожидания ответа администратора.",
        metric: "+72%",
      },
      {
        title: "Меню как витрина",
        text: "Сезонные позиции с фото и акцентами шефа — гости приходят уже «проголодавшись».",
      },
      {
        title: "Вечерняя атмосфера",
        text: "Тёмный визуальный язык и свет акцентов передают настроение зала ещё до визита.",
      },
    ],
    features: [
      {
        title: "Бронь за 30 секунд",
        text: "Дата, время и число гостей — подтверждение без звонка администратору. Столы заполняются заранее.",
        media: `/projects/umami/1.gif`,

        tech: ["Booking API", "React"],
      },
      {
        title: "Меню как витрина",
        text: "Сезонные позиции с акцентами шефа. Гость приходит уже «проголодавшимся».",
        media: `/projects/umami/2.gif`,

        tech: ["CMS", "TypeScript"],
      },
      {
        title: "Вечерняя атмосфера",
        text: "Тёмный визуальный язык и свет акцентов передают настроение зала ещё до визита.",
        media: `/projects/umami/3.gif`,

        tech: ["CSS", "Motion"],
      },
    ],
    pagespeed: {
      performance: 100,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    },
    stack: ["React", "Booking API", "CMS"],
  },
  {
    slug: "borovoe-houses",
    preview: "/projects/borovoe-houses/cover.webp",
    full: "/projects/borovoe-houses/case.webp",
    title: "Borovoe Houses",
    cat: "Сайт курорта",
    kinds: ["latest", "site"],
    url: "borovoehouses.kz",
    result: "+210% заявок",
    time: "1 месяц",
    year: "2025",
    client: "Beyond Travel",
    summary:
      "Тревел-платформа под индивидуальные маршруты: вдохновение + понятный бриф = заявка без лишней переписки.",
    challenge:
      "Каталог туров выглядел шаблонно. Клиенты писали «сколько стоит?» и пропадали — не было сценария подбора.",
    solution:
      "Построили воронку вокруг направлений и стиля путешествия, добавили квиз маршрута и сильные визуальные истории.",
    highlights: [
      {
        title: "Квиз маршрута",
        text: "Бюджет, сезон, формат отдыха — заявка приходит уже сегментированной.",
        metric: "+210%",
      },
      {
        title: "Истории направлений",
        text: "Не списки отелей, а сценарии путешествия: для кого, зачем и что получите.",
      },
      {
        title: "Быстрый ответ",
        text: "Форма сразу уходит менеджеру с тегами — клиент получает предложение в тот же день.",
      },
    ],
    features: [
      {
        title: "Квиз маршрута",
        text: "Бюджет, сезон и формат отдыха собираются в короткие шаги — заявка приходит сегментированной.",
        media: `/projects/borovoe-houses/1.gif`,

        tech: ["Quiz funnel", "CRM"],
      },
      {
        title: "Истории направлений",
        text: "Не список отелей, а сценарии путешествия: для кого, зачем и что получите.",
        media: `/projects/borovoe-houses/2.gif`,

        tech: ["React", "CMS"],
      },
      {
        title: "Ответ в тот же день",
        text: "Форма уходит менеджеру с тегами — клиент получает предложение без лишней переписки.",
        media: `/projects/borovoe-houses/3.gif`,

        tech: ["Analytics", "API"],
      },
    ],
    pagespeed: {
      performance: 97,
      accessibility: 99,
      bestPractices: 100,
      seo: 98,
    },
    stack: ["React", "Quiz funnel", "CRM", "Analytics"],
  },
  {
    slug: "lightroom",
    preview: "/projects/lightroom/preview.webp",
    full: "/projects/lightroom/full.jpg",
    title: "Товары для освещения",
    cat: "Лэндинг магазина",
    kinds: ["latest", "landing"],
    url: "lightroom.kz",
    result: "×2.6 регистраций",
    time: "2 недели",
    year: "2024",
    client: "lightroom",
    summary:
      "Маркетинговый сайт SaaS, который объясняет сложный продукт за минуту и ведёт к пробному периоду.",
    challenge:
      "Посетители не понимали ценность за 10 секунд. Демо запрашивали редко, онбординг начинался с вопросов «а что это?».",
    solution:
      "Собрали storytelling вокруг use-cases, интерактивные демо-блоки и чёткий путь: ценность → proof → trial.",
    highlights: [
      {
        title: "Use-case storytelling",
        text: "Три роли пользователя — три сценария выгоды. Каждый видит себя в продукте.",
        metric: "×2.6",
      },
      {
        title: "Интерактивное демо",
        text: "Ключевые экраны продукта прямо на лендинге — меньше сомнений перед регистрацией.",
      },
      {
        title: "Trial без трения",
        text: "Короткая форма, соц.логин и онбординг-подсказки с первой минуты.",
      },
    ],
    features: [
      {
        title: "Use-case storytelling",
        text: "Три роли пользователя — три сценария выгоды. Каждый видит себя в продукте за минуту.",
        media: `/projects/lightroom/1.gif`,

        tech: ["Next.js", "Product demo"],
      },
      {
        title: "Интерактивное демо",
        text: "Ключевые экраны SaaS прямо на лендинге — меньше сомнений перед регистрацией.",
        media: `/projects/lightroom/2.gif`,

        tech: ["TypeScript", "React"],
      },
      {
        title: "Trial без трения",
        text: "Короткая форма, соц.логин и подсказки с первой минуты онбординга.",
        media: `/projects/lightroom/3.gif`,

        tech: ["Stripe", "Analytics"],
      },
    ],
    pagespeed: {
      performance: 99,
      accessibility: 100,
      bestPractices: 97,
      seo: 100,
    },
    stack: ["Next.js", "Product demo", "Stripe", "Analytics"],
  },
  {
    slug: "psychologist",
    preview: "/projects/psychologist/preview.webp",
    full: "/projects/psychologist/full.webp",
    title: "Психолог Москва",
    cat: "Персональный сайт",
    kinds: ["latest", "site"],
    url: "psycho.info",
    result: "+134% выручки",
    time: "1 месяц",
    year: "2026",
    client: "Психолог Москва",
    summary:
      "D2C-бренд ухода за кожей: чистый визуал, подбор продукта и покупка без лишних кликов.",
    challenge:
      "Ассортимент путал клиентов. Не было персонализации, а карточки товаров не закрывали возражения по составу.",
    solution:
      "Добавили квиз типа кожи, усилили карточки составами и доказательной базой, упростили чекаут.",
    highlights: [
      {
        title: "Подбор за минуту",
        text: "Квиз по типу кожи выдаёт 2–3 продукта — выше средний чек и меньше возвратов.",
        metric: "+134%",
      },
      {
        title: "Доверие к составу",
        text: "Ингредиенты, клинические факты и отзывы — рядом с кнопкой «В корзину».",
      },
      {
        title: "Чистый бренд",
        text: "Светлая эстетика и спокойная типографика отстроили бренд от «кричащего» масс-маркета.",
      },
    ],
    features: [
      {
        title: "Понятный первый экран",
        text: "Он чётко обозначает направления с которыми мы работает и представляет человека который может помочь.",
        media: `/projects/psychologist/1.gif`,

        tech: ["Quiz", "React"],
      },
      {
        title: "Список популярных услуг",
        text: "Помогает понять, что ваша проблема распространённая причина обращения к психологу, они решаемы и специалист работает именно с таким запросом.",
        media: `/projects/psychologist/1.gif`,

        tech: ["Примеры услуг"],
      },
      {
        title: "Дополнительные точки входа",
        text: "Небольшие статьи о распространённых жизненных ситуациях и проблемах, с которыми может помочь психолог — привлекают потенциальных клиентов из поисковых систем по другим запросам.",
        media: `/projects/psychologist/1.gif`,

        tech: ["Заметки", "SEO"],
      },
      {
        title: "Форма связи",
        text: "Светлая эстетика и спокойная типографика отстраивают бренд от «кричащего» масс-маркета.",
        media: `/projects/psychologist/1.gif`,

        tech: ["Telegram", "Макс", "Электронная почта"],
      },
    ],
    pagespeed: {
      performance: 100,
      accessibility: 96,
      bestPractices: 100,
      seo: 99,
    },
    stack: ["React", "E-commerce", "Quiz", "Email"],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function localizeProject(project: Project, locale: "ru" | "en"): Project {
  if (locale === "ru") return project;
  const copy = PROJECTS_EN[project.slug];
  if (!copy) return project;

  return {
    ...project,
    title: copy.title,
    cat: copy.cat,
    result: copy.result,
    time: copy.time,
    client: copy.client,
    summary: copy.summary,
    challenge: copy.challenge,
    solution: copy.solution,
    highlights: project.highlights.map((item, i) => ({
      ...item,
      title: copy.highlights[i]?.title ?? item.title,
      text: copy.highlights[i]?.text ?? item.text,
      metric: copy.highlights[i]?.metric ?? item.metric,
    })),
    features: project.features.map((item, i) => ({
      ...item,
      title: copy.features[i]?.title ?? item.title,
      text: copy.features[i]?.text ?? item.text,
      tech: copy.features[i]?.tech ?? item.tech,
    })),
    quote: project.quote
      ? {
          ...project.quote,
          text: copy.quote?.text ?? project.quote.text,
          role: copy.quote?.role ?? project.quote.role,
        }
      : project.quote,
  };
}

export function localizeProjects(locale: "ru" | "en"): Project[] {
  return PROJECTS.map((project) => localizeProject(project, locale));
}

export function getAdjacentProjects(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length],
    next: PROJECTS[(i + 1) % PROJECTS.length],
  };
}
