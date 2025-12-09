(function() {
            async function fetchData() {
                try {
                    const responses = await Promise.all([
                        fetch('https://apphq.longhuvip.com//w1/api/index.php?PhoneOSNew=2&Token=0&UserID=0&VerSion=5.12.0.1&View=1%2C2%2C3%2C4%2C5%2C6&a=GlobalCommon&apiv=w34&c=GlobalIndex'),
                        fetch('https://apphq.longhuvip.com/w1/api/index.php?a=ZhangFuDetail&apiv=w21&c=HomeDingPan'),
                        fetch('https://apphq.longhuvip.com/w1/api/index.php?Order=2&st=25&a=AllXianHuo&c=XianHuoData&apiv=w25&Type=2&IsJX=1'),
                        // 涨停数据接口（PidType=1~5 对应首板~五板及以上）
                        fetch('https://apphq.longhuvip.com/w1/api/index.php?Order=0&a=DailyLimitPerformance&st=100&apiv=w21&Type=4&c=HomeDingPan&PidType=1'), // 首板
                        fetch('https://apphq.longhuvip.com/w1/api/index.php?Order=0&a=DailyLimitPerformance&st=100&apiv=w21&Type=4&c=HomeDingPan&PidType=2'), // 二板
                        fetch('https://apphq.longhuvip.com/w1/api/index.php?Order=0&a=DailyLimitPerformance&st=100&apiv=w21&Type=4&c=HomeDingPan&PidType=3'), // 三板
                        fetch('https://apphq.longhuvip.com/w1/api/index.php?Order=0&a=DailyLimitPerformance&st=100&apiv=w21&Type=4&c=HomeDingPan&PidType=4'), // 四板
                        fetch('https://apphq.longhuvip.com/w1/api/index.php?Order=0&a=DailyLimitPerformance&st=100&apiv=w21&Type=4&c=HomeDingPan&PidType=5'), // 五板及以上
                        // A股指数接口
                        fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000001&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),
                        fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SZ399001&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),
                        fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SZ399006&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),
                        fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000300&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),
                        fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000016&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data'),
                        fetch('https://apphwhq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&StockID=SH000688&UserID=&VerSion=5.16.0.3&a=GetZsPanKou&apiv=w38&c=StockL2Data')
                    ]);

                    if (responses.some(response => !response.ok)) {
                        console.error('部分接口请求失败');
                        return;
                    }

                    // 解构赋值：前3个是其他数据，后面依次是5个涨停接口+6个A股指数接口
                    const [data1, zhangFuData, data4, ...limitUpData] = await Promise.all(responses.map(res => res.json()));
                    displayData(data1, zhangFuData, data4, limitUpData);
                } catch (error) {
                    console.error('数据获取异常：', error);
                }
            }

            function displayData(data1, zhangFuData, data4, limitUpData) {
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

                // 创建4个列容器
                const column1 = document.createElement('div'); column1.className = 'column';
                const column2 = document.createElement('div'); column2.className = 'column';
                const column3 = document.createElement('div'); column3.className = 'column';
                const column4 = document.createElement('div'); column4.className = 'column';

                // 第一列：市场动态 + 涨停数据
                const marketDynamicSection = createMarketDynamicSection(zhangFuData);
                const limitUpSectionDiv = createNewDataSection(...limitUpData.slice(0, 5)); // 取前5个涨停接口数据
                column1.appendChild(marketDynamicSection);
                column1.appendChild(limitUpSectionDiv);

                // 第二列：A股指数（取limitUpData第5~10个元素）
                const aShareIndexSection = createAShareIndexSection([
                    limitUpData[5], limitUpData[6], limitUpData[7],
                    limitUpData[8], limitUpData[9], limitUpData[10]
                ]);
                column2.appendChild(aShareIndexSection);

                // 第三列：外围指数+汇率+热门股指
                const combinedSectionDiv = createCombinedSectionDiv(sections[0], sections[1], sections[2]);
                column3.appendChild(combinedSectionDiv);

                // 第四列：全球商品
                const commoditiesSectionDiv = createCommoditiesSectionDiv(sections[3], data4);
                column4.appendChild(commoditiesSectionDiv);

                // 组装页面
                container.appendChild(column1);
                container.appendChild(column2);
                container.appendChild(column3);
                container.appendChild(column4);
            }

            // ====================== 核心修改：涨停数据统计与展示 ======================
            function createNewDataSection(data5_1, data5_2, data5_3, data5_4, data5_5) {  
                const sectionDiv = document.createElement('div');  
                sectionDiv.className = 'data-section';  

                // 标题
                const title = document.createElement('div');  
                title.className = 'section-title';  
                title.textContent = '涨停数据';  
                sectionDiv.appendChild(title);  

                // 数据加载中提示
                if (!data5_1 || !data5_2 || !data5_3 || !data5_4 || !data5_5) {
                    const noDataDiv = document.createElement('div');  
                    noDataDiv.className = 'data-item';  
                    noDataDiv.innerHTML = '<strong>数据加载中...</strong>';  
                    sectionDiv.appendChild(noDataDiv);
                    return sectionDiv;
                }

                // 安全获取各板数量（增加try-catch和数据类型校验）
                const getCount = (data) => {
                    try {
                        // 兼容接口返回格式：优先取 data.info[0].length，无则取0
                        return data?.info && Array.isArray(data.info) && data.info.length > 0 
                            ? (Array.isArray(data.info[0]) ? data.info[0].length : 0)
                            : 0;
                    } catch (e) {
                        console.warn('统计涨停数量异常：', e);
                        return 0;
                    }
                };

                // 计算各板数量和总计
                const count1 = getCount(data5_1); // 首板
                const count2 = getCount(data5_2); // 二板
                const count3 = getCount(data5_3); // 三板
                const count4 = getCount(data5_4); // 四板
                const count5 = getCount(data5_5); // 五板及以上
                const total = count1 + count2 + count3 + count4 + count5; // 新增总计

                // 调整显示顺序：首板→二板→三板→四板→五板及以上→总计（符合常规阅读习惯）
                const rowData = [
                    [`首板: <span class="highlight">${count1}家</span>`, `二板: <span class="highlight">${count2}家</span>`],
                    [`三板: <span class="highlight">${count3}家</span>`, `四板: <span class="highlight">${count4}家</span>`],
                    [`五板及以上: <span class="highlight">${count5}家</span>`, `总计: <span class="highlight">${total}家</span>`]
                ];

                // 创建行容器（优化布局间距）
                rowData.forEach((rowItems, rowIndex) => {
                    const rowDiv = document.createElement('div');
                    rowDiv.style.display = 'flex';
                    rowDiv.style.gap = '15px'; // 项目之间间距
                    rowDiv.style.marginBottom = rowIndex < rowData.length - 1 ? '8px' : '0'; // 行间距（最后一行无间距）

                    // 每个数据项
                    rowItems.forEach(text => {
                        const itemDiv = document.createElement('div');  
                        itemDiv.className = 'data-item';  
                        itemDiv.innerHTML = `<strong>${text}</strong>`;  
                        itemDiv.style.flex = '1'; // 平均分配宽度
                        itemDiv.style.padding = '3px 0'; // 增加内边距，避免文字贴边
                        itemDiv.style.textAlign = 'center'; // 文字居中，更美观
                        rowDiv.appendChild(itemDiv);
                    });

                    sectionDiv.appendChild(rowDiv);
                });

                return sectionDiv;  
            }
            // =====================================================================

            // 市场动态（未修改）
            function createMarketDynamicSection(zhangFuData) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'data-section';
                const title = document.createElement('div');
                title.className = 'section-title';
                title.textContent = '市场动态';
                sectionDiv.appendChild(title);

                const info = zhangFuData.info;
                if (!info) return sectionDiv;

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

            // A股指数（未修改）
            function createAShareIndexSection(indices) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'data-section';
                const title = document.createElement('div');
                title.className = 'section-title';
                title.textContent = 'A股指数';
                sectionDiv.appendChild(title);

                indices.forEach((data) => {
                    if (!data || !data.real) return;
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

            // 外围+汇率+热门股指（未修改）
            function createCombinedSectionDiv(section1, section2, section3) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'data-section flex-row';
                const leftDiv = document.createElement('div'); leftDiv.className = 'half-width';
                const rightDiv = document.createElement('div'); rightDiv.className = 'half-width';

                // 左半部分：外围指数
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

                // 右半部分：汇率+热门股指
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

            // 全球商品（未修改）
            function createCommoditiesSectionDiv(section, additionalData) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'data-section flex-row';
                const leftDiv = document.createElement('div'); leftDiv.className = 'half-width';
                const rightDiv = document.createElement('div'); rightDiv.className = 'half-width';

                const leftItems = ['@GC0W', '@HG0W', '@SI0W', '@NG0Y', 'BRN0Y', 'WBS0Y'];
                // 左半部分：主要商品
                const title1 = document.createElement('div');
                title1.className = 'section-title';
                title1.textContent = '主要商品';
                leftDiv.appendChild(title1);
                // 右半部分：其他商品
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
                        leftItems.includes(item.code) ? leftDiv.appendChild(itemDiv) : rightDiv.appendChild(itemDiv);
                    }
                });

                // 新增波罗的海指数
                const bdiData = additionalData?.List?.find(item => item[1] === '波罗的海(BDI)指数');
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

            // 初始化数据获取
            fetchData();
        })();