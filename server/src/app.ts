// import exp from "constants"
import { error } from "console";
import express,{Request,Response} from "express";
import fs from 'fs';
const app=express();
const port =8000;

app.use(express.json());
const cnt=0;

function arrayToCSVRow(arr: any[]) {
    return arr.map(String).join(',') + '\n';
}

function appendToCSV(data:any){
    const csvRow=arrayToCSVRow([]);
    fs.appendFile('data.csv',csvRow,(err)=>{
         if(err)throw new error
    })
}
app.post("/getData",(req:Request,res:Response)=>{
    console.log("-------------------     ------->   ",cnt);
   console.log("req->body" , req.body);

   res.json("success")
})
app.listen(port ,()=>{
    console.log("server is running ..");
})


// z,y,x, lg ,l
// timestampe , log, lat ,  label,()
//           20.00001 2