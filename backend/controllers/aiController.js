const generateReason = async (req, res) => {
  try {
    const { prompt, tone = 'Formal' } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt text is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      try {
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey });

        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that writes well-structured, professional leave requests for corporate employees. The tone should be ${tone}. Be concise.`
            },
            {
              role: 'user',
              content: `Write a professional leave request based on this reason: ${prompt}`
            }
          ],
          model: 'llama-3.3-70b-versatile',
        });

        const aiContent = completion.choices[0]?.message?.content || null;
        if (aiContent) {
          return res.status(200).json({ reason: aiContent.trim() });
        }
      } catch (_groqError) {
        // Fall through to mock response
      }
    }

    // Mock response fallback
    const toneMap = {
      Formal: `Dear Manager,\n\nI am writing to formally request leave due to: ${prompt}.\n\nI will ensure all pending tasks are completed before my absence and will catch up promptly upon my return. I kindly request your approval at the earliest convenience.\n\nThank you for your understanding.\n\nRegards`,
      Informal: `Hi,\n\nI wanted to let you know that I need to take some time off because: ${prompt}.\n\nI'll make sure everything is covered before I leave. Thanks for understanding!`,
      Urgent: `Dear Manager,\n\nI urgently need to request immediate leave due to: ${prompt}.\n\nThis is an unexpected situation that requires my immediate attention. I will ensure minimal disruption to ongoing work. Please approve at the earliest.\n\nThank you`,
    };

    return res.status(200).json({ reason: toneMap[tone] || toneMap['Formal'] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateReason };
