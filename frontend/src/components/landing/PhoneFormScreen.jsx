import AddRepoForm from '../AddRepoForm';

export default function PhoneFormScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-2">
      <h2 className="text-lg font-serif font-bold text-[#1A1A1A] tracking-tight mb-2">Analyze Repository</h2>
      <p className="text-sm font-sans text-[#1A1A1A]/70 mb-6">Paste a GitHub repo URL to start chatting with its README.</p>
      <AddRepoForm compact />
    </div>
  );
}
