require('dotenv').config()
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    const inputText = req.body.input
    const prompt =  `<s>[INST] ${inputText.trim()} [/INST]`
    const response = await fetch(`https://api-inference.huggingface.co/models/${process.env.MODEL_DETAILS}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            inputs: prompt
         })
      });
    
    const result = await response.json();

    if (result[0]?.generated_text) {
        return res.status(200).json({
            success: true,
            data: {
                result: result
            }
        })
    } else {
        return res.status(404).json({
            success: true,
            data: {
                failed: true
            }
        })
    }
})


module.exports = router