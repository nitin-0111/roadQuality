import express, { Request, Response } from 'express';
import { getDataFromSensor, sendDataToFB, label,test } from '../controller/handleSensorDataController/index';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ msg: "ok !! " });
});

router.post("/getData", getDataFromSensor);
router.get("/test",test);
router.post("/sendData", sendDataToFB);
router.get("/label/:sessionId", label);

export default router;
