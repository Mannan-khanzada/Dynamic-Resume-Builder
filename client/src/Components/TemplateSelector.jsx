import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      preview:
        'A clean, traditional resume format with clear sections and professional typography'
    },
    {
      id: 'modern',
      name: 'Modern',
      preview:
        'Sleek design with strategic use of color and modern font choices'
    },
    {
      id: 'minimal-image',
      name: 'Minimal Image',
      preview: 'Minimal design with a single image and clean typography'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      preview: 'Ultra-clean design that puts your content front and center'
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-brand-blue-500
        bg-linear-to-br from-brand-blue-50 to-brand-blue-100 ring-1 ring-brand-blue-300
        hover:ring-2 transition-all px-3 py-2 rounded-lg"
      >
        <Layout size={14} />
        <span className="max-sm:hidden"> Template</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full w-72 p-3 mt-2 space-y-3 z-10
          bg-white rounded-md border border-gray-200 shadow-sm"
        >
          {templates.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onChange(item.id)
                setIsOpen(false)
              }}
              className={`relative p-3 border rounded-md cursor-pointer transition-all
              ${
                selectedTemplate === item.id
                  ? 'border-brand-blue-400 bg-brand-blue-100'
                  : 'bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }`}
            >
              {selectedTemplate === item.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-brand-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <div className="mt-2 p-2 bg-brand-blue-50 rounded text-xs text-gray-500 italic">
                  {item.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateSelector
