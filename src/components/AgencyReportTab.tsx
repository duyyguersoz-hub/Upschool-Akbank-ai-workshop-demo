import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Compass,
  Award,
  Briefcase,
  Layers,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { InterviewPlanResult, TrainingAnalysisResult, Training } from '../types';

interface AgencyReportTabProps {
  interviewPlan: InterviewPlanResult | null;
  trainingAnalysis: TrainingAnalysisResult | null;
  trainings: Training[];
  interviewerTitle: string;
  targetRole: string;
  careerGoal: string;
}

export const AgencyReportTab: React.FC<AgencyReportTabProps> = ({
  interviewPlan,
  trainingAnalysis,
  trainings,
  interviewerTitle,
  targetRole,
  careerGoal,
}) => {
  const [copied, setCopied] = useState(false);

  const hasData = interviewPlan || trainingAnalysis || trainings.length > 0;

  const handleCopyReport = () => {
    let text = `=== KARİYERPUSULA | EXECUTIVE MÜLAKAT VE KARİYER RAPORU ===\n`;
    text += `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n`;
    text += `Hedef Pozisyon: ${targetRole || 'Belirtilmedi'}\n`;
    text += `Kariyer Hedefi: ${careerGoal || 'Belirtilmedi'}\n`;
    text += `Görüşmeci Unvanı: ${interviewerTitle || 'Belirtilmedi'}\n\n`;

    if (interviewPlan) {
      text += `--- 1. GÖRÜŞMECİ ZİHNİYETİ & DEĞERLENDİRME ANALİZİ ---\n`;
      text += `Unvan: ${interviewPlan.interviewerProfile.title}\n`;
      text += `Bakış Açısı: ${interviewPlan.interviewerProfile.lensPerspective}\n`;
      text += `Öncelikleri: ${interviewPlan.interviewerProfile.corePriorities.join(', ')}\n`;
      text += `Gizli Endişeleri: ${interviewPlan.interviewerProfile.hiddenFears.join(', ')}\n\n`;

      text += `--- 2. POTANSİYEL MÜLAKAT SORULARI (${interviewPlan.questions.length}) ---\n`;
      interviewPlan.questions.forEach((q, idx) => {
        text += `\n[Soru ${idx + 1}] (${q.category})\n`;
        text += `Soru: ${q.question}\n`;
        text += `Niyet: ${q.intent}\n`;
        text += `Strateji: ${q.strategyTip}\n`;
        text += `Örnek Cevap: ${q.sampleAnswer}\n`;
      });
      text += `\n`;
    }

    if (trainingAnalysis) {
      text += `\n--- 3. EĞİTİM ANALİZİ & BİR SONRAKİ ADIM YOL HARİTASI ---\n`;
      text += `Mevcut Seviye: ${trainingAnalysis.currentSkillMatrix.levelTitle}\n`;
      text += `Sağlam Yetkinlikler: ${trainingAnalysis.currentSkillMatrix.solidCompetencies.join(', ')}\n`;
      text += `\nTespit Edilen Yetkinlik Boşlukları (Skill Gaps):\n`;
      trainingAnalysis.skillGaps.forEach((g) => {
        text += `- ${g.gapName} (${g.impactLevel} Öncelik): ${g.description}\n`;
      });

      text += `\nBİR SONRAKİ ADIM İÇİN TAVSİYE EDİLEN EĞİTİM:\n`;
      text += `Eğitim Adı: ${trainingAnalysis.nextTrainingRecommendation.trainingTitle}\n`;
      text += `Format: ${trainingAnalysis.nextTrainingRecommendation.idealFormat}\n`;
      text += `Neden Bu Eğitim: ${trainingAnalysis.nextTrainingRecommendation.whyThisTraining}\n\n`;
      text += `Önerilen Sertifikalar: ${trainingAnalysis.nextTrainingRecommendation.recommendedCertifications.join(', ')}\n`;
      text += `Bitirme Projesi: ${trainingAnalysis.nextTrainingRecommendation.capstoneProjectIdea.projectTitle} - ${trainingAnalysis.nextTrainingRecommendation.capstoneProjectIdea.projectDetails}\n`;
      text += `\n30-60-90 Günlük Eylem Planı:\n`;
      text += `İlk 30 Gün: ${trainingAnalysis.nextTrainingRecommendation.actionPlan.first30Days}\n`;
      text += `31-60 Gün: ${trainingAnalysis.nextTrainingRecommendation.actionPlan.day31to60}\n`;
      text += `61-90 Gün: ${trainingAnalysis.nextTrainingRecommendation.actionPlan.day61to90}\n\n`;
      text += `Koçun Notu: ${trainingAnalysis.careerCoachAdvice}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            Yönetici Brifingi
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            KariyerPusula Acente Strateji Raporu
          </h2>
          <p className="text-xs text-slate-500">
            Mülakat hazırlıklarınızı ve eğitim yol haritanızı içeren toplu koçluk dosyası.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyReport}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Raporu Kopyala</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF</span>
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Henüz bir analiz üretilmedi</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            "Görüşmeci & Mülakat Koçu" sekmesinden soru ürettiğinizde veya "Eğitim Portföyü" sekmesinden analiz yaptığınızda raporunuz burada otomatik olarak derlenecektir.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  KariyerPusula Executive Briefing
                </h1>
                <p className="text-xs text-slate-500">Mülakat Stratejisi & Gelişim Raporu</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Tarih: {new Date().toLocaleDateString('tr-TR')}</div>
              <div>Durum: Aktif Danışmanlık Dosyası</div>
            </div>
          </div>

          {/* Candidate & Interview Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Hedef Rol</span>
              <span className="text-slate-900 font-medium">{targetRole || 'Belirtilmedi'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Kariyer Hedefi</span>
              <span className="text-slate-900 font-medium">{careerGoal || 'Belirtilmedi'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Hedef Görüşmeci</span>
              <span className="text-slate-900 font-medium">{interviewerTitle || 'Belirtilmedi'}</span>
            </div>
          </div>

          {/* Section 1: Interview Strategy */}
          {interviewPlan && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                1. Görüşmeci Bakış Açısı ve Soru Dağılımı
              </h3>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-2">
                <div className="font-bold text-indigo-900">
                  Görüşmeci: {interviewPlan.interviewerProfile.title}
                </div>
                <p className="text-indigo-850">
                  <strong>Temel Zihniyet:</strong> {interviewPlan.interviewerProfile.lensPerspective}
                </p>
                <div className="text-indigo-850">
                  <strong>Öncelikli Konular:</strong> {interviewPlan.interviewerProfile.corePriorities.join(', ')}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Öne Çıkan Kritik Sorular:
                </h4>
                {interviewPlan.questions.slice(0, 4).map((q, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-700">#{i + 1} {q.category}:</span>
                      <span className="font-semibold text-slate-900">{q.question}</span>
                    </div>
                    <p className="text-slate-600"><strong>Niyet:</strong> {q.intent}</p>
                    <p className="text-slate-600"><strong>STAR Taktik:</strong> {q.strategyTip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Education Roadmap */}
          {trainingAnalysis && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Award className="w-4 h-4 text-indigo-600" />
                2. Eğitim Analizi & Bir Sonraki Adım Tavsiyesi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Mevcut Seviye ve Güçlü Yönler:</span>
                  <p className="text-slate-600 mb-2">{trainingAnalysis.currentSkillMatrix.summaryAnalysis}</p>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {trainingAnalysis.currentSkillMatrix.solidCompetencies.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">Kritik Yetkinlik Boşlukları (Gaps):</span>
                  <ul className="space-y-1 text-amber-850">
                    {trainingAnalysis.skillGaps.map((g, i) => (
                      <li key={i}>• <strong>{g.gapName}:</strong> {g.description}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Next Training */}
              <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 px-2 py-0.5 rounded bg-indigo-900/60">
                  ÖNERİLEN BİR SONRAKİ EĞİTİM
                </span>
                <h4 className="text-base font-bold text-white">
                  {trainingAnalysis.nextTrainingRecommendation.trainingTitle}
                </h4>
                <p className="text-xs text-slate-300">
                  {trainingAnalysis.nextTrainingRecommendation.whyThisTraining}
                </p>

                <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <span className="font-bold text-amber-300">Örnek Bitirme Projesi: </span>
                  {trainingAnalysis.nextTrainingRecommendation.capstoneProjectIdea.projectTitle}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Training History Snapshot */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              Kayıtlı Eğitim Geçmişiniz ({trainings.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {trainings.map((t, idx) => (
                <div key={t.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="font-bold text-slate-900">#{idx + 1} {t.title}</div>
                  <div className="text-slate-500 text-[11px]">{t.provider} | {t.date}</div>
                  <div className="text-slate-600 text-[11px] mt-1 line-clamp-2">{t.skills}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
