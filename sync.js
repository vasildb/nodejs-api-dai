const { dbRun } = require("./helpers/database");
const { rpc } = require("./config");
const Web3 = require("web3");

function sync() {
	const web3 = new Web3(rpc);
	const DAI_ABI = require("./dai-abi.json");
	const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
	const contract = new web3.eth.Contract(DAI_ABI, DAI_ADDRESS);

	/*
		Listen for new blocks mined
		Get DAI transfers from the last block
		Insert them into database
	*/
	web3.eth
		.subscribe("newBlockHeaders", function () {})
		.on("data", () => {
			contract
				.getPastEvents("Transfer", {
					fromBlock: "latest",
				})
				.then((event) => {
					event.forEach((e) => {
						dbRun("INSERT INTO transactions VALUES (?,?,?,?)", [e.blockNumber, e.returnValues.src, e.returnValues.dst, e.returnValues.wad]);
					});
				});
		})
		.on("error", (e) => console.error("Can't connect to node. " + e.description));
}

module.exports = { sync };
