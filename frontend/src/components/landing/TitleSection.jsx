import GitGraphDoodle from './GitGraphDoodle';

export default function TitleSection() {
  return (
    <section className="title-section">
      <GitGraphDoodle variant="top-left" style={{ left: '4%', top: '5%', width: '160px' }} />
      <GitGraphDoodle variant="top-right" style={{ right: '4%', top: '15%', width: '200px' }} />
      <GitGraphDoodle variant="bottom-left" style={{ left: '8%', bottom: '5%', width: '180px' }} />
      <GitGraphDoodle variant="bottom-right" style={{ right: '8%', bottom: '10%', width: '160px' }} />
      
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
