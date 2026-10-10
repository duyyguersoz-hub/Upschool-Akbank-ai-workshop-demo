import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  PlayCircle,
  Copy,
  Check,
  Building,
  UserCheck
} from 'lucide-react';
import { InterviewPlanResult, InterviewQuestion } from '../types';
import { POPULAR_INTERVIEWER_ROLES } from '../data/sampleProfiles';

interface InterviewCoachTabProps {
  interviewPlan: InterviewPlanResult | null;
  setInterviewPlan: (plan: InterviewPlanResult | null) => void;
  onSelectQuestionForMock: (question: string, interviewerTitle: string, targetRole: string) => void;
  savedInterviewerTitle: string;
  setSavedInterviewerTitle: (title: string) => void;
  savedTargetRole: string;
  setSavedTargetRole: (role: string) => void;
}

export const InterviewCoachTab: React.FC<InterviewCoachTabProps> = ({
  interviewPlan,
  setInterviewPlan,
  onSelectQuestionForMock,
  savedInterviewerTitle,
  setSavedInterviewerTitle,
  savedTargetRole,
  setSavedTargetRole,
}) => {
  const [interviewerTitle, setInterviewerTitle] = useState(savedInterviewerTitle || 'Teknolojiden Sorumlu Başkan (CTO)');
  const [targetRole, setTargetRole] = useState(savedTargetRole || 'Kıdemli Yazılım Mühendisi / Tech Lead');
  const [industry, setIndustry] = useState('B2B SaaS / Finansal Teknolojiler (Scale-up)');
  const [experienceLevel, setExperienceLevel] = useState('Senior (5+ Yıl)');
  const [companyNotes, setCompanyNotes] = useState('Hızlı büyüyen bir scale-up şirketi. Dağıtık sistemler, yüksek trafik ve mühendislik kalitesine odaklanıyorlar.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!interviewerTitle.trim() || !targetRole.trim()) {
      setError('Lütfen görüşmecinin unvanını ve hedeflediğiniz pozisyonu belirtin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Sync to parent
    setSavedInterviewerTitle(interviewerTitle);
    setSavedTargetRole(targetRole);

    try {
      const res = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          targetRole,
          industry,
          experienceLevel,
          companyNotes,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Sorular üretilemedi.');
      }

      const data: InterviewPlanResult = await res.json();
      setInterviewPlan(data);
      if (data.questions && data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Mülakat stratejisi oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            Unvan Odaklı Mülakat Simülasyonu
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Görüşmecinizin Unvanına Göre Özel Soru ve Strateji Üretimi
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Mülakatta karşınızdaki kişinin unvanı (İK Direktörü, CTO, CEO, Ürün Yöneticisi vb.) soruların dilini, ölçülen kriterleri ve beklentileri tamamen değiştirir. Unvanı girin; potansiyel soruları, arkasındaki gizli niyeti ve ideal cevap stratejisini anında görün.
          </p>
        </div>
      </div>

      {/* Form Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <span>Görüşme Parametrelerini Tanımlayın</span>
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Görüşmeyi gerçekleştirecek kişinin unvanını seçin veya doğrudan yazın.
        </p>

        {/* Quick Title Selection Pills */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Hızlı Unvan Şablonları (Tek Tıkla Seç)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {POPULAR_INTERVIEWER_ROLES.map((role, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInterviewerTitle(role.title)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  interviewerTitle === role.title
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{role.title}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    {role.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{role.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Custom Interviewer Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Görüşmecinin Unvanı / Rolü *
              </label>
              <input
                type="text"
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: İK Direktörü, CTO, Senior Lead Engineer, CEO..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                İster yukarıdaki şablonlardan seçin, ister şirketteki özel unvanı yazın.
              </p>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Başvurduğunuz Pozisyon *
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Senior Frontend Developer, Finansal Analist, Ürün Yöneticisi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Industry & Company Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Sektör / Şirket Türü
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Örn: Fintech Scale-up, Kurumsal Bankacılık, E-Ticaret, Ajans..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Deneyim Seviyeniz
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="Junior / Yeni Mezun (0-2 Yıl)">Junior / Yeni Mezun (0-2 Yıl)</option>
                <option value="Mid-Level (2-5 Yıl)">Mid-Level (2-5 Yıl)</option>
                <option value="Senior (5-8 Yıl)">Senior (5-8 Yıl)</option>
                <option value="Team Lead / Manager (8+ Yıl)">Team Lead / Manager (8+ Yıl)</option>
                <option value="Executive / Direktör (10+ Yıl)">Executive / Direktör (10+ Yıl)</option>
              </select>
            </div>
          </div>

          {/* Additional Company Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Görüşme ve Şirket Notları (Opsiyonel)
            </label>
            <textarea
              rows={2}
              value={companyNotes}
              onChange={(e) => setCompanyNotes(e.target.value)}
              placeholder="Görüşme kaçıncı aşama? İlanda özellikle vurgulanan bir teknoloji veya şirket kültürü detayı var mı?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unvan Analizi Yapılıyor & Sorular Üretiliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Görüşmeci Sorularını & Stratejisini Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {interviewPlan && (
        <div className="space-y-8 animate-fadeIn">
          {/* Section 1: Interviewer Mindset / Lens Analysis */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                  Görüşmeci Zihniyeti & Değerlendirme Filtresi
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-2 text-white">
                  {interviewPlan.interviewerProfile.title}
                </h3>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60 max-w-sm">
                🎯 {interviewPlan.interviewerProfile.lensPerspective}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Core Priorities */}
              <div className="bg-slate-850/60 rounded-xl p-5 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Bu Unvandaki Kişinin En Çok Önemsediği Konular
                </h4>
                <ul className="space-y-2">
                  {interviewPlan.interviewerProfile.corePriorities.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hidden Fears & Red Flags */}
              <div className="bg-slate-850/60 rounded-xl p-5 border border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Görüşmecinin Gizli Endişeleri & İstemediği Riskler
                </h4>
                <ul className="space-y-2">
                  {interviewPlan.interviewerProfile.hiddenFears.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Executive Advice Note */}
            <div className="mt-6 p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/50 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Acente Koçunun Zihinsel Taktik Notu
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {interviewPlan.executiveSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Potential Questions List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Potansiyel Mülakat Soruları ({interviewPlan.questions.length})
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  "{interviewPlan.interviewerProfile.title}" unvanındaki kişinin sorabileceği derinlemesine sorular ve arka planları.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {interviewPlan.questions.map((q: InterviewQuestion, index: number) => {
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div
                    key={q.id || index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs hover:border-slate-300"
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            #{index + 1} {q.category}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Niyet: {q.intent.slice(0, 50)}...
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectQuestionForMock(q.question, interviewerTitle, targetRole);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Bu soru ile Canlı Prova Masasına geç"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Prova Yap</span>
                        </button>
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/30">
                        {/* What it tests / Intent */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-100">
                            <h5 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-sky-700" />
                              Görüşmeci Bu Soruyla Neyi Ölçüyor?
                            </h5>
                            <p className="text-xs text-sky-850 leading-relaxed">{q.intent}</p>
                          </div>

                          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100">
                            <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" />
                              Değerlendirme Kriterleri
                            </h5>
                            <ul className="text-xs text-indigo-850 space-y-1">
                              {q.assessmentPoints.map((pt, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-indigo-500 font-bold">•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Strategy Tip */}
                        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80">
                          <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                            Cevaplama Stratejisi & STAR Yaklaşımı
                          </h5>
                          <p className="text-xs text-amber-900 leading-relaxed">{q.strategyTip}</p>
                        </div>

                        {/* Sample Impressive Answer */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200 relative group">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                              Örnek Etkileyici Cevap Taslağı
                            </h5>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(q.sampleAnswer, q.id)}
                              className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === q.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Kopyalandı</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Kopyala</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            "{q.sampleAnswer}"
                          </p>
                        </div>

                        {/* Pitfalls to Avoid */}
                        <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2 text-rose-800 text-xs">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-900">Kaçınılması Gereken Hatalar (Tuzak): </span>
                            {q.pitfallsToAvoid}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Smart Counter Questions (Questions to ask the interviewer) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Görüşme Sonu Taktiksel Güç
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Bu Unvandaki Görüşmeciye Sizin Soracağınız Akıllı Karşı Sorular
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                "Bize sormak istediğiniz bir soru var mı?" dendiğinde bu soruları sormak, görüşmecinin zihninde sizi en üst sıraya yerleştirir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviewPlan.counterQuestions.map((cq, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Soru #{i + 1}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      ⏰ {cq.bestTiming}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    "{cq.question}"
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Etki Nedeni: </strong> {cq.strategicReason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
