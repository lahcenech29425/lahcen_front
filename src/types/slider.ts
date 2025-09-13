import { ImageType } from "./image";

export interface SliderItem {
  order: number;
  id: number;
  title: string;
  subtitle: string;
  image: ImageType;
}

export interface Slider {
  id: number;
  title: string;
  description: string;
  allow_thumbnail: boolean;
  timer: number;
  slider: SliderItem[];
}
