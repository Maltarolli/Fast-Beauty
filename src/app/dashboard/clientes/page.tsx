'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Pencil, MessageCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDateShort, cn, differenceInDays } from '@/lib/utils';
import type { Client } from '@/types/database';

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editObs, setEditObs] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
    setClients(data || []);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditPhone(client.phone);
    setEditObs(client.observations || '');
  };

  const handleSave = async () => {
    if (!editingClient) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('clients').update({
      name: editName,
      phone: editPhone,
      observations: editObs || null,
    }).eq('id', editingClient.id);
    
    setSaving(false);
    setEditingClient(null);
    loadClients();
  };

  const isFiel = (client: Client) => {
    if (!client.last_visit) return false;
    const daysSince = differenceInDays(new Date(), new Date(client.last_visit));
    return daysSince <= 60;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black">Clientes</h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {filtered.map(client => (
            <div
              key={client.id}
              className="bg-card border border-border rounded-2xl p-5 card-interactive animate-fade-in-up"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold truncate">{client.name}</h3>
                    <Badge variant={isFiel(client) ? 'success' : 'default'}>
                      {isFiel(client) ? 'Fiel' : 'Novo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted mb-2">{client.phone}</p>
                  {client.last_visit && (
                    <p className="text-xs text-muted-dark">
                      Última visita: {formatDateShort(client.last_visit)}
                    </p>
                  )}
                  {client.observations && (
                    <div className="flex items-start gap-1.5 mt-2 text-xs text-warning bg-warning-bg border border-warning/10 rounded-lg p-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{client.observations}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(client)}
                    className="p-2 rounded-lg text-muted hover:text-foreground hover-subtle transition-all cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted hover:text-success hover:bg-success-bg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-subtle mx-auto flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-dark" />
          </div>
          <h3 className="text-lg font-bold text-muted mb-2">
            {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente ainda'}
          </h3>
          <p className="text-muted-dark text-sm">
            {search ? 'Tente outra busca.' : 'Os clientes são cadastrados automaticamente a partir dos agendamentos.'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        title="Editar Cliente"
      >
        <div className="space-y-4">
          <Input label="Nome" value={editName} onChange={e => setEditName(e.target.value)} />
          <Input label="Telefone" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
          <Input label="Observações" value={editObs} onChange={e => setEditObs(e.target.value)} placeholder="Alergias, preferências..." />
          <Button onClick={handleSave} loading={saving} className="w-full" size="lg">
            Salvar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
