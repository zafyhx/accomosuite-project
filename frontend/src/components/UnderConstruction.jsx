import { Settings, Wrench } from "lucide-react";

const UnderConstruction = ({ pageName = "Halaman Ini" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-gray-700 p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in-up">
      <div className="flex items-center space-x-4 mb-6">
        <Wrench size={48} className="text-primary-dark animate-bounce-slow" />
        <Settings size={48} className="text-primary animate-spin-slow" />
      </div>
      <h2 className="text-3xl font-bold mb-3 text-secondary text-center">
        {pageName} Sedang Dalam Pengembangan!
      </h2>
      <p className="text-lg text-center max-w-2xl leading-relaxed">
        Mohon maaf atas ketidaknyamanannya. Kami sedang bekerja keras untuk
        menyempurnakan fitur ini agar pengalaman Anda menjadi lebih baik.
      </p>
      <p className="mt-4 text-md text-gray-500 text-center">
        Silakan kembali lagi nanti, atau jelajahi fitur lain yang sudah
        tersedia.
      </p>
      <div className="mt-8 text-sm text-gray-400">
        <span className="font-mono">Accomosuite</span> © 2025
      </div>
    </div>
  );
};

export default UnderConstruction;
