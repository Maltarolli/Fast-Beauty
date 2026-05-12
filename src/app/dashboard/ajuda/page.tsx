'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, Mail, MessageCircleQuestion, Sparkles, HelpCircle, Send, Copy, Check } from 'lucide-react';

const faqData = [
  {
    category: 'Primeiros Passos',
    questions: [
      {
        q: 'Como começar a usar o FastBeauty?',
        a: 'Após criar sua conta, você será redirecionado ao painel principal. Comece cadastrando seus serviços na aba "Serviços", depois adicione seus clientes em "Clientes". Pronto! Já pode agendar atendimentos pela "Agenda".'
      },
      {
        q: 'O período de teste é gratuito?',
        a: 'Sim! Você tem 15 dias gratuitos para testar todas as funcionalidades do FastBeauty sem precisar cadastrar cartão de crédito. Ao final do período, você pode escolher um plano para continuar usando.'
      },
      {
        q: 'Posso usar o FastBeauty pelo celular?',
        a: 'Sim! O FastBeauty é totalmente responsivo e funciona perfeitamente em smartphones e tablets. Basta acessar pelo navegador do seu celular.'
      },
    ],
  },
  {
    category: 'Agenda e Agendamentos',
    questions: [
      {
        q: 'Como agendar um atendimento?',
        a: 'Na aba "Agenda", clique no botão "+ Novo Agendamento". Selecione o cliente, o serviço, a data e o horário desejado. Clique em "Salvar" e pronto!'
      },
      {
        q: 'Posso cancelar ou remarcar um agendamento?',
        a: 'Sim! Clique sobre o agendamento na sua agenda. Você verá as opções de editar (para remarcar) ou excluir (para cancelar) o atendimento.'
      },
      {
        q: 'Consigo ver os agendamentos de dias anteriores?',
        a: 'Sim! Use as setas de navegação na agenda para navegar entre os dias e visualizar o histórico de atendimentos passados.'
      },
    ],
  },
  {
    category: 'Clientes',
    questions: [
      {
        q: 'Como cadastrar um novo cliente?',
        a: 'Vá até a aba "Clientes" e clique no botão "+ Novo Cliente". Preencha o nome, telefone e outras informações. Após salvar, o cliente estará disponível para agendamentos.'
      },
      {
        q: 'Posso editar os dados de um cliente?',
        a: 'Sim! Na lista de clientes, clique sobre o cliente desejado para abrir seus detalhes. Você poderá editar todas as informações cadastradas.'
      },
    ],
  },
  {
    category: 'Serviços',
    questions: [
      {
        q: 'Como adicionar um novo serviço?',
        a: 'Na aba "Serviços", clique no botão "+ Novo Serviço". Informe o nome, preço e duração do serviço. Ele ficará disponível para seleção nos agendamentos.'
      },
      {
        q: 'Posso alterar o preço de um serviço?',
        a: 'Sim! Na lista de serviços, clique sobre o serviço que deseja alterar. Edite o preço e salve. Os agendamentos futuros usarão o novo valor.'
      },
    ],
  },
  {
    category: 'Financeiro',
    questions: [
      {
        q: 'Como funciona o controle financeiro?',
        a: 'A aba "Financeiro" mostra um resumo das suas receitas e despesas. Você pode adicionar entradas e saídas manuais, além de acompanhar o faturamento gerado pelos atendimentos.'
      },
      {
        q: 'Posso gerar relatórios financeiros?',
        a: 'Sim! Na aba "Financeiro" você pode visualizar relatórios por período e exportá-los em PDF para facilitar sua gestão.'
      },
    ],
  },
  {
    category: 'Estoque',
    questions: [
      {
        q: 'Como controlar meu estoque?',
        a: 'Na aba "Estoque", cadastre seus produtos com nome, quantidade e preço de custo. O sistema mostrará alertas quando um produto estiver com estoque baixo.'
      },
      {
        q: 'Recebo alertas de estoque baixo?',
        a: 'Sim! Quando a quantidade de um produto atingir o mínimo definido, ele ficará destacado na lista de estoque para que você faça a reposição a tempo.'
      },
    ],
  },
  {
    category: 'Conta e Assinatura',
    questions: [
      {
        q: 'Como alterar minha senha?',
        a: 'Acesse seu perfil clicando no seu nome na barra lateral. Na seção "Alterar Senha", digite sua nova senha e confirme a alteração.'
      },
      {
        q: 'Como cancelar minha assinatura?',
        a: 'Acesse seu perfil e vá até a seção de assinatura. Clique em "Cancelar Plano". Você continuará tendo acesso até o fim do período já pago.'
      },
      {
        q: 'Meus dados são seguros?',
        a: 'Sim! Utilizamos criptografia de ponta e servidores seguros para proteger todos os seus dados. Nenhuma informação é compartilhada com terceiros.'
      },
    ],
  },
];

export default function AjudaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const supportEmail = 'suporte.fastbeauty@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const filteredFaq = useMemo(() => {
    if (!searchQuery.trim()) return faqData;

    const query = searchQuery.toLowerCase();
    return faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (item) =>
            item.q.toLowerCase().includes(query) ||
            item.a.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchQuery]);

  const toggleItem = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  const totalResults = filteredFaq.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-2">
          <HelpCircle className="w-4 h-4" />
          Central de Ajuda
        </div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
          Como podemos te <span className="gradient-accent-text">ajudar</span>?
        </h1>
        <p className="text-muted max-w-lg mx-auto">
          Encontre respostas rápidas para as perguntas mais frequentes ou entre em contato conosco.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Pesquise sua dúvida aqui..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder:text-muted-dark input-focus transition-all duration-200 shadow-theme text-sm lg:text-base"
        />
        {searchQuery && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="text-xs text-muted bg-card-hover px-2 py-1 rounded-lg">
              {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>
        )}
      </div>

      {/* FAQ */}
      {filteredFaq.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-4">
            <MessageCircleQuestion className="w-10 h-10 text-accent/50" />
          </div>
          <h3 className="text-lg font-bold mb-2">Nenhum resultado encontrado</h3>
          <p className="text-muted text-sm max-w-sm mx-auto">
            Não encontramos nada para &quot;{searchQuery}&quot;. Tente termos diferentes ou entre em contato conosco.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFaq.map((category, catIdx) => (
            <div key={catIdx} className="animate-fade-in-up" style={{ animationDelay: `${catIdx * 0.05}s` }}>
              {/* Category title */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <Sparkles className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-bold text-accent uppercase tracking-wider">
                  {category.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-theme divide-y divide-border">
                {category.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === key;

                  return (
                    <div key={key}>
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card-hover transition-all duration-200 cursor-pointer group"
                      >
                        <span className={`text-sm font-medium pr-4 transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-foreground group-hover:text-accent'}`}>
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-5 pb-4 pt-0">
                          <p className="text-sm text-muted leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-theme-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-lg font-bold mb-1">Ainda tem dúvidas?</h3>
            <p className="text-muted text-sm">
              Nossa equipe está pronta para te ajudar. Envie um e-mail e responderemos o mais rápido possível.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-card-hover transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-success">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-muted" />
                  <span>Copiar E-mail</span>
                </>
              )}
            </button>
            <a
              href={`mailto:${supportEmail}?subject=Dúvida%20-%20FastBeauty`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-accent text-white font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:brightness-110 transition-all duration-300 active:scale-[0.97] btn-glow shrink-0 w-full sm:w-auto justify-center"
            >
              <Send className="w-4 h-4" />
              Enviar E-mail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

