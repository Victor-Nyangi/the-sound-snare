export type ArticleImage = {
  asset: {
    _id: string;
    url: string;
  };
};

export type Children = {
  _key: string;
  _type: string;
  marks: Array<null>;
  text: string;

}

export type ArticleBody = {
  _key: string;
  _type: string;
  children: Children[];
  markDefs: Array<null>;
  style: string;
}

export type Slug = {
  _type: string;
  current: string;
};

export interface ArticleType {
  title: string;
  name: string;
  _createdAt: string;
  mainImage: ArticleImage;
  body: any;
}

export interface ArticleTypeI extends ArticleType {
  slug: Slug;
  excerpt: string;
}

export interface ArticleTypeII extends ArticleTypeI {
  category: string;
  categSlug: string | null;
}

export interface CategoryType {
  id: string;
  color: string;
  image_path: string;
  slug: string;
  title: string;
  sanity_ref: string;
  image_alt: string;
}

export interface QuotesArticleType {
  body: ArticleBody;
  mainImage: ArticleImage;
  slug: Slug;
  title: string;
}

// export interface JobType {
//     id: string;
//     attributes: Attributes;
//   }

// export interface JobTypeI{
//   id: string;
//   attributes: AttributesI;
// }