// import exp from "constants"
import { error } from "console";
import express,{Request,Response} from "express";
import fs from 'fs';
import Data_preprocess from "./utils/data-preProcessing";
const app=express();


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
 
        const data=req.body;
        const sessionId:string=req.body.sessionId;
        const csvFileName:string=`${sessionId}.csv`;
        let csvData:string='time,z,y,x,accuracy\n';

        req.body.payload.forEach((item)=>{
            if(item.name==='accelerometer'){
                const {time,values,accuracy}=item;
                const {z,y,x}=values;
                const { ax_prime, ay_prime, az_prime }=Data_preprocess({x,y,z});
                csvData+= `${time},${ax_prime},${ay_prime},${az_prime},${accuracy}\n`;
            }
        })
        fs.appendFileSync(csvFileName,csvData);
   res.json("success")
})
app.get("/",(req:Request,res:Response)=>{
    res.json({msg:"succesfuuull "});
})
const port =8000;

app.listen(port ,()=>{
    console.log("server is running .." +port);
})


// z,y,x, lg ,l
// timestampe , log, lat ,  label,()
//           20.00001 2
//"dev": "tsc-watch --onSuccess \"nodemon dist/app.js\"",