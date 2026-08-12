import GitGraphDoodle from './GitGraphDoodle';
import AddRepoForm from '../AddRepoForm';

export default function PhoneAnalysisSection() {
  return (
    <section className="phone-analysis-section">
      <GitGraphDoodle variant="top-left" style={{ left: '4%', top: '5%', width: '160px' }} />
      <GitGraphDoodle variant="top-right" style={{ right: '4%', top: '15%', width: '200px' }} />
      <GitGraphDoodle variant="bottom-left" style={{ left: '8%', bottom: '5%', width: '180px' }} />
      <GitGraphDoodle variant="bottom-right" style={{ right: '8%', bottom: '10%', width: '160px' }} />

      <div className="phone-frame-v2">
        <div className="phone-notch" />
        <div className="phone-screen-v2">
          <h2 className="phone-headline">
            Intelligent<br />README<br />Analysis
          </h2>
          <p className="phone-subtext">
            Unlock actionable insights from any public GitHub repository.
            Paste the URL to begin.
          </p>

          <div className="phone-form-wrap">
            <label className="phone-form-label">Repository URL</label>
            <AddRepoForm 
              compact 
              showIcon 
              placeholder="e.g., https://github.com/user/repo-name" 
              buttonText="BEGIN ANALYSIS NOW" 
            />
          </div>

          <div className="phone-footer">
            <span>🛡 Privacy Guaranteed 🔒</span>
            <span className="phone-version">v1.2</span>
          </div>
        </div>
      </div>
    </section>
  );
}
