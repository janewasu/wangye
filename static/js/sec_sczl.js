(function() {  
    async function fetchData() {  
        try {  
            const responses = await Promise.all([  
                fetch('https://apphq.longhuvip.com//w1/api/index.php?PhoneOSNew=2&Token=0&UserID=0&VerSion=5.12.0.1&View=1%2C2%2C3%2C4%2C5%2C6&a=GlobalCommon&apiv=w34&c=GlobalIndex'),  
                fetch('https://apphq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&Token=0&UserID=0&VerSion=5.12.0.1&a=ZhangTingExpression&apiv=w30&c=HomeDingPan'),  
                fetch('https://apphq.longhuvip.com/w1/api/index.php?a=ZhangFuDetail&apiv=w21&c=HomeDingPan'),  
                fetch('https://apphq.longhuvip.com/w1/api/index.php?Order=2&st=25&a=AllXianHuo&c=XianHuoData&apiv=w25&Type=2&IsJX=1'),  
                fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000001&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),  
                fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SZ399001&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),  
                fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SZ399006&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),  
                fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000300&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),  
                fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000016&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),  
                fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000688&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data')  
            ]);  

            if (responses.some(response => !response.ok)) {  
                console.error('Failed to fetch data');  
                return;  
            }  

            const [data1, data2, data3, data4, shIndex, szIndex, cybIndex, hs300, sh50, kc50] = await Promise.all(responses.map(res => res.json()));  
            displayData(data1, data2, data3, data4, [shIndex, szIndex, cybIndex, hs300, sh50, kc50]);  
        } catch (error) {  
            console.error('Error fetching data:', error);  
        }  
    }  

    function displayData(data1, data2, data3, data4, aShareIndices) {  
        const container = document.getElementById('data-container');  
        const sections = [  
            {  
                title: '外围指数',  
                data: data1.CYWWZS,  
                items: [  
                    { code: 'DJI', name: '道琼斯' },  
                    { code: 'IXIC', name: '纳斯达克' },  
                    { code: 'SPX', name: '标普500' },  
                    { code: 'HSI', name: '恒生指数' },  
                    { code: 'N225', name: '日经225' },  
                    { code: 'FTSE', name: '英国富时' }  
                ]  
            },  
            {  
                title: '汇率指数',  
                data: data1.HLZS,  
                items: [  
                    { code: 'USDIND', name: '美元指数' },  
                    { code: 'USDCNH', name: '美元离岸人民币' },  
                    { code: 'EURUSD', name: '欧元兑美元' }  
                ]  
            },  
            {  
                title: '热门股指',  
                data: data1.RMGZ,  
                items: [  
                    { code: '@YM0Y', name: '迷你道琼斯连续' },  
                    { code: 'CN0Y', name: 'A50期指当月连续' },  
                    { code: 'NK0W', name: '日经225期指主连' }  
                ]  
            },  
            {  
                title: '全球商品',  
                data: data1.QQSP,  
                items: [  
                    { code: '@GC0W', name: '纽约金主连' },  
                    { code: '@HG0W', name: '纽约铜主连' },  
                    { code: '@SI0W', name: '纽约银主连' },  
                    { code: '@NG0Y', name: '天然气连续' },  
                    { code: 'BRN0Y', name: '布伦特原油当月连续' },  
                    { code: 'WBS0Y', name: 'NYMEX原油' },  
                    { code: '03AHD', name: '综合铝03' },  
                    { code: '03NID', name: '综合镍03' },  
                    { code: '03PBD', name: '综合铅03' },  
                    { code: '03SND', name: '综合锡03' },  
                    { code: '03ZSD', name: '综合锌03' }  
                ]  
            }  
        ];  

        container.innerHTML = '';  

        const column1 = document.createElement('div');  
        column1.className = 'column';  
        const column2 = document.createElement('div');  
        column2.className = 'column';  
        const column3 = document.createElement('div');  
        column3.className = 'column';  
        const column4 = document.createElement('div');  
        column4.className = 'column';  

        const newSectionDiv1 = createThirdApiDataSection(data3);  
        const newSectionDiv2 = createNewDataSection(data2);  
        column1.appendChild(newSectionDiv1);  
        column1.appendChild(newSectionDiv2);  

        const aShareIndexSection = createAShareIndexSection(aShareIndices);  
        column2.appendChild(aShareIndexSection);  

        const combinedSectionDiv = createCombinedSectionDiv(sections[0], sections[1], sections[2]);  
        column3.appendChild(combinedSectionDiv);  

        const commoditiesSectionDiv = createCommoditiesSectionDiv(sections[3], data4);  
        column4.appendChild(commoditiesSectionDiv);  

        container.appendChild(column1);  
        container.appendChild(column2);  
        container.appendChild(column3);  
        container.appendChild(column4);  
    }  

    function createAShareIndexSection(indices) {  
        const sectionDiv = document.createElement('div');  
        sectionDiv.className = 'data-section';  

        const title = document.createElement('div');  
        title.className = 'section-title';  
        title.textContent = 'A股指数';  
        sectionDiv.appendChild(title);  

        indices.forEach((data) => {  
            const itemDiv = document.createElement('div');  
            itemDiv.className = 'data-item';  
            const pxChange = parseFloat(data.real.px_change || 0).toFixed(2);  
            const pxChangeRate = parseFloat(data.real.px_change_rate || 0).toFixed(2) + '%';  
            const lastPx = parseFloat(data.real.last_px || 0).toFixed(2);  
            const colorClass = pxChange >= 0 ? 'positive' : 'negative';  
            itemDiv.innerHTML = `  
                <strong>${data.name}</strong><br>  
                <span class="${colorClass}"> ${lastPx}</span><br>  
                <span class="${colorClass}">${pxChange} | ${pxChangeRate}</span>  
            `;  
            sectionDiv.appendChild(itemDiv);  
        });  

        return sectionDiv;  
    }  

    function createCombinedSectionDiv(section1, section2, section3) {  
        const sectionDiv = document.createElement('div');  
        sectionDiv.className = 'data-section flex-row';  

        const leftDiv = document.createElement('div');  
        leftDiv.className = 'half-width';  
        const rightDiv = document.createElement('div');  
        rightDiv.className = 'half-width';  

        const title1 = document.createElement('div');  
        title1.className = 'section-title';  
        title1.textContent = section1.title;  
        leftDiv.appendChild(title1);  
        section1.items.forEach(item => {  
            const dataItem = section1.data.find(d => d.code === item.code);  
            if (dataItem) {  
                const itemDiv = document.createElement('div');  
                itemDiv.className = 'data-item';  
                const rate = parseFloat(dataItem.increase_rate || 0).toFixed(2);  
                const lastPx = parseFloat(dataItem.last_px || 0).toFixed(2);  
                const increaseAmount = parseFloat(dataItem.increase_amount || 0).toFixed(2);  
                const colorClass = rate < 0 ? 'negative' : 'positive';  
                itemDiv.innerHTML = `  
                    <strong>${item.name}</strong><br>  
                    <span class="${colorClass}">${lastPx}</span><br>  
                    <span class="${colorClass}">${increaseAmount} | ${rate}%</span>  
                `;  
                leftDiv.appendChild(itemDiv);  
            }  
        });  

        const title2 = document.createElement('div');  
        title2.className = 'section-title';  
        title2.textContent = '汇率|股指';  
        rightDiv.appendChild(title2);  

        [section2, section3].forEach(section => {  
            section.items.forEach(item => {  
                const dataItem = section.data.find(d => d.code === item.code);  
                if (dataItem) {  
                    const itemDiv = document.createElement('div');  
                    itemDiv.className = 'data-item';  
                    const rate = parseFloat(dataItem.increase_rate || 0).toFixed(2);  
                    const lastPx = parseFloat(dataItem.last_px || 0).toFixed(2);  
                    const increaseAmount = parseFloat(dataItem.increase_amount || 0).toFixed(2);  
                    const colorClass = rate < 0 ? 'negative' : 'positive';  
                    itemDiv.innerHTML = `  
                        <strong>${item.name}</strong><br>  
                        <span class="${colorClass}">${lastPx}</span><br>  
                        <span class="${colorClass}">${increaseAmount} | ${rate}%</span>  
                    `;  
                    rightDiv.appendChild(itemDiv);  
                }  
            });  
        });  

        sectionDiv.appendChild(leftDiv);  
        sectionDiv.appendChild(rightDiv);  

        return sectionDiv;  
    }  

    function createCommoditiesSectionDiv(section, additionalData) {  
        const sectionDiv = document.createElement('div');  
        sectionDiv.className = 'data-section flex-row';  

        const leftDiv = document.createElement('div');  
        leftDiv.className = 'half-width';  
        const rightDiv = document.createElement('div');  
        rightDiv.className = 'half-width';  

        const leftItems = ['@GC0W', '@HG0W', '@SI0W', '@NG0Y', 'BRN0Y', 'WBS0Y'];  
        const rightItems = section.items.filter(item => !leftItems.includes(item.code)).map(item => item.code);  

        const title1 = document.createElement('div');  
        title1.className = 'section-title';  
        title1.textContent = '主要商品';  
        leftDiv.appendChild(title1);  

        const title2 = document.createElement('div');  
        title2.className = 'section-title';  
        title2.textContent = '其他商品';  
        rightDiv.appendChild(title2);  

        section.items.forEach(item => {  
            const dataItem = section.data.find(d => d.code === item.code);  
            if (dataItem) {  
                const itemDiv = document.createElement('div');  
                itemDiv.className = 'data-item';  
                const rate = parseFloat(dataItem.increase_rate || 0).toFixed(2);  
                const lastPx = parseFloat(dataItem.last_px || 0).toFixed(2);  
                const increaseAmount = parseFloat(dataItem.increase_amount || 0).toFixed(2);  
                const colorClass = rate < 0 ? 'negative' : 'positive';  
                itemDiv.innerHTML = `  
                    <strong>${item.name}</strong><br>  
                    <span class="${colorClass}">${lastPx}</span><br>  
                    <span class="${colorClass}">${increaseAmount} | ${rate}%</span>  
                `;  
                if (leftItems.includes(item.code)) {  
                    leftDiv.appendChild(itemDiv);  
                } else {  
                    rightDiv.appendChild(itemDiv);  
                }  
            }  
        });  

        const bdiData = additionalData.List.find(item => item[1] === '波罗的海(BDI)指数');  
        if (bdiData) {  
            const bdiDiv = document.createElement('div');  
            bdiDiv.className = 'data-item';  
            bdiDiv.innerHTML = `  
                <strong>波罗的海(BDI)指数</strong><br>  
                <span class="positive">${bdiData[0]}</span><br>  
                <span class="positive">${bdiData[4]} | ${bdiData[3]}%</span>  
            `;  
            rightDiv.appendChild(bdiDiv);  
        }  

        sectionDiv.appendChild(leftDiv);  
        sectionDiv.appendChild(rightDiv);  

        return sectionDiv;  
    }  

    function createNewDataSection(data) {  
        const sectionDiv = document.createElement('div');  
        sectionDiv.className = 'data-section';  

        const title = document.createElement('div');  
        title.className = 'section-title';  
        title.textContent = '涨停数据';  
        sectionDiv.appendChild(title);  

        const info = data.info;  
        const formattedData = [  
            `一板 <span class="highlight">${info[0]}家</span>`,  
            `二板 <span class="highlight">${info[1]}家</span>   晋级率：<span class="highlight">${info[4].toFixed(2)}%</span>`,  
            `三板 <span class="highlight">${info[2]}家</span>   晋级率：<span class="highlight">${info[5].toFixed(2)}%</span>`,  
            `四板+ <span class="highlight">${info[3]}家</span>   晋级率：<span class="highlight">${info[6].toFixed(2)}%</span>`,  
            `今日涨停破板率：<span class="negative">${info[7].toFixed(2)}%</span>`,  
            `昨日涨停今表现：<span class="${info[8] >= 0 ? 'positive' : 'negative'}">${info[8].toFixed(2)}%</span>`,  
            `昨日连板今表现：<span class="${info[9] >= 0 ? 'positive' : 'negative'}">${info[9].toFixed(2)}%</span>`,  
            `昨日破板今表现：<span class="${info[10] >= 0 ? 'positive' : 'negative'}">${info[10].toFixed(2)}%</span>`  
        ];  

        formattedData.forEach(text => {  
            const itemDiv = document.createElement('div');  
            itemDiv.className = 'data-item';  
            itemDiv.innerHTML = `<strong>${text}</strong>`;  
            sectionDiv.appendChild(itemDiv);  
        });  

        return sectionDiv;  
    }  

    function createThirdApiDataSection(data) {  
        const sectionDiv = document.createElement('div');  
        sectionDiv.className = 'data-section';  

        const title = document.createElement('div');  
        title.className = 'section-title';  
        title.textContent = '市场动态';  
        sectionDiv.appendChild(title);  

        const info = data.info;  
        const volume = (info.qscln / 10000).toFixed(2);  
        const changeFromYesterday = ((info.qscln - info.q_zrcs) / 10000).toFixed(2);  
        const changeColorClass = changeFromYesterday < 0 ? 'negative' : 'positive';  

        const formattedData = [  
            `实际涨停: <span class="positive">${info.SJZT}家</span> 实际跌停: <span class="negative">${info.SJDT}家</span>`,  
            `上涨家数: <span class="positive">${info.SZJS}家</span> 下跌家数: <span class="negative">${info.XDJS}家</span>`,  
            `量能: <span class="highlight">${volume}亿</span> 较昨日: <span class="${changeColorClass}">${changeFromYesterday}亿</span>`  
        ];  

        formattedData.forEach(text => {  
            const itemDiv = document.createElement('div');  
            itemDiv.className = 'data-item';  
            itemDiv.innerHTML = `<strong>${text}</strong>`;  
            sectionDiv.appendChild(itemDiv);  
        });  

        return sectionDiv;  
    }  

    fetchData();  
})(); 
