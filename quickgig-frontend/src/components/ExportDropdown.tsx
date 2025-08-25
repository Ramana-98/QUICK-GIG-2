import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, FileSpreadsheet, File, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu'
import { useToast } from '../hooks/use-toast'

interface ExportDropdownProps {
  data?: any[]
  filename?: string
}

export default function ExportDropdown({ data = [], filename = 'export' }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<string | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; placement: 'top' | 'bottom' }>({ top: 0, left: 0, placement: 'bottom' })
  const { toast } = useToast()

  const exportFormats = [
    {
      id: 'csv',
      label: 'Export as CSV',
      icon: FileText,
      description: 'Comma-separated values'
    },
    {
      id: 'excel',
      label: 'Export as Excel',
      icon: FileSpreadsheet,
      description: 'Microsoft Excel format'
    },
    {
      id: 'pdf',
      label: 'Export as PDF',
      icon: File,
      description: 'Portable document format'
    }
  ]

  const simulateExport = async (format: string) => {
    setIsExporting(true)
    setExportingFormat(format)
    setIsOpen(false)

    // Show preparing toast
    toast({
      title: "Preparing Export...",
      description: `Generating ${format.toUpperCase()} file`,
      variant: "default",
    })

    // Simulate export process (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Create and download mock file
    const blob = new Blob([`Mock ${format.toUpperCase()} export data`], { 
      type: format === 'csv' ? 'text/csv' : format === 'excel' ? 'application/vnd.ms-excel' : 'application/pdf' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.${format === 'excel' ? 'xlsx' : format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Show success toast
    toast({
      title: "Export Successful ✅",
      description: `Your ${format.toUpperCase()} file has been downloaded`,
      variant: "success",
    })

    setIsExporting(false)
    setExportingFormat(null)
  }

  const computePosition = () => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const gap = 8
    const spaceBelow = window.innerHeight - rect.bottom
    const preferredPlacement: 'top' | 'bottom' = spaceBelow < 220 ? 'top' : 'bottom'
    let top = preferredPlacement === 'bottom' ? rect.bottom + gap : rect.top - gap
    // Provisional left aligning to button's right, will be corrected after measuring menu
    const provisionalLeft = Math.max(8, Math.min(rect.right - 256, window.innerWidth - 8 - 256))
    setMenuStyle({ top, left: provisionalLeft, placement: preferredPlacement })
  }

  useLayoutEffect(() => {
    if (isOpen) {
      computePosition()
      // After first paint, if placing on top we need the menu height to subtract
      requestAnimationFrame(() => {
        if (menuRef.current && buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect()
          const gap = 8
          const menuHeight = menuRef.current.offsetHeight
          const menuWidth = menuRef.current.offsetWidth
          const spaceBelow = window.innerHeight - rect.bottom
          const placement: 'top' | 'bottom' = spaceBelow < menuHeight + 40 ? 'top' : 'bottom'
          const top = placement === 'bottom' ? rect.bottom + gap : rect.top - menuHeight - gap
          // Align right edges by default, then clamp into viewport with 8px margin
          const desiredLeft = rect.right - menuWidth
          const left = Math.max(8, Math.min(desiredLeft, window.innerWidth - 8 - menuWidth))
          setMenuStyle({ top, left, placement })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onResizeScroll = () => computePosition()
    window.addEventListener('resize', onResizeScroll)
    // capture scroll on any scrollable ancestor
    window.addEventListener('scroll', onResizeScroll, true)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResizeScroll)
      window.removeEventListener('scroll', onResizeScroll, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <div className="relative">
      <Button 
        ref={buttonRef}
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="relative"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export
          </>
        )}
      </Button>

      {isOpen && createPortal(
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.12 }}
          className="fixed z-[1000] w-[min(92vw,16rem)] bg-background border rounded-md shadow-lg p-1 max-h-[60vh] overflow-auto"
          style={{ top: menuStyle.top, left: menuStyle.left }}
          onMouseLeave={() => setIsOpen(false)}
        >
          {exportFormats.map((format) => {
            const Icon = format.icon
            return (
              <div
                key={format.id}
                onClick={() => simulateExport(format.id)}
                className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors cursor-pointer rounded-sm"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{format.label}</span>
                  <span className="text-xs text-muted-foreground">{format.description}</span>
                </div>
              </div>
            )
          })}
        </motion.div>,
        document.body
      )}

      {/* Loading overlay for visual feedback */}
      {isExporting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-lg p-6 shadow-lg border flex items-center gap-3"
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="font-medium">Preparing {exportingFormat?.toUpperCase()} Export</p>
              <p className="text-sm text-muted-foreground">This will take a moment...</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
