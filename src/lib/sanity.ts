import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.sanityprojectId!,
  dataset: process.env.sanitydataset!,
  useCdn: true,
  apiVersion: process.env.sanityapiVersion!,
});

// Category mapping utility
export const categoryMap = new Map([
  ['f6164172-45a1-4ca1-b8ec-50e37ae18773', 'nutrition'],
  ['2be72195-3222-4ba9-845b-33897d1edec3', 'general-life'],
  ['7349c500-7098-464d-bd2e-2b6d5b5391c5', 'religion'],
  ['a19706b0-5fa9-465a-af73-d7e47cf534eb', 'health'],
  ['7d0304cd-6686-41bc-b458-dc6ef880b0b4', 'survival-skills'],
]);

export const reverseCategoryMap = new Map([
  ['nutrition', 'f6164172-45a1-4ca1-b8ec-50e37ae18773'],
  ['general-life', '2be72195-3222-4ba9-845b-33897d1edec3'],
  ['religion', '7349c500-7098-464d-bd2e-2b6d5b5391c5'],
  ['health', 'a19706b0-5fa9-465a-af73-d7e47cf534eb'],
  ['survival-skills', '7d0304cd-6686-41bc-b458-dc6ef880b0b4'],
]);

// Fetch all podcasts
export async function getPodcasts() {
  return client.fetch(`*[_type == "podcast"]{_id, title, description, coverImage, spotifyUrl, episodes}`);
}

// Fetch all YouTube channels
export async function getYouTubeChannels() {
  return client.fetch(`*[_type == "youtubeChannel"]{_id, title, description, youtubeUrl, thumbnail}`);
} 