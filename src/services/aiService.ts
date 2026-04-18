import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const aiService = {
  async analyzeResume(resumeText: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this resume text and extract structured data: ${resumeText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            headline: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  period: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING }
                }
              }
            },
            atsScore: { type: Type.NUMBER },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "skills", "atsScore"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async improveResume(resumeData: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest improvements and rewrites for this resume data to make it more professional and ATS-friendly: ${JSON.stringify(resumeData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedHeadline: { type: Type.STRING },
            improvedBullets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  improved: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async matchJob(profileData: any, jobDescription: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Score the match between this user profile and job description. 
      Profile: ${JSON.stringify(profileData)}
      Job: ${jobDescription}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Match score from 0 to 100" },
            reasoning: { type: Type.STRING },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            fitAnalysis: { type: Type.STRING }
          },
          required: ["score", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateRoadmap(targetRole: string, currentProfile: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a career roadmap to become a ${targetRole} starting from this profile: ${JSON.stringify(currentProfile)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  milestone: { type: Type.STRING },
                  description: { type: Type.STRING },
                  skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
                  duration: { type: Type.STRING }
                }
              }
            },
            totalEstimatedTime: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateCoverLetter(profileData: any, jobData: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional cover letter for this job and user profile.
      Profile: ${JSON.stringify(profileData)}
      Job: ${JSON.stringify(jobData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverLetter: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateInterviewResponse(job: any, profile: any, history: {role: string, text: string}[]) {
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction: `You are an expert technical and behavioral interviewer hiring for the role of ${job.title} at ${job.company}.
The candidate's profile is: ${JSON.stringify(profile)}.
Your goal is to conduct a realistic mock interview. Ask one question at a time. Do not break character. Start by greeting the candidate and asking the first question.`
      }
    });
    return response.text || "";
  },

  async generateJobDescription(title: string, company: string, type: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a professional, attractive job description for a ${type} ${title} role at ${company}. Keep it structured. Do not use markdown like asterisks or hash symbols, just use plain text with line breaks. Keep it under 200 words.`,
    });
    return response.text || "";
  }
};
