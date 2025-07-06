import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.sanityprojectId!,
  dataset: process.env.sanitydataset!,
  useCdn: true,
  apiVersion: process.env.sanityapiVersion!,
});

// Category mapping utility
export const categoryMap = new Map([
  ['dfce2770-0a4f-45f1-af49-847fbcef441e', 'nutrition'],
  ['204e5acb-c665-4436-beb3-0f07382c68e3', 'general-life'],
  ['f38c3ff5-cbb3-4ba7-8602-c43cf9d1c18b', 'religion'],
  ['3fa72f0c-5589-4a3f-99e9-03d32387e138', 'health'],
  ['08e144fc-67f2-4717-abd1-d3f8957c1afe', 'survival-skills'],
]);

export const reverseCategoryMap = new Map([
  ['nutrition', 'dfce2770-0a4f-45f1-af49-847fbcef441e'],
  ['general-life', '204e5acb-c665-4436-beb3-0f07382c68e3'],
  ['religion', 'f38c3ff5-cbb3-4ba7-8602-c43cf9d1c18b'],
  ['health', '3fa72f0c-5589-4a3f-99e9-03d32387e138'],
  ['survival-skills', '08e144fc-67f2-4717-abd1-d3f8957c1afe'],
]); 