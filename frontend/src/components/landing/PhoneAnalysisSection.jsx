import GitGraphDoodle from './GitGraphDoodle';
import AddRepoForm from '../AddRepoForm';
import MagneticWrapper from '../MagneticWrapper';

export default function PhoneAnalysisSection() {
  return (
    <section className="phone-analysis-section">
      <GitGraphDoodle variant="top-left" style={{ left: '4%', top: '5%', width: '160px' }} />
      <GitGraphDoodle variant="top-right" style={{ right: '4%', top: '15%', width: '200px' }} />
      <GitGraphDoodle variant="bottom-left" style={{ left: '8%', bottom: '5%', width: '180px' }} />
      <GitGraphDoodle variant="bottom-right" style={{ right: '8%', bottom: '10%', width: '160px' }} />

      <MagneticWrapper strength={30} radius={400} className="relative z-20">
        <div className="phone-frame-v2">
          <div className="phone-notch" />
          <div className="phone-screen-v2">
          <MagneticWrapper strength={15}>
            <h2 className="phone-headline m-0 mt-8 mb-4">
              Intelligent<br />README<br />Analysis
            </h2>
          </MagneticWrapper>
          <MagneticWrapper strength={15}>
            <p className="phone-subtext m-0 mb-8">
              Unlock actionable insights from any public GitHub repository.
              Paste the URL to begin.
            </p>
          </MagneticWrapper>

          <div className="phone-form-wrap">
            <MagneticWrapper strength={10}>
              <label className="phone-form-label block m-0 mb-2">Repository URL</label>
            </MagneticWrapper>
            <MagneticWrapper strength={15} className="w-full">
              <AddRepoForm 
                compact 
                showIcon 
                placeholder="e.g., https://github.com/user/repo-name" 
                buttonText="BEGIN ANALYSIS NOW" 
              />
            </MagneticWrapper>
          </div>

          <div className="phone-footer">
            <MagneticWrapper strength={10}>
              <span>🛡 Privacy Guaranteed 🔒</span>
            </MagneticWrapper>
            <MagneticWrapper strength={5}>
              <span className="phone-version">v1.2</span>
            </MagneticWrapper>
          </div>
        </div>
      </div>
      </MagneticWrapper>
    </section>
  );
}
