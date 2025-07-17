/**
 * 板块数据相关操作
 */

// 板块数据接口地址
const plateApiUrl = 'https://apphq.longhuvip.com/w1/api/index.php?Order=1&a=RealRankingInfo&st=30&apiv=w21&Type=1&c=ZhiShuRanking&PhoneOSNew=1&VerSion=5&ZSType=7&';  
// 子板块数据接口地址
const sonPlateApiUrl = 'https://apphq.longhuvip.com/w1/api/index.php?a=SonPlate_Info&PhoneOSNew=2&Token=0&UserID=0&VerSion=5.12.0.1&c=ZhiShuRanking&apiv=w26&PlateID=';  
// 存储板块列表数据
let platesList = [];  
// 当前选中的板块ID
let currentPlateId = null;  
// 当前选中的子板块ID
let currentSubPlateId = null;  
// 当前选中的板块名称
let currentPlateName = '';  
// 当前选中的子板块名称
let currentSubPlateName = '';  

/**
 * 获取板块数据
 */
async function fetchPlates() {  
    try {  
        // 发起网络请求获取板块数据
        const response = await fetch(plateApiUrl);  
        const data = await response.json();  
        // 截取前100条数据作为板块列表
        platesList = data.list.slice(0,100);  
        // 更新板块表格显示
        updatePlateTable();  
        // 如果有板块数据，设置第一个板块为当前选中板块，并展示其成分股
        if (platesList.length > 0) {  
            currentPlateId = platesList[0][0];  
            currentPlateName = platesList[0][1];  
            displayComponentStocks(currentPlateId);  
            setActivePlate(0);  
            // 自动计算所有板块的涨停值
            for (let i = 0; i < platesList.length; i++) {  
                await calculateLimitUpCount(platesList[i][0], i, platesList[i][1]);  
            }  
        }  
    } catch (error) {  
        console.error("获取板块数据失败:", error);  
    }  
}  

/**
 * 更新板块表格显示
 */
function updatePlateTable() {  
    const plateTableBody = document.getElementById('plate-table-body');  
    plateTableBody.innerHTML = "";  

    platesList.forEach((item, index) => {  
        const row = plateTableBody.insertRow();  
        row.dataset.plateId = item[0];  

        const cell1 = row.insertCell(0);  
        const cell2 = row.insertCell(1);  
        const cell3 = row.insertCell(2);  
        const cell4 = row.insertCell(3);  
        const cell5 = row.insertCell(4);  

        cell1.innerText = index +1;  // 板块序号
        cell2.innerText = item[1];   // 板块名称
        cell3.innerText = item[2];   // 板块涨跌幅
        cell4.innerText = parseFloat(item[3]).toFixed(2);  // 板块涨跌额
        cell5.innerText = ' ';       // 涨停数量，后续会动态填充

        // 根据涨跌额设置不同样式
        const changeValue = parseFloat(item[3]);  
        if (changeValue >0) {  
            cell4.classList.add('positive-change');  
        } else if (changeValue <0) {  
            cell4.classList.add('negative-change');  
        }  

        // 行点击事件，用于选中板块并展示其成分股和子板块
        row.onclick = async (event) => {  
            event.stopPropagation();  
            setActivePlate(index);  
            currentPlateId = item[0];  
            currentPlateName = item[1];  
            currentSubPlateId = null;  
            currentSubPlateName = '';  
            await displayComponentStocks(currentPlateId);  
            await fetchSubPlates(currentPlateId, row);  
        };  
    });  
}  

/**
 * 设置当前选中的板块行高亮显示
 */
function setActivePlate(index) {  
    const plateRows = document.querySelectorAll('#plate-table-body tr');  
    plateRows.forEach((row, i) => {  
        if (i === index) {  
            row.classList.add('active');  
        } else {  
            row.classList.remove('active');  
        }  
    });  
}  

/**
 * 获取子板块数据
 */
async function fetchSubPlates(plateID, plateRow) {  
    try {  
        // 构造子板块数据接口地址
        const subPlateApiUrl = `${sonPlateApiUrl}${plateID}`;  
        const response = await fetch(subPlateApiUrl);  
        const data = await response.json();  
        const subPlates = data.List;  

        if (subPlates && subPlates.length >0) {  
            const subPlateTableBody = document.getElementById('sub-plate-table-body');  
            subPlateTableBody.innerHTML = '';  
            subPlates.forEach(subPlate => {  
                const newRow = subPlateTableBody.insertRow();  
                newRow.dataset.plateId = subPlate[0];  

                newRow.innerHTML = `  
                <td>${subPlate[1]}</td>  
                <td>${subPlate[2]}</td>  
                `;  

                // 子板块行点击事件，用于选中子板块并展示其成分股
                newRow.onclick = (event) => {  
                    event.stopPropagation();  
                    currentSubPlateId = subPlate[0];  
                    currentSubPlateName = subPlate[1];  
                    displayComponentStocks(currentSubPlateId);  
                    calculateLimitUpCount(currentSubPlateId, null, currentSubPlateName);  
                };  
            });  
            // 显示子板块窗口
            showSubPlateWindow();  
        }  
    } catch (error) {  
        console.error("获取子板块数据失败:", error);  
    }  
}  

/**
 * 显示子板块窗口
 */
function showSubPlateWindow() {  
    const subPlateWindow = document.getElementById('sub-plate-window');  
    subPlateWindow.style.display = 'block';  
}  

/**
 * 展示板块成分股数据
 */
async function displayComponentStocks(plateID) {  
    const baseUrl = `https://apphq.longhuvip.com/w1/api/index.php?Order=1&st=60&a=ZhiShuStockList_W8&c=ZhiShuRanking&PhoneOSNew=1&apiv=W21&Type=6&PlateID=${plateID}`;  
    let allStocks = [];  
    let index =0;  
    let hasMoreData = true;  

    try {  
        // 循环获取所有成分股数据
        while (hasMoreData) {  
            const stockApiUrl = `${baseUrl}&Index=${index}`;  
            const response = await fetch(stockApiUrl);  
            const data = await response.json();  
            const stocksList = data.list || [];  

            if (stocksList.length >0) {  
                allStocks = allStocks.concat(stocksList);  
                index += stocksList.length;  
            } else {  
                hasMoreData = false;  
            }  
        }  

        const tableBody = document.getElementById('data-table-body');  
        tableBody.innerHTML = "";  
        const stockCountElement = document.getElementById('stock-count');  
        stockCountElement.innerText = `(${allStocks.length})`;  

        // 遍历所有股票数据并填充表格
        allStocks.forEach(item => {  
            const row = tableBody.insertRow();  
            row.setAttribute('data-stock-code', item[0]);  

            const cell1 = row.insertCell(0);  
            const cell2 = row.insertCell(1);  
            const cell3 = row.insertCell(2);  
            const cell4 = row.insertCell(3);  
            const cell5 = row.insertCell(4);  
            const cell6 = row.insertCell(5);  

            const stockName = item[1] || '';  
            const stockUrl = `http://www.treeid/code_${item[0]}`;  

            cell1.innerText = stockName;          // 股票名称
            cell2.innerText = item[5] ? item[5].toFixed(2) : '';  // 当前价
            cell3.innerText = item[6] !== undefined ? (item[6] ? item[6].toFixed(2) + '%' : '') : '';  // 涨跌幅
            cell4.innerText = item[4] || '';       // 涨跌额
            cell5.innerText = item[24] || '';      // 连板信息
            cell6.innerText = item[23] || '';      // 涨停信息

            // 根据涨跌幅设置不同样式
            const changeValue = parseFloat(item[6]);  
            if (changeValue >0) {  
                cell3.classList.add('positive-change');  
            } else if (changeValue <0) {  
                cell3.classList.add('negative-change');  
            }  

            // 行点击事件，跳转到股票详情页
            row.style.cursor = 'pointer';  
            row.addEventListener('click', () => {  
                window.location.href = stockUrl;  
            });  

            // 高亮涨停的股票
            if (item[23] && !item[23].includes('昨')) {  
                cell6.classList.add('highlight-limit-up');  
            }  
        });  

        // 如果没有数据，显示提示信息
        if (allStocks.length ===0) {  
            const row = tableBody.insertRow();  
            const cell = row.insertCell(0);  
            cell.colSpan =6;  
            cell.innerText = "没有找到股票数据";  
        }  

    } catch (error) {  
        console.error("获取股票数据失败:", error);  
    }  
}  

/**
 * 计算板块涨停数量
 */
async function calculateLimitUpCount(plateID, plateIndex, plateName) {  
    const baseUrl = `https://apphq.longhuvip.com/w1/api/index.php?Order=1&st=60&a=ZhiShuStockList_W8&c=ZhiShuRanking&PhoneOSNew=1&apiv=W21&Type=6&PlateID=${plateID}`;  
    let allStocks = [];  
    let index = 0;  
    let hasMoreData = true;  

    try {  
        // 循环获取所有成分股数据
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

        // 遍历所有股票数据，统计涨停数量
        allStocks.forEach(item => {  
            const lianBanContent = item[23] || ''; // 获取"连板"列数据
            if (lianBanContent) { // 如果"连板"列有值
                if (!lianBanContent.includes('昨')) {
                    limitUpCount += 1; // 不含"昨"字计为1
                } // 含"昨"字计为0（无需额外操作）
            }
        });

        // 更新板块表格中对应的涨停数量
        if (plateIndex !== null) {
            const plateRow = document.querySelectorAll('#plate-table-body tr')[plateIndex];
            if (plateRow) {
                const limitUpCell = plateRow.cells[4]; // "涨停"列
                limitUpCell.innerText = limitUpCount; // 更新涨停数值
            }
        }

    } catch (error) {
        console.error("获取股票数据失败:", error);
    }
}

/**
 * 导出股票代码为.ebk格式
 */
document.getElementById('export-ebk-button').onclick = function() {
    const rows = document.querySelectorAll('#data-table-body tr');
    let transformedStockCodes = [];

    rows.forEach(row => {
        const stockCode = row.getAttribute('data-stock-code');
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

    const blob = new Blob([transformedStockCodes.join('\r\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (currentSubPlateId ? currentSubPlateName : currentPlateName) + '.ebk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * 导出股票名称和代码为.txt格式
 */
document.getElementById('export-txt-button').onclick = function() {
    const rows = document.querySelectorAll('#data-table-body tr');
    let nameCodePairs = [];

    rows.forEach(row => {
        const stockName = row.cells[0].innerText;
        const stockCode = row.getAttribute('data-stock-code');
        if (stockName && stockCode) {
            nameCodePairs.push(`${stockCode} ${stockName}`);
        }
    });

    const blob = new Blob([nameCodePairs.join('\r\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (currentSubPlateId ? currentSubPlateName : currentPlateName) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * 点击页面其他区域隐藏子板块窗口
 */
document.addEventListener('click', function(event) {
    const subPlateWindow = document.getElementById('sub-plate-window');
    if (!subPlateWindow.contains(event.target) && !event.target.closest('#plate-table')) {
        subPlateWindow.style.display = 'none';
    }
});

/**
 * 关闭子板块窗口
 */
document.querySelector('#sub-plate-window .close-btn').onclick = function() {
    document.getElementById('sub-plate-window').style.display = 'none';
};

// 初始化加载板块数据
fetchPlates();