'use client'

import React, {useCallback} from 'react'
import {set} from 'sanity'

type PTSpan = { _type: 'span'; _key: string; text: string; marks?: string[] }
type PTMarkDef = { _key: string; _type: string; [k: string]: any }
type PTBlock = { _type: 'block'; _key: string; style?: string; children: PTSpan[]; markDefs?: PTMarkDef[]; listItem?: 'bullet' | 'number'; level?: number }

function key(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function mapFontSize(px: number | null): 'sm' | 'base' | 'lg' | 'xl' | undefined {
  if (!px) return undefined
  if (px <= 13) return 'sm'
  if (px <= 16) return 'base'
  if (px <= 19) return 'lg'
  return 'xl'
}

export default function PasteHtmlPortableText(props: any) {
  const {renderDefault, onChange, value} = props

  const convertHtmlToBlocks = useCallback((html: string): PTBlock[] => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const blocks: PTBlock[] = []

    const createBlock = (style?: string): PTBlock => ({
      _type: 'block',
      _key: key('blk'),
      style: style || 'normal',
      children: [],
      markDefs: [],
    })

    const pushText = (block: PTBlock, text: string, marks: string[]) => {
      if (!text) return
      block.children.push({_type: 'span', _key: key('spn'), text, marks})
    }

    const ensureColorDef = (block: PTBlock, colorHex: string): string => {
      const existing = block.markDefs?.find((d) => d._type === 'textColor' && d.color?.hex?.toLowerCase() === colorHex.toLowerCase())
      if (existing) return existing._key
      const defKey = key('mark')
      block.markDefs = block.markDefs || []
      block.markDefs.push({_key: defKey, _type: 'textColor', color: {hex: colorHex}})
      return defKey
    }

    const ensureFontSizeDef = (block: PTBlock, size: 'sm' | 'base' | 'lg' | 'xl'): string => {
      const existing = block.markDefs?.find((d) => d._type === 'fontSize' && d.size === size)
      if (existing) return existing._key
      const defKey = key('mark')
      block.markDefs = block.markDefs || []
      block.markDefs.push({_key: defKey, _type: 'fontSize', size})
      return defKey
    }

    const walker = (node: Node, active: {decorators: string[]; color?: string; fontSize?: 'sm'|'base'|'lg'|'xl'}, block: PTBlock | null) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ''
        if (!block) {
          const b = createBlock('normal')
          pushText(b, text, active.decorators)
          blocks.push(b)
        } else {
          const marks = [...active.decorators]
          if (active.color) marks.push(ensureColorDef(block, active.color))
          if (active.fontSize) marks.push(ensureFontSizeDef(block, active.fontSize))
          pushText(block, text, marks)
        }
        return
      }

      if (!(node instanceof HTMLElement)) {
        node.childNodes.forEach((c) => walker(c, active, block))
        return
      }

      const tag = node.tagName.toLowerCase()

      if (tag === 'br') {
        if (block) pushText(block, '\n', active.decorators)
        return
      }

      const isList = tag === 'ul' || tag === 'ol'
      const isListItem = tag === 'li'
      const isHeading = tag === 'h1' || tag === 'h2' || tag === 'h3'
      const isParagraph = tag === 'p' || tag === 'div'

      let nextBlock = block
      if (isHeading) {
        nextBlock = createBlock(tag as any)
        blocks.push(nextBlock)
      } else if (isParagraph) {
        nextBlock = createBlock('normal')
        blocks.push(nextBlock)
      } else if (isListItem) {
        nextBlock = createBlock('normal')
        nextBlock.listItem = (node.parentElement && node.parentElement.tagName.toLowerCase() === 'ol') ? 'number' : 'bullet'
        nextBlock.level = 1
        blocks.push(nextBlock)
      }

      const next = {...active}

      const styleColor = node.style?.color || ''
      if (styleColor) {
        const m = styleColor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i) || styleColor.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
        if (m) {
          if (m[0].startsWith('#')) next.color = m[0]
          else {
            const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10)
            const hex = `#${[r,g,b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
            next.color = hex
          }
        }
      }

      const fontSizeStr = node.style?.fontSize || ''
      if (fontSizeStr) {
        const px = fontSizeStr.endsWith('px') ? parseInt(fontSizeStr, 10) : null
        const size = mapFontSize(px)
        if (size) next.fontSize = size
      }

      const fontWeight = node.style?.fontWeight || ''
      if (fontWeight && (fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600)) {
        next.decorators = Array.from(new Set([...(next.decorators || []), 'strong']))
      }

      const decos = new Set(next.decorators)
      if (tag === 'strong' || tag === 'b') decos.add('strong')
      if (tag === 'em' || tag === 'i') decos.add('em')
      if (tag === 'u') decos.add('underline')
      if (tag === 's' || tag === 'strike') decos.add('strike-through')
      next.decorators = Array.from(decos)

      node.childNodes.forEach((c) => walker(c, next, nextBlock || block))
    }

    const bodyChildren = Array.from(doc.body.childNodes)
    if (bodyChildren.length === 0) {
      const empty: PTBlock = {_type: 'block', _key: key('blk'), style: 'normal', children: [{_type: 'span', _key: key('spn'), text: '', marks: []}], markDefs: []}
      blocks.push(empty)
    } else {
      bodyChildren.forEach((n) => walker(n, {decorators: []}, null))
    }

    // Split blocks by hard line breaks (\n) into separate blocks
    const finalBlocks: PTBlock[] = []
    for (const blk of blocks) {
      let current: PTBlock = { ...blk, _key: key('blk'), children: [], markDefs: blk.markDefs ? [...blk.markDefs] : [] }
      for (const ch of blk.children) {
        const parts = (ch.text || '').split('\n')
        for (let i = 0; i < parts.length; i++) {
          const partText = parts[i]
          if (partText) {
            current.children.push({ ...ch, _key: key('spn'), text: partText })
          }
          if (i < parts.length - 1) {
            if (current.children.length === 0) {
              // Keep empty lines as empty paragraph
              current.children.push({ _type: 'span', _key: key('spn'), text: '', marks: [] })
            }
            finalBlocks.push(current)
            current = { ...blk, _key: key('blk'), children: [], markDefs: blk.markDefs ? [...blk.markDefs] : [] }
          }
        }
      }
      finalBlocks.push(current)
    }

    return finalBlocks
  }, [])

  const handlePasteIntoHelper = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData?.getData('text/html')
    if (!html) return
    e.preventDefault()
    const blocks = convertHtmlToBlocks(html)
    onChange(set(blocks))
    e.currentTarget.value = ''
  }, [convertHtmlToBlocks, onChange])

  const handlePasteCapture = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const html = e.clipboardData?.getData('text/html')
    if (!html) return
    e.preventDefault()
    const blocks = convertHtmlToBlocks(html)
    onChange(set(blocks))
  }, [convertHtmlToBlocks, onChange])

  return (
    <div onPasteCapture={handlePasteCapture}>
      <div style={{marginBottom: 8}}>
        <textarea
          placeholder="Paste HTML here to import formatting"
          onPaste={handlePasteIntoHelper}
          style={{width: '100%', minHeight: 60, padding: 8, border: '1px solid #e5e7eb', borderRadius: 4}}
        />
      </div>
      {renderDefault(props)}
    </div>
  )
}


