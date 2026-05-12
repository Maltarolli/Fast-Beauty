'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, Clock, Sparkle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import type { Service } from '@/types/database';

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('services').select('*').eq('user_id', user.id).order('name');
    setServices(data || []);
  };

  const openNew = () => {
    setEditing(null);
    setName('');
    setPrice('');
    setDuration('');
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setName(service.name);
    setPrice(service.price.toString());
    setDuration(service.duration_minutes.toString());
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      name,
      price: parseFloat(price) || 0,
      duration_minutes: parseInt(duration) || 30,
    };

    if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('services').insert(payload);
    }

    setSaving(false);
    setShowModal(false);
    loadServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este serviço?')) return;
    const supabase = createClient();
    await supabase.from('services').delete().eq('id', id);
    loadServices();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Serviços</h1>
        <button
          onClick={openNew}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-accent rounded-xl hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      {/* List */}
      {services.length > 0 ? (
        <div className="space-y-3 stagger-children">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 card-interactive animate-fade-in-up"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center shrink-0">
                  <Sparkle className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{service.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-semibold gradient-accent-text">{formatCurrency(service.price)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="w-3 h-3" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEdit(service)} className="p-2 rounded-lg text-muted hover:text-foreground hover-subtle transition-all cursor-pointer">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-2 rounded-lg text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-subtle mx-auto flex items-center justify-center mb-4">
            <Sparkle className="w-8 h-8 text-muted-dark" />
          </div>
          <h3 className="text-lg font-bold text-muted mb-2">Nenhum serviço cadastrado</h3>
          <p className="text-muted-dark text-sm mb-4">Cadastre seus serviços para agilizar os agendamentos.</p>
          <button onClick={openNew} className="text-sm text-accent font-semibold cursor-pointer">+ Novo Serviço</button>
        </div>
      )}

      {/* FAB mobile */}
      <button
        onClick={openNew}
        className="sm:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full gradient-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:brightness-110 active:scale-90 transition-all cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Serviço' : 'Novo Serviço'}>
        <div className="space-y-4">
          <Input label="Nome do serviço" placeholder="Ex: Manicure Gel" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Preço (R$)" type="number" step="0.01" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
          <Input label="Duração (minutos)" type="number" placeholder="30" value={duration} onChange={e => setDuration(e.target.value)} required />
          <Button onClick={handleSave} loading={saving} className="w-full" size="lg">
            {editing ? 'Salvar Alterações' : 'Criar Serviço'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
