import { Types, getType, judge } from './types.js';

const selections = document.getElementById('selection');

for (const type of Types) {
    const button = createElement('button', {
        text: type.name,
        className: 'type_' + type.id,
        attr: {
            tabIndex: '-1'
        },
        onclick: e => typeSelected.set(type)
    });
    selections.appendChild(button);
}

const typeSelected = new class {
    constructor () {
        this.index = 0;
        this.elms = [
            document.getElementById('left-type'),
            document.getElementById('right-type1'),
            document.getElementById('right-type2')
        ];
        for (const elm of this.elms) {
            elm.onclick = () => {
                const index = this.elms.findIndex(e => e.id === elm.id);
                typeSelected.index = index;
                elm.dataset.id = '';
                elm.textContent = elm.dataset.placeholder;
                for (const e of typeSelected.elms) {
                    e.classList.remove('highlight');
                }
                elm.className = 'selected-type highlight';
                selectionContainer.open = true;
                resultContainer.open = false;
            };
        }        
    }

    getSelectedTypes() {
        const [left, right1, right2] = this.elms.map(el => el.dataset.id ? getType(el.dataset.id) : null);
        const rights = right1 !== null && right2 !== null && right1.id === right2.id ? [right1] : [right1, right2];
        return {
            left: left,
            right: rights.filter(type => type !== null)
        };
    }

    set(type) {
        const elm = this.elms[this.index];
        elm.className = 'selected-type';
        elm.classList.add('type_' + type.id);
        elm.dataset.id = type.id;
        elm.textContent = type.name;
        if (this.index === this.elms.length - 1) {
            this.index = 0;
        } else {
            this.index++;
        }
        this.elms[this.index].classList.add('highlight');
    }

    clear() {
        for (const elm of this.elms) {
            elm.className = 'selected-type';
            elm.dataset.id = '';
            elm.textContent = elm.dataset.placeholder;
        }
        this.index = 0;
        this.elms[0].classList.add('highlight');
    }
};

const clearButton = document.getElementById('clear');

clearButton.onclick = e => {
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
        return;
    }

    resultContainer.open = true;
    selectionContainer.open = false;
};

const selectionContainer = document.getElementById('selection-container');
const resultContainer = document.getElementById('result-container');
const resultTypeContainer = document.getElementById('result-types');
const resultLabel = document.getElementById('result-label');

function showAttackEffect(left, rights) {
    resultTypeContainer.innerHTML = '';
    resultLabel.textContent = '';
    if (rights.length === 0) {
        Types.map(type => ({
            type,
            effect: judge(left, [type])
        })).sort((t1, t2) => t2.effect.rate - t1.effect.rate)
        .map(r => createResultType(r.type, r.effect))
        .forEach(el => resultTypeContainer.appendChild(el));
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
        Types.map(type => ({
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
    const typeDiv = createElement('div', {
        className: 'result-type'
    }, [
        createElement('label', {
            className: 'type_' + type.id,
            text: type.name
        }),
        createElement('span', {
            className: 'result-type-judge',
            text: `${judge.text}(${judge.rate})`
        })
    ]);
    return typeDiv;
}

/**
 * 
 * @param {string} tag 
 * @param {{
 *  id?: string,
 *  className?: string,
 *  text?: string,
 *  dataset?: Object<string, string>,
 *  attr?: Object<string, string>,
 *  onclick?: function (MouseEvent) => void
 * }} option
 * @param {HTMLElement} [children]
 * @returns {HTMLElement}
 */
function createElement(tag, option, children) {
    const elm = document.createElement(tag);
    if (option.id) {
        elm.id = option.id;
    }
    if (option.className) {
        elm.className = option.className;
    }
    if (option.text) {
        elm.textContent = option.text;
    }
    if (option.dataset) {
        for (const key in option.dataset) {
            elm.dataset[key] = option.dataset[key];
        }
    }
    if (option.attr) {
        for (const key in option.attr) {
            elm[key] = option.attr[key];
        }
    }
    if (option.onclick) {
        elm.onclick = e => option.onclick(e);
    }
    if (children) {
        for (const child of children) {
            elm.appendChild(child);
        }
    }
    return elm;
}
