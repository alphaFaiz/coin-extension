//change coins list in this array
//coin's name - entry_target - capital
const coinsList = [
    'BTC',
    'ETH',
    'TLM-0.326_0.58-128.8',
    'TCT-0.029_0.039-86',
    'OGN-0.79_1.2-106.01',
    'LINK-47_100-100',
    'USDT',
];

const fetchCoinAPI = async () => {
    let totalInterestAmount = 0;

    coinsList.forEach(async (coinNameString) => {
        const coinNameComponents = coinNameString.split('-');
        // const coinName = coinNameComponents[0];
        // const range = coinNameComponents[1] ? `(${coinNameComponents[1]})` : '';
        let [coinName, range, capital] = coinNameComponents;

        let url = `https://min-api.cryptocompare.com/data/price?fsym=${coinName}&tsyms=USDT`;
        let fetchResult = await fetch(url);
        let jsonResult = await fetchResult.json();
        const currentPrice = jsonResult.USDT;
        
        let interest = 0;

        let interestElement = `<span></span>`;
        if (range) {
            let [entry, tp] = range.split('_');
            if (!isNaN(entry)) {
                interest = 100 * ( Number(currentPrice) - Number(entry) ) / entry;
            }
            range = `(${entry}_${tp})`
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
    });
    // Exchange USD to VNĐ
    let VNDcurrency = await fetchExchange();
    document.getElementById('VNDPrice').innerHTML = formatMoney(VNDcurrency);
    document.getElementById('totalInterest').innerHTML = `${totalInterestAmount.toFixed(2)}$`;
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