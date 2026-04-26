import { format, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  value?: string | null
  onChange: (date: string) => void
}

export function CustomDatePicker({ value, onChange }: Props) {
  const parsedDate = value ? parseISO(value) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {parsedDate ? format(parsedDate, "MM/dd/yyyy") : "Pick a date"}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-50 p-0">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={(date) =>
            onChange(date ? format(date, "yyyy-MM-dd") : "")
          }
          initialFocus
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  )
}