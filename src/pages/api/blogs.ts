import type {NextRequest} from 'next/server'
import { ArticleTypeII } from '../../../types'
import {client}  from './client'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {



  const data = await client.fetch<ArticleTypeII[]>(
    `*[_type == "post"] {
        title,
        slug,
        "category": categories[0]._ref,
        mainImage{
          asset->{
          _id,
          url
        }
      },
      excerpt,
      _createdAt,
      "name": author->name,
    }`
  )

const articles = data.map((article: ArticleTypeII) => {
    const valuemap = new Map();

    valuemap.set('dfce2770-0a4f-45f1-af49-847fbcef441e', 'nutrition');
    valuemap.set('204e5acb-c665-4436-beb3-0f07382c68e3', 'general-life');
    valuemap.set('f38c3ff5-cbb3-4ba7-8602-c43cf9d1c18b', 'religion');
    valuemap.set('3fa72f0c-5589-4a3f-99e9-03d32387e138', 'health');
    valuemap.set('08e144fc-67f2-4717-abd1-d3f8957c1afe', 'survival-skills');
    return {...article, categSlug: valuemap.get(`${article.category}`)}

})
  return new Response(JSON.stringify({articles}), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}