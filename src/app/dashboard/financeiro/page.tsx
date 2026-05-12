'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Eye, EyeOff, Plus, FileText, Trash2, Settings, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, format, addMonths, subMonths, addDays, cn } from '@/lib/utils';
import type { Transaction, FixedRule, PurchaseItem } from '@/types/database';

type Period = 'day' | 'month' | 'year';

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showValues, setShowValues] = useState(true);
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [showFixedRules, setShowFixedRules] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptItems, setReceiptItems] = useState<PurchaseItem[]>([]);
  const [receiptTitle, setReceiptTitle] = useState('');

  // New transaction form
  const [txType, setTxType] = useState<'entrada' | 'saida'>('saida');
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [txDate, setTxDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [txSaving, setTxSaving] = useState(false);

  // Fixed rules
  const [fixedRules, setFixedRules] = useState<FixedRule[]>([]);
  const [frTitle, setFrTitle] = useState('');
  const [frAmount, setFrAmount] = useState('');
  const [frCategory, setFrCategory] = useState('');
  const [frDay, setFrDay] = useState('');
  const [frSaving, setFrSaving] = useState(false);

  const getDateRange = useCallback(() => {
    if (period === 'day') {
      const d = format(currentDate, 'yyyy-MM-dd');
      return { start: d, end: d };
    }
    if (period === 'month') {
      const start = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), 'yyyy-MM-dd');
      const end = format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), 'yyyy-MM-dd');
      return { start, end };
    }
    const start = `${currentDate.getFullYear()}-01-01`;
    const end = `${currentDate.getFullYear()}-12-31`;
    return { start, end };
  }, [currentDate, period]);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { start, end } = getDateRange();

    // Load transactions
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('transaction_date', start)
      .lte('transaction_date', end)
      .order('transaction_date', { ascending: false });
    setTransactions(data || []);

    // Load fixed rules
    const { data: rules } = await supabase.from('fixed_rules').select('*').eq('user_id', user.id).order('day_of_month');
    setFixedRules(rules || []);

    // Auto-generate fixed rule transactions for current month
    if (period === 'month') {
      const today = new Date();
      const currentDay = today.getDate();
      for (const rule of (rules || [])) {
        if (rule.day_of_month <= currentDay) {
          const ruleDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), rule.day_of_month), 'yyyy-MM-dd');
          
          // Check if already exists
          const { data: existing } = await supabase
            .from('transactions')
            .select('id')
            .eq('user_id', user.id)
            .eq('source', 'fixo')
            .eq('source_id', rule.id)
            .eq('transaction_date', ruleDate)
            .single();

          if (!existing) {
            await supabase.from('transactions').insert({
              user_id: user.id,
              type: 'saida',
              title: rule.title,
              amount: rule.amount,
              category: rule.category,
              transaction_date: ruleDate,
              source: 'fixo',
              source_id: rule.id,
            });
          }
        }
      }

      // Reload after potential inserts
      const { data: refreshed } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('transaction_date', start)
        .lte('transaction_date', end)
        .order('transaction_date', { ascending: false });
      setTransactions(refreshed || []);
    }
  }, [getDateRange, currentDate, period]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalEntradas = transactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0);
  const totalSaidas = transactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalEntradas - totalSaidas;

  const navigatePeriod = (direction: -1 | 1) => {
    if (period === 'day') setCurrentDate(addDays(currentDate, direction));
    else if (period === 'month') setCurrentDate(direction === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    else setCurrentDate(new Date(currentDate.getFullYear() + direction, 0, 1));
  };

  const periodLabel = () => {
    if (period === 'day') return format(currentDate, 'dd/MM/yyyy');
    if (period === 'month') return format(currentDate, 'MMMM yyyy');
    return currentDate.getFullYear().toString();
  };

  const handleNewTransaction = async () => {
    setTxSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('transactions').insert({
      user_id: user.id,
      type: txType,
      title: txTitle,
      amount: parseFloat(txAmount) || 0,
      category: txCategory || 'Outros',
      transaction_date: txDate,
      source: 'manual',
    });

    setTxSaving(false);
    setShowNewTransaction(false);
    setTxTitle(''); setTxAmount(''); setTxCategory('');
    loadData();
  };

  const handleDeleteTransaction = async (tx: Transaction) => {
    if (tx.source === 'agenda') {
      alert('Para apagar, vá na Agenda e retire o status Pago.');
      return;
    }
    if (!confirm('Excluir este lançamento?')) return;
    const supabase = createClient();
    await supabase.from('transactions').delete().eq('id', tx.id);
    loadData();
  };

  const handleAddFixedRule = async () => {
    setFrSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('fixed_rules').insert({
      user_id: user.id,
      title: frTitle,
      amount: parseFloat(frAmount) || 0,
      category: frCategory || 'Fixo',
      day_of_month: parseInt(frDay) || 1,
    });

    setFrSaving(false);
    setFrTitle(''); setFrAmount(''); setFrCategory(''); setFrDay('');
    loadData();
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Excluir esta regra?')) return;
    const supabase = createClient();
    await supabase.from('fixed_rules').delete().eq('id', id);
    loadData();
  };

  const openReceipt = async (tx: Transaction) => {
    if (tx.source !== 'estoque') return;
    const supabase = createClient();
    const { data } = await supabase
      .from('purchase_items')
      .select('*')
      .eq('transaction_id', tx.id);
    setReceiptItems(data || []);
    setReceiptTitle(tx.title);
    setShowReceipt(true);
  };

  const generatePDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('FastBeauty - Relatório Financeiro', 14, 22);
    doc.setFontSize(11);
    doc.text(`Período: ${periodLabel()}`, 14, 32);
    doc.text(`Saldo: ${formatCurrency(saldo)}`, 14, 40);
    doc.text(`Entradas: ${formatCurrency(totalEntradas)}  |  Saídas: ${formatCurrency(totalSaidas)}`, 14, 48);

    autoTable(doc, {
      startY: 56,
      head: [['Data', 'Tipo', 'Título', 'Categoria', 'Valor']],
      body: transactions.map(t => [
        format(new Date(t.transaction_date + 'T12:00:00'), 'dd/MM/yyyy'),
        t.type === 'entrada' ? 'Entrada' : 'Saída',
        t.title,
        t.category,
        (t.type === 'entrada' ? '+' : '-') + formatCurrency(t.amount),
      ]),
    });

    doc.save(`fastbeauty-financeiro-${periodLabel()}.pdf`);
  };

  const sourceLabel = (source: string) => {
    const labels: Record<string, string> = { agenda: 'AGENDA', manual: 'MANUAL', estoque: 'ESTOQUE', fixo: 'FIXO' };
    return labels[source] || source.toUpperCase();
  };

  const sourceBadge = (source: string) => {
    const variants: Record<string, 'accent' | 'default' | 'warning' | 'info'> = { agenda: 'accent', manual: 'default', estoque: 'warning', fixo: 'info' };
    return variants[source] || 'default';
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-black mb-6">Financeiro</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex bg-card border border-border rounded-xl overflow-hidden">
          {(['day', 'month', 'year'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-all cursor-pointer',
                period === p ? 'gradient-accent text-white' : 'text-muted hover:text-foreground'
              )}
            >
              {p === 'day' ? 'Dia' : p === 'month' ? 'Mês' : 'Ano'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigatePeriod(-1)} className="p-2 rounded-lg text-muted hover:text-foreground hover-subtle transition-all cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold min-w-[140px] text-center capitalize">{periodLabel()}</span>
          <button onClick={() => navigatePeriod(1)} className="p-2 rounded-lg text-muted hover:text-foreground hover-subtle transition-all cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setShowFixedRules(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-card border border-border rounded-xl text-muted hover:text-foreground hover:bg-card-hover transition-all sm:ml-auto cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          Regras Fixas
        </button>
      </div>

      {/* Balance Card */}
      <div className="gradient-accent rounded-3xl p-6 mb-6 text-white animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium opacity-80">Saldo do período</span>
          <button onClick={() => setShowValues(!showValues)} className="p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer">
            {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        <div className="text-3xl sm:text-4xl font-black mb-4">
          {showValues ? formatCurrency(saldo) : 'R$ ••••'}
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-1.5 opacity-90">
            <TrendingUp className="w-4 h-4" />
            {showValues ? formatCurrency(totalEntradas) : '••••'}
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <TrendingDown className="w-4 h-4" />
            {showValues ? formatCurrency(totalSaidas) : '••••'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <Button variant="secondary" onClick={generatePDF} size="sm">
          <FileText className="w-4 h-4" /> PDF
        </Button>
        <Button onClick={() => setShowNewTransaction(true)} size="sm">
          <Plus className="w-4 h-4" /> Lançar Gasto
        </Button>
      </div>

      {/* Transactions list */}
      <div className="space-y-2 stagger-children">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className={cn(
              'bg-card border border-border rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up transition-all',
              tx.source === 'estoque' && 'cursor-pointer hover:border-border-light'
            )}
            onClick={() => tx.source === 'estoque' && openReceipt(tx)}
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              tx.type === 'entrada' ? 'bg-success-bg' : 'bg-error-bg'
            )}>
              {tx.type === 'entrada' ? <TrendingUp className="w-5 h-5 text-success" /> : <TrendingDown className="w-5 h-5 text-error" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate">{tx.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted">{format(new Date(tx.transaction_date + 'T12:00:00'), 'dd/MM')}</span>
                <Badge variant={sourceBadge(tx.source)}>{sourceLabel(tx.source)}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn('text-sm font-bold', tx.type === 'entrada' ? 'text-success' : 'text-error')}>
                {tx.type === 'entrada' ? '+' : '-'}{showValues ? formatCurrency(tx.amount) : '••••'}
              </span>
              {tx.source !== 'agenda' && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteTransaction(tx); }}
                  className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-subtle mx-auto flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-muted-dark" />
            </div>
            <h3 className="text-lg font-bold text-muted mb-2">Nenhum lançamento</h3>
            <p className="text-muted-dark text-sm">Não há movimentações neste período.</p>
          </div>
        )}
      </div>

      {/* New Transaction Modal */}
      <Modal isOpen={showNewTransaction} onClose={() => setShowNewTransaction(false)} title="Lançar Transação">
        <div className="space-y-4">
          <div className="flex bg-background border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setTxType('entrada')}
              className={cn('flex-1 py-3 text-sm font-semibold transition-all cursor-pointer', txType === 'entrada' ? 'bg-success-bg text-success' : 'text-muted')}
            >
              Entrada
            </button>
            <button
              onClick={() => setTxType('saida')}
              className={cn('flex-1 py-3 text-sm font-semibold transition-all cursor-pointer', txType === 'saida' ? 'bg-error-bg text-error' : 'text-muted')}
            >
              Saída
            </button>
          </div>
          <Input label="Título" placeholder="Ex: Aluguel" value={txTitle} onChange={e => setTxTitle(e.target.value)} required />
          <Input label="Valor (R$)" type="number" step="0.01" value={txAmount} onChange={e => setTxAmount(e.target.value)} required />
          <Input label="Categoria" placeholder="Ex: Material, Aluguel..." value={txCategory} onChange={e => setTxCategory(e.target.value)} />
          <Input label="Data" type="date" value={txDate} onChange={e => setTxDate(e.target.value)} required />
          <Button onClick={handleNewTransaction} loading={txSaving} className="w-full" size="lg">
            Salvar Lançamento
          </Button>
        </div>
      </Modal>

      {/* Fixed Rules Modal */}
      <Modal isOpen={showFixedRules} onClose={() => setShowFixedRules(false)} title="Regras de Gastos Fixos" size="lg">
        <div className="space-y-4">
          {fixedRules.length > 0 && (
            <div className="space-y-2 mb-6">
              {fixedRules.map(rule => (
                <div key={rule.id} className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">{rule.title}</h3>
                    <p className="text-xs text-muted">Dia {rule.day_of_month} — {rule.category} — {formatCurrency(rule.amount)}</p>
                  </div>
                  <button onClick={() => handleDeleteRule(rule.id)} className="p-2 rounded-lg text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-4 space-y-3">
            <h3 className="text-sm font-bold">Adicionar nova regra</h3>
            <Input label="Título" placeholder="Ex: Aluguel" value={frTitle} onChange={e => setFrTitle(e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Valor (R$)" type="number" step="0.01" value={frAmount} onChange={e => setFrAmount(e.target.value)} />
              <Input label="Categoria" placeholder="Fixo" value={frCategory} onChange={e => setFrCategory(e.target.value)} />
              <Input label="Dia do mês" type="number" min="1" max="31" value={frDay} onChange={e => setFrDay(e.target.value)} />
            </div>
            <Button onClick={handleAddFixedRule} loading={frSaving} className="w-full">
              Adicionar Regra
            </Button>
          </div>
        </div>
      </Modal>

      {/* Receipt Modal */}
      <Modal isOpen={showReceipt} onClose={() => setShowReceipt(false)} title={`Recibo — ${receiptTitle}`}>
        <div className="space-y-3">
          {receiptItems.map(item => (
            <div key={item.id} className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">{item.product_name}</h4>
                <p className="text-xs text-muted">{item.quantity}x — {formatCurrency(item.unit_price)} cada</p>
              </div>
              <span className="text-sm font-bold">{formatCurrency(item.total_price)}</span>
            </div>
          ))}
          {receiptItems.length === 0 && (
            <p className="text-center text-muted text-sm py-4">Nenhum item encontrado.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
