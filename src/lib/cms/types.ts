// ─────────────────────────────────────────────────────────────────────────────
// CMS Block Type System – Thitronik Campus 2.0
// Enriched block types for the island-based training curriculum editor.
// ─────────────────────────────────────────────────────────────────────────────

/** All available CMS block type discriminators. */
export type CMSBlockType =
  | 'heading'
  | 'text'
  | 'video'
  | 'image'
  | 'presentation'
  | 'game'
  | 'tool'
  | 'quiz'
  | 'checklist'
  | 'faq'
  | 'comparison'
  | 'steps'
  | 'cards'
  | 'divider'

// ── Shared base ────────────────────────────────────────────────────────────

export interface CMSBlockBase {
  id: string
  order: number
}

// ── Individual block interfaces (v2) ───────────────────────────────────────────

export interface HeadingBlock extends CMSBlockBase {
  type: 'heading'
  level: 1 | 2 | 3
  text: string
}

export interface TextBlock extends CMSBlockBase {
  type: 'text'
  content: string // Richtext/Markdown
}

export interface VideoBlock extends CMSBlockBase {
  type: 'video'
  url?: string
  fileId?: string
  caption?: string
  autoplay?: boolean
}

export interface ImageBlock extends CMSBlockBase {
  type: 'image'
  url?: string
  fileId?: string
  alt?: string
}

export interface PresentationBlock extends CMSBlockBase {
  type: 'presentation'
  fileId: string
  title: string
  slideCount?: number
}

export interface GameEmbedBlock extends CMSBlockBase {
  type: 'game'
  gameId: string
  title: string
  description?: string
  isRequired?: boolean
  xpReward?: number
}

export interface ToolEmbedBlock extends CMSBlockBase {
  type: 'tool'
  toolId: string
  title: string
  description?: string
}

export interface QuizBlock extends CMSBlockBase {
  type: 'quiz'
  question: string
  options: { id: string; text: string; isCorrect: boolean }[]
  explanation?: string
  xpReward?: number
}

export interface ChecklistBlock extends CMSBlockBase {
  type: 'checklist'
  title: string
  items: { id: string; label: string; checked: boolean }[]
}

export interface FaqBlock extends CMSBlockBase {
  type: 'faq'
  items: { id: string; question: string; answer: string }[]
}

export interface ComparisonBlock extends CMSBlockBase {
  type: 'comparison'
  title: string
  headers: string[]
  rows: { id: string; values: string[] }[]
}

export interface StepsBlock extends CMSBlockBase {
  type: 'steps'
  title: string
  steps: { id: string; title: string; description: string; icon?: string }[]
}

export interface CardsBlock extends CMSBlockBase {
  type: 'cards'
  title: string
  cards: { id: string; title: string; content: string; imageId?: string }[]
}

export interface DividerBlock extends CMSBlockBase {
  type: 'divider'
  style: 'solid' | 'dashed' | 'dotted' | 'gradient'
}

// ── Union type ─────────────────────────────────────────────────────────────

export type CMSBlock =
  | HeadingBlock
  | TextBlock
  | VideoBlock
  | ImageBlock
  | PresentationBlock
  | GameEmbedBlock
  | ToolEmbedBlock
  | QuizBlock
  | ChecklistBlock
  | FaqBlock
  | ComparisonBlock
  | StepsBlock
  | CardsBlock
  | DividerBlock

// Utility: distributes Omit over a discriminated union so that
// Omit<HeroBlock | RichTextBlock, 'order'> keeps each variant's properties.
export type DistributedOmit<T, K extends PropertyKey> =
  T extends unknown ? Omit<T, K> : never

