import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-600">Carregando...</p>
      </div>
    </div>
  );
}

export default Loading;