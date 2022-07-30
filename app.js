const express = require('express')
const app = express()
const path = require('path')
const {notice} = require("./firebase")
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.get('/', (req,res) => {
    res.render("index")
})

app.get('/admin',async(req,res)=>{
    const fireData = await notice.get();
    let data = []
    fireData.forEach((doc) => {
        let value = doc.data();
        data.push(value)
    });
    // res.send(data)
    res.render('admin', { data })
})

app.get('/adnot',(req,res)=>{
    res.render('adnot')
})

app.post('/adnot',async(req,res)=>{
    const data = req.body
    data.id = uuidv4();
    const dataRef = await notice.doc(data.id).set(req.body)
    res.redirect('/admin')
})

app.delete('/admin/:id',async(req,res)=>{
    const { id } = req.params
    const fireData = await notice.get();
    let data= []
    fireData.forEach((doc)=>{
        let value = doc.data();
        if(value.id === id){
            data.push(doc.id)
        }
    });
    const deleteData = await notice.doc(data[0]).delete();
    res.redirect('/admin')
})


app.get('/out',async (req,res)=>{
    const fireData = await notice.get();
    let data = []
    fireData.forEach((doc) => {
        let value = doc.data();
        data.push(value)
    });
    // res.send(data)
    res.render('out', { data })
})


app.listen(3000,()=>{
    console.log('server up')
})