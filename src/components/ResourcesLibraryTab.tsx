import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Award,
  Sparkles,
  Bookmark,
  CheckCircle,
  PlusCircle,
  Layers,
  Compass
} from 'lucide-react';
import { LearningResource, Training } from '../types';
import { CURATED_RESOURCES } from '../data/sampleProfiles';

interface ResourcesLibraryTabProps {
  onAddToTrainings: (resource: LearningResource) => void;
}

export const ResourcesLibraryTab: React.FC<ResourcesLibraryTabProps> = ({
  onAddToTrainings,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'Tüm Kaynaklar' },
    { id: 'Mülakat Hazırlığı', label: 'Mülakat Hazırlığı' },
    { id: 'Teknik Yetkinlik', label: 'Teknik Yetkinlik' },
    { id: 'Liderlik & İletişim', label: 'Liderlik & İletişim' },
    { id: 'Sertifikasyon', label: 'Sertifikasyon' },
  ];

  const filteredResources = CURATED_RESOURCES.filter((res) => {
    const matchesCategory =
      selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase()) ||
      res.targetAudience.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    setSavedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAdd = (resource: LearningResource) => {
    onAddToTrainings(resource);
    setAddedIds((prev) => [...prev, resource.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((i) => i !== resource.id));
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Eğitim Materyalleri & Kaynak Kütüphanesi
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Mülakat ve Kariyer İçin Önerilen Materyaller
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Kariyer hedeflerinize ve görüşmeci unvanınıza uygun, acentemiz tarafından doğrulanmış en etkili kitaplar, sertifikasyonlar ve metodoloji rehberleri. Dilediğiniz kaynağı tek tıkla kendi eğitim portföyünüze ekleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Materyal veya konu ara..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => {
          const isBookmarked = savedResourceIds.includes(res.id);
          const isAdded = addedIds.includes(res.id);

          return (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                    {res.category} • {res.type}
                  </span>
                  <button
                    onClick={() => toggleBookmark(res.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-500 cursor-pointer transition-colors"
                    title={isBookmarked ? 'Kaydedildi' : 'Kaydet'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
                </p>

                <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div>
                    <strong className="text-slate-700">Hedef Kitle: </strong>
                    <span>{res.targetAudience}</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">Sağlayıcı / Yazar: </strong>
                    <span>{res.provider}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Add to training matrix */}
              <button
                type="button"
                onClick={() => handleAdd(res)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Eğitim Portföyüne Eklendi</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Eğitim Portföyüme Ekle</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
