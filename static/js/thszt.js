const apiUrl = 'https://data.10jqka.com.cn/dataapi/limit_up/limit_up_pool?page=1&limit=200&field=199112,10,9001,330323,330324,330325,9002,330329,133971,133970,1968584,3475914,9003,9004&filter=HS,GEM2STAR&order_field=330324&order_type=0&date=&_=1705655093294';  

let tableData = [];  
let currentSort = { column: 'last_limit_up_time', order: 'desc' };  

fetch(apiUrl)  
    .then(response => {  
        if (!response.ok) {  
            throw new Error('网络错误');  
        }  
        return response.json();  
    })  
    .then(data => {  
        const info = data.data.info;  
        tableData = info.map((item, index) => ({  
            sequence: index + 1,  
            code: item.code,  
            name: item.name,  
            first_limit_up_time: new Date(item.first_limit_up_time * 1000),  
            last_limit_up_time: new Date(item.last_limit_up_time * 1000),  
            high_days: item.high_days,  
            latest: item.latest,  
            limit_up_type: item.limit_up_type,  
            order_amount: formatValue(item.order_volume * item.latest),  
            limit_up_suc_rate: (item.limit_up_suc_rate * 100).toFixed(2) + '%',  
            currency_value: formatValue(item.currency_value),  
            turnover_rate: item.turnover_rate.toFixed(2) + '%',  
            reason_type: item.reason_type,  
        }));  

        renderTable(tableData);  
        sortTable(currentSort.column, currentSort.order);  
    })  
    .catch(error => {  
        console.error('Error:', error);  
    });  

function formatValue(value) {  
    if (value >= 1e8) {  
        return (value / 1e8).toFixed(2) + ' 亿';  
    } else {  
        return (value / 1e4).toFixed(2) + ' 万';  
    }  
}  

function renderTable(data) {  
    const tbody = document.getElementById('data-table-zt').getElementsByTagName('tbody')[0];  
    tbody.innerHTML = '';  

    data.forEach(item => {  
        const row = tbody.insertRow();  
        row.insertCell(0).innerText = item.sequence;  

        const codeCell = row.insertCell(1);  
        codeCell.innerHTML = `<a>${item.code}</a>`;  

        const nameCell = row.insertCell(2);  
        nameCell.innerHTML = `<a>${item.name}</a>`;  

        row.insertCell(3).innerText = item.first_limit_up_time.toLocaleTimeString();  
        row.insertCell(4).innerText = item.last_limit_up_time.toLocaleTimeString();  
        row.insertCell(5).innerText = item.high_days;  
        row.insertCell(6).innerText = item.latest;  
        row.insertCell(7).innerText = item.limit_up_type;  
        row.insertCell(8).innerText = item.order_amount;  
        row.insertCell(9).innerText = item.limit_up_suc_rate;  
        row.insertCell(10).innerText = item.currency_value;  
        row.insertCell(11).innerText = item.turnover_rate;  
        row.insertCell(12).innerText = item.reason_type;  
    });  
}  

function toggleSort(column) {  
    if (currentSort.column === column) {  
        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';  
    } else {  
        currentSort.column = column;  
        currentSort.order = 'asc';  
    }  
    sortTable(currentSort.column, currentSort.order);  
}  

function sortTable(column, order = 'desc') {  
    const sortedData = [...tableData].sort((a, b) => {  
        const aValue = a[column];  
        const bValue = b[column];  

        if (aValue instanceof Date && bValue instanceof Date) {  
            return order === 'asc' ? aValue - bValue : bValue - aValue;  
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {  
            return order === 'asc' ? aValue - bValue : bValue - aValue;  
        } else {  
            return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);  
        }  
    });  

    renderTable(sortedData);  

    const headers = document.querySelectorAll('th');  
    headers.forEach(header => {  
        header.classList.remove('sorted-asc', 'sorted-desc');  
    });  

    const currentHeader = Array.from(headers).find(header => header.onclick && header.onclick.toString().includes(column));  
    if (currentHeader) {  
        currentHeader.classList.add(order === 'asc' ? 'sorted-asc' : 'sorted-desc');  
    }  
}  