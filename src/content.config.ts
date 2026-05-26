import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    role: z.string(),
    years: z.string(),
    tools: z.array(z.string()),
    summary: z.string(),
    outcome: z.string(),
    heroImage: z.string(),
    heroAlt: z.string(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).optional(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work };
