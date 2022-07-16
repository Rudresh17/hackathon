const express= require("express")
const dotnev= require("dotenv")
const cors = require('cors')

dotnev.config({path : "./config/config.env"})

const app =express()
app.use(cors())
const PORT= process.env.PORT || 5000
app.all('*', (req, res, next) => {
     res.header("Access-Control-Allow-Origin", "x");
     next();
 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/disease",require("./routes/disease"))

app.listen(PORT,console.log(`Server running ${process.env.NODE_ENV} on port ${PORT}`))
console.log("hello")
app.get('/', (req, res) => {
    res.send('Hello World!')
  })