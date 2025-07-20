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

    valuemap.set('f6164172-45a1-4ca1-b8ec-50e37ae18773', 'nutrition');
    valuemap.set('2be72195-3222-4ba9-845b-33897d1edec3', 'general-life');
    valuemap.set('7349c500-7098-464d-bd2e-2b6d5b5391c5', 'religion');
    valuemap.set('a19706b0-5fa9-465a-af73-d7e47cf534eb', 'health');
    valuemap.set('7d0304cd-6686-41bc-b458-dc6ef880b0b4', 'survival-skills');
    return {...article, categSlug: valuemap.get(`${article.category}`)}

})
  return new Response(JSON.stringify({articles}), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}