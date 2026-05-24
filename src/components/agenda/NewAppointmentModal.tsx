'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Service, TimeBlock, Client } from '@/types/database';
import { formatTime } from '@/lib/utils';
import { AlertTriangle, Clock } from 'lucide-react';

function CustomTimePicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMin, setSelectedMin] = useState('00');

  useEffect(() => {
    if (isOpen && value) {
      const [h, m] = value.split(':');
      if (h) setSelectedHour(h);
      if (m) setSelectedMin(m);
      
      // Auto-scroll to selected position
      setTimeout(() => {
        const hScroll = document.getElementById('hour-scroll');
        const mScroll = document.getElementById('min-scroll');
        if (hScroll) hScroll.scrollTop = parseInt(h || '8') * 40;
        if (mScroll) mScroll.scrollTop = parseInt(m || '0') * 40;
      }, 50);
    }
  }, [isOpen, value]);

  const hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirm = () => {
    onChange(`${selectedHour}:${selectedMin}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-foreground mb-2">
        Horário<span className="text-error ml-1">*</span>
      </label>
      <div className="relative">
        <input 
          type="text"
          inputMode="numeric"
          placeholder="--:--"
          value={value}
          onChange={(e) => {
            let raw = e.target.value.replace(/\D/g, '');
            if (raw.length > 4) raw = raw.slice(0, 4);
            
            let formatted = raw;
            if (raw.length > 2) {
              formatted = `${raw.slice(0, 2)}:${raw.slice(2)}`;
            }
            
            onChange(formatted);
            
            if (raw.length === 4) {
              const h = raw.slice(0, 2);
              const m = raw.slice(2, 4);
              const validH = parseInt(h) > 23 ? '23' : h;
              const validM = parseInt(m) > 59 ? '59' : m;
              if (h !== validH || m !== validM) {
                 onChange(`${validH}:${validM}`);
              } else {
                 setSelectedHour(h);
                 setSelectedMin(m);
              }
            }
          }}
          onFocus={() => setIsOpen(true)}
          required
          className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-12 text-foreground input-focus transition-all cursor-text font-medium"
        />
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 cursor-pointer hover:bg-subtle/50 rounded-lg transition-colors"
        >
          <Clock className="w-5 h-5 text-muted hover:text-foreground" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-card border border-border rounded-2xl shadow-theme-2xl overflow-hidden animate-scale-in p-5 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto origin-top">
           <div className="flex justify-center gap-4 h-52 relative">
              {/* Highlight background strip */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-10 bg-subtle/50 rounded-xl pointer-events-none"></div>

              <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth flex flex-col relative z-10" id="hour-scroll">
                 <div className="h-[84px] shrink-0 pointer-events-none"></div>
                 {hours.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSelectedHour(h)}
                      className={`h-10 shrink-0 w-full flex items-center justify-center text-lg transition-all cursor-pointer ${selectedHour === h ? 'text-white bg-accent rounded-full font-bold shadow-md scale-105' : 'text-muted-dark hover:text-foreground hover:bg-subtle/30 rounded-xl'}`}
                    >
                      {h}
                    </button>
                 ))}
                 <div className="h-[84px] shrink-0 pointer-events-none"></div>
              </div>

              <div className="flex items-center justify-center text-2xl font-bold text-muted-dark pb-2 z-10">:</div>

              <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth flex flex-col relative z-10" id="min-scroll">
                 <div className="h-[84px] shrink-0 pointer-events-none"></div>
                 {minutes.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMin(m)}
                      className={`h-10 shrink-0 w-full flex items-center justify-center transition-all cursor-pointer ${selectedMin === m ? 'text-accent font-bold text-2xl scale-110' : 'text-lg text-muted-dark hover:text-foreground'}`}
                    >
                      {m}
                    </button>
                 ))}
                 <div className="h-[84px] shrink-0 pointer-events-none"></div>
              </div>
           </div>
           
           <div className="pt-4 mt-3 flex justify-end gap-6">
              <button type="button" onClick={() => setIsOpen(false)} className="text-sm font-bold text-muted uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer">
                 Cancelar
              </button>
              <button type="button" onClick={handleConfirm} className="text-sm font-bold text-accent uppercase tracking-wider hover:brightness-110 transition-colors cursor-pointer">
                 OK
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  services: Service[];
  timeBlocks: TimeBlock[];
  onSaved: () => void;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  selectedDate,
  services,
  timeBlocks,
  onSaved,
}: NewAppointmentModalProps) {
  const router = useRouter();
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [price, setPrice] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Autocomplete state
  const [clients, setClients] = useState<Client[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [conflictData, setConflictData] = useState<{ show: boolean; message: string } | null>(null);

  // Load clients when modal opens
  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('clients').select('*').order('name');
    if (data) {
      setClients(data);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update date when selectedDate changes
  useState(() => {
    setDate(selectedDate);
  });

  const handleServiceChange = (id: string) => {
    if (id === 'new_service') {
      router.push('/dashboard/servicos');
      return;
    }
    setServiceId(id);
    const service = services.find(s => s.id === id);
    if (service) {
      setPrice(service.price.toString());
    }
  };

  const handleSubmit = async (e?: React.FormEvent, ignoreConflict = false) => {
    if (e) e.preventDefault();
    setError('');

    // Check for full-day block
    const fullDayBlock = timeBlocks.find(b => b.is_full_day && b.block_date === date);
    if (fullDayBlock) {
      setError('Este dia está completamente bloqueado. Desbloqueie primeiro.');
      return;
    }

    // Check for partial block conflict
    const conflictBlock = timeBlocks.find(b => {
      if (b.is_full_day || b.block_date !== date) return false;
      return time >= (b.start_time || '') && time < (b.end_time || '');
    });
    if (conflictBlock) {
      setError(`Horário bloqueado das ${formatTime(conflictBlock.start_time || '')} às ${formatTime(conflictBlock.end_time || '')}. Escolha outro horário.`);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check for 1 hour conflict
      if (!ignoreConflict) {
        const [hours, minutes] = time.split(':').map(Number);
        const newTimeInMinutes = hours * 60 + minutes;

        const { data: existingAppointments } = await supabase
          .from('appointments')
          .select('appointment_time, client_name')
          .eq('user_id', user.id)
          .eq('appointment_date', date);

        if (existingAppointments && existingAppointments.length > 0) {
          let hasConflict = false;
          let conflictName = '';

          for (const appt of existingAppointments) {
            const [apptHours, apptMins] = (appt.appointment_time || '00:00').split(':').map(Number);
            const apptTimeInMinutes = apptHours * 60 + apptMins;

            if (Math.abs(newTimeInMinutes - apptTimeInMinutes) < 60) {
              hasConflict = true;
              conflictName = appt.client_name;
              break;
            }
          }

          if (hasConflict) {
            setConflictData({ show: true, message: `Já tem uma cliente (${conflictName}) nesse intervalo de 1 hora.` });
            setLoading(false);
            return;
          }
        }
      }

      // Check/create client by phone
      let clientId: string | null = null;
      if (clientPhone) {
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .eq('phone', clientPhone)
          .single();

        if (existingClient) {
          clientId = existingClient.id;
          await supabase.from('clients').update({
            name: clientName,
            last_visit: date,
            observations: observations || null,
          }).eq('id', clientId);
        } else {
          const { data: newClient } = await supabase
            .from('clients')
            .insert({
              user_id: user.id,
              name: clientName,
              phone: clientPhone,
              last_visit: date,
              observations: observations || null,
            })
            .select('id')
            .single();
          clientId = newClient?.id || null;
        }
      }

      const service = services.find(s => s.id === serviceId);

      await supabase.from('appointments').insert({
        user_id: user.id,
        client_id: clientId,
        service_id: serviceId || null,
        appointment_date: date,
        appointment_time: time,
        client_name: clientName,
        client_phone: clientPhone,
        service_name: service?.name || 'Serviço personalizado',
        price: parseFloat(price) || 0,
        observations: observations || null,
        is_paid: false,
      });

      // Reset form
      setTime('');
      setClientName('');
      setClientPhone('');
      setServiceId('');
      setPrice('');
      setObservations('');
      setConflictData(null);
      onSaved();
      onClose();
    } catch {
      setError('Erro ao salvar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Novo Agendamento">
        <form onSubmit={handleSubmit} className="space-y-4 overflow-visible">
          {error && (
            <div className="bg-error-bg border border-error/20 rounded-xl p-3 text-error text-sm animate-fade-in-down">
              {error}
            </div>
          )}

        <div className="grid grid-cols-2 gap-4">
          <Input label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <CustomTimePicker value={time} onChange={setTime} />
        </div>

        <div className="relative" ref={wrapperRef}>
          <Input
            label="Nome do Cliente"
            placeholder="Ex: Maria Silva"
            value={clientName}
            onChange={e => {
              setClientName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            required
            autoComplete="off"
          />
          {showSuggestions && clientName && clients.some(c => c.name.toLowerCase().includes(clientName.toLowerCase())) && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-theme-lg max-h-48 overflow-y-auto">
              {clients
                .filter(c => c.name.toLowerCase().includes(clientName.toLowerCase()))
                .map(client => (
                  <div
                    key={client.id}
                    className="px-4 py-2 hover:bg-subtle-strong cursor-pointer transition-colors border-b border-border/50 last:border-0"
                    onClick={() => {
                      setClientName(client.name);
                      setClientPhone(client.phone || '');
                      setObservations(client.observations || '');
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="font-medium text-foreground">{client.name}</div>
                    {client.phone && <div className="text-xs text-muted-dark">{client.phone}</div>}
                  </div>
                ))}
            </div>
          )}
        </div>

        <Input
          label="Telefone do Cliente"
          placeholder="(11) 99999-9999"
          value={clientPhone}
          onChange={e => setClientPhone(e.target.value)}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-foreground mb-2">Serviço<span className="text-error ml-1">*</span></label>
          <select
            value={serviceId}
            onChange={e => handleServiceChange(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground input-focus transition-all cursor-pointer"
            required
          >
            <option value="">Selecione um serviço</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} — R$ {s.price.toFixed(2)}
              </option>
            ))}
            <option value="new_service" className="text-accent font-semibold">+ Cadastrar novo serviço</option>
          </select>
        </div>

        <Input
          label="Preço (R$)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <Input
          label="Observações"
          placeholder="Opcional..."
          value={observations}
          onChange={e => setObservations(e.target.value)}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Salvar Agendamento
        </Button>
      </form>
    </Modal>

    {/* Conflict Confirmation Modal */}
    <Modal
      isOpen={!!conflictData?.show}
      onClose={() => setConflictData(null)}
      title="Aviso de Conflito"
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-warning-bg rounded-full flex items-center justify-center mx-auto mb-2 relative">
          <div className="absolute inset-0 bg-warning/20 rounded-full animate-ping opacity-75"></div>
          <AlertTriangle className="w-8 h-8 text-warning relative z-10" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">Tem certeza?</h3>
          <p className="text-muted-dark leading-relaxed">
            {conflictData?.message}
          </p>
          <p className="text-sm font-semibold text-warning mt-4">
            Deseja prosseguir mesmo com esse conflito de horário?
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setConflictData(null)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              setConflictData(null);
              handleSubmit(undefined, true);
            }}
            className="flex-1"
          >
            Sim, desejo agendar
          </Button>
        </div>
      </div>
    </Modal>
    </>
  );
}
