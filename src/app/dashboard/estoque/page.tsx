'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Plus, Minus, Trash2, AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, format, cn } from '@/lib/utils';
import type { Product } from '@/types/database';

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [purchaseItems, setPurchaseItems] = useState([{ name: '', quantity: '', total: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('name');
    setProducts(data || []);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = products.filter(p => p.quantity <= p.min_quantity);

  const handleConsume = async (product: Product) => {
    if (product.quantity <= 0) return;
    const supabase = createClient();
    await supabase.from('products').update({ quantity: product.quantity - 1 }).eq('id', product.id);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  const addPurchaseItem = () => {
    setPurchaseItems([...purchaseItems, { name: '', quantity: '', total: '' }]);
  };

  const updatePurchaseItem = (index: number, field: string, value: string) => {
    const items = [...purchaseItems];
    items[index] = { ...items[index], [field]: value };
    setPurchaseItems(items);
  };

  const removePurchaseItem = (index: number) => {
    if (purchaseItems.length <= 1) return;
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const handlePurchase = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const validItems = purchaseItems.filter(i => i.name && i.quantity);
    const totalAmount = validItems.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
    const itemNames = validItems.map(i => i.name).join(', ');

    // Create financial transaction
    const { data: tx } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'saida',
      title: `Compra: ${itemNames}`,
      amount: totalAmount,
      category: 'Estoque',
      transaction_date: purchaseDate,
      source: 'estoque',
    }).select('id').single();

    // Process each item
    for (const item of validItems) {
      const qty = parseInt(item.quantity) || 0;
      const total = parseFloat(item.total) || 0;
      const unitPrice = qty > 0 ? total / qty : 0;

      // Save purchase item for receipt
      if (tx) {
        await supabase.from('purchase_items').insert({
          user_id: user.id,
          transaction_id: tx.id,
          product_name: item.name,
          quantity: qty,
          unit_price: unitPrice,
          total_price: total,
          purchase_date: purchaseDate,
        });
      }

      // Update or create product
      const { data: existing } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .ilike('name', item.name)
        .single();

      if (existing) {
        await supabase.from('products').update({ quantity: existing.quantity + qty }).eq('id', existing.id);
      } else {
        await supabase.from('products').insert({
          user_id: user.id,
          name: item.name,
          quantity: qty,
          min_quantity: 2,
        });
      }
    }

    setSaving(false);
    setShowPurchase(false);
    setPurchaseItems([{ name: '', quantity: '', total: '' }]);
    loadProducts();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Estoque</h1>
        <button
          onClick={() => setShowPurchase(true)}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-accent rounded-xl hover:brightness-110 transition-all cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          Lançar Compra
        </button>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-warning-bg border border-warning/20 rounded-2xl p-4 mb-6 flex items-center gap-3 animate-fade-in-down">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
          <p className="text-sm text-warning">
            <span className="font-bold">Atenção!</span> Você tem {lowStock.length} {lowStock.length === 1 ? 'item acabando' : 'itens acabando'}.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <Input placeholder="Buscar produto..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {filtered.map(product => {
            const isLow = product.quantity <= product.min_quantity;
            return (
              <div key={product.id} className="bg-card border border-border rounded-2xl p-5 card-interactive animate-fade-in-up">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{product.name}</h3>
                      {product.brand && <span className="text-xs text-muted">({product.brand})</span>}
                    </div>
                    {product.category && (
                      <Badge variant="default" className="mb-2">{product.category}</Badge>
                    )}
                    <div className={cn(
                      'mt-2 text-2xl font-black',
                      isLow ? 'text-error' : 'text-foreground'
                    )}>
                      {product.quantity}
                      <span className="text-sm font-normal text-muted ml-1">un.</span>
                    </div>
                    {isLow && (
                      <p className="text-xs text-error mt-1">⚠ Estoque baixo</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleConsume(product)}
                      className={cn(
                        'p-2 rounded-lg transition-all cursor-pointer',
                        product.quantity > 0
                          ? 'text-foreground bg-subtle hover:bg-accent/10 hover:text-accent'
                          : 'text-muted-dark opacity-50 cursor-not-allowed'
                      )}
                      disabled={product.quantity <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-subtle mx-auto flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-dark" />
          </div>
          <h3 className="text-lg font-bold text-muted mb-2">Estoque vazio</h3>
          <p className="text-muted-dark text-sm mb-4">Lance sua primeira compra para começar a controlar o estoque.</p>
          <button onClick={() => setShowPurchase(true)} className="text-sm text-accent font-semibold cursor-pointer">+ Lançar Compra</button>
        </div>
      )}

      {/* FAB mobile */}
      <button
        onClick={() => setShowPurchase(true)}
        className="sm:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full gradient-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:brightness-110 active:scale-90 transition-all cursor-pointer"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>

      {/* Purchase Modal */}
      <Modal isOpen={showPurchase} onClose={() => setShowPurchase(false)} title="Lançar Compra" size="lg">
        <div className="space-y-4">
          <Input label="Data da compra" type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />

          <div className="space-y-3">
            <label className="text-sm font-medium">Itens da compra</label>
            {purchaseItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-end animate-fade-in-up">
                <div className="flex-1">
                  <Input placeholder="Produto" value={item.name} onChange={e => updatePurchaseItem(index, 'name', e.target.value)} />
                </div>
                <div className="w-20">
                  <Input placeholder="Qtd" type="number" value={item.quantity} onChange={e => updatePurchaseItem(index, 'quantity', e.target.value)} />
                </div>
                <div className="w-28">
                  <Input placeholder="Total R$" type="number" step="0.01" value={item.total} onChange={e => updatePurchaseItem(index, 'total', e.target.value)} />
                </div>
                {purchaseItems.length > 1 && (
                  <button onClick={() => removePurchaseItem(index)} className="p-2 rounded-lg text-muted hover:text-error transition-all cursor-pointer mb-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addPurchaseItem} className="text-sm text-accent font-semibold cursor-pointer">+ Adicionar item</button>
          </div>

          <div className="bg-background border border-border rounded-xl p-3 text-right">
            <span className="text-sm text-muted">Total: </span>
            <span className="text-lg font-bold">
              {formatCurrency(purchaseItems.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0))}
            </span>
          </div>

          <Button onClick={handlePurchase} loading={saving} className="w-full" size="lg">
            Salvar Compra
          </Button>
        </div>
      </Modal>
    </div>
  );
}
