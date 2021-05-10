import { abi_erc20 } from './abi/abi_erc20.js'

let web3 = new Web3('wss://api.avax.network/ext/bc/C/ws');

let bmfcontract = new web3.eth.Contract(abi_erc20, '0x9E7890B2E2dE38D764A29b0DE1e2B9b37C90Ddb9');

let usdtpair = new web3.eth.Contract(abi_erc20, '0x9de728D3e80e968b947a424480b33a22e52Bc3bD')

const pretty = (n) => {
    if ( n / 1000000 >= 1000 ) {
        return parseInt(n / 1000000000) + '.' + ((n % 1000000000) / 10000000) + 'B'
    } else if ( n / 1000000 >= 1 ) {
        return parseInt(n / 1000000) + '.' + parseInt((n % 1000000) / 10000) + 'M'
    } else if ( n / 1000 >= 100 ) {
        return parseInt(n / 1000) + ' K'
    } else if ( n / 1000 >= 10 ) {
        return parseInt(n / 1000) + '.' + parseInt((n % 1000) / 100) + 'K'
    } else if ( n / 1000 >= 1 ) {
        return parseInt(n / 100 ) + '.' + parseInt((n % 100) / 10) + 'K'
    } else if ( parseInt(n) == 0 ) {
        return ''
    } else if ( n < 1000 ) {
        return parseInt(n)
    } else {
        return n
    }
}

const quad = (v) => {
    let prefix = (parseFloat(v) / 1e24).toFixed(2)
    if ( prefix.endsWith('.00') ) {
        return prefix.split('.')[0] + ' Quadrillion'    
    }
    return prefix + ' Quadrillion'
}

Promise.all([
    Promise.resolve(parseFloat(1e26)), 
    bmfcontract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call().then(result => {
    document.getElementById('burnpile').innerHTML = quad(result);    
    return parseFloat(result)
}), bmfcontract.methods.balanceOf('0xE124d1b6F4C3D7C9EAd6a50692FC3bd2b4e7801f').call().then(result => {
    document.getElementById('billpile').innerHTML = quad(result);        
    return parseFloat(result)
}), usdtpair.methods.getReserves().call().then(result => {
    let price = (result[1] / 1e6) / (result[0] / 1e9);
    document.getElementById('price').innerHTML = price.toFixed(18);
    return price;
})]).then(results => {
    let mks = results[0] - results[1]
    let cs = mks - results[2]
    console.log(mks, results[3])
    document.getElementById('minted').innerHTML = quad(results[0]); 
    document.getElementById('marketcap').innerHTML = pretty(mks * results[3] / 1e9);
    document.getElementById('circulating').innerHTML = quad(cs);
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