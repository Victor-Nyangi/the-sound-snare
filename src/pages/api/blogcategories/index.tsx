import { categories } from './../categorydata'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CategoryType } from '../../../../types'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoryType[]>
) {
  res.status(200).json(categories)
}
