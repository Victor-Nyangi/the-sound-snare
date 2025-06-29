import type { NextApiResponse } from 'next'
import { ArticleTypeI } from "../../../../types";
import {client}  from '../client'

// export const config = {
//   runtime: "edge",
// };

type QueryProp = {
  query: {
    slug: string;
  };
};


export default async function handler(
  { query: { slug } }: QueryProp,
  res: NextApiResponse
  ) {

    const valuemap = new Map();

    valuemap.set('nutrition', 'dfce2770-0a4f-45f1-af49-847fbcef441e');
    valuemap.set('general-life', '204e5acb-c665-4436-beb3-0f07382c68e3' );
    valuemap.set('religion', 'f38c3ff5-cbb3-4ba7-8602-c43cf9d1c18b');
    valuemap.set('health', '3fa72f0c-5589-4a3f-99e9-03d32387e138');
    valuemap.set('survival-skills', '08e144fc-67f2-4717-abd1-d3f8957c1afe');

    const refKey = valuemap.get(`${slug}`)

    const articles = refKey !== undefined ? await client.fetch<ArticleTypeI[]>(
      `*[_type == "post" && categories[0]._ref == $refKey]{
          title,
          slug,
          mainImage{
            asset->{
            _id,
            url
          }
        },
        excerpt,
        _createdAt,
        "name": author->name,
      }`,
      {    refKey   }
    ) : []

  if (articles.length > 0) {
    res.status(200).json(articles)
  } else {
    res
      .status(404)
      .json({ message: `Category with the slug ${slug} is not found` })
  }

  return new Response(JSON.stringify({ articles }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
