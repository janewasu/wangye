let activeTheme = null;

async function fetchThemeData() {
    try {
        const response = await fetch('https://prx.upchina.com/json/specialTheme/getTSDataNewThemeByDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                "stReq": {
                    "uiStart": 0,
                    "uiCount": 50
                }
            })
        });
        const data = await response.json();
        return data.stRsp.vThemeData;
    } catch (error) {
        console.error('Error fetching theme data:', error);
        return [];
    }
}

async function fetchStockDetails(plateCode) {
    try {
        const response = await fetch('https://gateway.upchina.com/json/stockextweb/stockExtDetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                "stReq": {
                    "stHeader": {
                        "sSource": "题材宝-common/service/clue/getStockExtDetail"
                    },
                    "lDate": 0,
                    "iType": 6,
                    "iId": 0,
                    "iExt": 0,
                    "sExt": plateCode,
                    "vFilterType": [],
                    "vStock": [],
                    "eColumn": 4,
                    "eSort": 2,
                    "iStart": 0,
                    "iSize": 1150,
                    "bFromCache": true,
                    "stFrom": {},
                    "vBitmap": [28,64,0,0,0,0,68,254,248,32,0,0,0,48],
                    "mapIncFlag": {},
                    "mapReq": {},
                    "bDetail": false,
                    "iReqType": 1
                }
            })
        });
        const data = await response.json();
        return data.stRsp.vDataSimple || [];
    } catch (error) {
        console.error('Error fetching stock details:', error);
        return [];
    }
}

function formatDate(dateStr) {
    const year = dateStr.toString().substring(0, 4);
    const month = dateStr.toString().substring(4, 6);
    const day = dateStr.toString().substring(6, 8);
    return `${year}/${month}/${day}`;
}

function isToday(dateStr) {
    const today = new Date();
    const year = parseInt(dateStr.toString().substring(0, 4));
    const month = parseInt(dateStr.toString().substring(4, 6)) - 1;
    const day = parseInt(dateStr.toString().substring(6, 8));
    const date = new Date(year, month, day);
    
    return today.getFullYear() === year && 
            today.getMonth() === month && 
            today.getDate() === day;
}

async function showStockDetails(theme) {
    const detailTitle = document.getElementById('detailTitle');
    const stockList = document.getElementById('stockList');
    
    stockList.innerHTML = '<div class="text-center text-gray-400">加载中...</div>';

    const stocks = await fetchStockDetails(theme.sPlateCode);
    
    detailTitle.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="text-white">${theme.sPlateName}</span>
            <span class="text-sm text-gray-400">共 ${stocks.length} 只股票</span>
        </div>
    `;
    
    stockList.innerHTML = `
        <div class="space-y-2">
            ${stocks.map(stock => {
                const percentage = stock.m1['4'] || 0;
                const isUp = percentage > 0;
                
                return `
                    <div class="stock-card stock-item" data-code="${stock.code}">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-medium text-white">${stock.name}</span>
                                <span class="text-gray-400 text-sm ml-2 stock-code">${stock.code}</span>
                            </div>
                            <span class="percentage ${isUp ? 'up' : 'down'}">
                                ${isUp ? '+' : ''}${percentage.toFixed(2)}%
                            </span>
                        </div>
                        <div class="text-sm text-gray-400 mt-2">
                            ${stock.m2['49'][1] || '暂无业绩预告'}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    stockList.querySelectorAll('.stock-card').forEach(card => {
        card.addEventListener('click', () => {
            const code = card.dataset.code;
            // window.location.href = `#`;
        });
    });
}

function createThemeCard(theme) {
    const card = document.createElement('div');
    card.className = 'theme-card';
    if (activeTheme === theme.sPlateCode) {
        card.classList.add('active');
    }

    card.innerHTML = `
        <div>
            <div class="font-medium text-white">
                ${theme.sPlateName}
            </div>
            <div class="text-gray-400 text-sm mt-1">
                ${theme.parentName}
            </div>
            <div class="text-gray-300 text-sm mt-2">
                投资逻辑：${theme.driveLogic}
            </div>
        </div>
    `;

    card.addEventListener('click', async () => {
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        activeTheme = theme.sPlateCode;
        await showStockDetails(theme);
    });

    return card;
}

async function renderThemeList() {
    const themeList = document.getElementById('themeList');
    const themes = await fetchThemeData();
    
    let currentDate = null;
    themeList.innerHTML = '';
    
    themes.forEach((theme, index) => {
        const dateStr = formatDate(theme.effectiveTime);
        
        if (currentDate !== dateStr) {
            currentDate = dateStr;
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date-divider';
            dateDiv.textContent = isToday(theme.effectiveTime) ? '今日' : dateStr;
            themeList.appendChild(dateDiv);
        }
        
        const card = createThemeCard(theme);
        themeList.appendChild(card);

        if (index === 0) {
            card.classList.add('active');
            activeTheme = theme.sPlateCode;
            showStockDetails(theme);
        }
    });
}

renderThemeList();
/* setInterval(renderThemeList, 1000000); */
