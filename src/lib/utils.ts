import { format, parseISO, isToday, isSameDay, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths, startOfDay, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export function daysRemaining(trialEndsAt: string): number {
  const end = parseISO(trialEndsAt);
  const now = new Date();
  return Math.max(0, differenceInDays(end, now));
}

export function isTrialExpired(trialEndsAt: string): boolean {
  return daysRemaining(trialEndsAt) <= 0;
}

export function getCalendarDays(date: Date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = getDay(monthStart);
  
  const previousMonthDays: (Date | null)[] = Array(startDayOfWeek).fill(null);
  
  const totalCells = Math.ceil((startDayOfWeek + daysInMonth.length) / 7) * 7;
  const nextMonthPadding: (Date | null)[] = Array(totalCells - startDayOfWeek - daysInMonth.length).fill(null);
  
  return [...previousMonthDays, ...daysInMonth, ...nextMonthPadding];
}

export function cn(...classes: (string | boolean | undefined | null | number)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Only re-export what is actually used by other files
export { format, parseISO, isToday, isSameDay, differenceInDays, addDays, startOfMonth, endOfMonth, subMonths, addMonths, getDay };
export { ptBR };
