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
    /** @type {number} */
    number;
    /** @type {string[]} */
    additional;

    constructor (id, option) {
        this.id = id;
        this.name = option.name;
        this.good = option.good || [];
        this.bad = option.bad || [];
        this.ne = option.ne || [];
        this.number = option.number ?? 0;
        this.additional = option.additional ??[];
    }

    /**
     * @param {Type} type
     * @returns {{ effect: string, rate: number }}
     */
    attack (type) {
        if (this.good.includes(type.id)) {
            return {
                effect: 'good',
                rate: 1.6
            };
        } else if (this.bad.includes(type.id)) {
            return {
                effect: 'bad',
                rate: 0.625
            };
        } else if (this.ne.includes(type.id)) {
            return {
                effect: 'ne',
                rate: 0.39
            };
        } else {
            return {
                effect: 'normal',
                rate: 1
            };
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
        ne: ['ghost'],
        number: 1
    }),
    new Type('fire', {
        name: 'ほのお',
        good: ['grass', 'ice', 'bug', 'steel'],
        bad: ['fire', 'water', 'rock', 'dragon'],
        ne: [],
        number: 2,
        additional: [
            '「やけど」にならない'
        ]
    }),
    new Type('water', {
        name: 'みず',
        good: ['fire', 'ground', 'rock'],
        bad: ['water', 'grass', 'dragon'],
        ne: [],
        number: 3
    }),
    new Type('grass', {
        name: 'くさ',
        good: ['water', 'ground', 'rock'],
        bad: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
        ne: [],
        number: 4,
        additional: [
            '「やどりぎのタネ」「キノコのほうし」無効',
            'こな系ワザ無効'
        ]
    }),
    new Type('electric', {
        name: 'でんき',
        good: ['water', 'flying'],
        bad: ['electric', 'grass', 'dragon'],
        ne: ['ground'],
        number: 5,
        additional: [
            '「まひ」にならない'
        ]
    }),
    new Type('ice', {
        name: 'こおり',
        good: ['grass', 'ground', 'flying', 'dragon'],
        bad: ['fire', 'water', 'ice', 'steel'],
        ne: [],
        number: 6,
        additional: [
            '「こおり」にならない',
            '「ゆき」の時 ぼうぎょx1.5',
            '「ぜったいれいど」無効'
        ]
    }),
    new Type('fighting', {
        name: 'かくとう',
        good: ['normal', 'ice', 'rock', 'dark', 'steel'],
        bad: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
        ne: ['ghost'],
        number: 7
    }),
    new Type('poison', {
        name: 'どく',
        good: ['grass', 'fairy'],
        bad: ['poison', 'ground', 'rock', 'ghost'],
        ne: ['steel'],
        number: 8,
        additional: [
            '「どく」「もうどく」にならない',
            '「どくびし」を無力化(ひこうタイプ/ふゆう特性以外)'
        ]
    }),
    new Type('ground', {
        name: 'じめん',
        good: ['fire', 'electric', 'poison', 'rock', 'steel'],
        bad: ['grass', 'bug'],
        ne: ['flying'],
        number: 9,
        additional: [
            '「でんじは」無効',
            '「すなあらし」の時のダメージ0'
        ]
    }),
    new Type('flying', {
        name: 'ひこう',
        good: ['grass', 'fighting', 'bug'],
        bad: ['electric', 'rock', 'steel'],
        ne: [],
        number: 10,
        additional: [
            '「まきびし」「どくびし」の効果を受けない'
        ]
    }),
    new Type('psychic', {
        name: 'エスパー',
        good: ['fighting', 'poison'],
        bad: ['psychic', 'steel'],
        ne: ['dark'],
        number: 11
    }),
    new Type('bug', {
        name: 'むし',
        good: ['grass', 'psychic', 'dark'],
        bad: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
        ne: [],
        number: 12
    }),
    new Type('rock', {
        name: 'いわ',
        good: ['fire', 'ice', 'flying', 'bug'],
        bad: ['fighting', 'ground', 'steel'],
        ne: [],
        number: 13,
        additional: [
            '「すなあらし」の時 ダメージ0 & とくぼうx1.5'
        ]
    }),
    new Type('ghost', {
        name: 'ゴースト',
        good: ['psychic', 'ghost'],
        bad: ['dark'],
        ne: ['normal'],
        number: 14,
        additional: [
            '逃げられなくなるワザや特性無効'
        ]
    }),
    new Type('dragon', {
        name: 'ドラゴン',
        good: ['dragon'],
        bad: ['steel'],
        ne: ['fairy'],
        number: 15
    }),
    new Type('dark', {
        name: 'あく',
        good: ['psychic', 'ghost'],
        bad: ['fighting', 'dark', 'fairy'],
        ne: [],
        number: 16,
        additional: [
            '「いたずらごころ」特性で先制されたへんかワザ無効'
        ]
    }),
    new Type('steel', {
        name: 'はがね',
        good: ['ice', 'rock', 'fairy'],
        bad: ['fire', 'water', 'electric', 'steel'],
        ne: [],
        number: 17,
        additional: [
            '「すなあらし」の時 ダメージ0',
            '「どく」「もうどく」にならない'
        ]
    }),
    new Type('fairy', {
        name: 'フェアリー',
        good: ['fighting', 'dragon', 'dark'],
        bad: ['fire', 'poison', 'steel'],
        ne: [],
        number: 18
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
 * @returns {{ rate: string, text: string }}
 */
export function judge(own, others) {
    const effects = others.map(t => own.attack(t));
    const rate = effects.reduce((p, c) => p *= c.rate, 1).toFixed(2);
    const text = (r => {
        if (effects.some(e => e.effect === 'ne')) {
            return '× 効果なし';
        } else {
            if (r >= 1.6) {
                return '○ ばつぐん'
            } else if (r <= 0.63) {
                return '△ いまひとつ';
            } else {
                return '・ 効果あり';
            }
        }
    })(rate);
    return {
        rate,
        text
    };
}
