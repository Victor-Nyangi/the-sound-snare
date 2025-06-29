import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.sanityprojectId, // find this at manage.sanity.io or in your sanity.json
  dataset: process.env.sanitydataset, // this is from those question during 'sanity init'
  useCdn: true, // set to `true` to fetch from edge cache
  apiVersion: process.env.sanityapiVersion, // use current date (YYYY-MM-DD) to target the latest API version
});
