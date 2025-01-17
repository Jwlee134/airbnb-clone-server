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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = void 0;
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var User_1 = __importDefault(require("../../model/User"));
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.query.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.default.findById(id).populate({
                        path: "rooms",
                        model: "Room",
                    })];
            case 2:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, res.status(200).send(user)];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(404).send("존재하지 않는 사용자입니다.")];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var s3, _a, avatarUrl, text, user, currentUser, userData, key, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                s3 = new aws_sdk_1.default.S3({
                    accessKeyId: process.env.S3_ACCESSKEY_ID,
                    secretAccessKey: process.env.S3_SECRET_ACCESSKEY_ID,
                });
                _a = req.body, avatarUrl = _a.avatarUrl, text = _a.text, user = _a.user, currentUser = _a.currentUser;
                if (currentUser !== user)
                    return [2 /*return*/, res.status(400).end()];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.default.findById(user)];
            case 2:
                userData = _b.sent();
                if (userData) {
                    if (text) {
                        userData.introduction = text;
                    }
                    if (avatarUrl) {
                        if (userData.avatarUrl.includes("amazon")) {
                            key = userData.avatarUrl.split("/avatar/")[1];
                            s3.deleteObject({
                                Bucket: process.env.S3_BUCKET_NAME + "/avatar",
                                Key: key,
                            }, function (err) {
                                if (err) {
                                    return res.status(500).send("다시 시도해 주세요.");
                                }
                            });
                        }
                        userData.avatarUrl = avatarUrl;
                    }
                    userData.save();
                    return [2 /*return*/, res.status(204).end()];
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(404).send("존재하지 않는 사용자입니다.")];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
//# sourceMappingURL=index.js.map