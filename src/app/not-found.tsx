export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-extrabold mb-4">404 - Página não encontrada</h1>
      <p className="text-slate-300 text-lg mb-6">A página que você está procurando não existe.</p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded-2xl transition-all"
      >
        Voltar para a Página Inicial
      </a>
    </div>
  );
}
