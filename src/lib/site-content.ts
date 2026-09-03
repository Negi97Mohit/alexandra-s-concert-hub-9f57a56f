import {
  ALL_REVIEWS_URL,
  ARTIST,
  BIO_DATE,
  BIO_INTRO,
  BIO_LANGUAGES,
  BIO_PARAGRAPHS,
  CONCERTS,
  CONTACTS,
  MEDIA,
  NEWS,
  PHOTOS,
  QUOTES,
  REVIEWS,
  type Concert,
} from "@/data/dovgan";

export type SiteContent = {
  artist: typeof ARTIST;
  bioIntro: string;
  bioParagraphs: string[];
  bioDate: string;
  bioLanguages: typeof BIO_LANGUAGES;
  quotes: typeof QUOTES;
  photos: typeof PHOTOS;
  concerts: Concert[];
  news: typeof NEWS;
  media: typeof MEDIA;
  reviews: typeof REVIEWS;
  allReviewsUrl: string;
  contacts: typeof CONTACTS;
};

/** Fallback content shipped with the site; the admin page overrides these values. */
export const DEFAULT_CONTENT: SiteContent = {
  artist: ARTIST,
  bioIntro: BIO_INTRO,
  bioParagraphs: BIO_PARAGRAPHS,
  bioDate: BIO_DATE,
  bioLanguages: BIO_LANGUAGES,
  quotes: QUOTES,
  photos: PHOTOS,
  concerts: CONCERTS,
  news: NEWS,
  media: MEDIA,
  reviews: REVIEWS,
  allReviewsUrl: ALL_REVIEWS_URL,
  contacts: CONTACTS,
};

/** Merge stored overrides (per top-level section) on top of the defaults. */
export function mergeContent(stored: unknown): SiteContent {
  if (!stored || typeof stored !== "object") return DEFAULT_CONTENT;
  const overrides = stored as Partial<SiteContent>;
  const merged = { ...DEFAULT_CONTENT };
  for (const key of Object.keys(DEFAULT_CONTENT) as (keyof SiteContent)[]) {
    const value = overrides[key];
    if (value !== undefined && value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = value;
    }
  }
  return merged;
}
