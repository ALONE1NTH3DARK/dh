import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowLeft,
  Clock3,
  Eye,
  LogOut,
  MonitorSmartphone,
  MousePointerClick,
  RefreshCw,
  Send,
  TrendingDown,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

type Breakdown = { name: string; views: number; visitors: number };

type Stats = {
  ok: boolean;
  range: { days: number; from: string; to: string };
  totals: {
    pageviews: number;
    visitors: number;
    sessions: number;
    clicks: number;
    leads: number;
    avgSessionSeconds: number;
    bounceRate: number;
    conversionRate: number;
  };
  timeline: { bucket: string; label: string; views: number; visitors: number }[];
  pages: {
    path: string;
    views: number;
    visitors: number;
    avgSeconds: number;
    avgScroll: number;
  }[];
  clicks: { label: string; path: string; clicks: number; visitors: number }[];
  sources: Breakdown[];
  devices: Breakdown[];
  countries: Breakdown[];
};

const RANGES = [
  { days: 1, label: "Сутки" },
  { days: 7, label: "7 дней" },
  { days: 30, label: "30 дней" },
] as const;

const DEVICE_NAMES: Record<string, string> = {
  mobile: "Телефоны",
  tablet: "Планшеты",
  desktop: "Компьютеры",
};

const SOURCE_NAMES: Record<string, string> = {
  direct: "Прямые заходы",
};

const CARD =
  "min-w-0 rounded-2xl border border-white/10 bg-void-2/70 p-5 backdrop-blur-xl md:p-6";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0 с";
  if (seconds < 60) return `${seconds} с`;

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  return rest === 0 ? `${minutes} мин` : `${minutes} мин ${rest} с`;
}

/** Код страны в флаг: RU → 🇷🇺 */
function countryFlag(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";

  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65)
  );
}

async function api(path: string, init?: RequestInit): Promise<Response> {
  return fetch(path, { credentials: "same-origin", ...init });
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [days, setDays] = useState<number>(7);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Статистика · DARKHORSE";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => meta.remove();
  }, []);

  useEffect(() => {
    let cancelled = false;

    void api("/api/admin-session.php")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        setAuthenticated(Boolean(data?.authenticated));
        setConfigured(data?.configured !== false);
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadStats = useCallback(async (range: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api(`/api/stats.php?days=${range}`);

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error("stats_failed");

      setStats((await res.json()) as Stats);
    } catch {
      setError("Не удалось загрузить статистику. Проверьте, что api/ работает на сервере.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) void loadStats(days);
  }, [authenticated, days, loadStats]);

  const logout = async () => {
    await api("/api/admin-session.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});

    setStats(null);
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-void">
        <p className="font-mono text-[14px] uppercase tracking-[2px] text-mute">
          Загрузка…
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <LoginScreen
        configured={configured}
        onSuccess={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-void px-4 py-8 text-ink sm:px-5 md:px-10 md:py-14">
      <div className="mx-auto w-full min-w-0 max-w-[1400px]">
        <header className="flex flex-col gap-6 border-b border-white/[0.07] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 flex min-w-0 items-center gap-3 font-mono text-[13px] uppercase tracking-[1.4px] text-mute/90 sm:text-[14px] sm:tracking-[2px]">
              <span className="h-px w-9 shrink-0 bg-vio" aria-hidden />
              Аналитика
            </p>
            <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold uppercase leading-tight break-words">
              Статистика <span className="text-gradient-warm">сайта</span>
            </h1>
            {stats && (
              <p className="mt-3 font-mono text-[12px] uppercase tracking-[1.4px] text-mute">
                {stats.range.from === stats.range.to
                  ? stats.range.to
                  : `${stats.range.from} — ${stats.range.to}`}
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="flex max-w-full overflow-x-auto rounded-full border border-white/15 p-1">
              {RANGES.map((range) => (
                <button
                  key={range.days}
                  type="button"
                  onClick={() => setDays(range.days)}
                  className={`shrink-0 rounded-full px-3 py-2 font-mono text-[12px] font-semibold uppercase tracking-[1.4px] transition-colors duration-300 sm:px-4 md:px-5 md:text-[13px] ${
                    days === range.days
                      ? "bg-ink text-void"
                      : "text-mute hover:text-ink"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void loadStats(days)}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-colors hover:border-vio hover:bg-vio/15"
              aria-label="Обновить"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              to="/"
              className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-colors hover:border-cyan-neon/60 hover:bg-cyan-neon/10"
              aria-label="На сайт"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <button
              type="button"
              onClick={() => void logout()}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-mute transition-colors hover:border-pink-neon/60 hover:bg-pink-neon/10 hover:text-ink"
              aria-label="Выйти"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        {error && (
          <p className="mt-8 rounded-2xl border border-pink-neon/30 bg-pink-neon/10 p-5 text-sm text-ink">
            {error}
          </p>
        )}

        {stats && (
          <>
            <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Eye}
                label="Просмотры"
                value={formatNumber(stats.totals.pageviews)}
                tone="text-cyan-neon"
              />
              <StatCard
                icon={Users}
                label="Посетители"
                value={formatNumber(stats.totals.visitors)}
                hint={`${formatNumber(stats.totals.sessions)} сессий`}
                tone="text-vio"
              />
              <StatCard
                icon={Clock3}
                label="Среднее время"
                value={formatDuration(stats.totals.avgSessionSeconds)}
                hint="на сессию"
                tone="text-amber-neon"
              />
              <StatCard
                icon={MousePointerClick}
                label="Клики по кнопкам"
                value={formatNumber(stats.totals.clicks)}
                tone="text-pink-neon"
              />
              <StatCard
                icon={Send}
                label="Заявки"
                value={formatNumber(stats.totals.leads)}
                tone="text-cyan-neon"
              />
              <StatCard
                icon={Activity}
                label="Конверсия"
                value={`${stats.totals.conversionRate}%`}
                hint="сессии с заявкой"
                tone="text-vio"
              />
              <StatCard
                icon={TrendingDown}
                label="Отказы"
                value={`${stats.totals.bounceRate}%`}
                hint="одна страница за сессию"
                tone="text-amber-neon"
              />
              <StatCard
                icon={MonitorSmartphone}
                label="Основное устройство"
                value={
                  stats.devices[0]
                    ? DEVICE_NAMES[stats.devices[0].name] ?? stats.devices[0].name
                    : "—"
                }
                hint={
                  stats.devices[0] ? `${formatNumber(stats.devices[0].views)} просмотров` : undefined
                }
                tone="text-pink-neon"
              />
            </div>

            <Timeline
              data={stats.timeline}
              hourly={stats.range.days === 1}
              className="mt-4"
            />

            <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-2">
              <PagesTable pages={stats.pages} />
              <ClicksTable clicks={stats.clicks} />
            </div>

            <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
              <BreakdownCard
                title="Источники"
                rows={stats.sources}
                names={SOURCE_NAMES}
                accent="bg-vio"
              />
              <BreakdownCard
                title="Устройства"
                rows={stats.devices}
                names={DEVICE_NAMES}
                accent="bg-cyan-neon"
              />
              <BreakdownCard
                title="Страны"
                rows={stats.countries}
                accent="bg-amber-neon"
                flags
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LoginScreen({
  configured,
  onSuccess,
}: {
  configured: boolean;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await api("/api/admin-session.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });

      if (res.ok) {
        onSuccess();
        return;
      }

      const data = await res.json().catch(() => null);
      setError(
        data?.error === "too_many_attempts"
          ? "Слишком много попыток. Повторите через 15 минут."
          : data?.error === "not_configured"
            ? "Пароль не задан на сервере: создайте api/admin-config.php."
            : "Неверный пароль."
      );
    } catch {
      setError("Сервер статистики недоступен.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-void px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-void-2/85 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8"
      >
        <p className="mb-4 flex min-w-0 items-center gap-3 font-mono text-[13px] uppercase tracking-[1.4px] text-mute/90 sm:text-[14px] sm:tracking-[2px]">
          <span className="h-px w-9 shrink-0 bg-vio" aria-hidden />
          Только для владельца
        </p>
        <h1 className="font-display text-2xl font-semibold uppercase leading-snug">
          Вход в <span className="text-gradient-warm">статистику</span>
        </h1>

        {!configured && (
          <p className="mt-5 rounded-xl border border-amber-neon/30 bg-amber-neon/10 p-4 text-sm text-ink">
            На сервере нет файла <code>api/admin-config.php</code>. Скопируйте
            <code> admin-config.example.php</code> и задайте пароль.
          </p>
        )}

        <label className="mt-6 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Пароль
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            className="w-full border-b border-white/15 bg-transparent py-4 text-base text-ink outline-none transition-colors placeholder:text-mute/55 focus:border-vio"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="mt-4 text-sm text-pink-neon">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="mt-7 w-full rounded-full bg-ink px-7 py-3.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 hover:bg-vio hover:text-ink disabled:opacity-60"
        >
          {sending ? "Проверяем…" : "Войти"}
        </button>
      </form>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  hint?: string;
  tone: string;
}) {
  return (
    <div className={CARD}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          {label}
        </span>
        <Icon className={`size-4 shrink-0 ${tone}`} />
      </div>
      <p className="mt-4 break-words font-display text-[clamp(1.5rem,8vw,1.875rem)] font-semibold leading-tight text-ink">
        {value}
      </p>
      {hint && (
        <p className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-mute/70">
          {hint}
        </p>
      )}
    </div>
  );
}

function Timeline({
  data,
  hourly,
  className = "",
}: {
  data: Stats["timeline"];
  hourly: boolean;
  className?: string;
}) {
  const max = Math.max(1, ...data.map((point) => point.views));

  return (
    <section className={`${CARD} ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-medium uppercase leading-snug text-ink">
          {hourly ? "Просмотры по часам" : "Просмотры по дням"}
        </h2>
        <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-sm bg-vio" /> просмотры
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-sm bg-cyan-neon" /> посетители
          </span>
        </div>
      </div>

      <div className="mt-7 overflow-x-auto">
        <div
          className={`flex h-48 items-end gap-1 md:gap-1.5 ${
            data.length > 10 ? "w-max min-w-full" : "w-full"
          }`}
        >
          {data.map((point) => (
            <div
              key={point.bucket}
              className={`group flex h-full flex-col justify-end gap-1 ${
                data.length > 10 ? "w-7 shrink-0" : "min-w-0 flex-1"
              }`}
              title={`${point.label}: ${point.views} просмотров, ${point.visitors} посетителей`}
            >
              <div className="flex h-full items-end justify-center gap-[2px]">
                <span
                  className="w-full max-w-3 rounded-t bg-vio/80 transition-colors group-hover:bg-vio"
                  style={{ height: `${Math.max(2, (point.views / max) * 100)}%` }}
                />
                <span
                  className="w-full max-w-3 rounded-t bg-cyan-neon/60 transition-colors group-hover:bg-cyan-neon"
                  style={{ height: `${Math.max(2, (point.visitors / max) * 100)}%` }}
                />
              </div>
              <span className="truncate text-center font-mono text-[8px] uppercase tracking-wide text-mute/60 md:text-[9px]">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TableShell({
  title,
  head,
  children,
  empty,
}: {
  title: string;
  head: string[];
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <section className={CARD}>
      <h2 className="font-display text-lg font-medium uppercase leading-snug text-ink">{title}</h2>

      {empty ? (
        <p className="mt-6 text-sm text-mute">Пока нет данных за этот период.</p>
      ) : (
        <div className="mt-5 -mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[480px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10">
                {head.map((cell, index) => (
                  <th
                    key={cell}
                    className={`pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute ${
                      index === 0 ? "" : "text-right"
                    }`}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PagesTable({ pages }: { pages: Stats["pages"] }) {
  return (
    <TableShell
      title="Страницы"
      head={["Страница", "Просмотры", "Люди", "Время", "Скролл"]}
      empty={pages.length === 0}
    >
      {pages.map((page) => (
        <tr key={page.path} className="border-b border-white/[0.05] last:border-0">
          <td className="max-w-[220px] truncate py-3 font-mono text-xs text-ink">
            {page.path}
          </td>
          <td className="py-3 text-right font-display text-sm font-medium text-ink">
            {formatNumber(page.views)}
          </td>
          <td className="py-3 text-right text-sm text-mute">
            {formatNumber(page.visitors)}
          </td>
          <td className="py-3 text-right text-sm text-mute">
            {formatDuration(page.avgSeconds)}
          </td>
          <td className="py-3 text-right text-sm text-mute">{page.avgScroll}%</td>
        </tr>
      ))}
    </TableShell>
  );
}

function ClicksTable({ clicks }: { clicks: Stats["clicks"] }) {
  return (
    <TableShell
      title="Клики по кнопкам"
      head={["Кнопка", "Страница", "Клики", "Люди"]}
      empty={clicks.length === 0}
    >
      {clicks.map((click) => (
        <tr
          key={`${click.label}-${click.path}`}
          className="border-b border-white/[0.05] last:border-0"
        >
          <td className="max-w-[200px] truncate py-3 text-sm text-ink">{click.label}</td>
          <td className="max-w-[140px] truncate py-3 text-right font-mono text-xs text-mute">
            {click.path}
          </td>
          <td className="py-3 text-right font-display text-sm font-medium text-ink">
            {formatNumber(click.clicks)}
          </td>
          <td className="py-3 text-right text-sm text-mute">
            {formatNumber(click.visitors)}
          </td>
        </tr>
      ))}
    </TableShell>
  );
}

function BreakdownCard({
  title,
  rows,
  names,
  accent,
  flags = false,
}: {
  title: string;
  rows: Breakdown[];
  names?: Record<string, string>;
  accent: string;
  flags?: boolean;
}) {
  const total = rows.reduce((sum, row) => sum + row.views, 0);

  return (
    <section className={CARD}>
      <h2 className="font-display text-lg font-medium uppercase leading-snug text-ink">{title}</h2>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-mute">Пока нет данных.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {rows.map((row) => {
            const share = total > 0 ? Math.round((row.views / total) * 100) : 0;
            const flag = flags ? countryFlag(row.name) : "";

            return (
              <li key={row.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="min-w-0 truncate text-sm text-ink">
                    {flag && <span className="mr-2">{flag}</span>}
                    {names?.[row.name] ?? row.name}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-mute">
                    {formatNumber(row.views)} · {share}%
                  </span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <span
                    className={`block h-full rounded-full ${accent}`}
                    style={{ width: `${Math.max(2, share)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
