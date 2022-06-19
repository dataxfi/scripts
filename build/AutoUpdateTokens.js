var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a = require("graphql-request"), GraphQLClient = _a.GraphQLClient, gql = _a.gql;
var oceanAddresses = {
    1: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
    4: "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
    56: "0xdce07662ca8ebc241316a15b611c89711414dd1a",
    137: "0x282d8efCe846A88B159800bd4130ad77443Fa1A1",
    246: "0x593122aae80a6fc3183b2ac0c4ab3336debee528",
    1285: "0x99C409E5f62E4bd2AC142f17caFb6810B8F0BAAE",
};
var chains = {
    1: "mainnet",
    4: "rinkeby",
    56: "bsc",
    137: "polygon",
    246: "energyweb",
    1285: "moonriver",
};
function getTokenData(chainId, accumulator, globalList) {
    return __awaiter(this, void 0, void 0, function () {
        var paginationValue, endpoint, graphQLClient, query, response, total, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paginationValue = 500;
                    if (!accumulator)
                        accumulator = 0;
                    if (!globalList)
                        globalList = [];
                    endpoint = "https://v4.subgraph.".concat(chains[chainId], ".oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph");
                    graphQLClient = new GraphQLClient(endpoint, { headers: {} });
                    query = gql(__makeTemplateObject(["\n    {\n      tokens(where: { isDatatoken: true }, first: 1000) {\n        symbol\n        decimals\n        address\n        name\n        supply\n        pools {\n          id\n        }\n        fixedRateExchanges {\n          active\n          exchangeId\n        }\n      }\n    }\n  "], ["\n    {\n      tokens(where: { isDatatoken: true }, first: 1000) {\n        symbol\n        decimals\n        address\n        name\n        supply\n        pools {\n          id\n        }\n        fixedRateExchanges {\n          active\n          exchangeId\n        }\n      }\n    }\n  "]));
                    console.log(query);
                    console.log(endpoint);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4, graphQLClient.request(query)];
                case 2:
                    response = _a.sent();
                    total = response.tokens.length;
                    globalList.push(response.tokens);
                    accumulator += paginationValue;
                    if (!(total > accumulator)) return [3, 4];
                    return [4, getTokenData(chainId, accumulator, globalList)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4, Promise.resolve(globalList.flat())];
                case 5: return [2, _a.sent()];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error: ".concat(error_1.message), error_1);
                    return [3, 7];
                case 7: return [2];
            }
        });
    });
}
function parseTokenData(globalList) {
    return globalList.map(function (token) {
        try {
            return __assign(__assign({}, token), { isFRE: token.pools.length > 0 ? false : true });
        }
        catch (error) {
            console.error("ERROR: ".concat(error.message));
        }
    });
}
function prepareDataTokenList(tokens, chainId) {
    console.log(tokens);
    try {
        var tokenList = {
            name: "Datax",
            logoURI: "https://gateway.pinata.cloud/ipfs/QmadC9khFWskmycuhrH1H3bzqzhjJbSnxAt1XCbhVMkdiY",
            keywords: ["datatokens", "oceanprotocol", "datax"],
            tags: {
                datatokens: {
                    name: "Datatokens",
                    description: "Ocean Protocol's Datatokens that represent access rights to underlying data and AI services",
                },
            },
            timestamp: "",
            tokens: [],
            version: {
                major: 1,
                minor: 0,
                patch: 0,
            },
        };
        var tokensData = tokens.map(function (token) {
            return __assign(__assign({}, token), { chainId: chainId, logoURI: "https://gateway.pinata.cloud/ipfs/QmPQ13zfryc9ERuJVj7pvjCfnqJ45Km4LE5oPcFvS1SMDg/datatoken.png", tags: ["datatoken"] });
        });
        var oceantoken = [
            {
                chainId: chainId,
                address: oceanAddresses[chainId],
                symbol: "OCEAN",
                name: "Ocean Token",
                decimals: 18,
                logoURI: "https://gateway.pinata.cloud/ipfs/QmY22NH4w9ErikFyhMXj9uBHn2EnuKtDptTnb7wV6pDsaY",
                tags: ["oceantoken"],
            },
        ];
        tokenList.tokens = __spreadArray(__spreadArray([], tokensData, true), oceantoken, true);
        tokenList.timestamp = new Date().toISOString().replace(/.\d+[A-Z]$/, "+00:00");
        return tokenList;
    }
    catch (e) {
        console.error("ERROR: ".concat(e.message));
    }
}
function createDataTokenList(chainId) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenData, parsedData, tokenList, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Generating new token list for ".concat(chainId, "."));
                    return [4, getTokenData(chainId)];
                case 1:
                    tokenData = _a.sent();
                    parsedData = parseTokenData(tokenData);
                    tokenList = prepareDataTokenList(parsedData, chainId);
                    return [3, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
}
function main(chainIds) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            chainIds.forEach(function (chainId) { return __awaiter(_this, void 0, void 0, function () {
                var datatoken, fileName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, createDataTokenList(chainId)];
                        case 1:
                            datatoken = _a.sent();
                            fileName = "chain".concat(chainId);
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    });
}
main([1, 4, 137, 56, 246, 1285]);
//# sourceMappingURL=AutoUpdateTokens.js.map