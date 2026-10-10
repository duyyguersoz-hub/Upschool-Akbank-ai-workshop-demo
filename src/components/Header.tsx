import React from 'react';
import {
  Briefcase,
  Compass,
  Sparkles,
  Award,
  BookOpen,
  Users,
  FileText,
  UserCheck
} from 'lucide-react';

export type ActiveTabType = 'interview' | 'training' | 'mock' | 'resources' | 'report' | 'coach';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  trainingsCount: number;
  clientsCount: number;
  hasQuestions: boolean;
  hasTrainingAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  trainingsCount,
  clientsCount,
  hasQuestions,
  hasTrainingAnalysis,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3 gap-3">
          {/* Logo & Agency Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    Kariyer<span className="text-indigo-600">Pusula</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Executive Koçluk Ajansı
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Görüşmeci Unvanı Analizi • Eğitim Yol Haritası • Danışan Yönetimi
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-medium overflow-x-auto scrollbar-none">
            {/* 1. Interview Coach */}
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'interview'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Görüşmeci Simülatörü</span>
              {hasQuestions && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>

            {/* 2. Training Roadmap */}
            <button
              onClick={() => setActiveTab('training')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'training'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Eğitim Portföyü & Analiz</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 font-semibold text-slate-700">
                {trainingsCount}
              </span>
              {hasTrainingAnalysis && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>

            {/* 3. Mock Interview Desk */}
            <button
              onClick={() => setActiveTab('mock')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'mock'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Canlı Prova Masası</span>
            </button>

            {/* 4. Curated Resources */}
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'resources'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Materyaller</span>
            </button>

            {/* 5. Executive Report */}
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Acente Raporu</span>
            </button>

            {/* 6. Coach / Client Management Portal */}
            <button
              onClick={() => setActiveTab('coach')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                activeTab === 'coach'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-semibold'
                  : 'bg-indigo-50/70 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Koç Portalı ({clientsCount})</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
