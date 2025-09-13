import { LinkType } from "./link";

export interface ExploreSection {
  id: number;
  title: string;
  subtitle: string;
  fetchCount: number;
  itemType: string;
  fetchCondition: string;
  button: LinkType;
}
