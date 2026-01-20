
import { GoogleGenAI } from "@google/genai";

// Use directly from process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (summaryData: any) => {
  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning/analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        As a financial expert for a credit union (Koperasi), analyze the following data:
        ${JSON.stringify(summaryData)}
        Provide a concise strategic summary in Indonesian focusing on:
        1. Liquidity health.
        2. Loan portfolio risk.
        3. Recommendation for the next month.
        Keep it under 150 words.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal mendapatkan analisis AI saat ini.";
  }
};

export const simulateLoanRisk = async (loanData: any, memberHistory: any) => {
  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning/analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Analyze this loan application for a Koperasi:
        Loan: ${JSON.stringify(loanData)}
        Member History: ${JSON.stringify(memberHistory)}
        Provide a risk score from 1-10 and a brief justification in Indonesian.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Analisis risiko tidak tersedia.";
  }
};
