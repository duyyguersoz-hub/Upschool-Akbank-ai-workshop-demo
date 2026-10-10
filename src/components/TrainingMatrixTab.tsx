import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Target,
  Layers,
  ArrowRight,
  RotateCcw,
  Calendar,
  FileText,
  Briefcase
} from 'lucide-react';
import { Training, TrainingAnalysisResult } from '../types';
import { SAMPLE_TRAINING_PRESETS } from '../data/sampleProfiles';

interface TrainingMatrixTabProps {
  trainings: Training[];
  setTrainings: React.Dispatch<React.SetStateAction<Training[]>>;
  analysisResult: TrainingAnalysisResult | null;
  setAnalysisResult: (res: TrainingAnalysisResult | null) => void;
  careerGoal: string;
  setCareerGoal: (goal: string) => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
}

export const TrainingMatrixTab: React.FC<TrainingMatrixTabProps> = ({
  trainings,
  setTrainings,
  analysisResult,
  setAnalysisResult,
  careerGoal,
  setCareerGoal,
  currentRole,
  setCurrentRole,
}) => {
  // Modal / Inline Editing State
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form fields for create/edit
  const [modalTitle, setModalTitle] = useState('');
  const [modalProvider, setModalProvider] = useState('');
  const [modalDate, setModalDate] = useState('');
  const [modalSkills, setModalSkills] = useState('');
  const [modalContent, setModalContent] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openEditModal = (t: Training) => {
    setEditingTraining(t);
    setModalTitle(t.title);
    setModalProvider(t.provider);
    setModalDate(t.date);
    setModalSkills(t.skills);
    setModalContent(t.content);
    setIsAddingNew(false);
  };

  const openAddNewModal = () => {
    setEditingTraining(null);
    setModalTitle('');
    setModalProvider('');
    setModalDate('2024 - 30 Saat');
    setModalSkills('');
    setModalContent('');
    setIsAddingNew(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    if (isAddingNew) {
      const newTraining: Training = {
        id: `train-${Date.now()}`,
        title: modalTitle,
        provider: modalProvider || 'Belirtilmedi',
        date: modalDate || '2024',
        skills: modalSkills || 'Genel Yetkinlikler',
        content: modalContent || 'Eğitim müfredat içeriği girilmedi.',
      };
      setTrainings((prev) => [newTraining, ...prev]);
    } else if (editingTraining) {
      setTrainings((prev) =>
        prev.map((item) =>
          item.id === editingTraining.id
            ? {
                ...item,
                title: modalTitle,
                provider: modalProvider,
                date: modalDate,
                skills: modalSkills,
                content: modalContent,
              }
            : item
        )
      );
    }

    setEditingTraining(null);
    setIsAddingNew(false);
  };

  const handleDeleteTraining = (id: string) => {
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  };

  const loadPreset = (presetIndex: number) => {
    const selected = SAMPLE_TRAINING_PRESETS[presetIndex];
    if (selected) {
      setTrainings(selected.trainings);
      setCurrentRole(selected.role);
      setCareerGoal(selected.targetGoal);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (trainings.length === 0) {
      setError('Lütfen analiz için en az bir eğitim ekleyin veya hazır şablonlardan birini yükleyin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/career/analyze-trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainings,
          careerGoal,
          currentRole,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Analiz yapılamadı.');
      }

      const data: TrainingAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Eğitim analiz edilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            Eğitim & Kariyer Gelişim Acentesi
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Eğitim İçeriklerini Yönetin & Bir Sonraki Adımı Keşfedin
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Katıldığınız eğitimlerin içeriklerini dilediğiniz gibi ekleyin veya güncelleyin. Acentemiz bu içeriklerdeki kazanımları ve kariyer hedefiniz arasındaki eksikleri analiz eder; bir sonraki basamak için <strong className="text-white">tam olarak nasıl bir eğitim, müfredat ve sertifikasyon almanız gerektiğini</strong> raporlar.
          </p>
        </div>
      </div>

      {/* Preset Profiles & Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            Hızlı Profil Yükle (Örnek Eğitim Kümeleri)
          </h3>
          <p className="text-xs text-slate-500">
            Farklı kariyer alanlarındaki eğitim örneklerini tek tıkla deneyebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_TRAINING_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(idx)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
          <button
            type="button"
            onClick={openAddNewModal}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Eğitim Ekle</span>
          </button>
        </div>
      </div>

      {/* Goal & Current Role Setup */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          Kariyer Hedefiniz ve Mevcut Konumunuz
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mevcut Pozisyonunuz / Unvanınız
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="Örn: Mid-Level Frontend Geliştirici, Veri Analisti..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ulaşmak İstediğiniz Kariyer Hedefi / Sıradaki Pozisyon *
            </label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="Örn: Tech Lead olmak, Bulut Çözüm Mimarı pozisyonuna yükselmek..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Attended Trainings List (Editable Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Katıldığınız Eğitimler ({trainings.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Eğitimlerin içeriklerini "İçeriği Düzenle" butonuna tıklayarak istediğiniz zaman değiştirebilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddNewModal}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Eğitim Ekle</span>
          </button>
        </div>

        {trainings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">Henüz bir eğitim eklenmedi</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Yukarıdaki hızlı profillerden birini yükleyebilir veya kendi eğitiminizi ekleyebilirsiniz.
            </p>
            <button
              onClick={openAddNewModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              İlk Eğitimi Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {trainings.map((t, idx) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                        #{idx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{t.title}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {t.provider}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {t.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => openEditModal(t)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>İçeriği Düzenle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTraining(t.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eğitimi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Skills */}
                {t.skills && (
                  <div className="text-xs">
                    <span className="font-semibold text-slate-700">Edinilen Yetkinlikler: </span>
                    <span className="text-slate-600">{t.skills}</span>
                  </div>
                )}

                {/* Content / Curriculum summary */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
                  {t.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trigger Analysis Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Eğitim içeriklerinde değişiklik yaptıktan sonra aşağıdaki butona tıklayarak güncel analizinizi alın.
          </p>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading || trainings.length === 0}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eğitim İçerikleri & Eksikler Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Bir Sonraki Adım İçin Eğitimi Analiz Et</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Results Section */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn pt-4 border-t border-slate-200">
          {/* Section 1: Current Competencies & Skill Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Competency Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Mevcut Yetkinlik Seviyeniz
                </span>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {analysisResult.currentSkillMatrix.levelTitle}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {analysisResult.currentSkillMatrix.summaryAnalysis}
              </p>

              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Mevcut Eğitimlerle Kazanılmış Sağlam Yetkinlikler:
                </h5>
                <ul className="space-y-1.5">
                  {analysisResult.currentSkillMatrix.solidCompetencies.map((comp, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skill Gaps (Eksik Kalan Noktalar) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                Yetkinlik Boşlukları (Skill Gaps)
              </span>

              <p className="text-xs text-slate-500">
                Hedeflediğiniz "{careerGoal}" seviyesine ulaşabilmeniz için mevcut eğitim içeriklerinizde eksik kalan alanlar:
              </p>

              <div className="space-y-3">
                {analysisResult.skillGaps.map((gap, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{gap.gapName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        gap.impactLevel === 'Kritik'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {gap.impactLevel} Öncelik
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{gap.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: THE NEXT STEP TRAINING RECOMMENDATION (CORE RESULT) */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 space-y-6">
            <div className="border-b border-indigo-800/60 pb-5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                🏆 BİR SONRAKİ ADIM İÇİN TAVSİYE EDİLEN EĞİTİM
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-2 text-white">
                {analysisResult.nextTrainingRecommendation.trainingTitle}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-indigo-200">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-900/80 border border-indigo-700/60 font-medium">
                  İdeal Format: {analysisResult.nextTrainingRecommendation.idealFormat}
                </span>
              </div>
            </div>

            {/* Why This Training */}
            <div className="p-4 rounded-xl bg-indigo-900/30 border border-indigo-700/40 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-indigo-300">Neden Tam Olarak Bu Eğitim? </strong>
              {analysisResult.nextTrainingRecommendation.whyThisTraining}
            </div>

            {/* Curriculum Modules */}
            <div>
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Alacağınız Eğitimin İçermesi Gereken Kritik Müfredat Modülleri
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {analysisResult.nextTrainingRecommendation.curriculumModules.map((mod, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-[11px] font-bold text-sky-400">Modül #{i + 1}</span>
                    <h5 className="text-xs sm:text-sm font-bold text-white">{mod.moduleName}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{mod.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Certifications & Capstone Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Hedeflenmesi Gereken Sertifikasyonlar
                </h5>
                <ul className="space-y-1.5">
                  {analysisResult.nextTrainingRecommendation.recommendedCertifications.map((cert, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  Örnek Portföy / Bitirme Projesi
                </h5>
                <h6 className="text-xs font-bold text-white">
                  {analysisResult.nextTrainingRecommendation.capstoneProjectIdea.projectTitle}
                </h6>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.nextTrainingRecommendation.capstoneProjectIdea.projectDetails}
                </p>
              </div>
            </div>

            {/* 30-60-90 Day Action Plan */}
            <div className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
              <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                📅 30 - 60 - 90 Günlük Adım Adım Eylem Planı
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase">İlk 30 Gün</span>
                  <p className="text-slate-300">{analysisResult.nextTrainingRecommendation.actionPlan.first30Days}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">31 - 60 Gün</span>
                  <p className="text-slate-300">{analysisResult.nextTrainingRecommendation.actionPlan.day31to60}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">61 - 90 Gün</span>
                  <p className="text-slate-300">{analysisResult.nextTrainingRecommendation.actionPlan.day61to90}</p>
                </div>
              </div>
            </div>

            {/* Coach Note */}
            <div className="p-4 rounded-xl bg-indigo-900/40 border border-indigo-700/50 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong className="text-white">Acente Koçunun Nihai Yorumu: </strong>
                {analysisResult.careerCoachAdvice}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit or Add Training Modal */}
      {(isAddingNew || editingTraining) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>{isAddingNew ? 'Yeni Eğitim Ekle' : 'Eğitim İçeriğini Düzenle'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingTraining(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Eğitim Başlığı *
                </label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="Örn: Modern React & TypeScript Mimarisi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Kurum / Eğitmen / Platform
                  </label>
                  <input
                    type="text"
                    value={modalProvider}
                    onChange={(e) => setModalProvider(e.target.value)}
                    placeholder="Örn: Udemy, Coursera, Kurumsal Akademi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tarih / Süre
                  </label>
                  <input
                    type="text"
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    placeholder="Örn: 2024 - 40 Saat"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Kazanılan Beceriler / Anahtar Yetkinlikler
                </label>
                <input
                  type="text"
                  value={modalSkills}
                  onChange={(e) => setModalSkills(e.target.value)}
                  placeholder="Örn: React 19, TypeScript, State Management, API Entegrasyonu..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Eğitimin Detaylı İçeriği & Müfredat Maddeleri *
                </label>
                <textarea
                  rows={6}
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                  placeholder="Eğitimde işlenen konular, yapılan projeler, teorik ve pratik başlıklar..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Buraya müfredat maddelerini ekledikçe veya değiştirdikçe AI koç bir sonraki eğitim tavsiyesini buna göre güncelleyecektir.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingTraining(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {isAddingNew ? 'Eğitimi Kaydet' : 'Değişiklikleri Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
