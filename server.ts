import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini API with user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'KariyerPusula Career & Interview Coaching Agency' });
});

// Endpoint 1: Generate Interview Questions by Interviewer Title
app.post('/api/interview/generate', async (req: Request, res: Response) => {
  try {
    const { interviewerTitle, targetRole, industry, experienceLevel, companyNotes } = req.body;

    if (!interviewerTitle || !targetRole) {
      return res.status(400).json({ error: 'Görüşmecinin unvanı ve başvurulan pozisyon zorunludur.' });
    }

    const prompt = `
Sen üst düzey bir Yönetici Mülakat ve Kariyer Koçusun (Executive Interview & Career Coach).
Aday mülakata girecek ve karşısındaki görüşmecinin unvanı: "${interviewerTitle}".

Aday ve Mülakat Bilgileri:
- Görüşmecinin Unvanı/Pozisyonu: "${interviewerTitle}"
- Adayın Başvurduğu Pozisyon: "${targetRole}"
- Şirket Sektörü/Türü: "${industry || 'Genel Kurumsal / Teknoloji'}"
- Adayın Deneyim Düzeyi: "${experienceLevel || 'Mid - Senior'}"
- Şirket / Görüşme Ek Notları: "${companyNotes || 'Belirtilmedi'}"

GÖREVİN:
1. Görüşmecinin unvanına ("${interviewerTitle}") ÖZEL bir bakış açısı analizi yap. Bu unvandaki kişi mülakata hangi prizmadan bakar? Adayda ne arar, en büyük endişesi/riski nedir?
2. Bu unvandaki kişinin aday için hazırlayacağı veya sorabileceği en kritik ve gerçekçi 6-8 potansiyel soruyu üret. Her sorunun arkasındaki gizli niyeti, STAR metoduna göre yanıt stratejisini, güçlü bir örnek cevap taslağını ve adayların düştüğü ölümcül tuzakları yaz.
3. Adayın görüşmenin sonunda bu unvandaki kişiyi etkilemek için sorabileceği 4 akıllıca karşı soru hazırla.
4. Görüşme öncesi kısa koçluk tavsiyesi ver.

Lütfen çıktıyı tam olarak belirtilen JSON formatında ver.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerProfile: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                lensPerspective: { type: Type.STRING, description: 'Görüşmecinin temel bakış açısı ve değerlendirme zihniyeti' },
                corePriorities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'En çok önemsediği 3-4 ana konu'
                },
                hiddenFears: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Adayda görmek istemediği veya korktuğu riskler'
                }
              },
              required: ['title', 'lensPerspective', 'corePriorities', 'hiddenFears']
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'Kategori: Davranışsal, Teknik/Metodolojik, Liderlik/Uyum, Kriz & Çatışma, Stratejik Vizyon' },
                  question: { type: Type.STRING, description: 'Görüşmecinin soracağı soru' },
                  intent: { type: Type.STRING, description: 'Bu soruyla unvan sahibi tam olarak neyi ölçüyor?' },
                  assessmentPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Değerlendirme kriterleri'
                  },
                  strategyTip: { type: Type.STRING, description: 'Yanıtlama stratejisi ve ipuçları' },
                  sampleAnswer: { type: Type.STRING, description: 'Örnek etkileyici yanıt taslağı' },
                  pitfallsToAvoid: { type: Type.STRING, description: 'Kaçınılması gereken tuzaklar' }
                },
                required: ['id', 'category', 'question', 'intent', 'assessmentPoints', 'strategyTip', 'sampleAnswer', 'pitfallsToAvoid']
              }
            },
            counterQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: 'Adayın görüşmeciye soracağı soru' },
                  strategicReason: { type: Type.STRING, description: 'Bu sorunun unvan sahibi üzerindeki etkisi' },
                  bestTiming: { type: Type.STRING, description: 'Görüşmenin hangi anında sorulmalı' }
                },
                required: ['question', 'strategicReason', 'bestTiming']
              }
            },
            executiveSummary: { type: Type.STRING, description: 'Acente koçunun genel görüşme taktiği ve zihinsel hazırlık tavsiyesi' }
          },
          required: ['interviewerProfile', 'questions', 'counterQuestions', 'executiveSummary']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Interview generation error:', error);
    res.status(500).json({ error: error.message || 'Mülakat soruları üretilirken bir hata oluştu.' });
  }
});

// Endpoint 2: Evaluate User's Practice Answer (Mock Interview)
app.post('/api/interview/evaluate', async (req: Request, res: Response) => {
  try {
    const { question, candidateAnswer, interviewerTitle, targetRole } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({ error: 'Soru ve aday cevabı zorunludur.' });
    }

    const prompt = `
Sen deneyimli bir Kariyer ve Mülakat Koçusun.
Görüşmecinin Unvanı: "${interviewerTitle || 'Mülakatçı'}"
Pozisyon: "${targetRole || 'Aday Pozisyonu'}"
Soru: "${question}"
Adayın Verdiği Cevap: "${candidateAnswer}"

Bu cevabı "${interviewerTitle}" unvanına sahip kişinin bakış açısıyla titizlikle puanla ve analiz et.
STAR (Situation, Task, Action, Result) metodolojisini, ikna kabiliyetini, somut metrik kullanımını ve profesyonel tonu değerlendir.
Adayın cevabını çok daha etkili ve parlatılmış profesyonel bir versiyon olarak yeniden yaz.

Lütfen çıktıyı JSON formatında ver.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: '1-100 arası başarı puanı' },
            ratingLabel: { type: Type.STRING, description: 'Mükemmel / Güçlü / Geliştirilmeli / Yetersiz' },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Cevabın güçlü yönleri'
            },
            improvementAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Geliştirilmesi gereken noktalar'
            },
            starAnalysis: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING, description: 'Durum tespiti ve bağlam yeterli mi?' },
                task: { type: Type.STRING, description: 'Görev ve sorumluluk net mi?' },
                action: { type: Type.STRING, description: 'Kişisel aksiyon ve yetkinlik vurgulandı mı?' },
                result: { type: Type.STRING, description: 'Sonuç ve ölçülebilir çıktı var mı?' }
              },
              required: ['situation', 'task', 'action', 'result']
            },
            improvedVersion: { type: Type.STRING, description: 'Cevabın görüşmeciyi etkileyecek optimize edilmiş hali' },
            coachTip: { type: Type.STRING, description: 'Acente koçunun bir sonraki deneme için altın tavsiyesi' }
          },
          required: ['score', 'ratingLabel', 'strengths', 'improvementAreas', 'starAnalysis', 'improvedVersion', 'coachTip']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Answer evaluation error:', error);
    res.status(500).json({ error: error.message || 'Cevap değerlendirilirken bir hata oluştu.' });
  }
});

// Endpoint 3: Analyze Trainings & Recommend Next Step Education
app.post('/api/career/analyze-trainings', async (req: Request, res: Response) => {
  try {
    const { trainings, careerGoal, currentRole } = req.body;

    if (!Array.isArray(trainings) || trainings.length === 0) {
      return res.status(400).json({ error: 'En az bir eğitim içeriği gereklidir.' });
    }

    const trainingSummaries = trainings.map((t: any, index: number) => `
${index + 1}. EĞİTİM:
- Başlık: ${t.title || 'Başlıksız'}
- Kurum / Sağlayıcı: ${t.provider || 'Belirtilmedi'}
- Tarih / Süre: ${t.date || 'Belirtilmedi'}
- Kazanılan Beceriler: ${t.skills || 'Genel'}
- İçerik Detayı:
${t.content || 'İçerik belirtilmedi'}
`).join('\n----------------------\n');

    const prompt = `
Sen stratejik bir Kariyer Gelişim Koçu ve Eğitim Müfredatı Danışmanısın.
Kullanıcı bugüne kadar katıldığı eğitimlerin içeriklerini sağladı. Kullanıcı bu eğitimlerin içeriklerini değiştirdikçe veya yenilerini ekledikçe kariyer basamakları için analiz talep ediyor.

Mevcut Pozisyon / Durum: "${currentRole || 'Kariyer Geliştirici'}"
Kariyer Hedefi: "${careerGoal || 'Kariyerinde bir sonraki kıdem basamağına yükselmek ve uzmanlaşmak'}"

KATILINAN EĞİTİMLER VE İÇERİKLERİ:
${trainingSummaries}

GÖREVİN:
1. Bu eğitim içeriklerini derinlemesine incele: Adayın mevcut yetkinlik haritasını, uzmanlık derinliğini ve kazandığı somut kasları çıkar.
2. Hedeflenen kariyer sıçraması için mevcut eğitimlerin nerede YETERSİZ veya EKSİK kaldığını (Skill Gaps / Kör Noktalar) açıkça belirle.
3. EN ÖNEMLİSİ: Bir sonraki adım için aday TAM OLARAK NASIL BİR EĞİTİM ALMALI?
   - Önerilen eğitimin spesifik başlığı ve konusu ne olmalı?
   - Bu eğitimin içinde mutlaka yer alması gereken kritik müfredat modülleri nelerdir?
   - Formatı nasıl olmalı? (Uygulamalı proje tabanlı mı, akredite sertifika mı, mimari derinlik mi?)
   - Hangi uluslararası sertifikasyonları hedeflemeli?
   - Öğrendiklerini kanıtlayacak örnek bir portföy/uygulama projesi ne olmalı?
   - 30 - 60 - 90 günlük adım adım eylem planı.
4. Koçun stratejik tavsiyesi.

Lütfen yanıtı eksiksiz ve detaylı JSON formatında döndür.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentSkillMatrix: {
              type: Type.OBJECT,
              properties: {
                levelTitle: { type: Type.STRING, description: 'Mevcut yetkinlik seviye tanımı (Örn: Yetkin Uygulayıcı, Junior-Mid, vb.)' },
                solidCompetencies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Eğitimlerle kazanılmış sağlam yetkinlikler'
                },
                summaryAnalysis: { type: Type.STRING, description: 'Mevcut eğitimlerin kullanıcıya kazandırdığı altyapının koçluk özeti' }
              },
              required: ['levelTitle', 'solidCompetencies', 'summaryAnalysis']
            },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  gapName: { type: Type.STRING, description: 'Eksik veya geliştirilmesi gereken yetkinlik alanı' },
                  impactLevel: { type: Type.STRING, description: 'Kritik / Yüksek / Orta' },
                  description: { type: Type.STRING, description: 'Bu eksiğin kariyer hedefine etkisi' }
                },
                required: ['gapName', 'impactLevel', 'description']
              }
            },
            nextTrainingRecommendation: {
              type: Type.OBJECT,
              properties: {
                trainingTitle: { type: Type.STRING, description: 'Alınması önerilen bir sonraki eğitimin adı/konsepti' },
                idealFormat: { type: Type.STRING, description: 'İdeal format (Örn: Hands-on Proje Kampı, Akredite Sertifika Programı, vb.)' },
                whyThisTraining: { type: Type.STRING, description: 'Neden tam olarak bu eğitimin alınması gerektiğinin gerekçesi' },
                curriculumModules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      moduleName: { type: Type.STRING, description: 'Modül başlığı' },
                      description: { type: Type.STRING, description: 'Öğrenilmesi gereken konular ve çıktılar' }
                    },
                    required: ['moduleName', 'description']
                  }
                },
                recommendedCertifications: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Hedeflenmesi tavsiye edilen prestijli sertifikalar'
                },
                capstoneProjectIdea: {
                  type: Type.OBJECT,
                  properties: {
                    projectTitle: { type: Type.STRING, description: 'Örnek portföy projesi başlığı' },
                    projectDetails: { type: Type.STRING, description: 'Projenin kapsamı ve CV ye etkisi' }
                  },
                  required: ['projectTitle', 'projectDetails']
                },
                actionPlan: {
                  type: Type.OBJECT,
                  properties: {
                    first30Days: { type: Type.STRING, description: 'İlk 30 gün eylemi' },
                    day31to60: { type: Type.STRING, description: '31-60 gün eylemi' },
                    day61to90: { type: Type.STRING, description: '61-90 gün eylemi' }
                  },
                  required: ['first30Days', 'day31to60', 'day61to90']
                }
              },
              required: ['trainingTitle', 'idealFormat', 'whyThisTraining', 'curriculumModules', 'recommendedCertifications', 'capstoneProjectIdea', 'actionPlan']
            },
            careerCoachAdvice: { type: Type.STRING, description: 'Acente koçunun nihai kariyer tavsiyesi ve motivasyon' }
          },
          required: ['currentSkillMatrix', 'skillGaps', 'nextTrainingRecommendation', 'careerCoachAdvice']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Training analysis error:', error);
    res.status(500).json({ error: error.message || 'Eğitim analizi yapılırken bir hata oluştu.' });
  }
});

// Setup Vite middleware in dev or static files in prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`KariyerPusula server running on http://0.0.0.0:${port}`);
});
