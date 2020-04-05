async function fetchCoinAPI() {
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD';
    let result = await fetch(url);
    let jsonResult = await result.json();
    document.getElementById('USDPrice').innerHTML = jsonResult.USD;
    let VNDcurrency = await fetchExchange();
    document.getElementById('VNDPrice').innerHTML = formatMoney(VNDcurrency);
}

const fetchExchange = async () => {
    let result = await fetch(`https://free.currconv.com/api/v7/convert?q=USD_VND`); //add this to your url &compact=ultra&apiKey=${yourkey}
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

    var ret= s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")+' VNĐ';
    return ret.replace('.00','');
}

fetchCoinAPI();