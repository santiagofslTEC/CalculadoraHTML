

let fullOp = ``;
let res = 0;
let history = [];
const operatorRegex = /[+\-x/^]/;

function addToHistory(expression, result){
    const now = new Date();
    const timestamp = now.toTimeString().slice(0,5);


    history.unshift({expression, result, timestamp});

    if (history.length > 20) history.pop();
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');

    if (history.length === 0) {
        list.innerHTML = '<li class="history-empty">No operations yet.</li>';
        return;
    }

    list.innerHTML = history.map((entry, i) => `
        <li class="history-item ${i === 0 ? 'history-item--current' : ''}">
            <span class="history-timestamp">${i === 0 ? 'CURRENT' : entry.timestamp}</span>
            <div class="history-item-bottom">
                <span class="history-expr">${entry.expression}</span>
                <span class="history-result">${entry.result}</span>
            </div>
        </li>
    `).join('');
}

function clearHistory() {
    history = [];
    renderHistory();
}


function handleClick(number) {
    console.log(number);

    if (number === '=') {
        calculate();
        return;
    }

    if (number === 'CE') {
        fullOp = ``;
        showNumber(0);
        return;
    }

    if (number === '⌫') {
        fullOp = fullOp.slice(0, -1);
        showNumber(fullOp || '0');
        return;
    }
    
    if (number === '+/-') {
        if (fullOp === '' || fullOp === '0') return;
        if (fullOp.startsWith('-')) {
            fullOp = fullOp.slice(1);
        } else {
            fullOp = '-' + fullOp;
        }
        showNumber(fullOp);
        return;
    }
    
    if (number === '.') {
        if (fullOp.includes('.')) return;
        if (fullOp === '') fullOp = '0';
        fullOp += '.';
        showNumber(fullOp);
        return;
    }

    if (operatorRegex.test(String(number))) {
        if (fullOp === '') return;
        
        if (operatorRegex.test(fullOp.slice(-1))) return;
    }
    

    fullOp += number;
    showNumber(fullOp);
    showExpression(fullOp);
}


function calculate() {
    
    const match = fullOp.match(/^(-?[\d.]+)([+\-x\/^])(-?[\d.]+)$/)

    if (!match) return;

    const a = Number(match[1]);
    const op = match[2];
    const b = Number(match[3]);

    if (isNaN(a) || isNaN(b)) return;

    switch (op) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case 'x': res = a * b; break;
        case '/':
            if (b === 0) {
                showNumber('Error');
                fullOp = '';
                return;
            }
            res = a / b;
            break;
        case '^': res = Math.pow(a, b); break;
        default: return;
    }


    const expression = fullOp;  
    res = Math.round(res * 1e10) / 1e10;
    
    addToHistory(fullOp, res)
    fullOp = String(res);
    showExpression(expression + ' =');
    showNumber(res);

}


function showNumber(n) {
    document.getElementById("screen").innerHTML = n;
}


function showExpression(expr){
    document.getElementById('expression').textContent = expr;
}


function switchView(view) {
    document.getElementById('view-calc').classList.toggle('hidden', view !== 'calc');
    document.getElementById('view-history').classList.toggle('hidden', view !== 'history');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('nav-' + view).classList.add('active');
}
