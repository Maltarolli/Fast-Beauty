'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface BlockTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSaved: () => void;
}

export function BlockTimeModal({ isOpen, onClose, selectedDate, onSaved }: BlockTimeModalProps) {
  const [isFullDay, setIsFullDay] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('time_blocks').insert({
        user_id: user.id,
        block_date: selectedDate,
        is_full_day: isFullDay,
        start_time: isFullDay ? null : startTime,
        end_time: isFullDay ? null : endTime,
        reason: reason || null,
      });

      setIsFullDay(false);
      setStartTime('');
      setEndTime('');
      setReason('');
      onSaved();
      onClose();
    } catch {
      alert('Erro ao bloquear horário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bloquear Horário">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle full day */}
        <div className="flex items-center justify-between bg-background border border-border rounded-xl p-4">
          <span className="text-sm font-medium">Dia inteiro</span>
          <button
            type="button"
            onClick={() => setIsFullDay(!isFullDay)}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 cursor-pointer ${
              isFullDay ? 'bg-accent' : 'bg-subtle-strong'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${
                isFullDay ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Time range */}
        {!isFullDay && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in-down">
            <Input
              label="Início"
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required={!isFullDay}
            />
            <Input
              label="Fim"
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              required={!isFullDay}
            />
          </div>
        )}

        <Input
          label="Motivo / Observação"
          placeholder="Ex: Almoço, Folga, Feriado..."
          value={reason}
          onChange={e => setReason(e.target.value)}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Bloquear Horário
        </Button>
      </form>
    </Modal>
  );
}
