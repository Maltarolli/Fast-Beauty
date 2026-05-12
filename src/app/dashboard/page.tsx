'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar } from '@/components/agenda/Calendar';
import { DayPanel } from '@/components/agenda/DayPanel';
import { NewAppointmentModal } from '@/components/agenda/NewAppointmentModal';
import { BlockTimeModal } from '@/components/agenda/BlockTimeModal';
import { Plus } from 'lucide-react';
import type { Appointment, TimeBlock, Service } from '@/types/database';
import { format } from '@/lib/utils';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [allTimeBlocks, setAllTimeBlocks] = useState<TimeBlock[]>([]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showBlockTime, setShowBlockTime] = useState(false);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load services
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
    setServices(servicesData || []);

    // Load ALL appointments for current month (for calendar dots)
    const monthStart = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), 'yyyy-MM-dd');
    const monthEnd = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0), 'yyyy-MM-dd');
    
    const { data: allAppts } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .gte('appointment_date', monthStart)
      .lte('appointment_date', monthEnd)
      .order('appointment_time');
    setAllAppointments(allAppts || []);

    const { data: allBlocks } = await supabase
      .from('time_blocks')
      .select('*')
      .eq('user_id', user.id)
      .gte('block_date', monthStart)
      .lte('block_date', monthEnd);
    setAllTimeBlocks(allBlocks || []);

    // Load day-specific data
    const dayAppts = (allAppts || []).filter(a => a.appointment_date === dateStr);
    setAppointments(dayAppts);

    const dayBlocks = (allBlocks || []).filter(b => b.block_date === dateStr);
    setTimeBlocks(dayBlocks);
  }, [currentMonth, dateStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When selected date changes, filter from already loaded data
  useEffect(() => {
    const dayAppts = allAppointments.filter(a => a.appointment_date === dateStr);
    setAppointments(dayAppts);
    const dayBlocks = allTimeBlocks.filter(b => b.block_date === dateStr);
    setTimeBlocks(dayBlocks);
  }, [dateStr, allAppointments, allTimeBlocks]);

  // Get dates that have appointments (for calendar dots)
  const datesWithAppointments = new Set(allAppointments.map(a => a.appointment_date));
  const datesWithBlocks = new Set(allTimeBlocks.map(b => b.block_date));

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="lg:w-[380px] shrink-0">
          <Calendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onMonthChange={setCurrentMonth}
            datesWithAppointments={datesWithAppointments}
            datesWithBlocks={datesWithBlocks}
          />
        </div>

        {/* Day Panel */}
        <div className="flex-1 min-w-0">
          <DayPanel
            date={selectedDate}
            appointments={appointments}
            timeBlocks={timeBlocks}
            onNewAppointment={() => setShowNewAppointment(true)}
            onBlockTime={() => setShowBlockTime(true)}
            onRefresh={loadData}
          />
        </div>
      </div>

      {/* Floating button mobile */}
      <button
        onClick={() => setShowNewAppointment(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full gradient-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:brightness-110 active:scale-90 transition-all animate-scale-in cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        selectedDate={dateStr}
        services={services}
        timeBlocks={timeBlocks}
        onSaved={loadData}
      />
      
      <BlockTimeModal
        isOpen={showBlockTime}
        onClose={() => setShowBlockTime(false)}
        selectedDate={dateStr}
        onSaved={loadData}
      />
    </div>
  );
}
