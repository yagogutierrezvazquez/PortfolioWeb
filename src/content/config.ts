/**
 * @file Content Collections Configuration
 * @description Defines the schema and validation rules for the project's content collections.
 * Enforces structure for Writeups to ensure consistency in the UI.
 */
import { defineCollection, z } from 'astro:content';

// --- WRITEUPS COLLECTION SCHEMA ---
const writeups = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    platform: z.string(),
    date: z.date(),
    // Enforces specific difficulty levels to match CSS color mapping
    difficulty: z.enum(["Easy", "Medium", "Hard", "Insane"]),
    tags: z.array(z.string()),
    // Optional cover image for the grid view
    cover: image().optional(),
  })
});

// --- EXPORTS ---
export const collections = { writeups };