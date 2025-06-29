import type {NextRequest} from 'next/server'
import { ArticleTypeI } from '../../../types'
import {client}  from './client'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {

  const articles = await client.fetch<ArticleTypeI[]>(
    `*[_type == "post"][0...4] {
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
    }`
  )
  return new Response(JSON.stringify({articles}), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}