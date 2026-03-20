'use client'

import React from 'react'
import { ComparisonBlock as ComparisonBlockType } from '@/lib/cms/types'
import { useCmsStore } from '@/store/cmsStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Columns, Plus, Trash2, GripVertical } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface ComparisonBlockProps {
  block: ComparisonBlockType
}

export function ComparisonBlock({ block }: ComparisonBlockProps) {
  const { updateBlock } = useCmsStore()

  const addRow = () => {
    updateBlock(block.id, {
      rows: [...block.rows, { id: uuidv4(), values: block.headers.map(() => '') }]
    })
  }

  const updateHeader = (idx: number, val: string) => {
    const newHeaders = [...block.headers]
    newHeaders[idx] = val
    updateBlock(block.id, { headers: newHeaders })
  }

  const updateRowValue = (rowId: string, idx: number, val: string) => {
    updateBlock(block.id, {
      rows: block.rows.map(row => {
        if (row.id === rowId) {
          const newValues = [...row.values]
          newValues[idx] = val
          return { ...row, values: newValues }
        }
        return row
      })
    })
  }

  const removeRow = (rowId: string) => {
    updateBlock(block.id, {
      rows: block.rows.filter(row => row.id !== rowId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Columns className="w-5 h-5 text-cyan-600" />
        <Input
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          placeholder="Vergleichstabelle-Titel..."
          className="text-sm font-bold text-brand-navy uppercase tracking-wider border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
        />
      </div>

      <div className="overflow-x-auto thin-scrollbar rounded-2xl border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-cyan-50 border-b border-border">
              <th className="w-8" />
              {block.headers.map((header, idx) => (
                <th key={idx} className="p-3 text-left">
                  <Input
                    value={header}
                    onChange={(e) => updateHeader(idx, e.target.value)}
                    placeholder={`Spalte ${idx + 1}`}
                    className="h-8 text-[11px] font-extrabold uppercase tracking-widest text-brand-navy border-none p-0 focus-visible:ring-0 bg-transparent"
                  />
                </th>
              ))}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-neutral-50 transition-colors group/row">
                <td className="p-2 text-center">
                  <GripVertical className="w-4 h-4 text-muted-foreground/20 opacity-0 group-hover/row:opacity-100 cursor-grab" />
                </td>
                {row.values.map((val, idx) => (
                  <td key={idx} className="p-3">
                    <Input
                      value={val}
                      onChange={(e) => updateRowValue(row.id, idx, e.target.value)}
                      placeholder="..."
                      className="h-8 text-xs border-none p-0 focus-visible:ring-0 bg-transparent"
                    />
                  </td>
                ))}
                <td className="p-2">
                   <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(row.id)}
                    className="h-8 w-8 text-neutral-400 hover:text-brand-red hover:bg-brand-red/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="flex items-center gap-2 text-xs font-bold text-brand-sky hover:text-brand-sky-dark transition-colors pl-2 group"
      >
        <div className="w-6 h-6 rounded-lg border border-brand-sky/30 flex items-center justify-center group-hover:bg-brand-sky/10">
          <Plus className="w-4 h-4" />
        </div>
        Zeile hinzufügen
      </button>
    </div>
  )
}
