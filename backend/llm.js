const groq = require('groq-sdk'); // to import the llm model
require('dotenv').config(); // to retrieve the api key

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