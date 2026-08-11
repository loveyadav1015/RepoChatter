import PhoneFormScreen from './PhoneFormScreen';

export default function PhoneMockup() {
  return (
    <div className="phone-mockup">
      <div className="phone-screen relative">
        {/* Notch detail */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[var(--color-phone-frame)] rounded-b-3xl z-10" />
        
        <div className="screen-content w-full h-full pt-6">
          <PhoneFormScreen />
        </div>
      </div>
    </div>
  );
}
