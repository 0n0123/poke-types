import { Type, Types, getType, judge } from './types.js';

const selections = document.getElementById('selection');

for (const type of Types) {
    const button = createTypeButton(type);
    selections.appendChild(button);
}

function onTypeClick(e) {
    const typeId = e.target.dataset.id;
    const type = getType(typeId);
    typeSelected.set(type);
}

/**
 * 
 * @param {Type} type 
 */
function createTypeButton(type) {
    const elm = document.createElement('button');
    elm.innerText = type.name;
    elm.className = 'type_' + type.id;
    elm.dataset.id = type.id;
    elm.tabIndex = '-1';
    elm.onclick = onTypeClick;
    return elm;
}

const typeSelected = {
    index: 0,
    elms: [
        document.getElementById('left-type'),
        document.getElementById('right-type1'),
        document.getElementById('right-type2')
    ],
    getSelectedTypes: function () {
        const [left, right1, right2] = this.elms.map(el => el.dataset.id ? getType(el.dataset.id) : null);
        const rights = right1 !== null && right2 !== null && right1.id === right2.id ? [right1] : [right1, right2];
        return {
            left: left,
            right: rights.filter(type => type !== null)
        };
    },
    set: function (type) {
        const elm = this.elms[this.index];
        elm.className = 'type_' + type.id;
        elm.dataset.id = type.id;
        elm.value = type.name;
        if (this.index === this.elms.length - 1) {
            this.index = 0;
        } else {
            this.index++;
        }
        this.elms[this.index].focus();
        judgeButton.classList.add('highlight');
        judgeButton.disabled = false;
    },
    clear: function () {
        for (const elm of this.elms) {
            elm.className = '';
            elm.dataset.id = '';
            elm.value = '';
        }
        this.index = 0;
        this.elms[0].focus();
        judgeButton.classList.remove('highlight');
        judgeButton.disabled = true;
    }
};

typeSelected.elms.forEach(elm => elm.onfocus = function (_) {
    const index = typeSelected.elms.findIndex(e => e.id === elm.id);
    typeSelected.index = index;
});

typeSelected.elms[0].focus();

const selectionContainer = document.getElementById('selection-container');
const resultContainer = document.getElementById('result-container');

document.getElementById('clear').onclick = e => {
    typeSelected.clear();
    selectionContainer.open = true;
    resultContainer.open = false;
};

const judgeButton = document.getElementById('judge');

judgeButton.onclick = function () {
    const types = typeSelected.getSelectedTypes();
    showResultLabel(types.left, types.right);
    if (types.left) {
        showAttackEffect(types.left, types.right);
    } else if (types.right.length > 0) {
        showDefenceEffect(types.left, types.right);
    } else {
        alert('エラー');
        return;
    }

    resultContainer.open = true;
    selectionContainer.open = false;

    judgeButton.classList.remove('highlight');
    judgeButton.disabled = true;
};

const resultTypeContainer = document.getElementById('result-types');
const resultLabel = document.getElementById('result-label');

function showAttackEffect(left, rights) {
    resultTypeContainer.innerHTML = '';
    resultLabel.textContent = '';
    if (rights.length === 0) {
        const effects = Types.map(type => ({
            type,
            effect: judge(left, [type])
        })).sort((t1, t2) => t2.effect.rate - t1.effect.rate)
        .map(r => createResultType(r.type, r.effect))
        .forEach(el => resultTypeContainer.appendChild(el));
        console.log(effects);
    } else {
        const result = judge(left, rights);
        resultLabel.textContent = `${result.text}(${result.rate})`;
    }
}

function showDefenceEffect(left, rights) {
    resultTypeContainer.innerHTML = '';
    resultLabel.textContent = '';
    if (left) {
        const result = judge(left, rights);
        resultLabel.textContent = `${result.text}(${result.rate})`;
    } else {
        const effects = Types.map(type => ({
            type,
            effect: judge(type, rights)
        })).sort((t1, t2) => t2.effect.rate - t1.effect.rate)
        .map(r => createResultType(r.type, r.effect))
        .forEach(el => resultTypeContainer.appendChild(el));
    }
}

function showResultLabel(left, rights) {
    const label = document.getElementById('result-title');
    if (left && rights.length > 0) {
        label.textContent = left.name + ' わざの ' + rights.map(type => type.name).join(', ') + ' タイプへの効果';
    } else if (!left && rights.length > 0) {
        label.textContent = rights.map(type => type.name).join(',') + ' タイプへの効果';
    } else if (left && rights.length === 0) {
        label.textContent = left.name + ' わざの相手タイプへの効果';
    } else {
        label.textContent = 'エラー';
    }
}

function createResultType(type, judge) {
    const typeDiv = document.createElement('div');
    typeDiv.className = 'result-type';
    const typeLabel = document.createElement('label');
    typeLabel.className = 'type_' + type.id;
    typeLabel.textContent = type.name;
    const judgeSpan = document.createElement('span');
    judgeSpan.className = 'result-type-judge';
    judgeSpan.textContent = `${judge.text}(${judge.rate})`;
    typeDiv.appendChild(typeLabel);
    typeDiv.appendChild(judgeSpan);
    return typeDiv;

}
