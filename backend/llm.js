const groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const llm = new groq({ apiKey: process.env.GROQ_API_KEY });

const ask_llm = async (prompt) => {
  const completion = await llm.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });

  return completion.choices[0].message.content;
};

module.exports = ask_llm;