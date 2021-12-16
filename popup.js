//change coins list in this array
//coin's name - entry_target - quantity
const coinsList = [
    'BTC',
    'ETH',
    'GLCH',
    'C98-3.8-27.47',
    'ATOM-37.9-8.28',
    'NEAR-7.5-20.7',
    'CELO-5.7-14.59',
    'SLRS-0.4308_2-241.92',
    'LINK-47_50.9-2.14',
];

const fetchCoinAPI = async () => {
    let totalInterestAmount = 0;

    for (const coinNameString of coinsList) {
        const coinNameComponents = coinNameString.split('-');
        let [coinName, range, quantity] = coinNameComponents;

        let fetchResult = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${coinName}&tsyms=USDT`);
        let jsonResult = await fetchResult.json();
        let currentPrice = jsonResult.USDT;
        if (!currentPrice) {
            fetchResult = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${coinName}&tsyms=USD`);
            jsonResult = await fetchResult.json();
            currentPrice = jsonResult.USD;
        }

        let interest = 0;

        let capital = 0;
        let interestElement = `<span></span>`;
        if (range) {
            let [entry, tp] = range.split('_');
            if (!isNaN(entry)) {
                capital = Number(entry) * Number(quantity);
                interest = 100 * ( Number(currentPrice) - Number(entry) ) / entry;
            }
            range = `(${entry}${tp ? '_' + tp : ''})`
        } else {
            range = ''
        }
        if (interest != 0) {
            const interestAmount = (interest * Number(capital)/100).toFixed(2);
            totalInterestAmount += Number(interestAmount);
            interestElement = interest > 0 ? 
            `<span style="color: green;">+${interest.toFixed(2)}% |${interestAmount}$</span>` :
            `<span style="color: red;">${interest.toFixed(2)}% |${interestAmount}$</span>`
        }

        document.getElementById(`currenciesList`).innerHTML += `
        <h3>
        <a target="blank" href="https://www.cryptocompare.com/coins/${coinName.toLowerCase()}/overview/USDT">${coinName}${range}:</a> 
        <span style="color: blue;">$${currentPrice}</span> ${interestElement}
        </h3>`
    }

    // Exchange USD to VNĐ
    document.getElementById('totalInterest').innerHTML = `${totalInterestAmount.toFixed(2)}$`;
    let usdtFetchResult = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=USD`);
    let usdtJsonResult = await usdtFetchResult.json();
    document.getElementById('USDT').innerHTML = `${usdtJsonResult.USD}$`;
    let VNDcurrency = await fetchExchange();
    document.getElementById('VNDPrice').innerHTML = formatMoney(VNDcurrency);
}

const fetchExchange = async () => {
    let result = await fetch(`https://free.currconv.com/api/v7/convert?q=USD_VND&compact=ultra&apiKey=adeffb2a37fa8b7a98aa`); //add this to your url &compact=ultra&apiKey=${yourkey}
    result = await result.json();
    return result.USD_VND;
}

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    var ret = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + ' VNĐ';
    return ret.replace('.00', '');
}

fetchCoinAPI();