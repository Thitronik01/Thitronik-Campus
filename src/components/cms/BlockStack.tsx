'use client'

import React from 'react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useCmsStore } from '@/store/cmsStore'
import { BlockWrapper } from './BlockWrapper'
import { HeadingBlock } from './blocks/HeadingBlock'
import { TextBlock } from './blocks/TextBlock'
import { VideoBlock } from './blocks/VideoBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { PresentationBlock } from './blocks/PresentationBlock'
import { GameEmbedBlock } from './blocks/GameEmbedBlock'
import { ToolEmbedBlock } from './blocks/ToolEmbedBlock'
import { QuizBlock } from './blocks/QuizBlock'
import { ChecklistBlock } from './blocks/ChecklistBlock'
import { FaqBlock } from './blocks/FaqBlock'
import { ComparisonBlock } from './blocks/ComparisonBlock'
import { StepsBlock } from './blocks/StepsBlock'
import { CardsBlock } from './blocks/CardsBlock'
import { DividerBlock } from './blocks/DividerBlock'

export function BlockStack({ isReadOnly = false }: { isReadOnly?: boolean }) {
  const { blocks, reorderBlocks } = useCmsStore()
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string)
    }
    
    setActiveId(null)
  }

  // Helper to render the correct block component
  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'heading': return <HeadingBlock block={block} />
      case 'text': return <TextBlock block={block} />
      case 'video': return <VideoBlock block={block} />
      case 'image': return <ImageBlock block={block} />
      case 'presentation': return <PresentationBlock block={block} />
      case 'game': return <GameEmbedBlock block={block} />
      case 'tool': return <ToolEmbedBlock block={block} />
      case 'quiz': return <QuizBlock block={block} />
      case 'checklist': return <ChecklistBlock block={block} />
      case 'faq': return <FaqBlock block={block} />
      case 'comparison': return <ComparisonBlock block={block} />
      case 'steps': return <StepsBlock block={block} />
      case 'cards': return <CardsBlock block={block} />
      case 'divider': return <DividerBlock block={block} />
      default: return <div className="p-4 bg-muted rounded-xl text-xs text-muted-foreground italic">Block Typ "{block.type}" steht bald bereit.</div>
    }
  }


  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext 
        items={blocks.map(b => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {blocks.map((block) => (
            <BlockWrapper key={block.id} block={block} isReadOnly={isReadOnly}>
              {renderBlock(block)}
            </BlockWrapper>
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.4',
            },
          },
        }),
      }}>
        {activeId ? (
          <div className="bg-white border-2 border-brand-sky shadow-2xl rounded-3xl p-6 opacity-80 scale-105">
             <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
