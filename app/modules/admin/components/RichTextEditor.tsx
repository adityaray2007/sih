'use client'

import { useState, useRef, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Enter text content...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html)
    editorRef.current?.focus()
    handleInput()
  }

  const ToolbarButton = ({ onClick, children, title, isActive = false }: { 
    onClick: () => void
    children: React.ReactNode
    title: string
    isActive?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className={`border border-gray-300 rounded-lg ${isFocused ? 'ring-2 ring-red-500 border-transparent' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Strikethrough">
            <s>S</s>
          </ToolbarButton>
        </div>

        {/* Text Alignment */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('justifyRight')} title="Align Right">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('justifyFull')} title="Justify">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zM11 4a1 1 0 10 0 2h6a1 1 0 100-2h-6zm0 4a1 1 0 10 0 2h6a1 1 0 100-2h-6zm0 4a1 1 0 10 0 2h6a1 1 0 100-2h-6zm0 4a1 1 0 10 0 2h6a1 1 0 100-2h-6z" clipRule="evenodd" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zM11 4a1 1 0 10 0 2h6a1 1 0 100-2h-6zm0 4a1 1 0 10 0 2h6a1 1 0 100-2h-6zm0 4a1 1 0 10 0 2h6a1 1 0 100-2h-6zm0 4a1 1 0 10 0 2h6a1 1 0 100-2h-6z" clipRule="evenodd" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton onClick={() => insertHTML('<h1>Heading 1</h1>')} title="Heading 1">
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHTML('<h2>Heading 2</h2>')} title="Heading 2">
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHTML('<h3>Heading 3</h3>')} title="Heading 3">
            H3
          </ToolbarButton>
        </div>

        {/* Text Color */}
        <div className="flex">
          <ToolbarButton onClick={() => execCommand('foreColor', '#000000')} title="Text Color">
            <div className="w-4 h-4 border border-gray-400 rounded" style={{ backgroundColor: '#000000' }}></div>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('foreColor', '#ff0000')} title="Red Text">
            <div className="w-4 h-4 border border-gray-400 rounded" style={{ backgroundColor: '#ff0000' }}></div>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('foreColor', '#0000ff')} title="Blue Text">
            <div className="w-4 h-4 border border-gray-400 rounded" style={{ backgroundColor: '#0000ff' }}></div>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('foreColor', '#008000')} title="Green Text">
            <div className="w-4 h-4 border border-gray-400 rounded" style={{ backgroundColor: '#008000' }}></div>
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[120px] p-3 focus:outline-none text-black"
        style={{ minHeight: '120px', color: '#000000' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] {
          color: #000000;
        }
        [contenteditable] * {
          color: inherit;
        }
      `}</style>
    </div>
  )
}
