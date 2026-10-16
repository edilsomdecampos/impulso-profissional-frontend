import PageHeader from '../components/PageHeader.jsx'

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="badge">ODS 8 + ODS 10</span>
        <h1>Conectando adultos a oportunidades de trabalho e capacitação</h1>
        <p>
          O Impulso Profissional é uma plataforma acadêmica criada para aproximar pessoas adultas
          de vagas e cursos de qualificação oferecidos por empresas e organizações.
        </p>
      </section>

      <PageHeader
        title="Nossa proposta"
        description="Uma solução simples para ampliar o acesso a oportunidades profissionais e reduzir desigualdades."
      />

      <div className="cards-grid">
        <article className="card">
          <h2>Problema</h2>
          <p>Muitas pessoas adultas têm dificuldade para localizar oportunidades de emprego e qualificação em um só lugar.</p>
        </article>
        <article className="card">
          <h2>Público-alvo</h2>
          <p>Pessoas com 18 anos ou mais em busca de inserção, recolocação ou desenvolvimento profissional.</p>
        </article>
        <article className="card">
          <h2>Impacto esperado</h2>
          <p>Facilitar o acesso a vagas e capacitações, fortalecendo o trabalho decente e reduzindo desigualdades de acesso.</p>
        </article>
      </div>
    </>
  )
}
