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
    valuemap.set('f6164172-45a1-4ca1-b8ec-50e37ae18773', 'nutrition');
    valuemap.set('2be72195-3222-4ba9-845b-33897d1edec3', 'general-life');
    valuemap.set('7349c500-7098-464d-bd2e-2b6d5b5391c5', 'religion');
    valuemap.set('a19706b0-5fa9-465a-af73-d7e47cf534eb', 'health');
    valuemap.set('7d0304cd-6686-41bc-b458-dc6ef880b0b4', 'survival-skills');
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
