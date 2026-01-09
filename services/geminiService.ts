import { GoogleGenAI } from "@google/genai";
import { AIAnalysis, ChannelData, OnboardingData, ContentIdea, StrategyStep } from "../types";

export const generateAudit = async (
  userData: OnboardingData,
  channelData: ChannelData,
  apiKey: string
): Promise<AIAnalysis> => {
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Prepare comments context
    const commentsContext = channelData.recentVideos
      .map(v => `Video: "${v.title}"\nComments: ${v.topComments.map(c => `- "${c.text}"`).join(', ')}`)
      .join('\n\n');

    // Enhanced Prompt for Audit
    const prompt = `
      أنت مدير قناة يوتيوب خبير (YouTube Strategist).
      
      **بيانات صانع المحتوى:**
      - المستوى: ${userData.creatorLevel}
      - الشغف/المجال: ${userData.passionNiche}
      - الستايل المفضل: ${userData.contentStyle}
      - الهدف الرئيسي: ${userData.primaryGoal}
      - الوقت المتاح: ${userData.weeklyHours} ساعات/أسبوعياً

      **بيانات القناة الحالية:**
      - المشتركين: ${channelData.subscriberCount}
      - المشاهدات الإجمالية: ${channelData.viewCount}
      - التفاعل: ${JSON.stringify(channelData.recentVideos.map(v => ({ title: v.title, views: v.viewCount })))}

      **تعليقات الجمهور (مهم جداً للتحليل):**
      ${commentsContext}

      **المطلوب (JSON Output ONLY):**
      قم بإنشاء كائن JSON بالهيكلية التالية:
      {
        "channelHealthScore": (0-100),
        "healthBreakdown": { "growth": number, "consistency": number, "engagement": number, "contentQuality": number },
        "keyInsights": ["3 نقاط تحليلية عميقة ومخصصة"],
        "strengths": ["نقطتان قوة"],
        "weaknesses": ["نقطتان ضعف"],
        "opportunities": ["فرصتان للنمو السريع"],
        "actionItems": [{ "title": string, "priority": "High"|"Medium"|"Low", "description": string }],
        "contentIdeas": [ // اعطني 5 أفكار مبدئية
          { 
            "title": "عنوان جذاب جداً", 
            "format": "Video" | "Short",
            "whyItWorks": "شرح مقنع",
            "score": (1-5),
            "basedOnComment": "اقتباس إن وجد" 
          }
        ],
        "strategyPlan": [ // خطة مبدئية من مرحلتين
          {
            "phase": "المرحلة 1",
            "timeline": "المدة",
            "focus": "التركيز",
            "actions": ["خطوة 1", "خطوة 2"]
          },
           {
            "phase": "المرحلة 2",
            "timeline": "المدة",
            "focus": "التركيز",
            "actions": ["خطوة 1", "خطوة 2"]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysis;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error; // Let the UI handle basic errors or return mock data here if preferred
  }
};

export const generateMoreIdeas = async (
  userData: OnboardingData,
  channelData: ChannelData,
  existingTitles: string[],
  apiKey: string
): Promise<ContentIdea[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      بدي كمان أفكار فيديوهات لقناة ${userData.passionNiche} بستايل ${userData.contentStyle}.
      
      **الأفكار السابقة (لا تكررها):**
      ${existingTitles.join(', ')}

      **المطلوب:**
      5 أفكار جديدة ومبتكرة جداً (Viral Ideas) بصيغة JSON Array:
      [
        {
          "title": "عنوان ملفت للنظر (Clickbait بس صادق)",
          "format": "Video" | "Short",
          "whyItWorks": "ليش هاي الفكرة رح تضرب؟",
          "score": 5,
          "basedOnComment": ""
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating ideas:", error);
    return [];
  }
};

export const regenerateStrategy = async (
  userData: OnboardingData,
  channelData: ChannelData,
  apiKey: string
): Promise<StrategyStep[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      بدي استراتيجية نمو جديدة ومفصلة لقناة ${userData.passionNiche} للمستوى ${userData.creatorLevel}.
      الهدف: ${userData.primaryGoal}.
      الوقت المتاح: ${userData.weeklyHours} ساعات.

      المطلوب: 3 مراحل (تأسيس، نمو، توسع) بصيغة JSON Array:
      [
         {
            "phase": "اسم المرحلة الجذاب",
            "timeline": "المدة الزمنية",
            "focus": "كلمة واحدة قوية",
            "actions": ["خطوة عملية 1", "خطوة عملية 2", "خطوة عملية 3"]
          }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error regenerating strategy:", error);
    return [];
  }
};