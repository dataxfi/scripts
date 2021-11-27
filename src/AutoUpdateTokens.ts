const axios = require("axios").default;
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const schedule = require("node-schedule");
const http = require("http");
require("dotenv").config();
const rinkebyTokens = {
  name: "Datax",
  logoURI:
    "https://gateway.pinata.cloud/ipfs/QmadC9khFWskmycuhrH1H3bzqzhjJbSnxAt1XCbhVMkdiY",
  keywords: ["datatokens", "oceanprotocol", "datax"],
  tags: {
    datatokens: {
      name: "Datatokens",
      description:
        "Ocean Protocol's Datatokens that represent access rights to underlying data and AI services",
    },
  },
  timestamp: "2021-08-24T20:02:48+00:00",
  tokens: [
    {
      chainId: 4,
      address: "0xCF6823cf19855696D49c261e926dcE2719875C3D",
      symbol: "ZEASEA-66",
      pool: "0xfd81eD84494Fa548C0A8b815Fbdc3b6bd47FC3b2",
      name: "Zealous Seahorse Token",
      decimals: 18,
      logoURI:
        "https://gateway.pinata.cloud/ipfs/QmPQ13zfryc9ERuJVj7pvjCfnqJ45Km4LE5oPcFvS1SMDg/datatoken.png",
      tags: ["datatoken"],
    },
    {
      chainId: 4,
      address: "0x8D2da54A1691FD7Bd1cD0a242d922109B0616C68",
      symbol: "DAZORC-13",
      pool: "0xe817e4183A09512B7438E1a6f6c121DBc179538e",
      name: "Dazzling Orca Token",
      decimals: 18,
      logoURI:
        "https://gateway.pinata.cloud/ipfs/QmPQ13zfryc9ERuJVj7pvjCfnqJ45Km4LE5oPcFvS1SMDg/datatoken.png",
      tags: ["datatoken"],
    },
    {
      chainId: 4,
      address: "0x1d0C4F1DC8058a5395b097DE76D3cD8804ef6bb4",
      symbol: "SAGKRI-94",
      pool: "0xfdd3a4d1b4d96e9812e27897346006b906bd98ce",
      name: "Sagacious Krill Token",
      decimals: 18,
      logoURI:
        "https://gateway.pinata.cloud/ipfs/QmPQ13zfryc9ERuJVj7pvjCfnqJ45Km4LE5oPcFvS1SMDg/datatoken.png",
      tags: ["datatoken"],
    },
    {
      chainId: 4,
      address: "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
      symbol: "OCEAN",
      name: "Ocean Token",
      decimals: 18,
      logoURI:
        "https://gateway.pinata.cloud/ipfs/QmY22NH4w9ErikFyhMXj9uBHn2EnuKtDptTnb7wV6pDsaY",
      tags: ["oceantoken"],
    },
  ],
};

interface Hit {
  _id: string;
}

interface SingleTokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  pool: string;
}

/**
 * get all general token data by recursively fetching until total hits is reached. The accumulator and globalList params should not be passed manually.
 * @param chainId
 * @returns
 */

async function getTokenData(
  chainId: number,
  accumulator?: number | null,
  globalList?: Hit[]
): Promise<any> {
  let paginationValue: number = 100;
  if (!accumulator) accumulator = 0;
  if (!globalList) globalList = [];
  try {
    const response = await axios.post(
      "https://aquarius.oceanprotocol.com/api/v1/aquarius/assets/query",
      {
        from: accumulator,
        size: paginationValue,
        query: {
          bool: {
            filter: [
              { terms: { chainId: [chainId] } },
              { term: { _index: "aquarius" } },
              { term: { isInPurgatory: "false" } },
            ],
          },
        },
      }
    );

    const total: number = response.data.hits.total;
    globalList.push(...response.data.hits.hits);
    accumulator += paginationValue;
    if (total > accumulator && accumulator < 500) {
      await getTokenData(chainId, accumulator, globalList);
    }
    return await Promise.resolve(globalList);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * get all tokens that have a pool
 *
 */

async function parseTokenData(globalList: Hit[]): Promise<any> {
  const parsedList = globalList.map(async (token: Hit) => {
    try {
      const tokenDid: string = token._id;
      const response = await axios.get(
        `https://aquarius.oceanprotocol.com/api/v1/aquarius/assets/ddo/${tokenDid}`
      );

      const { dataTokenInfo, price } = response.data;

      if (price && price.type === "pool") {
        const { name, symbol, decimals } = dataTokenInfo;
        const tokenInfo: SingleTokenInfo = {
          address: dataTokenInfo.address,
          name: name,
          symbol: symbol,
          decimals: decimals,
          pool: price.address,
        };
        return tokenInfo;
      }
    } catch (error) {
      console.error(`ERROR: ${error.message}`);
      throw Error(`ERROR: ${error.message}`);
    }
  });

  const resolvedList: any = await Promise.allSettled(parsedList);
  const filteredList = resolvedList
    .filter((promise) => promise.value)
    .map((promise) => promise.value);
  return filteredList;
}

/**
 * prepare datatokens list (OCEAN + datatokens) to be published
 * @param tokens
 * @param chainId
 * @returns
 * a json list of datatokens
 */

async function prepareDataTokenList(tokens: any, chainId: number) {
  try {
    let listTemplate = {
      name: "Datax",
      logoURI:
        "https://gateway.pinata.cloud/ipfs/QmadC9khFWskmycuhrH1H3bzqzhjJbSnxAt1XCbhVMkdiY",
      keywords: ["datatokens", "oceanprotocol", "datax"],
      tags: {
        datatokens: {
          name: "Datatokens",
          description:
            "Ocean Protocol's Datatokens that represent access rights to underlying data and AI services",
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

    const tokensData = tokens.map((token) => {
      const { address, symbol, name, pool, decimals } = token;
      return {
        chainId,
        address,
        symbol,
        pool,
        name,
        decimals,
        logoURI:
          "https://gateway.pinata.cloud/ipfs/QmPQ13zfryc9ERuJVj7pvjCfnqJ45Km4LE5oPcFvS1SMDg/datatoken.png",
        tags: ["datatoken"],
      };
    });

    // fetch 1inch list
    let oceantoken = [
      {
        chainId,
        address: "0x8967bcf84170c91b0d24d4302c2376283b0b3a07",
        symbol: "OCEAN",
        name: "Ocean Token",
        decimals: 18,
        logoURI:
          "https://gateway.pinata.cloud/ipfs/QmY22NH4w9ErikFyhMXj9uBHn2EnuKtDptTnb7wV6pDsaY",
        tags: ["oceantoken"],
      },
    ];

    listTemplate.tokens = [...tokensData, ...oceantoken];

    listTemplate.timestamp = new Date()
      .toISOString()
      .replace(/.\d+[A-Z]$/, "+00:00");

    return listTemplate;
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    throw Error(`ERROR : ${e.message}`);
  }
}

async function createDataTokenList(chainId: number) {
  console.log("Generating new token list.");
  const tokenData = await getTokenData(chainId);
  const parsedData = await parseTokenData(tokenData);
  const tokenList = await prepareDataTokenList(parsedData, chainId);
  return JSON.stringify(tokenList);
}

/**
 * Deletes any old file in google drive, creates new file and saves to google drive.
 * @returns
 *
 */
async function writeToSADrive(chainIds: number[]): Promise<any> {
  const clientEmail = process.env.CLIENT_EMAIL;
  const privateKey = process.env.PRIVATE_KEY;
  const auth = new GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth: auth });

  chainIds.forEach(async (chainId, index) => {
    //list files to see it file already exists
    await drive.files.list(
      {
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
      },
      (err, res) => {
        if (err) return console.error("The API returned an error: " + err);
        const files = res.data.files;
        if (files.length && index === 0) {
          files.map(async (file) => {
            console.log(`Deleting ${file.name}: ${file.id}`);
            if (file.name != "datatokens4") {
              try {
                const res = await drive.files.delete({ fileId: file.id });
                console.log("Status " + res.status + ": deletion successful");
              } catch (error) {
                console.log(error);
              }
            }
          });
        } else {
          console.log("No files found.");
        }
      }
    );

    let datatokens;
    chainId === 4
      ? (datatokens = JSON.stringify(rinkebyTokens))
      : (datatokens = await createDataTokenList(chainId));

    console.log("Creating a new file");
    //create a file if no file exists
    await drive.files.create(
      {
        requestBody: {
          name: `datatokens${chainId}`,
          mimeType: "application/json",
        },
        media: {
          mimeType: "application/json",
          body: datatokens,
        },
      },
      (err, res) => {
        if (err) console.error(err);
        console.log(res.data);
      }
    );
  });
}

var requestListener = function (req, res) {
  if (req.url != "/favicon.ico") {
    // go to site directly to manually update the token list
    writeToSADrive([1, 137, 56, 4]);
  }
  console.log(req.url);
  res.writeHead(200);
  res.end("DataX");
};

var server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080, () => {
  var job = schedule.scheduleJob("* 0 * * *", function () {
    writeToSADrive([1, 137, 56]);
  });
});
