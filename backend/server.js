import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt'

const app= express()

app.use(express.json())
app.use(cors())

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Root@123',
    database:'code'
})
const salt=5;
app.post("/register",(req,res)=>{
    const sql="INSERT INTO reg (username,email, password) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt,(err,hash)=>{
        if(err) return res.json("Error")
            const values=[req.body.username,req.body.email, hash]
        db.query(sql,[values],(err,result)=>{
            if(err) console.log(err)
            else return res.json(result)
        }
        )
     })
})

app.post("/login",(req,res)=>{
    const sql="SELECT * FROM reg WHERE `email`=?";
    db.query(sql,[req.body.email],(err,result)=>{
        if(err) return res.json ({Erro:"Error"})
        else {
    if(result.length>0){
        bcrypt.compare(req.body.password.toString(),result[0].password,(ee,response)=>{
            if(err) return res.json({Erro:"Error"})
                if(response) return res.json({Status:"Success"})
                    else return res.json({Error :"Wrong Password"})
        })   
    }else{
        return res.json({Error:"Wrong Email"})
    }}
    })
    bcrypt.hash(req.body.password.toString(), salt,(err,hash)=>{
        if(err) return res.json("Error")
            const values=[req.body.username,req.body.email, hash]
        db.query(sql,[values],(err,result)=>{
            if(err) console.log(err)
            else return res.json(result)
        }
        )
     })
})
app.listen(8081, ()=>{
    console.log("Server is running on port 8081") 
})