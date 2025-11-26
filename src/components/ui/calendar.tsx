import * as React from "react";
import { ChevronLeft, ChevronRight } from "react-icons/sf";
import { DayPicker } from "react-day-picker";

import { cn, iosFontClass, iosInteractiveClass } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(iosFontClass, "rounded-[32px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.08)]", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row sm:space-x-4",
        month: "space-y-4",
        caption: "relative flex items-center justify-center pt-1 text-center",
        caption_label: "text-lg font-semibold tracking-tight text-foreground",
        nav: "flex items-center space-x-2",
        nav_button: cn(
          buttonVariants({ variant: "subtle", size: "icon" }),
          iosInteractiveClass,
          "h-9 w-9 bg-card text-foreground",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell: "w-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground",
        row: "mt-2 flex w-full",
        cell:
          "relative flex h-10 w-10 items-center justify-center p-0 text-center text-base [&:has([aria-selected].day-range-end)]:rounded-r-2xl [&:has([aria-selected].day-outside)]:bg-muted [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-l-2xl last:[&:has([aria-selected])]:rounded-r-2xl focus-within:relative focus-within:z-20",
        day: cn(
          iosInteractiveClass,
          "flex h-10 w-10 items-center justify-center rounded-2xl text-base font-semibold text-foreground aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary",
        day_today: "border border-primary/40 text-primary",
        day_outside:
          "day-outside text-muted-foreground opacity-60 aria-selected:bg-muted aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-40",
        day_range_middle: "aria-selected:bg-primary/10 aria-selected:text-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="text-foreground" />,
        IconRight: ({ ..._props }) => <ChevronRight className="text-foreground" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
