'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft, ShieldCheck, CreditCard, CloudLightning, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen px-4 py-12 md:py-20 relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-dark/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
              <Sparkles className="w-6 h-6 text-accent transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-2xl font-black tracking-tight">
                Fast<span className="gradient-accent-text">Beauty</span>.
              </span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Termos de Uso e <span className="gradient-accent-text">Políticas</span>
            </h1>
            <p className="text-muted text-sm mt-1">Última atualização: 9 de junho de 2026</p>
          </div>
          <Link href="/cadastro">
            <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Voltar para o Cadastro
            </Button>
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-theme-lg space-y-8 text-foreground/90 leading-relaxed text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
              <span className="w-1.5 h-6 rounded-full gradient-accent" />
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao criar uma conta ou utilizar os serviços do <strong>FastBeauty</strong>, você declara ter lido, compreendido e aceitado todos os termos e condições descritos neste documento. Caso não concorde com qualquer parte destes termos, você não deve utilizar o sistema.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
              <span className="w-1.5 h-6 rounded-full gradient-accent" />
              2. Descrição do Serviço
            </h2>
            <p>
              O <strong>FastBeauty</strong> é um software de gestão de agendamentos, serviços, clientes e financeiro sob o modelo de SaaS (Software as a Service) voltado para estabelecimentos do ramo da beleza. O sistema é disponibilizado &ldquo;como está&rdquo; (as is) e &ldquo;conforme disponibilidade&rdquo; (as available).
            </p>
          </section>

          <section className="bg-error-bg/30 border border-error/15 rounded-2xl p-5 md:p-6 space-y-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-error">
              <Database className="w-5 h-5" />
              3. Isenção de Responsabilidade sobre Dados e Segurança
            </h2>
            <p className="text-foreground/95">
              O <strong>FastBeauty</strong> atua apenas como fornecedor de ferramentas de tecnologia. O usuário é o <strong>único e exclusivo responsável</strong> por todos os dados inseridos no sistema, incluindo dados cadastrais, informações de clientes, históricos de agendamentos e registros de fluxo de caixa.
            </p>
            <p className="text-foreground/95 font-medium">
              Por meio deste termo, o usuário declara e concorda que a plataforma e seus desenvolvedores estão integralmente isentos de responsabilidade por:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/90">
              <li>Qualquer exclusão acidental, perda, corrupção, alteração indesejada ou impossibilidade de acesso a dados armazenados na plataforma.</li>
              <li>Acessos não autorizados causados por vazamento de credenciais do usuário (como compartilhamento ou uso de senhas fracas).</li>
              <li>Ações de invasão, ataques cibernéticos ou incidentes de segurança de terceiros que fujam do controle razoável de segurança da plataforma.</li>
              <li>Incorreções ou inconsistências nos dados inseridos, sendo o usuário responsável por verificar a exatidão das informações financeiras e de cadastro.</li>
            </ul>
          </section>

          <section className="bg-info-bg/30 border border-info/15 rounded-2xl p-5 md:p-6 space-y-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-info">
              <CreditCard className="w-5 h-5" />
              4. Processamento de Pagamentos e Stripe
            </h2>
            <p className="text-foreground/95">
              Toda e qualquer transação financeira realizada para assinatura ou uso do <strong>FastBeauty</strong> é intermediada pelo gateway de pagamento <strong>Stripe</strong>.
            </p>
            <p className="text-foreground/95 font-medium">
              A este respeito, aplicam-se as seguintes condições:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/90">
              <li><strong>Nós não armazenamos nem processamos nenhum dado de cartão de crédito</strong> em nossos servidores. Todos os dados de pagamento (como número do cartão, data de validade e CVV) são enviados diretamente e tratados de forma segura pela Stripe.</li>
              <li>A Stripe é a única responsável pela segurança das transações de pagamento e conformidade com os padrões da indústria (PCI-DSS).</li>
              <li>Não nos responsabilizamos por falhas, recusas de pagamento, cobranças indevidas geradas por erros do gateway ou vazamentos de dados que ocorram no ambiente da Stripe.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
              <span className="w-1.5 h-6 rounded-full gradient-accent" />
              5. LGPD (Lei Geral de Proteção de Dados)
            </h2>
            <p>
              Ao utilizar o sistema para cadastrar informações de seus clientes finais (consumidores do salão/clínica), o usuário reconhece e concorda que assume a posição de <strong>Controlador</strong> dos dados pessoais nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
            <p>
              O <strong>FastBeauty</strong> atua estritamente como <strong>Operador</strong> de dados pessoais sob as instruções do usuário. Cabe unicamente ao usuário (Controlador) obter o devido consentimento de seus clientes, atender às solicitações de direitos dos titulares de dados e assegurar as boas práticas legais no tratamento dessas informações.
            </p>
          </section>

          <section className="bg-warning-bg/20 border border-warning/15 rounded-2xl p-5 md:p-6 space-y-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-warning-dark dark:text-warning">
              <CloudLightning className="w-5 h-5" />
              6. Backups e Indisponibilidade
            </h2>
            <p className="text-foreground/95">
              Embora o <strong>FastBeauty</strong> empregue esforços técnicos para manter a estabilidade do sistema, não há garantia de uptime ininterrupto ou isento de instabilidades temporárias.
            </p>
            <p className="text-foreground/95">
              Recomenda-se fortemente que o usuário mantenha registros externos e cópias de segurança (backups) de suas informações comerciais. A plataforma não se responsabiliza por lucros cessantes, perdas financeiras ou interrupções comerciais geradas pelo período em que o sistema estiver fora do ar ou por eventuais falhas nos servidores de banco de dados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
              <span className="w-1.5 h-6 rounded-full gradient-accent" />
              7. Modificações nos Termos
            </h2>
            <p>
              Reservamo-nos o direito de alterar estes termos a qualquer momento, visando melhorias operacionais ou adequações jurídicas. Qualquer alteração importante será comunicada na plataforma. O uso contínuo dos serviços após as alterações constitui aceitação tácita dos novos termos.
            </p>
          </section>

          <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted text-xs text-center md:text-left">
              FastBeauty © 2026. Todos os direitos reservados.
            </p>
            <Link href="/cadastro">
              <Button className="gradient-accent hover:brightness-105 text-white font-semibold shadow-md">
                Aceitar e Voltar ao Cadastro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
