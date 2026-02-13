export const START_DATE_ISO = "2025-12-21";
export const PASSCODE = "21122025";
export const HER_NAME = "Martina";

export type BootLine = { text: string; delayMs?: number };

export function makeBootLines(days: number, herName: string): BootLine[] {
  return [
    { text: "Booting LoveOS v1.0...", delayMs: 650 },
    { text: "Loading memories...", delayMs: 650 },
    { text: "Mounting HeartMonitor.sys...", delayMs: 650 },
    { text: "Checking Surprise.lock...", delayMs: 650 },
    { text: `Connecting to: ${herName} ❤️`, delayMs: 900 },
    { text: "Relationship status: ACTIVE", delayMs: 650 },
    { text: `Days online: ${days}`, delayMs: 650 },
    { text: "System stable.", delayMs: 800 },
  ];
}

export const MEMORY_CARDS = [
  { date: "21.12.2025", title: "Start", note: "Počelo je (i nije stalo)." },
  { date: "—", title: "Naša interna fora", note: "Ovdje ubaci vaš inside joke." },
  { date: "—", title: "Mali trenutak", note: "Neki sitan detalj koji pamtiš." },
  { date: "—", title: "Osmijeh", note: "Kad si skontao: ‘to je to’." },
];

export const LOVE_MESSAGES = [
  "Ti si mi najbolja odluka (uz malo ludila).",
  "Moj mir + moj haos = mi.",
  "Ako klikneš još jednom, dugujem ti poljubac.",
  "Trifun + Valentinovo = mi. Deal.",
  "Okej, službeno: ti si mi omiljena navika.",
  "Ti i ja: jednostavno radi.",
];

export const finalLetter  = `
Kusicka,

Ako si dosla do ovdje, znaci da si prosla sve moje male testove. Nadam se da ces imati razuma kad dodjes ovde i da tvoji testovi prema meni budu slicne tezine hahaha 😂

Iskreno nadam se da ti se svidjelo ovo sve.
Zelim samo da ti kazem da mi je drago sto si tako neplanirano usla u moj zivot, znam da cemo imati teskih momenata kroz zivot, ovde ce ti stajati moje obecanje da cu dati sve od sebe da uspijemo i mi kao ljubav i mi kao osobe, bodrit cu te u svemu sto zamislis i sto budes htjela ostvariti u buducnosti.

Drago mi je sto me "bombardujes" sa svojim random pitanjima, jako volim sto mozemo o svemu pricati, jer mislim da je to i "cheat code" do uspijeha. Volio bih da tako ostane, da budemo i ljubavnici i najbolji prijatelji u isto vrijeme, i da ti budem jak oslonac, tvrdjava u koju ces uvijek moci pobjeci kada god ti to treba i osjecati se sigurno tu.

Tvoj Nedo ❤️
`;

