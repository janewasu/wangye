const plateApiUrl30 = 'https://apphq.longhuvip.com/w1/api/index.php?Order=1&a=RealRankingInfo&st=30&apiv=w21&Type=1&c=ZhiShuRanking&PhoneOSNew=1&VerSion=5&ZSType=5&';
let platesList30 = [];
let calculatedPlates30 = new Set();
let currentPlateName30 = '';

// fetchPlates30(apiUrl)：用于从API获取板块数据，并更新板块列表
async function fetchPlates30() {
    try {
        const response = await fetch(plateApiUrl30);
        const data = await response.json();
        platesList30 = data.list.slice(0, 30); // 假设返回的数据格式中有list字段，且我们只关注前30个板块

        // updatePlateTable30()：用于将获取到的板块数据更新到页面的板块列表中
        updatePlateTable30();
        if (platesList30.length > 0) {
            displayComponentStocks30(platesList30[0][0]); // displayComponentStocks30(plateID)：用于获取并显示所选板块的成分股信息。
            setActivePlate30(0);
            currentPlateName30 = platesList30[0][1];
            for (let i = 0; i < 10 && i < platesList30.length; i++) {
                calculateLimitUpCount30(platesList30[i][0], i);
                calculatedPlates30.add(i);
            }
        }
    } catch (error) {
        console.error("获取板块数据失败:", error);
    }
}

function updatePlateTable30() {
    const plateTableBody30 = document.getElementById('plate-table-body30');
    plateTableBody30.innerHTML = "";

    platesList30.forEach((item, index) => {
        const row = plateTableBody30.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.innerText = index + 1;
        cell2.innerText = item[1];
        cell3.innerText = item[2];
        let percentage = parseFloat(item[3]).toFixed(2);
        let style = '';
        if (percentage > 0) {
            style = percentage > 9.9 ? 'display:block;text-align:center;color: white; background-color: #800020; font-size: 14px;' : 'color: red;';
        } else if (percentage < 0) {
            style = percentage < -9.9 ? 'color:#fff; background-color: #00FF00; font-size: 14px;' : 'color: #00FF00;';
        }
        cell4.innerHTML = `<span style="${style}">${percentage}</span>`;
        cell5.innerText = ' ';
/*
        row.onclick = () => {
            displayComponentStocks30(item[0]);
            setActivePlate30(index); //setActivePlate30(index)：用于在板块列表中高亮显示当前选中的板块。
            currentPlateName30 = item[1];

            if (!calculatedPlates30.has(index)) {
                calculateLimitUpCount30(item[0], index);
                calculatedPlates30.add(index);
            }
        };
        */
        row.onclick = async (event) => {
            event.stopPropagation();
            setActivePlate30(index);
            currentPlateName30 = item[1];
            currentSubPlateId = null;
            await displayComponentStocks30(item[0]);
            calculateLimitUpCount30(item[0], index, currentPlateName30);
        };

    });
}

async function displayComponentStocks30(plateID) {
    const baseUrl = `https://apphq.longhuvip.com/w1/api/index.php?Order=1&st=60&a=ZhiShuStockList_W8&c=ZhiShuRanking&PhoneOSNew=1&apiv=W21&Type=6&PlateID=${plateID}`;
    let allStocks = [];
    let index = 0;
    let hasMoreData = true;

    try {
        while (hasMoreData) {
            const stockApiUrl = `${baseUrl}&Index=${index}`;
            const response = await fetch(stockApiUrl);
            const data = await response.json();
            const stocksList = data.list || [];

            if (stocksList.length > 0) {
                allStocks = allStocks.concat(stocksList);
                index += stocksList.length;
            } else {
                hasMoreData = false;
            }
        }

        const tableBody = document.getElementById('data-table-body30');
        tableBody.innerHTML = "";
        const stockCountElement = document.getElementById('stock-count30');
        stockCountElement.innerText = `(${allStocks.length})`;

        const chineseNumerals = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];

        allStocks.forEach(item => {
            const row = tableBody.insertRow();
            row.setAttribute('data-stock-code', item[0]);

            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);

            const stockCode = item[0];
            const stockName = item[1] || '';
            const stockUrl = `#`;

            cell1.innerText = stockName;
            cell2.innerText = item[5] ? item[5].toFixed(2) : '';
            let percentage = item[6] !== undefined ? (item[6] ? item[6].toFixed(2) + '%' : '') : '';
            let style = '';
            if (percentage.startsWith('-')) {
                let negativePercentage = parseFloat(percentage);
                if (negativePercentage < -9.9) {
                    style = 'color:#fff; background-color: #00FF00; font-size: 12px;';
                } else {
                    style = 'color: #00FF00;';
                }
            } else {
                let positivePercentage = parseFloat(percentage);
                if (positivePercentage > 9.9) {
                    style = 'display:block;text-align:center;color: white; background-color: #800020; font-size: 14px;';
                } else {
                    style = 'color: red;';
                }
            }
            cell3.innerHTML = `<span style="${style}">${percentage}</span>`;
            cell4.innerText = item[4] || '';
            cell5.innerText = item[24] || '';



            if (chineseNumerals.some(numeral => item[24].includes(numeral))) {
                cell1.classList.add('highlight-limit-up');
            }
        });




        if (allStocks.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.innerText = "没有找到股票数据";
        }

    } catch (error) {
        console.error("获取股票数据失败:", error);
    }
}




//用于计算并显示板块中涨停股票的数量。
async function calculateLimitUpCount30(plateID, plateIndex, plateName) {
    const baseUrl = `https://apphq.longhuvip.com/w1/api/index.php?Order=1&st=60&a=ZhiShuStockList_W8&c=ZhiShuRanking&PhoneOSNew=1&apiv=W21&Type=6&PlateID=${plateID}`;
    let allStocks = [];
    let index = 0;
    let hasMoreData = true;

    try {
        while (hasMoreData) {
            const stockApiUrl = `${baseUrl}&Index=${index}`;
            const response = await fetch(stockApiUrl);
            const data = await response.json();
            const stocksList = data.list || [];

            if (stocksList.length > 0) {
                allStocks = allStocks.concat(stocksList);
                index += stocksList.length;
            } else {
                hasMoreData = false;
            }
        }

        let limitUpCount = 0;

        allStocks.forEach(item => {
            const stockName = item[1] || '';
            const lianBanContent = item[23] || '';
            const priceChange = item[6] || 0;

            if (plateName === "北交所") {
                if (priceChange >= 29.9 && !stockName.toLowerCase().includes('st')) {
                    limitUpCount++;
                }
            } else {
                if (lianBanContent && !lianBanContent.includes('昨') && !stockName.toLowerCase().includes('st')) {
                    limitUpCount++;
                }
            }
        });

        if (plateIndex !== null) {
            const plateRow = document.querySelectorAll('#plate-table-body30 tr')[plateIndex];
            if (plateRow) {
                const limitUpCell = plateRow.cells[4];
                limitUpCell.innerText = limitUpCount;
            }
        }

    } catch (error) {
        console.error("获取股票数据失败:", error);
    }
}

function setActivePlate30(index) {
    const plateRows = document.querySelectorAll('#plate-table-body30 tr');
    plateRows.forEach((row, i) => {
        if (i === index) {
            row.classList.add('active');
        } else {
            row.classList.remove('active');
        }
    });
}

document.getElementById('export-ebk-button30').onclick = function() {
    const rows = document.querySelectorAll('#data-table-body30 tr');
    let transformedStockCodes = [];

    rows.forEach(row => {
        const stockCode = row.getAttribute('data-stock-code'); // Correctly retrieve the data attribute  
        let transformedCode = stockCode;

        if (stockCode) {
            if (stockCode.startsWith('0') || stockCode.startsWith('3')) {
                transformedCode = '0' + stockCode;
            } else if (stockCode.startsWith('6')) {
                transformedCode = '1' + stockCode;
            } else if (stockCode.startsWith('4') || stockCode.startsWith('8')) {
                transformedCode = '2' + stockCode;
            }
            transformedStockCodes.push(transformedCode);
        }
    });

    const blob = new Blob([transformedStockCodes.join('\r\n')], {
        type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentPlateName30 + '.ebk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

document.getElementById('export-txt-button30').onclick = function() {
    const rows = document.querySelectorAll('#data-table-body30 tr');
    let nameCodePairs = [];

    rows.forEach(row => {
        const stockName = row.cells[0].innerText;
        const stockCode = row.getAttribute('data-stock-code'); // Correctly retrieve the data attribute  
        if (stockName && stockCode) {
            nameCodePairs.push(`${stockCode} ${stockName}`);
        }
    });

    const blob = new Blob([nameCodePairs.join('\r\n')], {
        type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentPlateName30 + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

fetchPlates30();
