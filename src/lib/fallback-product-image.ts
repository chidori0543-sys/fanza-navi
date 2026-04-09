export interface FallbackProductImageSource {
  title: string;
  genre: string;
  tags: string[];
  rank?: number;
  actresses?: string[];
  maker?: string;
  series?: string;
}

const FALLBACK_GENRE_META: Record<string, { name: string; color: string; description: string }> = {
  popular: {
    name: "人気作品",
    color: "#e4007f",
    description: "今最も売れている人気作品",
  },
  "new-release": {
    name: "新作",
    color: "#ff6b35",
    description: "最新リリースの注目作品",
  },
  sale: {
    name: "セール",
    color: "#ffd700",
    description: "お得なセール・キャンペーン中",
  },
  "high-rated": {
    name: "高評価",
    color: "#34d399",
    description: "ユーザー評価4.5以上の名作",
  },
  amateur: {
    name: "素人",
    color: "#60a5fa",
    description: "素人系の人気作品",
  },
  vr: {
    name: "VR",
    color: "#a78bfa",
    description: "没入感抜群のVR作品",
  },
  mature: {
    name: "熟女",
    color: "#f472b6",
    description: "大人の魅力あふれる熟女作品",
  },
  busty: {
    name: "巨乳",
    color: "#fb923c",
    description: "巨乳ジャンルの人気作品",
  },
  planning: {
    name: "企画",
    color: "#22d3ee",
    description: "ユニークな企画系作品",
  },
  drama: {
    name: "ドラマ",
    color: "#c084fc",
    description: "ストーリー重視のドラマ作品",
  },
  cosplay: {
    name: "コスプレ",
    color: "#f97316",
    description: "コスプレ衣装が魅力の作品",
  },
  idol: {
    name: "アイドル",
    color: "#ec4899",
    description: "アイドル系女優の作品",
  },
};

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitFallbackTitle(title: string, maxChars = 14) {
  const normalized = title.replace(/\s+/g, " ").trim();
  const lines: string[] = [];
  let buffer = "";

  for (const char of normalized) {
    if ((buffer + char).length > maxChars) {
      lines.push(buffer);
      buffer = char;
      if (lines.length === 2) {
        break;
      }
    } else {
      buffer += char;
    }
  }

  if (lines.length < 2 && buffer) {
    lines.push(buffer);
  }

  return lines.slice(0, 2);
}

export function buildProductFallbackImageUrl(product: FallbackProductImageSource) {
  const genreMeta = FALLBACK_GENRE_META[product.genre] ?? FALLBACK_GENRE_META.popular;
  const titleLines = splitFallbackTitle(product.title);
  const accent = genreMeta.color;
  const rankLabel = product.rank ? `${product.rank}位` : genreMeta.name;
  const eyebrow = escapeSvgText(
    product.actresses?.[0] ?? product.maker ?? product.series ?? genreMeta.name
  );
  const line1 = escapeSvgText(titleLines[0] ?? product.title);
  const line2 = escapeSvgText(titleLines[1] ?? "");
  const footer = escapeSvgText(product.tags.slice(0, 2).join(" / ") || genreMeta.description);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
      <defs>
        <linearGradient id="bg" x1="40" y1="40" x2="760" y2="560" gradientUnits="userSpaceOnUse">
          <stop stop-color="${accent}"/>
          <stop offset="1" stop-color="#111215"/>
        </linearGradient>
        <linearGradient id="panel" x1="120" y1="110" x2="680" y2="490" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(255,255,255,0.18)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0.04)"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="36" fill="url(#bg)"/>
      <circle cx="660" cy="110" r="120" fill="rgba(255,255,255,0.10)"/>
      <circle cx="170" cy="500" r="140" fill="rgba(255,255,255,0.06)"/>
      <rect x="76" y="78" width="648" height="444" rx="34" fill="url(#panel)" stroke="rgba(255,255,255,0.16)"/>
      <rect x="106" y="108" width="150" height="42" rx="21" fill="rgba(17,18,21,0.55)"/>
      <text x="181" y="135" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="700" fill="#fff4e4">${escapeSvgText(rankLabel)}</text>
      <text x="108" y="200" font-family="'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="600" fill="rgba(255,244,228,0.82)">${eyebrow}</text>
      <text x="108" y="278" font-family="'Helvetica Neue', Arial, sans-serif" font-size="42" font-weight="800" fill="#ffffff">${line1}</text>
      ${line2 ? `<text x="108" y="330" font-family="'Helvetica Neue', Arial, sans-serif" font-size="42" font-weight="800" fill="#ffffff">${line2}</text>` : ""}
      <rect x="108" y="388" width="220" height="2" fill="rgba(255,255,255,0.26)"/>
      <text x="108" y="438" font-family="'Helvetica Neue', Arial, sans-serif" font-size="24" font-weight="600" fill="rgba(255,255,255,0.86)">${escapeSvgText(genreMeta.name)}</text>
      <text x="108" y="478" font-family="'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="500" fill="rgba(255,255,255,0.68)">${footer}</text>
      <text x="108" y="536" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="700" fill="rgba(255,255,255,0.52)">FANZA TOKUNAVI CURATED PICK</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
