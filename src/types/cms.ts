export type CmsBlockType = 'h1' | 'h2' | 'h3' | 'text' | 'image' | 'video' | 'teaser';

export interface CmsBlock {
    id: string; // Unique ID for the block (uuid or timestamp)
    type: CmsBlockType;
    content: string; // Text content, URL for media, or JSON string for complex blocks
    orderIndex?: number; // Sorting order in the CMS
}

export interface IslandContent {
    id: string; // Corresponding to the island ID (e.g. 'poel', 'vejroe')
    blocks: CmsBlock[];
    createdAt: string;
    updatedAt: string;
}

// Dies ist das Schema, welches später in Supabase z.B. in einer "island_content"
// Tabelle gespeichert wird, wobei "blocks" eine JSONB Spalte darstellt.
