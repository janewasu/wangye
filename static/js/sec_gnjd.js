const DEFAULT_STOCK_CODE = '002131';
const modal = document.getElementById('conceptModal');
const modalClose = document.querySelector('.modal-close');
const conceptIframe = document.getElementById('concept-iframe');

function closeModal() {
    modal.style.display = 'none';
    conceptIframe.src = 'about:blank';
}

modalClose.onclick = closeModal;

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

function fetchStockConcepts(stockCode) {  
    var conceptsContainer = document.getElementById('concepts-container');  
    var stockInfoContainer = document.getElementById('stock-info');  
    
    conceptsContainer.innerHTML = '加载中...';  
    stockInfoContainer.innerHTML = '';  

    var xhr = new XMLHttpRequest();  
    xhr.open('GET', `https://basic.10jqka.com.cn/basicapi/concept/stock_concept_list/?code=${stockCode}&locale=zh_CN`, true);  
    
    xhr.onreadystatechange = function() {  
        if (xhr.readyState === 4) {  
            if (xhr.status === 200) {  
                var result = JSON.parse(xhr.responseText);  
                conceptsContainer.innerHTML = '';

                if (result.status_code === 0) {  
                    var concepts = result.data;  
                    if (concepts.length === 0) {  
                        conceptsContainer.innerHTML = '<p class="error-message">未找到该股票的概念信息</p>';  
                        return;  
                    }  

                    stockInfoContainer.innerHTML = `当前股票：${stockCode}`;  

                    concepts.forEach(function(concept) {  
                        var conceptCard = document.createElement('div');  
                        conceptCard.className = 'concept-card';  

                        var leadersHtml = '';  
                        if (concept.leader && concept.leader.length > 0) {  
                            leadersHtml = '<div class="leaders">概念龙头：';  
                            concept.leader.forEach(function(leader) {  
                                var stockElement = document.createElement('span');  
                                stockElement.textContent = leader.name;  
                                leadersHtml += `<span class="leader">  
                                    ${stockElement.outerHTML} (${leader.code})  
                                </span> `;  
                            });  
                            leadersHtml += '</div>';  
                        }  

                        var conceptNameElement = document.createElement('div');  
                        conceptNameElement.className = 'concept-name';  
                        conceptNameElement.textContent = concept.concept_name;  

                        conceptNameElement.addEventListener('click', function() {  
                            if (concept.plate_id && concept.market_id) {  
                                modal.style.display = 'block';  
                                conceptIframe.src = `https://basic.10jqka.com.cn/conceptph/briefinfo/index.html?code=${concept.plate_id}&marketid=${concept.market_id}`;  
                            }  
                        });  

                        var conceptExplainElement = document.createElement('div');  
                        conceptExplainElement.className = 'concept-explain';  
                        conceptExplainElement.textContent = '相关说明：' + concept.concept_explain;  

                        conceptCard.appendChild(conceptNameElement);  
                        conceptCard.appendChild(conceptExplainElement);  
                        
                        if (leadersHtml) {  
                            var leadersElement = document.createElement('div');  
                            leadersElement.innerHTML = leadersHtml;  
                            conceptCard.appendChild(leadersElement);  
                        }  

                        conceptsContainer.appendChild(conceptCard);  
                    });  
                } else {  
                    conceptsContainer.innerHTML = '<p class="error-message">无法加载数据，请稍后重试。</p>';  
                }  
            } else {  
                conceptsContainer.innerHTML = '<p class="error-message">网络错误，请检查网络连接。</p>';  
            }  
        }  
    };  

    xhr.send();  
}

function handleHashChange() {
    var stockCode = window.location.hash.substring(1).trim() || DEFAULT_STOCK_CODE;
    
    if (/^\d{6}$/.test(stockCode)) {
        fetchStockConcepts(stockCode);
    } else {
        window.location.hash = DEFAULT_STOCK_CODE;
        fetchStockConcepts(DEFAULT_STOCK_CODE);
    }
}

window.addEventListener('hashchange', handleHashChange);
handleHashChange();
