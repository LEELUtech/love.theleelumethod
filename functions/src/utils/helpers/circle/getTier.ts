import { CircleTag } from "../../../types/circle";
import { CIRCLE_TIER } from "../../../types/typeform";

export const getTier = (tags: CircleTag[]): CIRCLE_TIER | null => {
  const tag = tags.find(({ name }) => Object.values(CIRCLE_TIER).includes(name as CIRCLE_TIER));

  return tag ? (tag.name as CIRCLE_TIER) : null;
};
