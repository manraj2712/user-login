const app = require("./app");

const connectWithDb = require("./config/db");

// connect with database
connectWithDb();
app.get("/",(req,res)=>{
    "Welcome to user login api";
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is up and running at port ${process.env.PORT}`);
});