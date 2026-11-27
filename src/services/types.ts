export interface Drama {
  id: string;
  title: string;
  description: string;
  cover: string;
  episodeCount: number;
  tags: string[];
  views: number;
}
export interface Episode {
  id: string;
  number: number;
  available: boolean;
}
export interface Detail extends Drama {
  episodes: Episode[];
}
export interface VideoSource extends Episode {
  title: string;
  cover: string;
  url: string;
  duration: number;
  subtitles: { language: string; label: string; url: string }[];
}
export interface Page {
  items: Drama[];
  next: string | null;
}
