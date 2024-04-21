"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var fs = require("fs");
var RoadDataORM = /** @class */ (function () {
    function RoadDataORM() {
        this.pool = new pg_1.Pool({
            host: 'localhost',
            user: 'postgres',
            port: 5432,
            password: '123456',
            database: 'postgres',
        });
    }
    RoadDataORM.prototype.testConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.query('SELECT version()')];
                    case 1:
                        res = _a.sent();
                        console.log(res.rows[0]);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Error connecting to database:', err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadDataORM.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        _a.sent();
                        console.log('Connected to the database');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error connecting to database:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadDataORM.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.end()];
                    case 1:
                        _a.sent();
                        console.log('Disconnected from the database');
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error disconnecting from database:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadDataORM.prototype.createTableIfNotExist = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.query("CREATE TABLE IF NOT EXISTS roadlabeldData (\n                id SERIAL PRIMARY KEY,\n                time TIMESTAMPTZ,\n                geom GEOMETRY(LINESTRING, 4326)\n            )")];
                    case 1:
                        _a.sent();
                        console.log('Table created or already exists');
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error creating table:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadDataORM.prototype.insertData = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var csvData, rows, _i, rows_1, row, _a, rawTime, longitude_s, latitude_s, longitude_e, latitude_e, quality_label, time, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        csvData = fs.readFileSync(filepath, 'utf-8');
                        rows = csvData.split('\n').slice(1);
                        _i = 0, rows_1 = rows;
                        _b.label = 1;
                    case 1:
                        if (!(_i < rows_1.length)) return [3 /*break*/, 4];
                        row = rows_1[_i];
                        _a = row.split(','), rawTime = _a[0], longitude_s = _a[1], latitude_s = _a[2], longitude_e = _a[3], latitude_e = _a[4], quality_label = _a[5];
                        time = void 0;
                        try {
                            time = new Date(parseInt(rawTime) / 1e6); // Convert nanoseconds to milliseconds and create a Date object
                            if (isNaN(time.getTime())) {
                                throw new Error('Invalid time value');
                            }
                        }
                        catch (error) {
                            console.error('Error parsing time value:', error);
                            return [3 /*break*/, 3]; // Skip this row and proceed with the next one
                        }
                        return [4 /*yield*/, this.pool.query('INSERT INTO roadlabeldData (time, geom) VALUES ($1, ST_SetSRID(ST_MakeLine(ST_MakePoint($2, $3), ST_MakePoint($4, $5)), 4326))', [time, longitude_s, latitude_s, longitude_e, latitude_e])];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log('Data inserted successfully');
                        return [3 /*break*/, 6];
                    case 5:
                        error_4 = _b.sent();
                        console.error('Error inserting data:', error_4);
                        throw error_4;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoadDataORM.prototype.getData = function (longitude, latitude, radius) {
        if (radius === void 0) { radius = 1000; }
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.query("SELECT time, ST_X(ST_StartPoint(geom)) as longitude_s, ST_Y(ST_StartPoint(geom)) as latitude_s, \n                ST_X(ST_EndPoint(geom)) as longitude_e, ST_Y(ST_EndPoint(geom)) as latitude_e, 'quality_label' as quality_label\n                FROM roadlabeldData \n                WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)", [longitude, latitude, radius])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting data:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RoadDataORM;
}());
// Example usage:
function exampleUsage() {
    return __awaiter(this, void 0, void 0, function () {
        var roaddataORMinstance, data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roaddataORMinstance = new RoadDataORM();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, roaddataORMinstance.connect()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, roaddataORMinstance.getData(75.8205074, 26.8630226)];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    return [4 /*yield*/, roaddataORMinstance.disconnect()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_6 = _a.sent();
                    console.error('Error in example usage:', error_6);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// await roaddataORMinstance.createTableIfNotExist();
// await roaddataORMinstance.insertData("./output.csv");
exampleUsage();
