import { ChevronLeft, Smartphone, Share, Plus, MoreVertical, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InstallPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e3a5f] via-[#2a4d7a] to-[#152d4a] text-white">
        <div className="max-w-lg mx-auto px-5 pt-6 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Înapoi</span>
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Instalează aplicația</h1>
              <p className="text-slate-300 text-xs mt-0.5">Adaugă pe ecranul principal</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Poți folosi aplicația ca pe o aplicație normală, direct de pe ecranul principal al telefonului tău.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-8">
        {/* iOS Instructions */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <span className="text-xl">🍎</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">iPhone / iPad</h2>
              <p className="text-xs text-slate-400">Safari browser</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Deschide în Safari</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Asigură-te că ai deschis aplicația în browserul <strong>Safari</strong> (nu Chrome sau alt browser).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Apasă butonul de partajare</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Apasă pe iconița <strong>Partajare</strong> (pătratul cu săgeata în sus) din bara de jos a Safari-ului.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="bg-blue-50 rounded-xl p-3 inline-flex items-center gap-2 text-blue-600">
                      <Share className="w-6 h-6" />
                      <span className="text-sm font-medium">← Acest buton</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">„Adaugă pe ecranul principal"</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Derulează în jos în meniul de partajare și apasă pe <strong>„Adaugă pe ecranul principal"</strong> (Add to Home Screen).
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="bg-green-50 rounded-xl p-3 inline-flex items-center gap-2 text-green-700">
                      <Plus className="w-5 h-5" />
                      <span className="text-sm font-medium">Adaugă pe ecranul principal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d4a843] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Confirmă și gata!</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Apasă <strong>„Adaugă"</strong> în colțul din dreapta sus. Aplicația va apărea pe ecranul principal! 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Android Instructions */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Android</h2>
              <p className="text-xs text-slate-400">Chrome browser</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Deschide în Chrome</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Deschide aplicația în browserul <strong>Chrome</strong> pe telefonul tău Android.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Apasă meniul cu trei puncte</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Apasă pe cele <strong>trei puncte verticale</strong> (⋮) din colțul din dreapta sus al Chrome.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="bg-slate-100 rounded-xl p-3 inline-flex items-center gap-2 text-slate-700">
                      <MoreVertical className="w-6 h-6" />
                      <span className="text-sm font-medium">← Acest buton</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">„Adaugă pe ecranul de start"</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Din meniu, apasă pe <strong>„Adaugă pe ecranul de start"</strong> sau <strong>„Instalează aplicația"</strong>.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="bg-green-50 rounded-xl p-3 inline-flex items-center gap-2 text-green-700">
                      <Download className="w-5 h-5" />
                      <span className="text-sm font-medium">Instalează aplicația</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d4a843] text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Confirmă și gata!</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Apasă <strong>„Adaugă"</strong> sau <strong>„Instalează"</strong>. Aplicația va apărea pe ecranul principal ca o aplicație normală! 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tip */}
        <div className="bg-[#1e3a5f]/5 rounded-2xl p-5 border border-[#1e3a5f]/10">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Știai că?</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Odată adăugată pe ecranul principal, aplicația se va deschide pe ecran complet,
                exact ca o aplicație normală din App Store sau Google Play — fără bară de adresă!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-lg mx-auto px-5 pb-8 pt-4 text-center border-t border-slate-100 mt-4">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Biserica Impact Timișoara
        </p>
      </footer>
    </div>
  );
}
