import type { NextApiResponse } from 'next'
import { ArticleTypeI } from "../../../../../types";
import {client}  from '../../client'

// export const config = {
//   runtime: "edge",
// };

type QueryProp = {
  query: {
    categslug: string;
    slug: string;
  };
};


export default async function handler(
  { query: { categslug, slug } }: QueryProp,
  res: NextApiResponse
  ) {

    const valuemap = new Map();

    valuemap.set('nutrition', 'f6164172-45a1-4ca1-b8ec-50e37ae18773');
    valuemap.set('general-life', '2be72195-3222-4ba9-845b-33897d1edec3' );
    valuemap.set('religion', '7349c500-7098-464d-bd2e-2b6d5b5391c5');
    valuemap.set('health', 'a19706b0-5fa9-465a-af73-d7e47cf534eb');
    valuemap.set('survival-skills', '7d0304cd-6686-41bc-b458-dc6ef880b0b4');

    const refKey = valuemap.get(`${categslug}`)

    const data = refKey !== undefined ? await client.fetch<ArticleTypeI[]>(
      `*[_type == "post" && categories[0]._ref == $refKey][0...4] {
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

    const articles = data.filter((article: ArticleTypeI) => article.slug.current !== slug)
  if (articles.length > 0) {
    res.status(200).json(articles)
  } else {
    res
      .status(404)
      .json({ message: `Category with the slug ${categslug} was not found` })
  }

  // return new Response(JSON.stringify({ articles }), {
  //   status: 200,
  //   headers: {
  //     "content-type": "application/json",
  //   },
  // });
}
