import { createClient } from "next-sanity";
import type {NextRequest} from 'next/server'
import { ArticleTypeI } from '../../../types'
import {client}  from './client'
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
    const quotesRef = process.env.quotesRef
  const quotes = await client.fetch<ArticleTypeI[]>(
    `*[_type == "post" && categories[0]._ref == $quotesRef]{
        title,
        slug,
        body,
        mainImage{
          asset->{
          _id,
          url
        }
      }
    }`, {quotesRef}
  )
  return new Response(JSON.stringify({quotes}), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}