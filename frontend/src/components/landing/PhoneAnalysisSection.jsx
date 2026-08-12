import GitGraphDoodle from './GitGraphDoodle';
import AddRepoForm from '../AddRepoForm';

export default function PhoneAnalysisSection() {
  return (
    <section className="phone-analysis-section">
      <GitGraphDoodle style={{ position: 'absolute', left: '5%', top: '20%', width: '180px' }} />
      <GitGraphDoodle style={{ position: 'absolute', right: '5%', top: '20%', width: '180px' }} flipped />

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
