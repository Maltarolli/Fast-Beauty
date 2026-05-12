'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, isToday, getCalendarDays, subMonths, addMonths, cn, formatMonthYear } from '@/lib/utils';

interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  datesWithAppointments: Set<string>;
  datesWithBlocks: Set<string>;
}

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function Calendar({
  currentMonth,
  selectedDate,
  onSelectDate,
  onMonthChange,
  datesWithAppointments,
  datesWithBlocks,
}: CalendarProps) {
  const days = getCalendarDays(currentMonth);
  const monthLabel = formatMonthYear(currentMonth);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="p-2 rounded-xl text-muted hover:text-foreground hover-subtle transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold capitalize">{monthLabel}</h2>
        <button
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="p-2 rounded-xl text-muted hover:text-foreground hover-subtle transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-xs font-semibold text-muted-dark py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const hasAppointments = datesWithAppointments.has(dateStr);
          const hasBlocks = datesWithBlocks.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(day)}
              className={cn(
                'aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium relative cursor-pointer',
                isSelected ? 'calendar-day-selected text-white' : 'calendar-day',
                !isSelected && isTodayDate && 'calendar-day-today text-accent',
                !isSelected && !isTodayDate && 'text-foreground',
              )}
            >
              {day.getDate()}
              {/* Indicators */}
              {(hasAppointments || hasBlocks) && !isSelected && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {hasAppointments && <div className="w-1 h-1 rounded-full bg-accent" />}
                  {hasBlocks && <div className="w-1 h-1 rounded-full bg-warning" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
