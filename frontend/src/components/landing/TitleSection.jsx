export default function TitleSection() {
  return (
    <section className="title-section">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-none">
        <h1 className="hero-title mb-6">
          Repo Chatter
        </h1>
        <p className="hero-subtitle">
          Ask questions about any GitHub repository and get<br className="hidden md:block" />
          answers grounded in its README.
        </p>
      </div>
    </section>
  );
}
