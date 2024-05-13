import express, { Request, Response } from 'express';
import { getDataFromSensor, sendDataToFB, label,test,getAllPotholes,hlabel } from '../controller/handleSensorDataController/index';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ msg: "server is Up & working.... !! " });
});

router.post("/getData", getDataFromSensor);  // data received  from sensors
router.get("/test",test);
router.post("/sendData", sendDataToFB); 
router.post('/hlabel',hlabel);
router.get("/label", label);
router.get("/allPotholes", getAllPotholes);

export default router;
