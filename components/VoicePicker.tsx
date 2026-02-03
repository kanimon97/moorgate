import React, { useState, useRef, useEffect, useMemo, useContext, createContext } from "react"
import { Check, ChevronsUpDown, Pause, Play, Search, X } from "lucide-react"
import { Orb, AgentState } from "./Orb"
import { cn } from "../utils"
import { VoiceOption } from "../types"

// --- Audio Player Context ---
interface AudioItem {
  id: string
  src: string
}

interface AudioPlayerContextType {
  isPlaying: boolean
  activeId: string | null
  play: (item: AudioItem) => void
  pause: () => void
  isItemActive: (id: string) => boolean
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null)

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.onended = () => setIsPlaying(false)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const play = (item: AudioItem) => {
    if (!audioRef.current) return

    if (activeId === item.id && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    if (activeId !== item.id) {
      audioRef.current.src = item.src
      setActiveId(item.id)
    }

    audioRef.current.play().catch(e => console.error("Playback error", e))
    setIsPlaying(true)
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const isItemActive = (id: string) => activeId === id

  return (
    <AudioPlayerContext.Provider value={{ isPlaying, activeId, play, pause, isItemActive }}>
      {children}
    </AudioPlayerContext.Provider>
  )
}

function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (!context) throw new Error("useAudioPlayer must be used within AudioPlayerProvider")
  return context
}

// --- Voice Picker Item Component ---

interface VoicePickerItemProps {
  voice: VoiceOption
  isSelected: boolean
  onSelect: () => void
}

const VoicePickerItem: React.FC<VoicePickerItemProps> = ({
  voice,
  isSelected,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const player = useAudioPlayer()

  const preview = voice.previewUrl
  const audioItem = useMemo(
    () => (preview ? { id: voice.id, src: preview } : null),
    [preview, voice]
  )

  const isPlaying =
    audioItem && player.isItemActive(audioItem.id) && player.isPlaying

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!audioItem) return

    if (isPlaying) {
      player.pause()
    } else {
      player.play(audioItem)
    }
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer",
        isSelected && "bg-gray-100 dark:bg-zinc-800"
      )}
    >
      <div
        className="relative z-10 size-8 shrink-0 cursor-pointer overflow-visible mr-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePreview}
      >
        <div className="absolute inset-0">
           <Orb
            agentState={isPlaying ? "talking" : null}
            className="pointer-events-none w-full h-full"
          />
        </div>
        
        {preview && (isHovered || isPlaying) && (
          <div className="pointer-events-none absolute inset-0 flex size-8 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-opacity hover:bg-black/50 z-20">
            {isPlaying ? (
              <Pause className="size-3 text-white" />
            ) : (
              <Play className="size-3 text-white" />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="font-medium truncate">{voice.name}</span>
        {voice.labels && (
          <div className="text-gray-500 dark:text-zinc-500 flex items-center gap-1.5 text-xs truncate">
            {voice.labels.accent && <span>{voice.labels.accent}</span>}
            {voice.labels.gender && <span>•</span>}
            {voice.labels.gender && (
              <span className="capitalize">{voice.labels.gender}</span>
            )}
            {voice.labels.description && <span>•</span>}
             {voice.labels.description && (
              <span className="capitalize">{voice.labels.description}</span>
            )}
          </div>
        )}
      </div>

      <Check
        className={cn(
          "ml-auto size-4 shrink-0",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}

// --- Voice Picker Component ---

interface VoicePickerProps {
  voices: VoiceOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function VoicePicker({
  voices,
  value,
  onValueChange,
  placeholder = "Select a voice...",
  className,
  disabled
}: VoicePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedVoice = voices.find((v) => v.id === value)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset search on close
  useEffect(() => {
    if (!isOpen) setSearchQuery("")
  }, [isOpen])

  const filteredVoices = useMemo(() => {
    if (!searchQuery) return voices
    const lower = searchQuery.toLowerCase()
    return voices.filter(v => 
      v.name.toLowerCase().includes(lower) || 
      v.labels?.accent?.toLowerCase().includes(lower) || 
      v.labels?.gender?.toLowerCase().includes(lower) ||
      v.labels?.description?.toLowerCase().includes(lower)
    )
  }, [voices, searchQuery])

  return (
    <AudioPlayerProvider>
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:text-slate-50 dark:focus:ring-slate-300",
            className
          )}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          {selectedVoice ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="relative size-6 shrink-0 overflow-visible">
                <Orb agentState="thinking" className="absolute inset-0" />
              </div>
              <span className="truncate">{selectedVoice.name}</span>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-zinc-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-1 z-50 w-full rounded-md border border-gray-200 bg-white text-slate-950 shadow-md outline-none animate-in fade-in-0 zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-slate-50">
            <div className="flex items-center border-b border-gray-100 dark:border-zinc-800 px-3">
              <Search className="mr-2 size-4 shrink-0 opacity-50" />
              <input 
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-zinc-500"
                placeholder="Search voices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1 custom-scrollbar">
              {filteredVoices.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500 dark:text-zinc-500">
                  No voice found.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredVoices.map((voice) => (
                    <VoicePickerItem
                      key={voice.id}
                      voice={voice}
                      isSelected={value === voice.id}
                      onSelect={() => {
                        onValueChange?.(voice.id)
                        setIsOpen(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AudioPlayerProvider>
  )
}
