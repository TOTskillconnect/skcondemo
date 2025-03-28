import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Tag {
  id: string
  label: string
  category?: string
  icon?: string
}

interface TagInputProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  suggestions?: Tag[]
  placeholder?: string
}

export function TagInput({
  tags,
  onTagsChange,
  suggestions = [],
  placeholder = "Add tags...",
  className,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setShowSuggestions(value.length > 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const newTag: Tag = {
        id: Math.random().toString(36).substr(2, 9),
        label: inputValue.trim(),
      }
      onTagsChange([...tags, newTag])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(tags.filter((tag) => tag.id !== tagId))
  }

  const handleSelectSuggestion = (suggestion: Tag) => {
    onTagsChange([...tags, suggestion])
    setInputValue("")
    setShowSuggestions(false)
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
          >
            {tag.icon && <span className="mr-1">{tag.icon}</span>}
            <span>{tag.label}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="rounded-md border bg-popover p-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              {suggestion.icon && <span>{suggestion.icon}</span>}
              <span>{suggestion.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 