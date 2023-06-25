const express = require('express')
require("dotenv").config()
const chatRouter = express.Router()

const{CountModel}=require('../models/questionCount.model')

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
    apiKey: `${process.env.OPEN_AI_KEY}`,
});

const openai = new OpenAIApi(config);

let bag = [];


chatRouter.get("/dummy",(req,res)=>{
    res.send('welcome')
})

chatRouter.post('/chat', async (req, res) => {

    const payload = req.body.payload;

    try {
        const prompt = `${payload}`;

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 2048,
            temperature: 1,
        });

        const textResponse = response.data.choices[0].text;
        console.log(textResponse);
        bag = textResponse.split(' ');
        res.send({ "ans": `${textResponse}` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});


chatRouter.patch("/count", async (req, res) => {
    const AttempedQuestion = req.body.AttempedQuestion;
    const user = req.body.user;
  
    try {
      const data = await CountModel.findOne({ userID: user });
  
      if (data) {
        // User found, update count
        await CountModel.updateOne({ userID: user }, { count: AttempedQuestion });
        res.status(200).json({ message: "Count updated successfully." });
      } else {
        // User not found, create new document
        const newCount = new CountModel({count: AttempedQuestion, userID:user });
        await newCount.save();
        res.status(200).json({ message: "New count document created." });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating count." });
    }
  });

  chatRouter.get("/get/:id",async(req,res)=>{
    let id = req.params.id
    try {
      const data = await CountModel.findOne({userID:id})
      res.send({"data":data}) 
    } catch (error) {
      res.send({"msg":"user not found"})
    }
  })

module.exports={chatRouter}