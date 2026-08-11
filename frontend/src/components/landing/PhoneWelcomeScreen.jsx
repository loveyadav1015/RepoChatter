export default function PhoneWelcomeScreen({ onSkip }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer select-none" onClick={onSkip}>
      <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] mb-8 flex items-center justify-center shadow-lg relative overflow-hidden">
        {/* Simple geometric icon representing the app */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"></div>
        <div className="w-6 h-6 border-2 border-white rounded-md"></div>
      </div>
      <h2 className="text-xl font-serif font-bold text-[#1A1A1A] tracking-tight mb-2">Welcome to<br />Repo Chatter</h2>
      <p className="text-sm font-sans text-[#1A1A1A]/60">Tap to continue</p>
    </div>
  );
}
