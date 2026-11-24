import slug from "slug";

export const slugify = (name: string) => {
  return slug(name);
};
