const express = require('express')
const app = express()
app.use(express.json());
app.listen(3333)

//cors
const cors = require('cors')
app.use(cors())
app.options('*', cors())

const {Configuration, OpenAIApi} = require('openai')
const config = new Configuration({
    apikey: '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'
});

const openai = new OpenAIApi(config)

app.post('/api/call', async (req, res) => {
    const runPrompt = async () => {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: req.body.prompt,
            max_tokens: 1024,
            temperature: 0.8,
        })

        return response.data;

    }
    const respondeFromAPI = await runPrompt();

    console.log(respondeFromAPI)
    res.send(respondeFromAPI.choices[0].text)
})