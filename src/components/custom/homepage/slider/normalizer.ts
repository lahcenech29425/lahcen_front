import { Slider, SliderItem } from "@/types/slider";
import { ImageType } from "@/types/image";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";

export function normalizeSlider(data: Slider): Slider {
  return {
    id: data.id,
    title: data.title || "",
    description: data.description || "",
    allow_thumbnail: Boolean(data.allow_thumbnail),
    timer: Number(data.timer),
    slider: Array.isArray(data.slider)
      ? data.slider.map(
          (item: SliderItem): SliderItem => ({
            order: item.order,
            id: item.id,
            title: item.title || "",
            subtitle: item.subtitle || "",
            image: normalizeImage(item.image) as ImageType,
          })
        )
      : [],
  };
}
