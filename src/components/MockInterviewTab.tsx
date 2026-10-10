import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { AnswerEvaluationResult } from '../types';

interface MockInterviewTabProps {
  selectedQuestion: string;
  setSelectedQuestion: (q: string) => void;
  interviewerTitle: string;
  targetRole: string;
}

export const MockInterviewTab: React.FC<MockInterviewTabProps> = ({
  selectedQuestion,
  setSelectedQuestion,
  interviewerTitle,
  targetRole,
}) => {
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Speech recognition support
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tarayıcınız sesle yazmayı desteklemiyor. Lütfen cevabınızı metin olarak girin.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCandidateAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedQuestion.trim() || !candidateAnswer.trim()) {
      setError('Lütfen bir mülakat sorusu ve yanıtınızı girin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion,
          candidateAnswer,
          interviewerTitle: interviewerTitle || 'Görüşmeci',
          targetRole: targetRole || 'Aday Pozisyonu',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Değerlendirme yapılamadı.');
      }

      const data: AnswerEvaluationResult = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Cevabınız değerlendirilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyImprovedAnswer = () => {
    if (evaluation?.improvedVersion) {
      navigator.clipboard.writeText(evaluation.improvedVersion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            Canlı Mülakat Prova Masası & Puanlama
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Yanıtınızı Test Edin, STAR Analizi ve Puan Alın
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Karşınızdaki <span className="text-amber-300 font-semibold">{interviewerTitle || 'Görüşmeci'}</span> unvanına özel bir soru seçin ve kendi cevabınızı yazın. AI koç cevabınızı STAR metodolojisi ve ikna kabiliyeti açısından 100 üzerinden puanlasın, güçlü yönlerinizi ve daha etkileyici bir revizyonunu sunsun.
          </p>
        </div>
      </div>

      {/* Practice Desk Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Mülakat Sorusu *
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Görüşmeci: <strong>{interviewerTitle || 'Belirtilmedi'}</strong>
            </span>
          </label>
          <input
            type="text"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            placeholder="Örn: Geçmişte yaşadığınız en büyük teknik krizi ve nasıl çözdüğünüzü anlatır mısınız?"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Sizin Cevabınız * (Mülakatta söyleyeceğiniz gibi samimi ve detaylı aktarın)
            </label>
            <button
              type="button"
              onClick={startListening}
              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>Dinleniyor... Konuşun</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sesle Dikte Et</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={6}
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            placeholder="Örn: Önceki projemizde veritabanı yanıt süreleri 4 saniyeye çıkmıştı. Ben durumu inceleyip N+1 sorgu problemini tespit ettim. İndeksleme ve redis önbellekleme uygulayarak süreyi 120ms'ye düşürdüm ve müşteri şikayetlerini sıfırladık..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            required
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
            <span>İpucu: Durumu (Situation), Görevinizi (Task), Aksiyonunuzu (Action) ve Somut Sonucu (Result) belirtmeye çalışın.</span>
            <span>{candidateAnswer.length} karakter</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setCandidateAnswer('');
              setEvaluation(null);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isLoading || !selectedQuestion.trim() || !candidateAnswer.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Görüşmeci Perspektifinde Puanlanıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Cevabımı Puanla & Değerlendir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score Header Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                  Mülakat Performans Skoru
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {evaluation.ratingLabel}
                </h3>
                <p className="text-xs text-slate-400">
                  Değerlendiren Filtre: "{interviewerTitle}" Unvanı Bakış Açısı
                </p>
              </div>

              {/* Big Score Badge */}
              <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700">
                <Award className={`w-8 h-8 ${evaluation.score >= 80 ? 'text-emerald-400' : evaluation.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`} />
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">
                    {evaluation.score}<span className="text-sm font-normal text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Toplam Puan</span>
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {/* Strengths */}
              <div className="bg-slate-850 rounded-xl p-5 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Cevabınızın Güçlü Yönleri
                </h4>
                <ul className="space-y-2">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Areas */}
              <div className="bg-slate-850 rounded-xl p-5 border border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Geliştirilmesi Gereken Noktalar
                </h4>
                <ul className="space-y-2">
                  {evaluation.improvementAreas.map((imp, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* STAR Breakdown Grid */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                STAR Metodolojisi Uyum Haritası
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase">S - Durum (Situation)</span>
                  <p className="text-slate-300">{evaluation.starAnalysis.situation}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">T - Görev (Task)</span>
                  <p className="text-slate-300">{evaluation.starAnalysis.task}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">A - Aksiyon (Action)</span>
                  <p className="text-slate-300">{evaluation.starAnalysis.action}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">R - Sonuç (Result)</span>
                  <p className="text-slate-300">{evaluation.starAnalysis.result}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Improved Answer (Executive Polish) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Mükemmelleştirilmiş Versiyon
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  Görüşmeciyi Etkileyecek Şekilde Revize Edilmiş Örnek Cevabınız
                </h4>
              </div>
              <button
                type="button"
                onClick={copyImprovedAnswer}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Cevabı Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line italic">
              "{evaluation.improvedVersion}"
            </div>

            {/* Coach Tip */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Acente Koçunun Altın Tavsiyesi: </span>
                {evaluation.coachTip}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
