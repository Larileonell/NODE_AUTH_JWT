require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dbuser = process.env.DB_USER
const dbpass = process.env.DB_PASS
const app = express()
app.use(express.json())
const port = process.env.PORT
const user = require('./models/users')
mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.okofpf7.mongodb.net/?retryWrites=true&w=majority`

    ,).then(
        () => console.log("banco de dados conectado")
    ).catch((err) => console.log(err))

//register 
app.post('/auth/register', async (req, res) => {
    const { name, email, passaword, confimpassword } = req.body
   
        if (!name) { return res.status(422).json({ message: "o nome é obrigatorio" }) }
        if (!email) {
            return res.status(422).json({ message: "o email é obrigatorio" })
        }
        if (!passaword) {
            return res.status(422).json({ message: "a senha é obrigatorio" })
        }
        if (passaword != confimpassword){
            return res.status(422).json({message: "as senhas não conferem"})
        }

        const userExisits = await user.findOne({email: email})
        if (userExisits){
            return res.status(422).json({message: "Por favor, Ultilize outro email"})
        }
    // creat passaword
    const salt = await bcrypt.genSalt(10)
    const passawordHash = await bcrypt.hash(passaword, salt)
    // creat new user
    const User = new user ({
        name,
        email,
        passaword: passawordHash,
    })
    try {
         await User.save()
         res.status(200).json({message:"Novo usario cadastrado com sucesso"})
    } catch (error) {
        res.status(500.).json({message: error})
    }
    
  
}
)




app.listen(port, () => console.log(`tá rolando  API na porta: ${port}`))
