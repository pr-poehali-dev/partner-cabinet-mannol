/* ─────────────────────────────────────────────
   Центральное хранилище черновиков заказов.
   Данные живут в localStorage под ключом "b2b_drafts".
───────────────────────────────────────────── */

export type PkgType = "unit" | "box" | "pallet";

export interface DraftItem {
  id: string;
  sku: string;
  name: string;
  qty: number;
  pkg: PkgType;
  pricePerUnit: number;
  weightPerUnit: number;
}

export interface Draft {
  id: string;
  title: string;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
  autoSaved: boolean;
  orderType: "regular" | "direct";
  shipDate?: string;
  comment?: string;
  items: DraftItem[];
}

const KEY = "b2b_drafts";

function read(): Draft[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(drafts: Draft[]) {
  localStorage.setItem(KEY, JSON.stringify(drafts));
}

export const draftStore = {
  getAll(): Draft[] {
    const stored = read();
    // Если localStorage пустой — вернуть моковые данные для демо
    if (stored.length === 0) return SEED_DRAFTS;
    return stored;
  },

  get(id: string): Draft | undefined {
    return draftStore.getAll().find(d => d.id === id);
  },

  save(draft: Draft): Draft {
    const all = draftStore.getAll();
    const existing = all.findIndex(d => d.id === draft.id);
    const updated = { ...draft, updatedAt: new Date().toISOString() };
    if (existing >= 0) {
      all[existing] = updated;
    } else {
      all.unshift(updated);
    }
    write(all);
    return updated;
  },

  delete(id: string) {
    write(draftStore.getAll().filter(d => d.id !== id));
  },

  duplicate(id: string): Draft | null {
    const orig = draftStore.get(id);
    if (!orig) return null;
    const copy: Draft = {
      ...orig,
      id: `draft-${Date.now()}`,
      title: `${orig.title} (копия)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      autoSaved: false,
    };
    const all = draftStore.getAll();
    all.unshift(copy);
    write(all);
    return copy;
  },

  newId(): string {
    return `draft-${Date.now()}`;
  },
};

/* ─── Seed data для демо (когда localStorage пуст) ─── */
const SEED_DRAFTS: Draft[] = [
  {
    id: "draft-001",
    title: "Заказ на апрель — моторные масла",
    createdAt: "2026-05-04T10:00:00.000Z",
    updatedAt: "2026-05-05T14:32:00.000Z",
    autoSaved: false,
    orderType: "regular",
    shipDate: "2026-05-12",
    comment: "Согласовать с логистом перед отправкой",
    items: [
      { id: "i1", sku: "MN7707-4", name: "MANNOL Energy Formula OP 5W-30 4L", qty: 80,  pkg: "box",  pricePerUnit: 2490, weightPerUnit: 4.2 },
      { id: "i2", sku: "MN7914-4", name: "MANNOL Extreme 5W-40 4L",            qty: 60,  pkg: "box",  pricePerUnit: 2750, weightPerUnit: 4.2 },
      { id: "i3", sku: "MN7501-4", name: "MANNOL Classic 10W-40 4L",           qty: 80,  pkg: "unit", pricePerUnit: 1890, weightPerUnit: 4.2 },
    ],
  },
  {
    id: "draft-002",
    title: "Черновик",
    createdAt: "2026-05-03T09:00:00.000Z",
    updatedAt: "2026-05-04T09:15:00.000Z",
    autoSaved: true,
    orderType: "direct",
    items: [
      { id: "i4", sku: "MN8212-1", name: "MANNOL ATF AG52 1L",        qty: 20, pkg: "unit", pricePerUnit: 890, weightPerUnit: 1.1 },
      { id: "i5", sku: "MN4012-1", name: "MANNOL Antifreeze AG12 1L", qty: 12, pkg: "unit", pricePerUnit: 420, weightPerUnit: 1.1 },
    ],
  },
  {
    id: "draft-003",
    title: "Спецзаказ — допродажи май",
    createdAt: "2026-05-02T08:00:00.000Z",
    updatedAt: "2026-05-02T11:00:00.000Z",
    autoSaved: false,
    orderType: "regular",
    shipDate: "2026-05-20",
    comment: "",
    items: [
      { id: "i6", sku: "MN7707-4", name: "MANNOL Energy Formula OP 5W-30 4L", qty: 200, pkg: "pallet", pricePerUnit: 2490, weightPerUnit: 4.2 },
      { id: "i7", sku: "MN7501-4", name: "MANNOL Classic 10W-40 4L",           qty: 400, pkg: "pallet", pricePerUnit: 1890, weightPerUnit: 4.2 },
    ],
  },
];
