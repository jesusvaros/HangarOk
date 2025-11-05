import type { StaticBlogPost } from '../posts';

const placeholderPost: StaticBlogPost = {
  slug: 'getting-started-hangarok',
  title: 'Welcome to HangarOK: How Local Riders Turn Data into Action',
  summary:
    'Discover how HangarOK empowers cyclists and residents to share real experiences with cycle hangars, compare safety and usability, and shape better streets together.',
  content: `## Why HangarOK exists
HangarOK began as a community project for riders who wanted safer hangars, faster maintenance, and honest information.

## What you can do today
- Search for nearby hangars and compare ratings
- Share your own experience in minutes
- Help neighbours understand how well a hangar is maintained

## The vision
Every hangar tells a story. HangarOK makes those stories visible so councils and communities can build streets that work for riders.`,
  publishedAt: new Date().toISOString(),
  heroImageUrl: '/images/blog/placeholder-cover.jpg',
  readingMinutes: 3,
  seoTitle: 'Welcome to HangarOK: The Community Hangar Review Hub',
  seoDescription:
    'Learn how HangarOK gathers trusted hangar reviews from riders and residents to improve cycling infrastructure across the UK.',
  sourceUrl: 'https://hangarok.com',
};

export default placeholderPost;
