import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { CMSBlock, CMSBlockType } from '@/lib/cms/types'

interface CmsEditorStore {
  currentView: 'dashboard' | 'content' | 'paths' | 'analytics' | 'settings'
  activeIslandId: string | null
  blocks: CMSBlock[]
  isDirty: boolean
  version: number
  status: 'draft' | 'published'
  lastSaved: Date | null
  isPreviewMode: boolean
  islandMetadata: {
    difficulty: 'Basis' | 'Fortgeschritten' | 'Profi'
    audience: string
    duration: string
    summary: string
    tags: string[]
    facts: string[]
  }

  setActiveIsland: (id: string) => void
  setBlocks: (blocks: CMSBlock[]) => void
  addBlock: (type: CMSBlockType, afterIndex?: number) => void
  updateBlock: (id: string, content: Partial<CMSBlock>) => void
  removeBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  reorderBlocks: (activeId: string, overId: string) => void
  moveBlock: (id: string, direction: 'up' | 'down') => void
  saveDraft: () => Promise<void>
  publish: () => Promise<void>
  setPreviewMode: (enabled: boolean) => void
  setCurrentView: (view: CmsEditorStore['currentView']) => void
  updateMetadata: (metadata: Partial<CmsEditorStore['islandMetadata']>) => void
}

// Helper to create default content for each block type
const createDefaultBlock = (type: CMSBlockType, order: number): CMSBlock => {
  const id = uuidv4()
  
  switch (type) {
    case 'heading':
      return { id, type, order, level: 2, text: '' }
    case 'text':
      return { id, type, order, content: '' }
    case 'video':
      return { id, type, order, url: '', caption: '', autoplay: false }
    case 'image':
      return { id, type, order, url: '', alt: '' }
    case 'presentation':
      return { id, type, order, fileId: '', title: '', slideCount: 0 }
    case 'game':
      return { id, type, order, gameId: '', title: '', description: '', isRequired: true, xpReward: 50 }
    case 'tool':
      return { id, type, order, toolId: '', title: '', description: '' }
    case 'quiz':
      return { id, type, order, question: '', options: [{ id: uuidv4(), text: '', isCorrect: false }], xpReward: 25 }
    case 'checklist':
      return { id, type, order, title: '', items: [{ id: uuidv4(), label: '', checked: false }] }
    case 'faq':
      return { id, type, order, items: [{ id: uuidv4(), question: '', answer: '' }] }
    case 'comparison':
      return { id, type, order, title: '', headers: ['', ''], rows: [{ id: uuidv4(), values: ['', ''] }] }
    case 'steps':
      return { id, type, order, title: '', steps: [{ id: uuidv4(), title: '', description: '' }] }
    case 'cards':
      return { id, type, order, title: '', cards: [{ id: uuidv4(), title: '', content: '' }] }
    case 'divider':
      return { id, type, order, style: 'solid' }
    default:
      throw new Error(`Unsupported block type: ${type}`)
  }
}

export const useCmsStore = create<CmsEditorStore>((set, get) => ({
  currentView: 'content',
  activeIslandId: null,
  blocks: [],
  isDirty: false,
  version: 1,
  status: 'draft',
  lastSaved: null,
  isPreviewMode: false,
  islandMetadata: {
    difficulty: 'Basis',
    audience: 'Händler & Servicepartner',
    duration: '30 min',
    summary: '',
    tags: [],
    facts: []
  },

  setActiveIsland: (id) => set({ activeIslandId: id }),
  
  setBlocks: (blocks) => set({ blocks, isDirty: false }),

  addBlock: (type, afterIndex) => {
    const { blocks } = get()
    const newBlock = createDefaultBlock(type, blocks.length)
    
    let updatedBlocks: CMSBlock[]
    if (afterIndex !== undefined) {
      updatedBlocks = [
        ...blocks.slice(0, afterIndex + 1),
        newBlock,
        ...blocks.slice(afterIndex + 1)
      ].map((b, i) => ({ ...b, order: i }))
    } else {
      updatedBlocks = [...blocks, newBlock].map((b, i) => ({ ...b, order: i }))
    }
    
    set({ blocks: updatedBlocks, isDirty: true })
  },

  updateBlock: (id, content) => {
    const { blocks } = get()
    const updatedBlocks = blocks.map(b => 
      b.id === id ? { ...b, ...content } as CMSBlock : b
    )
    set({ blocks: updatedBlocks, isDirty: true })
  },

  removeBlock: (id) => {
    const { blocks } = get()
    const updatedBlocks = blocks
      .filter(b => b.id !== id)
      .map((b, i) => ({ ...b, order: i }))
    set({ blocks: updatedBlocks, isDirty: true })
  },

  duplicateBlock: (id) => {
    const { blocks } = get()
    const index = blocks.findIndex(b => b.id === id)
    if (index === -1) return

    const blockToDuplicate = blocks[index]
    const newBlock = { 
      ...blockToDuplicate, 
      id: uuidv4(), 
      order: index + 1 
    } as CMSBlock

    const updatedBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1)
    ].map((b, i) => ({ ...b, order: i }))

    set({ blocks: updatedBlocks, isDirty: true })
  },

  reorderBlocks: (activeId, overId) => {
    const { blocks } = get()
    const oldIndex = blocks.findIndex(b => b.id === activeId)
    const newIndex = blocks.findIndex(b => b.id === overId)

    if (oldIndex === -1 || newIndex === -1) return

    const updatedBlocks = [...blocks]
    const [movedBlock] = updatedBlocks.splice(oldIndex, 1)
    updatedBlocks.splice(newIndex, 0, movedBlock)

    set({ 
      blocks: updatedBlocks.map((b, i) => ({ ...b, order: i })), 
      isDirty: true 
    })
  },

  moveBlock: (id, direction) => {
    const { blocks } = get()
    const index = blocks.findIndex(b => b.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const updatedBlocks = [...blocks]
    ;[updatedBlocks[index], updatedBlocks[newIndex]] = [updatedBlocks[newIndex], updatedBlocks[index]]

    set({ 
      blocks: updatedBlocks.map((b, i) => ({ ...b, order: i })), 
      isDirty: true 
    })
  },

  saveDraft: async () => {
    set({ isDirty: false, lastSaved: new Date() })
    // Placeholder for actual API call
    console.log('Saving draft...')
  },

  publish: async () => {
    set({ status: 'published', isDirty: false, lastSaved: new Date(), version: get().version + 1 })
    // Placeholder for actual API call
    console.log('Publishing content...')
  },

  setPreviewMode: (enabled) => set({ isPreviewMode: enabled }),
  
  setCurrentView: (view) => set({ currentView: view }),

  updateMetadata: (metadata) => set((state) => ({
    islandMetadata: { ...state.islandMetadata, ...metadata },
    isDirty: true
  }))
}))
