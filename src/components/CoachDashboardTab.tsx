import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  Building,
  Briefcase,
  TrendingUp,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  ChevronRight,
  MessageSquare,
  ListTodo
} from 'lucide-react';
import { ClientProfile } from '../types';

interface CoachDashboardTabProps {
  clients: ClientProfile[];
  setClients: React.Dispatch<React.SetStateAction<ClientProfile[]>>;
  onLoadClientForInterview: (interviewerTitle: string, targetRole: string) => void;
  onLoadClientForTraining: (clientName: string, role: string) => void;
}

export const CoachDashboardTab: React.FC<CoachDashboardTabProps> = ({
  clients,
  setClients,
  onLoadClientForInterview,
  onLoadClientForTraining,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(clients[0] || null);

  // Modals
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientRole, setNewClientRole] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientInterviewer, setNewClientInterviewer] = useState('Teknolojiden Sorumlu Başkan (CTO)');
  const [newClientDate, setNewClientDate] = useState('24 Ekim 2026');

  // New note and task input for active client
  const [newCoachNote, setNewCoachNote] = useState('');
  const [newTaskText, setNewTaskText] = useState('');

  // KPIs
  const totalClients = clients.length;
  const activeInterviews = clients.filter((c) => c.status === 'Mülakat Haftası' || c.status === 'Simülasyon Aşamasında').length;
  const offersReceived = clients.filter((c) => c.status === 'Teklif Alındı').length;
  const avgReadiness = Math.round(
    clients.reduce((acc, c) => acc + c.readinessScore, 0) / (totalClients || 1)
  );

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetCompany.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientRole.trim()) return;

    const newClient: ClientProfile = {
      id: `cli-${Date.now()}`,
      fullName: newClientName,
      email: newClientEmail || `${newClientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      targetRole: newClientRole,
      targetCompany: newClientCompany || 'Teknoloji Şirketi',
      interviewerTitle: newClientInterviewer || 'İK Direktörü',
      interviewDate: newClientDate || '15 Gün Sonra',
      status: 'Hazırlanıyor',
      readinessScore: 60,
      coachNotes: ['İlk danışmanlık dosyası açıldı. Hedef mülakat analizi yapılacak.'],
      assignedTasks: [
        { id: `task-${Date.now()}-1`, text: 'Geçmiş eğitim içeriklerini sisteme aktar', done: false },
        { id: `task-${Date.now()}-2`, text: 'Görüşmeci unvanına göre ilk simülasyonu yap', done: false }
      ],
      completedSimulationsCount: 0,
      lastActive: 'Yeni Kayıt',
      trainingsCount: 0
    };

    setClients((prev) => [newClient, ...prev]);
    setSelectedClient(newClient);
    setIsAddClientModalOpen(false);

    // Reset fields
    setNewClientName('');
    setNewClientEmail('');
    setNewClientRole('');
    setNewClientCompany('');
  };

  const handleAddCoachNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoachNote.trim() || !selectedClient) return;

    const updatedNote = `[${new Date().toLocaleDateString('tr-TR')}] ${newCoachNote.trim()}`;

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? { ...c, coachNotes: [updatedNote, ...c.coachNotes] }
          : c
      )
    );

    setSelectedClient((prev) =>
      prev ? { ...prev, coachNotes: [updatedNote, ...prev.coachNotes] } : null
    );

    setNewCoachNote('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !selectedClient) return;

    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      done: false
    };

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? { ...c, assignedTasks: [...c.assignedTasks, newTask] }
          : c
      )
    );

    setSelectedClient((prev) =>
      prev ? { ...prev, assignedTasks: [...prev.assignedTasks, newTask] } : null
    );

    setNewTaskText('');
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedClient) return;

    const updatedTasks = selectedClient.assignedTasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id ? { ...c, assignedTasks: updatedTasks } : c
      )
    );

    setSelectedClient((prev) =>
      prev ? { ...prev, assignedTasks: updatedTasks } : null
    );
  };

  const handleUpdateStatus = (newStatus: ClientProfile['status']) => {
    if (!selectedClient) return;

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id ? { ...c, status: newStatus } : c
      )
    );

    setSelectedClient((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleScoreChange = (newScore: number) => {
    if (!selectedClient) return;

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id ? { ...c, readinessScore: newScore } : c
      )
    );

    setSelectedClient((prev) => (prev ? { ...prev, readinessScore: newScore } : null));
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Bu danışan dosyasını silmek istediğinize emin misiniz?')) {
      const remaining = clients.filter((c) => c.id !== clientId);
      setClients(remaining);
      setSelectedClient(remaining[0] || null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              Ajans Koçu & Danışan Yönetim Paneli
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Danışan Dosyaları & Süreç Takip Portalı
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Danışanlarınızın mülakat hedeflerini, hazırlık skorlarını, eğitim açıklarını ve simülasyon provalarını tek bir merkezden yönetin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddClientModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Yeni Danışan Ekle</span>
          </button>
        </div>
      </div>

      {/* Agency KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Aktif Danışanlar</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalClients}</div>
          <p className="text-[11px] text-slate-500">Takip edilen kariyer dosyası</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Mülakat Aşaması</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{activeInterviews}</div>
          <p className="text-[11px] text-slate-500">Bu ay görüşmeye girecekler</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Teklif Alanlar</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{offersReceived}</div>
          <p className="text-[11px] text-slate-500">Başarılı yerleşme</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Ort. Hazırlık</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">%{avgReadiness}</div>
          <p className="text-[11px] text-slate-500">Simülasyon başarı puanı</p>
        </div>
      </div>

      {/* Main Two-Column Layout: Client List on Left, Active Client Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Danışan Listesi ({filteredClients.length})
            </h3>
            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ekle</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İsim, rol veya şirket ara..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {['all', 'Hazırlanıyor', 'Simülasyon Aşamasında', 'Mülakat Haftası', 'Teklif Alındı'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Tümü' : st}
                </button>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredClients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Aramaya uygun danışan bulunamadı.
              </div>
            ) : (
              filteredClients.map((client) => {
                const isSelected = selectedClient?.id === client.id;

                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {client.fullName}
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              client.status === 'Teklif Alındı'
                                ? 'bg-emerald-100 text-emerald-800'
                                : client.status === 'Mülakat Haftası'
                                ? 'bg-amber-100 text-amber-800'
                                : client.status === 'Simülasyon Aşamasında'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {client.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {client.targetRole}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          🏢 {client.targetCompany} • 🎯 {client.interviewerTitle}
                        </p>
                      </div>

                      {/* Score Circle */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-indigo-700">
                          %{client.readinessScore}
                        </span>
                        <div className="text-[9px] text-slate-400">Hazırlık</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Client Dossier Details (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {selectedClient ? (
            <>
              {/* Client Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedClient.fullName}
                    </h3>
                    <span className="text-xs text-slate-500">({selectedClient.email})</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Hedef: <strong className="text-slate-900">{selectedClient.targetRole}</strong> @ {selectedClient.targetCompany}
                  </p>
                  <p className="text-xs text-indigo-600 font-medium">
                    Görüşmeci Unvanı: <strong>{selectedClient.interviewerTitle}</strong> • Mülakat: {selectedClient.interviewDate}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleDeleteClient(selectedClient.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Danışan Dosyasını Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Launch Buttons for Simulation & Roadmap */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-indigo-900">
                  <strong className="block text-indigo-950 font-bold">Danışanın Senaryosunu Başlatın:</strong>
                  Bu danışanın görüşmeci unvanı ve pozisyonunu tek tıkla mülakat koçuna aktarın.
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onLoadClientForInterview(selectedClient.interviewerTitle, selectedClient.targetRole)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mülakatını Başlat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadClientForTraining(selectedClient.fullName, selectedClient.targetRole)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Eğitim Analizine Git</span>
                  </button>
                </div>
              </div>

              {/* Status and Readiness Controller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Danışan Süreç Aşaması
                  </label>
                  <select
                    value={selectedClient.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                    <option value="Simülasyon Aşamasında">Simülasyon Aşamasında</option>
                    <option value="Mülakat Haftası">Mülakat Haftası</option>
                    <option value="Teklif Alındı">Teklif Alındı</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Mülakat Hazırlık Skoru
                    </label>
                    <span className="text-xs font-extrabold text-indigo-600">
                      %{selectedClient.readinessScore}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={selectedClient.readinessScore}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Başlangıç (10)</span>
                    <span>Tam Hazır (100)</span>
                  </div>
                </div>
              </div>

              {/* Action Items / Assigned Tasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-indigo-600" />
                    Danışana Verilen Ödev ve Eylemler
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {selectedClient.assignedTasks.filter((t) => t.done).length} / {selectedClient.assignedTasks.length} Tamamlandı
                  </span>
                </div>

                {/* Task list */}
                <div className="space-y-2">
                  {selectedClient.assignedTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer text-xs transition-colors ${
                        task.done
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-500 line-through'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => {}}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{task.text}</span>
                    </div>
                  ))}
                </div>

                {/* Add new task input */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Danışana yeni görev ata (Örn: STAR cevap taslağını revize et)..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Ata
                  </button>
                </form>
              </div>

              {/* Coach Notes Log */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Koçluk Notları & Seans Geri Bildirimleri
                </h4>

                <form onSubmit={handleAddCoachNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newCoachNote}
                    onChange={(e) => setNewCoachNote(e.target.value)}
                    placeholder="Yeni koçluk notu veya mülakat geri bildirimi ekle..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Kaydet
                  </button>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedClient.coachNotes.map((note, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Detayları görmek için soldaki listeden bir danışan seçin.
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Yeni Danışan Kaydı Oluştur
              </h3>
              <button
                type="button"
                onClick={() => setIsAddClientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Danışanın Adı Soyadı *
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Örn: Burak Tan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="Örn: burak@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hedeflediği Pozisyon *
                </label>
                <input
                  type="text"
                  value={newClientRole}
                  onChange={(e) => setNewClientRole(e.target.value)}
                  placeholder="Örn: Senior Frontend Developer, Ürün Yöneticisi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hedef Şirket / Sektör
                </label>
                <input
                  type="text"
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  placeholder="Örn: Global Fintech Scale-up"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Görüşmecinin Unvanı
                </label>
                <input
                  type="text"
                  value={newClientInterviewer}
                  onChange={(e) => setNewClientInterviewer(e.target.value)}
                  placeholder="Örn: Teknolojiden Sorumlu Başkan (CTO), İK Direktörü..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hedef Mülakat Tarihi
                </label>
                <input
                  type="text"
                  value={newClientDate}
                  onChange={(e) => setNewClientDate(e.target.value)}
                  placeholder="Örn: 24 Ekim 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Danışanı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
