import { CircleTag } from "../../../types/circle";

export const isTagExist = (tags: CircleTag[], id: number): boolean => {
  return tags.some((t) => t.id === id);
};
