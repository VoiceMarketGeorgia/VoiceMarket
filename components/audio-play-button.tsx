"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AudioPlayButtonProps {
  isPlaying: boolean
  onClick: () => void
  icon?: React.ReactNode
  tooltip?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function AudioPlayButton({
  isPlaying,
  onClick,
  icon,
  tooltip,
  size = "md",
  variant = "outline",
}: AudioPlayButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const button = (
    <Button
      variant={variant}
      size="icon"
      className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${
        isPlaying ? "bg-orange-500 text-white hover:bg-orange-600" : ""
      }`}
      onClick={onClick}
    >
      {isPlaying ? <Pause className={iconSizes[size]} /> : icon || <Play className={iconSizes[size]} />}
    </Button>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}
