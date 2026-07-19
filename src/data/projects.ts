import noirPreview from "../assets/portfolio/noir-preview.jpg";
import noirFull from "../assets/portfolio/noir-full.jpg";
import pulsePreview from "../assets/portfolio/pulse-preview.jpg";
import pulseFull from "../assets/portfolio/pulse-full.jpg";
import atelierPreview from "../assets/portfolio/atelier-nord-preview.jpg";
import atelierFull from "../assets/portfolio/atelier-nord-full.jpg";
import umamiPreview from "../assets/portfolio/umami-preview.jpg";
import umamiFull from "../assets/portfolio/umami-full.jpg";
import beyondPreview from "../assets/portfolio/beyond-preview.jpg";
import beyondFull from "../assets/portfolio/beyond-full.jpg";
import cortexPreview from "../assets/portfolio/cortex-preview.jpg";
import cortexFull from "../assets/portfolio/cortex-full.jpg";
import lumenPreview from "../assets/portfolio/lumen-preview.jpg";
import lumenFull from "../assets/portfolio/lumen-full.jpg";

export interface ProjectHighlight {
  title: string;
  text: string;
  metric?: string;
}

export interface Project {
  slug: string;
  /** Карточка в «Последние работы» */
  preview: string;
  /** Крупный скрин на странице кейса */
  full: string;
  title: string;
  cat: string;
  url: string;
  result: string;
  time: string;
  year: string;
  client: string;
  summary: string;
  challenge: string;
  solution: string;
  highlights: ProjectHighlight[];
  metrics: { value: string; label: string }[];
  stack: string[];
  quote?: { text: string; author: string; role: string };
}

export const PROJECTS: Project[] = [
  {
    slug: "noir",
    preview: noirPreview,
    full: noirFull,
    title: "Noir",
    cat: "Fashion e-commerce",
    url: "noir-boutique.ru",
    result: "+148% продаж",
    time: "3 недели",
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
        title: "Витрина, которая продаёт",
        text: "Крупные кадры, фильтры без перезагрузки и карточки товара с акцентом на материал и посадку.",
        metric: "+148%",
      },
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
    metrics: [
      { value: "+148%", label: "онлайн-продаж" },
      { value: "4.2%", label: "конверсия" },
      { value: "−41%", label: "брошенных корзин" },
      { value: "3 нед.", label: "до запуска" },
    ],
    stack: ["React", "Headless CMS", "YooKassa", "SEO"],
    quote: {
      text: "Сайт окупается ежедневно. Конверсия выросла с 1,8% до 4,2%, а клиенты отдельно отмечают дизайн.",
      author: "Александр Громов",
      role: "Основатель Noir Boutique",
    },
  },
  {
    slug: "pulse",
    preview: pulsePreview,
    full: pulseFull,
    title: "Pulse",
    cat: "Финтех-платформа",
    url: "pulse.finance",
    result: "×3 конверсия",
    time: "8 недель",
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
    metrics: [
      { value: "×3", label: "больше заявок" },
      { value: "−35%", label: "стоимость лида" },
      { value: "24/7", label: "приём заявок" },
      { value: "8 нед.", label: "до запуска" },
    ],
    stack: ["Next.js", "TypeScript", "Analytics", "CRM"],
    quote: {
      text: "Новая подача цифр сработала и на клиентов, и на инвесторов. Продукт наконец выглядит на уровне лидеров рынка.",
      author: "Екатерина Соколова",
      role: "CMO Pulse Finance",
    },
  },
  {
    slug: "atelier-nord",
    preview: atelierPreview,
    full: atelierFull,
    title: "Atelier Nord",
    cat: "Архитектурное бюро",
    url: "ateliernord.studio",
    result: "+90% запросов",
    time: "4 недели",
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
    metrics: [
      { value: "+90%", label: "целевых запросов" },
      { value: "↑ чек", label: "среднего запроса" },
      { value: "×2", label: "глубина кейсов" },
      { value: "4 нед.", label: "до запуска" },
    ],
    stack: ["React", "CMS", "Motion", "SEO"],
    quote: {
      text: "Теперь заказчики приходят уже готовыми обсуждать дорогой дизайн-проект — уровень доверия вырос моментально.",
      author: "Михаил Вершинин",
      role: "Главный архитектор Atelier Nord",
    },
  },
  {
    slug: "umami",
    preview: umamiPreview,
    full: umamiFull,
    title: "Umami",
    cat: "Ресторан",
    url: "umami.rest",
    result: "+72% броней",
    time: "3 недели",
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
    metrics: [
      { value: "+72%", label: "онлайн-броней" },
      { value: "30 с", label: "до подтверждения" },
      { value: "2 шага", label: "до брони" },
      { value: "3 нед.", label: "до запуска" },
    ],
    stack: ["React", "Booking API", "CMS"],
  },
  {
    slug: "beyond",
    preview: beyondPreview,
    full: beyondFull,
    title: "Beyond",
    cat: "Тревел-агентство",
    url: "beyond.travel",
    result: "+210% заявок",
    time: "5 недель",
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
    metrics: [
      { value: "+210%", label: "заявок" },
      { value: "×2", label: "качество лидов" },
      { value: "1 день", label: "до ответа" },
      { value: "5 нед.", label: "до запуска" },
    ],
    stack: ["React", "Quiz funnel", "CRM", "Analytics"],
  },
  {
    slug: "cortex",
    preview: cortexPreview,
    full: cortexFull,
    title: "Cortex",
    cat: "SaaS-платформа",
    url: "cortex.app",
    result: "×2.6 регистраций",
    time: "10 недель",
    year: "2024",
    client: "Cortex",
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
    metrics: [
      { value: "×2.6", label: "регистраций" },
      { value: "+38%", label: "активация trial" },
      { value: "3 роли", label: "сценария" },
      { value: "10 нед.", label: "до запуска" },
    ],
    stack: ["Next.js", "Product demo", "Stripe", "Analytics"],
  },
  {
    slug: "lumen",
    preview: lumenPreview,
    full: lumenFull,
    title: "Lumen",
    cat: "Косметика D2C",
    url: "lumen-cosmetics.ru",
    result: "+134% выручки",
    time: "4 недели",
    year: "2025",
    client: "Lumen Cosmetics",
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
        text: "Светлая эстетика и спокойная типографика отстроили Lumen от «кричащего» масс-маркета.",
      },
    ],
    metrics: [
      { value: "+134%", label: "выручки" },
      { value: "+22%", label: "средний чек" },
      { value: "2–3", label: "продукта в квизе" },
      { value: "4 нед.", label: "до запуска" },
    ],
    stack: ["React", "E-commerce", "Quiz", "Email"],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length],
    next: PROJECTS[(i + 1) % PROJECTS.length],
  };
}
