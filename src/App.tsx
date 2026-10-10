/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTabType } from './components/Header';
import { InterviewCoachTab } from './components/InterviewCoachTab';
import { TrainingMatrixTab } from './components/TrainingMatrixTab';
import { MockInterviewTab } from './components/MockInterviewTab';
import { ResourcesLibraryTab } from './components/ResourcesLibraryTab';
import { AgencyReportTab } from './components/AgencyReportTab';
import { CoachDashboardTab } from './components/CoachDashboardTab';
import {
  Training,
  InterviewPlanResult,
  TrainingAnalysisResult,
  ClientProfile,
  LearningResource
} from './types';
import { SAMPLE_TRAINING_PRESETS, SAMPLE_CLIENTS } from './data/sampleProfiles';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Briefcase
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('interview');

  // Candidate Data & Trainings
  const [trainings, setTrainings] = useState<Training[]>(() => {
    const saved = localStorage.getItem('kp_trainings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_TRAINING_PRESETS[0].trainings;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('kp_current_role') || SAMPLE_TRAINING_PRESETS[0].role;
  });

  const [careerGoal, setCareerGoal] = useState(() => {
    return localStorage.getItem('kp_career_goal') || SAMPLE_TRAINING_PRESETS[0].targetGoal;
  });

  // Interview Coach State
  const [interviewerTitle, setInterviewerTitle] = useState('Teknolojiden Sorumlu Başkan (CTO)');
  const [targetRole, setTargetRole] = useState('Kıdemli Yazılım Mühendisi / Tech Lead');
  const [interviewPlan, setInterviewPlan] = useState<InterviewPlanResult | null>(() => {
    const saved = localStorage.getItem('kp_interview_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Training Analysis State
  const [analysisResult, setAnalysisResult] = useState<TrainingAnalysisResult | null>(() => {
    const saved = localStorage.getItem('kp_training_analysis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Mock Question State
  const [selectedQuestion, setSelectedQuestion] = useState(
    'Büyük ölçekli bir sistemde beklenmedik bir kesinti veya performans darboğazı yaşadığınızda süreci nasıl yönettiniz?'
  );

  // Coach Clients State
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('kp_clients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_CLIENTS;
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('kp_trainings', JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem('kp_current_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('kp_career_goal', careerGoal);
  }, [careerGoal]);

  useEffect(() => {
    if (interviewPlan) {
      localStorage.setItem('kp_interview_plan', JSON.stringify(interviewPlan));
    }
  }, [interviewPlan]);

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('kp_training_analysis', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem('kp_clients', JSON.stringify(clients));
  }, [clients]);

  // Handler: Select question from interview list to practice in mock tab
  const handleSelectQuestionForMock = (
    question: string,
    title: string,
    role: string
  ) => {
    setSelectedQuestion(question);
    setInterviewerTitle(title);
    setTargetRole(role);
    setActiveTab('mock');
    showToast(`"${question.slice(0, 40)}..." sorusu prova masasına yüklendi.`);
  };

  // Handler: From Coach dashboard, load a client's profile into interview simulator
  const handleLoadClientForInterview = (clientInterviewer: string, clientRole: string) => {
    setInterviewerTitle(clientInterviewer);
    setTargetRole(clientRole);
    setActiveTab('interview');
    showToast(`Danışanın mülakat parametreleri yüklendi (${clientInterviewer}).`);
  };

  // Handler: From Coach dashboard, load a client into training roadmap
  const handleLoadClientForTraining = (clientName: string, role: string) => {
    setCurrentRole(role);
    setCareerGoal(`Kıdemli ${role} pozisyonu ve liderlik yetkinlikleri`);
    setActiveTab('training');
    showToast(`${clientName} için eğitim analiz modülü açıldı.`);
  };

  // Handler: Add learning resource directly to trainings
  const handleAddResourceToTrainings = (resource: LearningResource) => {
    const newTraining: Training = {
      id: `train-res-${Date.now()}`,
      title: resource.title,
      provider: resource.provider,
      date: 'Önerilen Eğitim / Tamamlanacak',
      skills: `${resource.category}, ${resource.type}`,
      content: `${resource.description}\nHedef Kitle: ${resource.targetAudience}`,
    };
    setTrainings((prev) => [newTraining, ...prev]);
    showToast(`"${resource.title}" eğitim listenize eklendi!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trainingsCount={trainings.length}
        clientsCount={clients.length}
        hasQuestions={Boolean(interviewPlan && interviewPlan.questions.length > 0)}
        hasTrainingAnalysis={Boolean(analysisResult)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Interview Coach (Title-Based Simulation) */}
        {activeTab === 'interview' && (
          <InterviewCoachTab
            interviewPlan={interviewPlan}
            setInterviewPlan={setInterviewPlan}
            onSelectQuestionForMock={handleSelectQuestionForMock}
            savedInterviewerTitle={interviewerTitle}
            setSavedInterviewerTitle={setInterviewerTitle}
            savedTargetRole={targetRole}
            setSavedTargetRole={setTargetRole}
          />
        )}

        {/* Tab 2: Training Matrix & Next Step Recommendation */}
        {activeTab === 'training' && (
          <TrainingMatrixTab
            trainings={trainings}
            setTrainings={setTrainings}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
            careerGoal={careerGoal}
            setCareerGoal={setCareerGoal}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
          />
        )}

        {/* Tab 3: Mock Interview Practice Desk */}
        {activeTab === 'mock' && (
          <MockInterviewTab
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            interviewerTitle={interviewerTitle}
            targetRole={targetRole}
          />
        )}

        {/* Tab 4: Curated Resources Library */}
        {activeTab === 'resources' && (
          <ResourcesLibraryTab onAddToTrainings={handleAddResourceToTrainings} />
        )}

        {/* Tab 5: Executive Agency Report */}
        {activeTab === 'report' && (
          <AgencyReportTab
            interviewPlan={interviewPlan}
            trainingAnalysis={analysisResult}
            trainings={trainings}
            interviewerTitle={interviewerTitle}
            targetRole={targetRole}
            careerGoal={careerGoal}
          />
        )}

        {/* Tab 6: Coach & Client Management Portal */}
        {activeTab === 'coach' && (
          <CoachDashboardTab
            clients={clients}
            setClients={setClients}
            onLoadClientForInterview={handleLoadClientForInterview}
            onLoadClientForTraining={handleLoadClientForTraining}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">KariyerPusula</span>
            <span>— Executive Mülakat ve Kariyer Koçluğu Ajansı</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>🎯 Görüşmeci Odaklı Simülasyon</span>
            <span>🎓 Eğitim Boşluk Analizi</span>
            <span>👔 Koç & Danışan Yönetimi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
