import { createClient } from "next-sanity";

const config = {
  projectId: "l0s21o0s", // find this at manage.sanity.io or in your sanity.json
  dataset: "production", // this is from those question during 'sanity init'
  useCdn: true, // set to `true` to fetch from edge cache
  apiVersion: "2022-01-12", // use current date (YYYY-MM-DD) to target the latest API version
};
const sanityClient = createClient(config);

export default sanityClient;

//   const data = await client.fetch<number>(`count(*)`)
// data is typed as `number`
//   console.log(`Number of documents: ${data}`)
