export class Type {
    /** @type {string} */
    id;
    /** @type {string} */
    name;
    /** @type {string[]} */
    good;
    /** @type {string[]} */
    bad;
    /** @type {string[]} */
    ne;

    constructor (id, option) {
        this.id = id;
        this.name = option.name;
        this.good = option.good || [];
        this.bad = option.bad || [];
        this.ne = option.ne || [];
    }

    /**
     * @param {Type} type 
     */
    attack (type) {
        if (this.good.includes(type.id)) {
            return 1.6;
        } else if (this.bad.includes(type.id)) {
            return 0.625;
        } else if (this.ne.includes(type.id)) {
            return 0.39;
        } else {
            return 1;
        }
    }
}

/**
 * @type {Type[]}
 */
export const Types = [
    new Type('normal', {
        name: 'ノーマル',
        good: [],
        bad: ['rock', 'steel'],
        ne: ['ghost']
    }),
    new Type('fire', {
        name: 'ほのお',
        good: ['grass', 'ice', 'bug', 'steel'],
        bad: ['fire', 'water', 'rock', 'dragon'],
        ne: []
    }),
    new Type('water', {
        name: 'みず',
        good: ['fire', 'ground', 'rock'],
        bad: ['water', 'grass', 'dragon'],
        ne: []
    }),
    new Type('grass', {
        name: 'くさ',
        good: ['water', 'ground', 'rock'],
        bad: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
        ne: []
    }),
    new Type('electric', {
        name: 'でんき',
        good: ['water', 'flying'],
        bad: ['electric', 'grass', 'dragon'],
        ne: ['ground']
    }),
    new Type('ice', {
        name: 'こおり',
        good: ['grass', 'ground', 'flying', 'dragon'],
        bad: ['fire', 'water', 'ice', 'steel'],
        ne: []
    }),
    new Type('fighting', {
        name: 'かくとう',
        good: ['normal', 'ice', 'rock', 'dark', 'steel'],
        bad: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
        ne: ['ghost']
    }),
    new Type('poison', {
        name: 'どく',
        good: ['grass', 'fairy'],
        bad: ['poison', 'ground', 'rock', 'ghost'],
        ne: ['steel']
    }),
    new Type('ground', {
        name: 'じめん',
        good: ['fire', 'electric', 'poison', 'rock', 'steel'],
        bad: ['grass', 'bug'],
        ne: ['flying']
    }),
    new Type('flying', {
        name: 'ひこう',
        good: ['grass', 'fighting', 'bug'],
        bad: ['electric', 'rock', 'steel'],
        ne: []
    }),
    new Type('psychic', {
        name: 'エスパー',
        good: ['fighting', 'poison'],
        bad: ['psychic', 'steel'],
        ne: ['dark']
    }),
    new Type('bug', {
        name: 'むし',
        good: ['grass', 'psychic', 'dark'],
        bad: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
        ne: []
    }),
    new Type('rock', {
        name: 'いわ',
        good: ['fire', 'ice', 'flying', 'bug'],
        bad: ['fighting', 'ground', 'steel'],
        ne: []
    }),
    new Type('ghost', {
        name: 'ゴースト',
        good: ['psychic', 'ghost'],
        bad: ['dark'],
        ne: ['normal']
    }),
    new Type('dragon', {
        name: 'ドラゴン',
        good: ['dragon'],
        bad: ['steel'],
        ne: ['fairy']
    }),
    new Type('dark', {
        name: 'あく',
        good: ['psychic', 'ghost'],
        bad: ['fighting', 'dark', 'fairy'],
        ne: []
    }),
    new Type('steel', {
        name: 'はがね',
        good: ['ice', 'rock', 'fairy'],
        bad: ['fire', 'water', 'electric', 'steel'],
        ne: []
    }),
    new Type('fairy', {
        name: 'フェアリー',
        good: ['fighting', 'dragon', 'dark'],
        bad: ['fire', 'poison', 'steel'],
        ne: []
    })
];

/**
 * @param {string} id 
 * @returns {Type}
 */
export function getType(id) {
    return Types.find(type => type.id === id);
}

/**
 * @param {Type} own 
 * @param {Type[]} others 
 * @returns {{ rate: number, text: string }}
 */
export function judge(own, others) {
    const rate = parseFloat(others.map(t => own.attack(t)).reduce((p, c) => p *= c, 1).toFixed(2));
    const text = (r => {
        if (r >= 2.56) {
            return '○ 超ばつぐん'
        } else if (r >= 1.6) {
            return '○ ばつぐん';
        } else if (r <= 0.24) {
            return '× 効果なしなし';
        } else if (r <= 0.39) {
            return '× 効果なし';
        } else if (r <= 0.63) {
            return '△ いまひとつ';
        } else {
            return '・ 効果あり';
        }
    })(rate);
    return {
        rate,
        text
    };
}
