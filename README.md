# DAI token nodejs API

A REST API that provides information about the DAI smart contract, listing transactions, account balances and general usage statistics.

### Run locally

Rename `config.js.example` to `config.js`, and add a RPC server URL.
You can use [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/) to obtain an RPC to an Ethereum node.

A web server is started at http://localhost:3000

```bash
git clone https://github.com/vasildb/nodejs-api-dai.git
cd nodejs-api-dai
npm install
npm run start
```

### Running Tests

```bash
  npm run test
```

### API Reference

The `api_key` query param is required for all requests.

#### Sample api keys

| Key     | Limit (requests per minute) |
| ------- | --------------------------- |
| key1    | 1                           |
| key10   | 10                          |
| key1000 | 1000                        |

---

#### Endpoints

Get last 100 transactions, 10 per page

```
  GET /transactions/last100?api_key=<api_key>&page=<page>
```

Get all transactions where address is the sender

```
  GET /transactions/sender/<address>?api_key=<api_key>
```

Get all transactions where address is the recipient

```
  GET /transactions/recipient/<address>?api_key=<api_key>
```

Get address balance

```
  GET /balance/<address>?api_key=<api_key>
```

Get stats

```
  GET /stats?api_key=<api_key>&timeframe=<number_between_0_and_23>
```

Stats endpoint response:

```javascript
{
	"most_used_api_key": {
		"api_key": "key1000",
		"amount": 1
	},
	"max_activity": {
		"hour": 12, // means 12 and the next 2 hours
		"amount": 1
	},
	"total_requests_today_15hr": 0, // total requests today at 3pm
	"avg_requests_7days_15hr": 0 // avg number of requests at 3pm for the last 7 days
}
```

#### How it works

-   An empty database is created and seeded with the needed tables (transactions, logs, api_keys).
-   A web3 listener is instantiated to listen for new blocks, get the DAI transfer events and save them in database. _Ideally I would make this in a separate process, but sqlite doesn't allow writing from different processes._
-   A HTTP middleware is defined to log requests, check for valid api keys and its limits.
-   Routes are defined to allow querying the database, process and provide the needed data to the end user.

#### Notes

-   IDs are not used in sqlite, that's why I save the `api_key` in the logs table, and not its ID from the `api_keys` table.
-   DAI transactions are saved from the moment the app is started, not the beginning of the day. It usually takes 10 seconds for the database to be populated with a few records.
-   `dai-abi.json` file can be minimized further to just contain the needed bits.
