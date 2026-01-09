import { GoogleGenAI } from "@google/genai";
import { AIAnalysis, ChannelData, OnboardingData } from "../types";

export const generateAudit = async (
  userData: OnboardingData,
  channelData: ChannelData,
  apiKey: string
): Promise<AIAnalysis> => {
  try {
    // Use the key provided by the user
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Prepare comments context
    const commentsContext = channelData.recentVideos
      .map(v => `Video: "${v.title}"\nComments: ${v.topComments.map(c => `- "${c.text}"`).join(', ')}`)
      .join('\n\n');

    // Enhanced Prompt
    const prompt = `
      أنت محلل استراتيجي لقنوات يوتيوب (YouTube Strategist). مهمتك تحليل القناة بناءً على البيانات والتعليقات الحقيقية لتقديم خطة نمو مخصصة.

      **بيانات القناة:**
      - المشتركين: ${channelData.subscriberCount}
      - المشاهدات الإجمالية: ${channelData.viewCount}
      - عدد الفيديوهات: ${channelData.videoCount}
      - التفاعل: ${JSON.stringify(channelData.recentVideos.map(v => ({ title: v.title, views: v.viewCount, likes: v.likeCount })))}

      **تعليقات الجمهور (مهم جداً للتحليل):**
      ${commentsContext}

      **أهداف ومشاكل صانع المحتوى:**
      - الهدف: ${userData.primaryGoal}
      - المشكلة الرئيسية: ${userData.mainProblem}
      - العائق: ${userData.consistencyBlocker}
      - الوقت المتاح: ${userData.weeklyHours} ساعات/أسبوعياً

      **المطلوب (JSON Output ONLY):**
      قم بإنشاء كائن JSON بالهيكلية التالية بدقة:
      {
        "channelHealthScore": (number 0-100),
        "healthBreakdown": { "growth": number, "consistency": number, "engagement": number, "contentQuality": number },
        "keyInsights": [3 جمل قوية مبنية على الأرقام والتعليقات],
        "strengths": [نقطتان قوة],
        "weaknesses": [نقطتان ضعف],
        "opportunities": [نقطتان للنمو],
        "actionItems": [{ "title": string, "priority": "High"|"Medium"|"Low", "description": string }],
        "contentIdeas": [
          { 
            "title": "عنوان مقترح جذاب", 
            "format": "Video" | "Short" | "Community",
            "whyItWorks": "شرح سبب الاقتراح (مثلاً: لأن الجمهور سأل عنه في التعليقات)",
            "score": (1-5),
            "basedOnComment": "اقتبس التعليق الذي ألهمك بهذه الفكرة إن وجد" 
          }
        ],
        "strategyPlan": [
          {
            "phase": "المرحلة الأولى (التأسيس)",
            "timeline": "أول أسبوعين",
            "focus": "كلمة واحدة (مثلاً: الانتظام)",
            "actions": ["خطوة عملية 1", "خطوة عملية 2", "خطوة عملية 3"]
          },
          {
            "phase": "المرحلة الثانية (النمو)",
            "timeline": "الشهر الأول",
            "focus": "كلمة واحدة (مثلاً: التوسع)",
            "actions": ["خطوة عملية 1", "خطوة عملية 2"]
          }
        ]
      }

      **ملاحظات:**
      1. الأفكار يجب أن تكون مستوحاة من تعليقات الجمهور المرفقة بالأعلى.
      2. الاستراتيجية يجب أن تراعي وقت المستخدم (${userData.weeklyHours} ساعات).
      3. كن صريحاً ومباشراً وباللغة العربية.
    `;

    // Using gemini-2.0-flash-exp as it is robust and stable for analysis
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysis;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback Mock Data with explicit error message in insights
    return {
      channelHealthScore: 0,
      healthBreakdown: { growth: 0, consistency: 0, engagement: 0, contentQuality: 0 },
      keyInsights: [`حدث خطأ في الاتصال بالذكاء الاصطناعي: ${error instanceof Error ? error.message : "غير معروف"}`],
      strengths: ["-"],
      weaknesses: ["-"],
      opportunities: ["-"],
      actionItems: [{ title: "تحقق من المفتاح", priority: "High", description: "المفتاح المدخل غير صحيح أو انتهت صلاحيته." }],
      contentIdeas: [],
      strategyPlan: [
        {
          phase: "خطأ في الاتصال",
          timeline: "الآن",
          focus: "الإصلاح",
          actions: ["تأكد من نسخ Gemini API Key بشكل صحيح", "تأكد من تفعيل الفوترة في مشروعك إذا لزم الأمر"]
        }
      ]
    };
  }
};