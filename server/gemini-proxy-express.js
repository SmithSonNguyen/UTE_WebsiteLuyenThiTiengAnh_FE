import express from "express";
import dotenv from "dotenv";
import process from "process";
// >>> Thay thế 'node-fetch' bằng @google/genai SDK
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_KEY;
if (!GEMINI_KEY) {
  console.warn("GEMINI_KEY not set in env. Set GEMINI_KEY in your .env file.");
  // Nên dừng server hoặc trả về lỗi nếu không có key trong môi trường production
}

// Khởi tạo SDK với key API
// SDK sẽ tự động tìm GEMINI_API_KEY trong biến môi trường,
// nhưng ta sẽ truyền thủ công để đảm bảo sử dụng GEMINI_KEY.
const ai = new GoogleGenAI(GEMINI_KEY);

app.post("/api/gemini/translate", async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "text required" });

  try {
    // 💡 SỬ DỤNG PHƯƠNG THỨC 'generateContent' CỦA GEMINI SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Hoặc "gemini-2.5-pro"
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate the following English word or phrase to Vietnamese, and return ONLY the translated word or phrase. Do not include any explanations, definitions, or extra text. The phrase to translate is: "${text}"`,
            },
          ],
        },
      ],
      config: {
        // Có thể thêm maxOutputTokens nếu muốn giới hạn độ dài
        maxOutputTokens: 200,
      },
    });

    // Lấy nội dung dịch từ phản hồi
    const translated = response.text.trim();

    // Trả về kết quả dưới dạng { result: "..." } như client mong đợi
    res.json({ result: translated });
  } catch (err) {
    console.error("Gemini API Error:", err);
    // Có thể kiểm tra lỗi cụ thể để trả về mã trạng thái chính xác hơn
    res
      .status(500)
      .json({ error: "Lỗi nội bộ khi gọi API Gemini", message: err.message });
  }
});

const port = process.env.VITE_BACKEND_URL || 4000;
app.listen(port, () => console.log(`Gemini proxy listening on ${port}`));
