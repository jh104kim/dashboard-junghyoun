import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

const OBSIDIAN_ROOT = "F:\\ai-obsidian\\지식창고";

type MountainItem = {
  산이름?: string;
  지역?: string;
  고도?: string;
};

type MountainList = {
  다녀온_산?: MountainItem[];
  안_다녀온_산?: MountainItem[];
};

type ItineraryRow = {
  이름?: string;
  날짜?: string;
  Day?: string;
  지역?: string;
  교통?: string;
  "확인 필요"?: string;
};

type PackingRow = {
  이름?: string;
  카테고리?: string;
  "필수 여부"?: string;
  체크?: string;
};

export type LifeSourceSummary = {
  activity: {
    visitedMountains: number;
    wishlistMountains: number;
    totalMountains: number;
    highAltitudeMountains: number;
    topRegions: Array<{ region: string; count: number }>;
  };
  travel: {
    itineraryRows: number;
    tripDays: number;
    confirmNeeded: number;
    packingItems: number;
    requiredItems: number;
    checkedItems: number;
    transportModes: Array<{ mode: string; count: number }>;
  };
  learning: {
    messagesInWindow: number;
    matchedCandidates: number;
    finalPicks: number;
    categories: Array<{ category: string; count: number }>;
  };
  sourceStatus: {
    obsidianAvailable: boolean;
    loadedFiles: string[];
  };
};

export async function getLifeSourceSummary(): Promise<LifeSourceSummary> {
  const loadedFiles: string[] = [];
  const [mountains, itinerary, packing, digest] = await Promise.all([
    readJson<MountainList>(["raw", "processed", "life", "등산_List.json"], loadedFiles, {}),
    readExternalCsv<ItineraryRow>(["wiki", "life", "travel", "sources", "2026_Oze_Trekking", "02_itinerary-db.csv"], loadedFiles),
    readExternalCsv<PackingRow>(["wiki", "life", "travel", "sources", "2026_Oze_Trekking", "03_packing-list.csv"], loadedFiles),
    readText(["raw", "inbox", "20260525-social-feed-digest.md"], loadedFiles),
  ]);

  const visited = mountains.다녀온_산 ?? [];
  const wishlist = mountains.안_다녀온_산 ?? [];
  const allMountains = [...visited, ...wishlist];
  const topRegions = countTop(allMountains.map((item) => normalizeRegion(item.지역)).filter(Boolean), 5);
  const highAltitudeMountains = allMountains.filter((item) => parseAltitude(item.고도) >= 1000).length;
  const tripDays = new Set(itinerary.map((row) => row.Day).filter(Boolean)).size;
  const confirmNeeded = itinerary.filter((row) => row["확인 필요"]?.toUpperCase() === "TRUE").length;
  const requiredItems = packing.filter((row) => row["필수 여부"]?.includes("필수")).length;
  const checkedItems = packing.filter((row) => ["TRUE", "Y", "YES", "1", "완료"].includes((row.체크 ?? "").toUpperCase())).length;

  return {
    activity: {
      visitedMountains: visited.length,
      wishlistMountains: wishlist.length,
      totalMountains: allMountains.length,
      highAltitudeMountains,
      topRegions,
    },
    travel: {
      itineraryRows: itinerary.length,
      tripDays,
      confirmNeeded,
      packingItems: packing.length,
      requiredItems,
      checkedItems,
      transportModes: countTop(itinerary.map((row) => row.교통).filter(isPresent), 5),
    },
    learning: parseLearningDigest(digest),
    sourceStatus: {
      obsidianAvailable: loadedFiles.length > 0,
      loadedFiles,
    },
  };
}

async function readJson<T>(segments: string[], loadedFiles: string[], fallback: T): Promise<T> {
  try {
    const filePath = path.join(OBSIDIAN_ROOT, ...segments);
    const raw = await fs.readFile(filePath, "utf8");
    loadedFiles.push(segments.join("/"));
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function readText(segments: string[], loadedFiles: string[]): Promise<string> {
  try {
    const filePath = path.join(OBSIDIAN_ROOT, ...segments);
    const raw = await fs.readFile(filePath, "utf8");
    loadedFiles.push(segments.join("/"));
    return raw;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
    throw error;
  }
}

async function readExternalCsv<T extends object>(segments: string[], loadedFiles: string[]): Promise<T[]> {
  const raw = await readText(segments, loadedFiles);
  if (!raw) return [];
  const parsed = Papa.parse<T>(raw, { header: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) {
    throw new Error(`External CSV parse failed for ${segments.join("/")}: ${parsed.errors[0].message}`);
  }
  return parsed.data;
}

function normalizeRegion(value: string | undefined) {
  if (!value) return "";
  return value.split(/\s+/)[0]?.replace("특별자치도", "").replace("광역시", "").replace("특별시", "") ?? "";
}

function isPresent(value: string | undefined): value is string {
  return Boolean(value);
}

function parseAltitude(value: string | undefined) {
  if (!value) return 0;
  const match = value.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function countTop(values: string[], limit: number) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([label, count]) => ({ region: label, mode: label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ region, mode, count }) => ({ region: region || mode, mode: mode || region, count }));
}

function parseLearningDigest(raw: string): LifeSourceSummary["learning"] {
  const messagesInWindow = Number(raw.match(/기준 기간 내\s+(\d+)개/)?.[1] ?? 0);
  const matchedCandidates = Number(raw.match(/관심사 매칭 후보 수:\s+(\d+)개/)?.[1] ?? 0);
  const finalPicks = Number(raw.match(/최종 Pick 수:\s+(\d+)개/)?.[1] ?? 0);
  const categories = [...raw.matchAll(/^###\s+\d+\.\s+(.+)$/gm)].map((match) => match[1]?.trim() ?? "");
  return {
    messagesInWindow,
    matchedCandidates,
    finalPicks,
    categories: countTop(categories, 5).map((item) => ({ category: item.region, count: item.count })),
  };
}
