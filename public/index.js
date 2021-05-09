import { abi_erc20 } from './abi/abi_erc20.js'

let web3 = new Web3('wss://api.avax.network/ext/bc/C/ws');

let bmfcontract = new web3.eth.Contract(abi_erc20, '0x9E7890B2E2dE38D764A29b0DE1e2B9b37C90Ddb9');

let usdtpair = new web3.eth.Contract(abi_erc20, '0x9de728D3e80e968b947a424480b33a22e52Bc3bD')

Promise.all([bmfcontract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call().then(result => {
    let qn = parseFloat(result) / 1e24
    document.getElementById('burnpile').innerHTML = qn.toFixed(2) + ' Quadrillion';
    let rs = 1e17 - parseFloat(result) / 1e18
    console.log('rs:', rs)
    return rs
}), usdtpair.methods.getReserves().call().then(result => {
    let price = (result[1] / 1e6) / (result[0] / 1e9)
    document.getElementById('price').innerHTML = price.toFixed(18);
    return price;
})]).then(results => {
    document.getElementById('marketcap').innerHTML = results[0] * results[1];
});

fetch('https://cchain.explorer.avax.network/token-counters?id=0x9E7890B2E2dE38D764A29b0DE1e2B9b37C90Ddb9', {
    Accept: 'application/json'
}).then(res => res.json()).then(json => { 
    document.getElementById('hodlers').innerHTML = json.token_holder_count;
    document.getElementById('transfers').innerHTML = json.transfer_count;
});

fetch('https://cchain.explorer.avax.network/address-counters?id=0x9E7890B2E2dE38D764A29b0DE1e2B9b37C90Ddb9', {
    Accept: 'application/json'
}).then(res => res.json()).then(json => { 
    document.getElementById('transactions').innerHTML = json.transaction_count;
});