export type GalleryCategory = "Member" | "Conference" | "기타";
export type PublicationType = "Journal" | "Conference";
export type PatentStatus = "registered" | "pending";
export type MemberGroup = "postdocs" | "gradStudents" | "phdAlumni" | "msAlumni";

export interface NewsItem {
  id: string;
  badge: string;
  date: string;
  titleKr: string;
  titleEn: string;
  excerptKr: string;
  excerptEn: string;
}

export interface Publication {
  id: string;
  year: number;
  month: number;
  day: number;
  type: PublicationType;
  title: string;
  titleKo: string;
  authors: string;
  journal: string;
  volume: string;
  doi: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  category: GalleryCategory;
}

export interface Patent {
  id: string;
  number: string;
  title: string;
  titleEn: string;
  date: string;
  status: PatentStatus;
  inventors: string;
}

export interface TimelineEntry {
  id: string;
  period: string;
  textKr: string;
  textEn: string;
}

export interface Professor {
  nameKo: string;
  nameEn: string;
  affiliationKr: string;
  affiliationEn: string;
  email: string;
  scholar: string;
  education: TimelineEntry[];
  career: TimelineEntry[];
  achievements: TimelineEntry[];
}

export interface ResearcherMember {
  id: string;
  nameKo: string;
  nameEn: string;
  degree: string;
  email: string;
  fieldKr: string;
  fieldEn: string;
}

export interface AlumniMember {
  id: string;
  nameKo: string;
  nameEn: string;
  degree: string;
  year: number;
  month: number;
  affiliationKr: string;
  affiliationEn: string;
}

export interface MembersData {
  professor: Professor;
  postdocs: ResearcherMember[];
  gradStudents: ResearcherMember[];
  phdAlumni: AlumniMember[];
  msAlumni: AlumniMember[];
}

export interface SiteContent {
  news: NewsItem[];
  publications: Publication[];
  gallery: GalleryItem[];
  patents: Patent[];
  members: MembersData;
}
