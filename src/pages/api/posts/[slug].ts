import type { NextApiRequest, NextApiResponse } from "next";
import { ArticleTypeII } from "../../../../types";
import { client } from "../client";

// export const config = {
//   runtime: "edge",
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query;
    if (!slug || typeof slug !== "string") {
      res.status(400).json({ message: "Missing or invalid slug" });
      return;
    }
    const valuemap = new Map();
    valuemap.set('dfce2770-0a4f-45f1-af49-847fbcef441e', 'nutrition');
    valuemap.set('204e5acb-c665-4436-beb3-0f07382c68e3', 'general-life');
    valuemap.set('f38c3ff5-cbb3-4ba7-8602-c43cf9d1c18b', 'religion');
    valuemap.set('3fa72f0c-5589-4a3f-99e9-03d32387e138', 'health');
    valuemap.set('08e144fc-67f2-4717-abd1-d3f8957c1afe', 'survival-skills');
    const data = await client.fetch<ArticleTypeII[]>(
      `*[slug.current == $slug]{
        title,
        slug,
        "category": categories[0]._ref,
        mainImage{
          asset->{ _id, url }
        },
        body,
        "name": author->name,
        "authorImage": author->image,
        _createdAt,
      }`,
      { slug }
    );
    if (data && data[0]) {
      const postData = { ...data[0], categSlug: valuemap.get(`${data[0].category}`) };
      res.status(200).json(postData);
    } else {
      res.status(404).json({ message: `Post with the slug ${slug} is not found` });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
