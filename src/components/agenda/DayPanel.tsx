'use client';

import { Plus, Lock, Calendar as CalendarIcon, Trash2, DollarSign, Unlock } from 'lucide-react';
import { formatDate, formatTime, formatCurrency, cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Appointment, TimeBlock } from '@/types/database';
import { useState } from 'react';

interface DayPanelProps {
  date: Date;
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
  onNewAppointment: () => void;
  onBlockTime: () => void;
  onRefresh: () => void;
}

export function DayPanel({ date, appointments, timeBlocks, onNewAppointment, onBlockTime, onRefresh }: DayPanelProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fullDayBlock = timeBlocks.find(b => b.is_full_day);

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Deseja excluir este agendamento?')) return;
    setDeletingId(id);
    const supabase = createClient();
    
    // Also delete any related transaction
    await supabase.from('transactions').delete().eq('source', 'agenda').eq('source_id', id);
    await supabase.from('appointments').delete().eq('id', id);
    
    setDeletingId(null);
    onRefresh();
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Deseja desbloquear este horário?')) return;
    const supabase = createClient();
    await supabase.from('time_blocks').delete().eq('id', id);
    onRefresh();
  };

  const handleTogglePaid = async (appointment: Appointment) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const newStatus = !appointment.is_paid;
    await supabase.from('appointments').update({ is_paid: newStatus }).eq('id', appointment.id);

    if (newStatus) {
      // Create transaction
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'entrada',
        title: `${appointment.service_name} - ${appointment.client_name}`,
        amount: appointment.price,
        category: 'Serviço',
        transaction_date: appointment.appointment_date,
        source: 'agenda',
        source_id: appointment.id,
      });

      // Update client last visit
      if (appointment.client_id) {
        await supabase.from('clients').update({ last_visit: appointment.appointment_date }).eq('id', appointment.client_id);
      }
    } else {
      // Remove transaction
      await supabase.from('transactions').delete().eq('source', 'agenda').eq('source_id', appointment.id);
    }

    onRefresh();
  };

  // Merge appointments and partial blocks sorted by time
  const items: Array<{ type: 'appointment' | 'block'; data: Appointment | TimeBlock; time: string }> = [];
  
  appointments.forEach(a => items.push({ type: 'appointment', data: a, time: a.appointment_time }));
  timeBlocks.filter(b => !b.is_full_day).forEach(b => items.push({ type: 'block', data: b, time: b.start_time || '00:00' }));
  
  items.sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-card border border-border rounded-3xl p-6 animate-slide-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold capitalize">Agenda de {formatDate(date)}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewAppointment}
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white gradient-accent rounded-xl hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
          <button
            onClick={onBlockTime}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-card border border-border rounded-xl text-muted hover:text-foreground hover:bg-card-hover transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Bloquear
          </button>
        </div>
      </div>

      {/* Full day block */}
      {fullDayBlock && (
        <div className="bg-warning-bg border border-warning/20 rounded-2xl p-6 text-center animate-scale-in">
          <Lock className="w-10 h-10 text-warning mx-auto mb-3" />
          <h3 className="text-lg font-bold text-warning mb-1">Dia Bloqueado</h3>
          <p className="text-warning/80 text-sm mb-4">{fullDayBlock.reason || 'Sem motivo informado'}</p>
          <button
            onClick={() => handleDeleteBlock(fullDayBlock.id)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-warning/10 border border-warning/20 rounded-xl text-warning hover:bg-warning/20 transition-all cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            Desbloquear
          </button>
        </div>
      )}

      {/* Items list */}
      {!fullDayBlock && items.length > 0 && (
        <div className="space-y-3 stagger-children">
          {items.map((item) => {
            if (item.type === 'appointment') {
              const appt = item.data as Appointment;
              return (
                <div
                  key={appt.id}
                  className={cn(
                    'bg-background border border-border rounded-2xl p-4 transition-all duration-300 hover:border-border-light animate-fade-in-up',
                    deletingId === appt.id && 'opacity-50 scale-95'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-accent">{formatTime(appt.appointment_time)}</span>
                        <span className="text-sm font-semibold truncate">{appt.client_name}</span>
                      </div>
                      <p className="text-sm text-muted">{appt.service_name}</p>
                      <p className="text-sm font-bold mt-1">{formatCurrency(appt.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleTogglePaid(appt)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                          appt.is_paid
                            ? 'bg-success-bg text-success border border-success/20'
                            : 'bg-subtle text-muted border border-border hover:border-accent/30 hover:text-accent'
                        )}
                      >
                        <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                        {appt.is_paid ? 'Pago' : 'Receber'}
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appt.id)}
                        className="p-2 rounded-lg text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              const block = item.data as TimeBlock;
              return (
                <div key={block.id} className="bg-warning-bg/50 border border-warning/10 rounded-2xl p-4 animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-warning" />
                      <div>
                        <p className="text-sm font-semibold text-warning">
                          {formatTime(block.start_time || '')} – {formatTime(block.end_time || '')}
                        </p>
                        <p className="text-xs text-warning/70">{block.reason || 'Bloqueado'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-2 rounded-lg text-warning/60 hover:text-warning hover:bg-warning/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Empty state */}
      {!fullDayBlock && items.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-subtle mx-auto flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-muted-dark" />
          </div>
          <h3 className="text-lg font-bold text-muted mb-2">Agenda livre!</h3>
          <p className="text-muted-dark text-sm mb-4">Nenhum agendamento para este dia.</p>
          <button
            onClick={onNewAppointment}
            className="text-sm text-accent hover:text-accent/80 font-semibold transition-colors cursor-pointer"
          >
            + Agendar Cliente
          </button>
        </div>
      )}

      {/* Bottom action (desktop) */}
      {!fullDayBlock && (
        <div className="hidden lg:block mt-6">
          <button
            onClick={onNewAppointment}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-muted hover:text-accent hover:border-accent/30 transition-all text-sm font-medium cursor-pointer"
          >
            + Novo Agendamento
          </button>
        </div>
      )}
    </div>
  );
}
