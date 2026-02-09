import { defineCollection, z } from 'astro:content';

const writeups = defineCollection({
 
  type: 'content', 
  schema: z.object({
    title: z.string(),
    platform: z.string(),
    date: z.date(),
    difficulty: z.enum(["Easy", "Medium", "Hard", "Insane"]),
    tags: z.array(z.string()),
  })
});

export const collections = { writeups };