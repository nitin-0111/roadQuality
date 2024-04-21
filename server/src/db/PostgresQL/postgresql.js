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
exports.RoadQualityService = void 0;
var pg_1 = require("pg");
var fs = require("fs");
var pg_copy_streams_1 = require("pg-copy-streams");
var RoadQualityService = /** @class */ (function () {
    function RoadQualityService() {
        this.client = new pg_1.Client({
            host: "localhost",
            user: "postgres",
            port: 5432,
            password: "123456",
            database: "postgres",
        });
    }
    RoadQualityService.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        console.log("Connected to the database");
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error connecting to database:", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadQualityService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.end()];
                    case 1:
                        _a.sent();
                        console.log("Disconnected from the database");
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error disconnecting from database:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadQualityService.prototype.installPostGISExtension = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.query("CREATE EXTENSION IF NOT EXISTS postgis;")];
                    case 1:
                        _a.sent();
                        console.log("PostGIS extension installed or already exists.");
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error installing PostGIS extension:", error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadQualityService.prototype.createTableIfNotExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.query("\n        CREATE TABLE IF NOT EXISTS road_quality (\n          id SERIAL PRIMARY KEY,\n          time TIMESTAMP,\n          road_geometry GEOMETRY(LINESTRING),\n          quality_label VARCHAR(50)\n        );\n      ")];
                    case 1:
                        _a.sent();
                        console.log("Table road_quality created or already exists.");
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error creating table:", error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoadQualityService.prototype.insertDataIntoDB = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var stream_1, fileStream, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 6]);
                        // Begin a transaction
                        return [4 /*yield*/, this.client.query('BEGIN')];
                    case 1:
                        // Begin a transaction
                        _a.sent();
                        stream_1 = this.client.query((0, pg_copy_streams_1.from)('COPY road_quality (time, road_geometry, quality_label) FROM STDIN DELIMITER \',\' CSV HEADER'));
                        fileStream = fs.createReadStream(filePath);
                        // Pipe the file stream to the PostgreSQL stream
                        fileStream.pipe(stream_1);
                        // Wait for the stream to finish
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                stream_1.on('end', resolve);
                                stream_1.on('error', reject);
                            })];
                    case 2:
                        // Wait for the stream to finish
                        _a.sent();
                        // Commit the transaction
                        return [4 /*yield*/, this.client.query('COMMIT')];
                    case 3:
                        // Commit the transaction
                        _a.sent();
                        console.log("Data inserted into road_quality table.");
                        return [3 /*break*/, 6];
                    case 4:
                        error_5 = _a.sent();
                        // Rollback the transaction in case of error
                        return [4 /*yield*/, this.client.query('ROLLBACK')];
                    case 5:
                        // Rollback the transaction in case of error
                        _a.sent();
                        console.error("Error inserting data into table:", error_5);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoadQualityService.prototype.getDataFromDB = function (longitude, latitude, range) {
        if (range === void 0) { range = "1km"; }
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT *, ST_AsText(road_geometry) AS segments\n        FROM road_quality\n        WHERE ST_DWithin(\n          road_geometry,\n          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,\n          $3::geography\n        );\n      ";
                        return [4 /*yield*/, this.client.query(query, [longitude, latitude, range])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error fetching data:", error_6);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RoadQualityService;
}());
exports.RoadQualityService = RoadQualityService;
// Example usage:
function exampleUsage() {
    return __awaiter(this, void 0, void 0, function () {
        var roadQualityService, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roadQualityService = new RoadQualityService();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 9]);
                    return [4 /*yield*/, roadQualityService.connect()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, roadQualityService.installPostGISExtension()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, roadQualityService.createTableIfNotExists()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, roadQualityService.insertDataIntoDB("./output.csv")];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 6:
                    error_7 = _a.sent();
                    console.log("Error:", error_7);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, roadQualityService.disconnect()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exampleUsage();
