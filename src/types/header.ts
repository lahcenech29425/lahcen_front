import { ImageType } from "./image";

export interface HeaderLogo {
  id: number;
  link: string;
  image: ImageType;
}

export interface HeaderMenuItem {
  id: number;
  title: string;
  is_external: boolean;
  url: string;
}

export interface HeaderCTAItem {
  id: number;
  title: string;
  is_external: boolean;
  url: string;
}

export interface HeaderType {
  id: number;
  documentId: string;
  logo: HeaderLogo;
  menu: HeaderMenuItem[];
  cta: HeaderCTAItem[];
}
