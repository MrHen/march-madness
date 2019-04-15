const _ = require('lodash');

const predictions = require('./2018.json');
matchup = predictions.matchup;

// loadActual(matchup);

seeds = getSeeds();

values = [];

FIRST_ROUND = {
    games: _.map(getFirstRound(), (game, i) => ({
        ...build(game, 0, i),
    })),
};

const adam_1 = loadBracket(require('./centriam/adam_1.json'), 'adam_1');
const adam_2 = loadBracket(require('./centriam/adam_2.json'), 'adam_2');
const adam_3 = loadBracket(require('./centriam/adam_3.json'), 'adam_3');
const ian_1 = loadOnlineBracket(require('./centriam/ian_1.json'), 'ian_1');
const ian_2 = loadOnlineBracket(require('./centriam/ian_2.json'), 'ian_2');
const anya_2 = loadOnlineBracket(require('./centriam/anya_2.json'), 'anya_2');

const brackets = [];
brackets.push(adam_1);
brackets.push(adam_2);
brackets.push(adam_3);
brackets.push(ian_1);
brackets.push(ian_2);
brackets.push(anya_2);

const top = 10000;
// let brackets = runBatch(top);
resetBrackets(brackets);
const iMax = 20;

const evolve = false;

for (let i = 0; i <= iMax; i++) {
    console.log(`batch ${i} of ${iMax}`);
    const newBrackets = runBatch(1000);
    
    for (let j = 0; j < newBrackets.length; j++) {
        if (j % (newBrackets.length / 10) === 0) {
            console.log(`scoring... ${j}`);
        }
        scoreBrackets(brackets, newBrackets[j].picks);
    }

    if (evolve) {
        calculateBrackets(brackets);
        brackets = _.take(_.orderBy(brackets, ['score_avg'], ['desc']), top);
        console.log(`after ${i}, best [${brackets[0].score_avg}, ${brackets[1].score_avg}, ${brackets[2].score_avg}]`);
    
        resetBrackets(newBrackets);
        brackets = brackets.concat(newBrackets);    
    }
}

calculateBrackets(brackets);

// best = _.maxBy(brackets, 'score_avg');

// _.forEach(_.sortBy(brackets, 'score_avg'), (bracket) => {
//     if (bracket.name) {
//         console.log(`${bracket.name} ${bracket.score_avg} (${bracket.score_min} - ${bracket.score_max})`);
//     }
// })

// console.log(`alpha ${alpha.score_avg} (${alpha.score_min} - ${alpha.score_max})`);
// console.log(`beta ${beta.score_avg}`);
// console.log(`ian_1 ${ian_1.score_avg}`);
// console.log(`ian_2 ${ian_2.score_avg}`);
// console.log(`anya_2 ${anya_2.score_avg}`);

// console.log(`first max = ${first.max}`);
// console.log(`first expected = ${first.score_avg}`);

// console.log(`best max = ${best.max}`);
best = _.take(_.orderBy(brackets, ['score_avg'], ['desc']), 10);

const save = _.map(best[0].picks, (pick) => {
    return {
        "key": pick.key,
        "winner": pick.winner,
        "round": pick.round,
        "game": pick.game,
    }
});

// console.log(JSON.stringify(save, null, 2));

_.forEach(best, (bracket) => {
    console.log(`\n\n best expected\t ${bracket.name}\t ${bracket.score_avg} (${bracket.score_min} - ${bracket.score_max})`);
    // _.forEach(bracket.picks, (pick) => {
    //     console.log(`${pick.round}:${pick.game}\t ${pick.key}\t ${pick.winner} beats ${pick.loser}`);
    // })    
});

// const counts = _.countBy(brackets, hashBracket);

// console.log('counts\t ', _.values(counts).length);

function build(key, round, game) {
    // previous = previous || {
    //     winner_chance: 1,
    //     round_chance: 1,
    //     round: -1,
    // };

    teams = key.split('__');
    winner = teams[0];
    loser = teams[1];

    full = {
        key: `${teams[0]}__${teams[1]}`,

        winner: teams[0],
        winner_seed: seeds[winner].Seed,
        // winner_points: ,
        winner_chance: matchup[key].p,

        loser: teams[1],
        loser_seed: seeds[loser].Seed,
        // loser_points: seeds[loser].Seed,
        loser_chance: matchup[`${teams[1]}__${teams[0]}`].p,

        round,
        round_bonus: Math.pow(2, round),

        game,
    };

    full.winner_points = seeds[winner].Seed + full.round_bonus;
    full.loser_points = seeds[loser].Seed + full.round_bonus;

    full.winner_value = full.winner_points * full.winner_chance / 100;
    full.loser_value = full.loser_points * full.loser_chance / 100;

    return full;
}

function flip(game) {
    return {
        ...game,

        key: `${game.loser}__${game.winner}`,

        winner: game.loser,
        winner_seed: game.loser_seed,
        winner_points: game.loser_points,
        winner_chance: game.loser_chance,
        winner_value: game.loser_value,

        loser: game.winner,
        loser_seed: game.winner_seed,
        loser_points: game.winner_points,
        loser_chance: game.winner_chance,
        loser_value: game.winner_value,
    };
}

function runBatch(n = 10) {
    first = null;
    best = null;
    best_max = null;
    const brackets = [];
    for (let b = 0; b < n; b++) {
        if (b % (n / 10) === 0) {
            console.log(`\nbracket ${b} started`);
        }

        rounds = [
            _.clone(FIRST_ROUND),
        ];
        picks = [];

        for (let r = 0; r < 6; r++) {
            const round = rounds[r];

            // console.log(`\n\nround ${r} started ${_.map(round.games, 'key')}`);

            round.picks = [];

            for (i in round.games) {
                const game = round.games[i];
                resultA = build(game.key, r, i);
                resultB = flip(resultA);

                let winner = resultB;
                if (Math.random() * 100 < resultA.winner_chance) {
                    winner = resultA;
                }

                pick = {
                    ...winner,
                };

                round.picks.push(pick);
                picks.push(pick);
            }

            if (round.picks.length < 2) {
                break;
            }

            round.next = _.map(_.chunk(round.picks, 2), picks =>
                ({
                    key: `${picks[0].winner}__${picks[1].winner}`,
                }));
            round_next = {
                games: round.next,
            };
            rounds.push(round_next);
        }

        const bracket = {
            bracket: b,
            picks,
            max: _.sumBy(picks, 'winner_points'),
        };

        brackets.push(bracket);
    }

    return brackets;
}

function scoreBrackets(brackets, result) {
    for (var b = 0; b < brackets.length; b++) {
        const bracket = brackets[b];
        const picks = bracket.picks;

        let total = 0;

        for (let p = 0; p < bracket.picks.length; p++) {
            if (picks[p].winner === result[p].winner) {
                // console.log(`${bracket.name} hit ${picks[p].winner} in round ${picks[p].round} for ${picks[p].winner_points}`)
                total += picks[p].winner_points;
            }
        }

        if (bracket.score_min === null || total < bracket.score_min) {
            bracket.score_min = total;
        }

        if (bracket.score_max === null || total > bracket.score_max) {
            bracket.score_max = total;
        }

        bracket.score_all += total;
        bracket.score_count += 1;
    }
}

function resetBrackets(brackets) {
    for (var b = 0; b < brackets.length; b++) {
        const bracket = brackets[b];
        bracket.score_min = null;
        bracket.score_max = null;
        bracket.score_all = 0;
        bracket.score_count = 0;
        bracket.score_avg = 0;
    }
}

function calculateBrackets(brackets) {
    for (var b = 0; b < brackets.length; b++) {
        const bracket = brackets[b];
        bracket.score_avg = bracket.score_all / bracket.score_count;
    }
}

function hashBracket(bracket) {
    const str = _.map(bracket.picks, 'winner').join('|');
    return Buffer.from(str).toString('base64');
}

function buildBracket(firstRound) {
    const rounds = [firstRound];
    const picks = [];

    for (let r = 0; r < 6; r++) {
        const round = rounds[r];

        // console.log(`\n\nround ${r} started ${_.map(round.games, 'key')}`);

        round.picks = [];

        for (i in round.games) {
            const game = round.games[i];
            resultA = build(game.key, r, i);
            resultB = flip(resultA);

            const winner = Math.random() * 100 < resultA.winner_chance ? resultA : resultB;

            pick = {
                ...winner,
            };

            round.picks.push(pick);
            picks.push(pick);

            // console.log(`${pick.winner}\t > ${pick.loser}\t = ${pick.winner_value} points\t (${Math.round(pick.round_chance * 100000) / 1000}%)`);
            // console.log(_.map(round.picks, 'key'));
        }

        if (round.picks.length < 2) {
            break;
        }

        round.next = _.map(_.chunk(round.picks, 2), (picks, i) => {
            // console.log(`got ${picks[0].winner} v ${picks[1].winner}`)
            return {
                key: `${picks[0].winner}__${picks[1].winner}`,
                game: i,
            }
        });

        round_next = {
            games: round.next,
        };
        // console.log(`round ${r} ended ${_.map(round_next.games, 'key')}`);
        rounds.push(round_next);
    }

    // console.log(JSON.stringify(picks, null, 2));
    return picks;
}

function loadBracket(picks, name) {
    const bracket = {
        name,
        picks: [],
    };

    for (let p = 0; p < picks.length; p++) {
        const pick = picks[p];
        bracket.picks.push({
            ...pick,
            winner_seed: seeds[pick.winner].Seed,
            winner_chance: matchup[pick.key].p,
            winner_points: seeds[pick.winner].Seed + Math.pow(2, pick.round),
        });
    }

    return bracket;
}

function loadOnlineBracket(bracket, name) {
    const seeds = getSeeds();
    // console.log(seeds['UVA']);
    const result = {
        name,
        picks: _.map(bracket.picks, (pick) => {
            const top_key = convertOnlineKey(pick.top);
            const bot_key = convertOnlineKey(pick.bottom);
            const winner_key = convertOnlineKey(pick.pick);

            if (!winner_key || !seeds[winner_key]) {
                throw `${pick.pick} => ${winner_key}`;
            }

            if (!top_key || !seeds[top_key]) {
                throw `${pick.top} => ${top_key}`;
            }

            if (!bot_key || !seeds[bot_key]) {
                throw `${pick.bot} => ${bot_key}`;
            }

            const loser_key = winner_key === top_key ? bot_key : top_key;

            const game_key = `${winner_key}__${loser_key}`;

            if (!game_key || !matchup[game_key]) {
                throw `${winner_key} ${loser_key} ${pick.pick} ${pick.top} ${pick.bottom} => ${game_key}`;
            }

            const round = pick.round - 1;

            const converted = {
                key: game_key,
                winner: winner_key,
                loser: loser_key,

                round,
                name,

                winner_seed: seeds[winner_key].Seed,
                winner_chance: matchup[game_key].p,
                winner_points: seeds[winner_key].Seed + Math.pow(2, round),
            };

            converted.winner_value = converted.winner_chance / 100 * converted.winner_points;
            // console.log(converted);
            return converted;
        }),
    };

    result.picks = _.sortBy(result.picks, 'round');

    return result;
}

function convertOnlineKey(key) {
    const mapping = {
        PLAY1: 'TX SOU',
        PLAY2: 'RADFRD',
        PLAY3: 'STBONA',
        PLAY4: 'SYR',

        ARIZ: 'ARIZ',
        ARK: 'ARK',
        AUBURN: 'AUBURN',
        BUTLER: 'BUTLER',
        CLEM: 'CLEM',
        CINCY: 'CINCY',
        CREIGH: 'CREIGH',
        CUSE: 'SYR',
        DAVID: 'DAVID',
        DUKE: 'DUKE',
        FSU: 'FSU',
        GONZAG: 'GONZ',
        HOU: 'HOU',
        KANSAS: 'KANSAS',
        KSTATE: 'KAN ST',
        FLA: 'FLA',
        LOYCHI: 'LOYCHI',
        MIAMI: 'MIAMI',
        MICH: 'MICH',
        MICHST: 'MICHST',
        MIZZOU: 'MIZZOU',
        NEVADA: 'NEVADA',
        NMEXST: 'NM ST',
        NOVA: 'NOVA',
        OHIOST: 'OHIOST',
        PURDUE: 'PURDUE',
        RI: 'URI',
        SETON: 'SETON',
        TCU: 'TCU',
        TENN: 'TENN',
        TEXAM: 'TX A&M',
        TEXAS: 'TEXAS',
        TXTECH: 'TXTECH',
        UK: 'UK',
        UMBC: 'UMBC',
        UNC: 'UNC',
        UVA: 'UVA',
        VATECH: 'VATECH',
        WICHST: 'WICHST',
        WVU: 'WVU',
        XAVIER: 'XAVIER',

        BAMA: 'ALA',
        BUCK: 'BUCKNL',
        BUFF: 'BUFF',
        CHARLS: 'C OF C',
        CSFULL: 'CSFULL',
        GAST: 'GA ST',
        IONA: 'IONA',
        LPSCMB: 'LIPSCO',
        MNTNA: 'MONT',
        MRSHL: 'MARSH',
        MURYST: 'MURRAY',
        NCGRN: 'UNC G',
        NCST: 'NC ST',
        OKLA: 'OKLA',
        PENN: 'PENN',
        PROV: 'PROV',
        SDAKST: 'SDAKST',
        SDGST: 'SDSU',
        SFA: 'SFA',
        WRIGHT: 'WRIGHT',
    };

    return mapping[key];
}

function getSeeds() {
    return {
        'LIU BK': {
            Char6: 'LIU BK',
            NameShort: 'LIU Brooklyn',
            NameSeo: 'long-island',
            Seed: 16,
        },
        RADFRD: {
            Char6: 'RADFRD',
            NameShort: 'Radford',
            NameSeo: 'radford',
            Seed: 16,
        },
        STBONA: {
            Char6: 'STBONA',
            NameShort: 'St. Bonaventure',
            NameSeo: 'st-bonaventure',
            Seed: 11,
        },
        UCLA: {
            Char6: 'UCLA',
            NameShort: 'UCLA',
            NameSeo: 'ucla',
            Seed: 16,
        },
        'TX SOU': {
            Char6: 'TX SOU',
            NameShort: 'TSU',
            NameSeo: 'texas-southern',
            Seed: 16,
        },
        'NC CEN': {
            Char6: 'NC CEN',
            NameShort: 'NC Central',
            NameSeo: 'nc-central',
            Seed: 16,
        },
        SYR: {
            Char6: 'SYR',
            NameShort: 'Syracuse',
            NameSeo: 'syracuse',
            Seed: 11,
        },
        'AZ ST': {
            Char6: 'AZ ST',
            NameShort: 'Arizona St',
            NameSeo: 'arizona-st',
            Seed: 11,
        },
        OKLA: {
            Char6: 'OKLA',
            NameShort: 'Oklahoma',
            NameSeo: 'oklahoma',
            Seed: 10,
        },
        URI: {
            Char6: 'URI',
            NameShort: 'URI',
            NameSeo: 'rhode-island',
            Seed: 7,
        },
        WRIGHT: {
            Char6: 'WRIGHT',
            NameShort: 'Wright State',
            NameSeo: 'wright-st',
            Seed: 14,
        },
        TENN: {
            Char6: 'TENN',
            NameShort: 'Tennessee',
            NameSeo: 'tennessee',
            Seed: 3,
        },
        'UNC G': {
            Char6: 'UNC G',
            NameShort: 'UNCG',
            NameSeo: 'unc-greensboro',
            Seed: 13,
        },
        GONZ: {
            Char6: 'GONZ',
            NameShort: 'Gonzaga',
            NameSeo: 'gonzaga',
            Seed: 4,
        },
        PENN: {
            Char6: 'PENN',
            NameShort: 'Penn',
            NameSeo: 'penn',
            Seed: 16,
        },
        KANSAS: {
            Char6: 'KANSAS',
            NameShort: 'Kansas',
            NameSeo: 'kansas',
            Seed: 1,
        },
        IONA: {
            Char6: 'IONA',
            NameShort: 'Iona',
            NameSeo: 'iona',
            Seed: 15,
        },
        DUKE: {
            Char6: 'DUKE',
            NameShort: 'Duke',
            NameSeo: 'duke',
            Seed: 2,
        },
        LOYCHI: {
            Char6: 'LOYCHI',
            NameShort: 'Loyola Chicago',
            NameSeo: 'loyola-il',
            Seed: 11,
        },
        MIAMI: {
            Char6: 'MIAMI',
            NameShort: 'Miami (FL)',
            NameSeo: 'miami-fl',
            Seed: 6,
        },
        SDAKST: {
            Char6: 'SDAKST',
            NameShort: 'S Dakota St',
            NameSeo: 'south-dakota-st',
            Seed: 12,
        },
        OHIOST: {
            Char6: 'OHIOST',
            NameShort: 'Ohio St. ',
            NameSeo: 'ohio-st',
            Seed: 5,
        },
        'NC ST': {
            Char6: 'NC ST',
            NameShort: 'NC State',
            NameSeo: 'north-carolina-st',
            Seed: 9,
        },
        SETON: {
            Char6: 'SETON',
            NameShort: 'Seton Hall',
            NameSeo: 'seton-hall',
            Seed: 8,
        },
        NOVA: {
            Char6: 'NOVA',
            NameShort: 'Villanova',
            NameSeo: 'villanova',
            Seed: 1,
        },
        DAVID: {
            Char6: 'DAVID',
            NameShort: 'Davidson',
            NameSeo: 'davidson',
            Seed: 12,
        },
        UK: {
            Char6: 'UK',
            NameShort: 'Kentucky',
            NameSeo: 'kentucky',
            Seed: 5,
        },
        SDSU: {
            Char6: 'SDSU',
            NameShort: 'San Diego State',
            NameSeo: 'san-diego-st',
            Seed: 11,
        },
        HOU: {
            Char6: 'HOU',
            NameShort: 'Houston',
            NameSeo: 'houston',
            Seed: 6,
        },
        SFA: {
            Char6: 'SFA',
            NameShort: 'SFA',
            NameSeo: 'stephen-f-austin',
            Seed: 14,
        },
        TXTECH: {
            Char6: 'TXTECH',
            NameShort: 'Texas Tech',
            NameSeo: 'texas-tech',
            Seed: 3,
        },
        ALA: {
            Char6: 'ALA',
            NameShort: 'Alabama',
            NameSeo: 'alabama',
            Seed: 9,
        },
        VATECH: {
            Char6: 'VATECH',
            NameShort: 'VA Tech',
            NameSeo: 'virginia-tech',
            Seed: 8,
        },
        BUFF: {
            Char6: 'BUFF',
            NameShort: 'Buffalo',
            NameSeo: 'buffalo',
            Seed: 13,
        },
        ARIZ: {
            Char6: 'ARIZ',
            NameShort: 'Arizona',
            NameSeo: 'arizona',
            Seed: 4,
        },
        MONT: {
            Char6: 'MONT',
            NameShort: 'Montana',
            NameSeo: 'montana',
            Seed: 14,
        },
        MICH: {
            Char6: 'MICH',
            NameShort: 'Michigan',
            NameSeo: 'michigan',
            Seed: 3,
        },
        FLA: {
            Char6: 'FLA',
            NameShort: 'Florida',
            NameSeo: 'florida',
            Seed: 9,
        },
        PROV: {
            Char6: 'PROV',
            NameShort: 'Providence',
            NameSeo: 'providence',
            Seed: 10,
        },
        'TX A&M': {
            Char6: 'TX A&M',
            NameShort: 'Texas A&M',
            NameSeo: 'texas-am',
            Seed: 7,
        },
        CSFULL: {
            Char6: 'CSFULL',
            NameShort: 'CSU Fullerton',
            NameSeo: 'cal-st-fullerton',
            Seed: 15,
        },
        PURDUE: {
            Char6: 'PURDUE',
            NameShort: 'Purdue',
            NameSeo: 'purdue',
            Seed: 2,
        },
        MARSH: {
            Char6: 'MARSH',
            NameShort: 'Marshall',
            NameSeo: 'marshall',
            Seed: 13,
        },
        WICHST: {
            Char6: 'WICHST',
            NameShort: 'Wichita St',
            NameSeo: 'wichita-st',
            Seed: 4,
        },
        'GA ST': {
            Char6: 'GA ST',
            NameShort: 'Georgia State',
            NameSeo: 'georgia-st',
            Seed: 15,
        },
        CINCY: {
            Char6: 'CINCY',
            NameShort: 'Cincinnati',
            NameSeo: 'cincinnati',
            Seed: 2,
        },
        LIPSCO: {
            Char6: 'LIPSCO',
            NameShort: 'Lipscomb',
            NameSeo: 'lipscomb',
            Seed: 15,
        },
        UNC: {
            Char6: 'UNC',
            NameShort: 'UNC',
            NameSeo: 'north-carolina',
            Seed: 2,
        },
        BUTLER: {
            Char6: 'BUTLER',
            NameShort: 'Butler',
            NameSeo: 'butler',
            Seed: 10,
        },
        ARK: {
            Char6: 'ARK',
            NameShort: 'Arkansas',
            NameSeo: 'arkansas',
            Seed: 7,
        },
        MURRAY: {
            Char6: 'MURRAY',
            NameShort: 'Murray State',
            NameSeo: 'murray-st',
            Seed: 12,
        },
        WVU: {
            Char6: 'WVU',
            NameShort: 'W Virginia',
            NameSeo: 'west-virginia',
            Seed: 5,
        },
        TEXAS: {
            Char6: 'TEXAS',
            NameShort: 'Texas',
            NameSeo: 'texas',
            Seed: 10,
        },
        NEVADA: {
            Char6: 'NEVADA',
            NameShort: 'Nevada',
            NameSeo: 'nevada',
            Seed: 7,
        },
        'KAN ST': {
            Char6: 'KAN ST',
            NameShort: 'Kansas St',
            NameSeo: 'kansas-st',
            Seed: 9,
        },
        CREIGH: {
            Char6: 'CREIGH',
            NameShort: 'Creighton',
            NameSeo: 'creighton',
            Seed: 8,
        },
        BUCKNL: {
            Char6: 'BUCKNL',
            NameShort: 'Bucknell',
            NameSeo: 'bucknell',
            Seed: 14,
        },
        MICHST: {
            Char6: 'MICHST',
            NameShort: 'Michigan St',
            NameSeo: 'michigan-st',
            Seed: 3,
        },
        XAVIER: {
            Char6: 'XAVIER',
            NameShort: 'Xavier',
            NameSeo: 'xavier',
            Seed: 1,
        },
        'C OF C': {
            Char6: 'C OF C',
            NameShort: 'Charleston',
            NameSeo: 'col-of-charleston',
            Seed: 13,
        },
        AUBURN: {
            Char6: 'AUBURN',
            NameShort: 'Auburn',
            NameSeo: 'auburn',
            Seed: 4,
        },
        UMBC: {
            Char6: 'UMBC',
            NameShort: 'UMBC',
            NameSeo: 'umbc',
            Seed: 16,
        },
        UVA: {
            Char6: 'UVA',
            NameShort: 'Virginia',
            NameSeo: 'virginia',
            Seed: 1,
        },
        TCU: {
            Char6: 'TCU',
            NameShort: 'TCU',
            NameSeo: 'tcu',
            Seed: 6,
        },
        FSU: {
            Char6: 'FSU',
            NameShort: 'Florida St',
            NameSeo: 'florida-st',
            Seed: 6,
        },
        MIZZOU: {
            Char6: 'MIZZOU',
            NameShort: 'Missouri',
            NameSeo: 'missouri',
            Seed: 8,
        },
        'NM ST': {
            Char6: 'NM ST',
            NameShort: 'N Mexico',
            NameSeo: 'new-mexico-st',
            Seed: 12,
        },
        CLEM: {
            Char6: 'CLEM',
            NameShort: 'Clemson',
            NameSeo: 'clemson',
            Seed: 5,
        },
    };
}

function getFirstRound() {
    return [
        // SOUTH
        'UVA__UMBC',
        'CREIGH__KAN ST',
        'UK__DAVID',
        'ARIZ__BUFF',

        'MIAMI__LOYCHI',
        'TENN__WRIGHT',
        'NEVADA__TEXAS',
        'CINCY__GA ST',

        // WEST
        'XAVIER__TX SOU',
        'MIZZOU__FSU',
        'OHIOST__SDAKST',
        'GONZ__UNC G',

        'HOU__SDSU',
        'MICH__MONT',
        'TX A&M__PROV',
        'UNC__LIPSCO',

        // EAST
        'NOVA__RADFRD',
        'VATECH__ALA',
        'WVU__MURRAY',
        'WICHST__MARSH',

        'FLA__STBONA',
        'TXTECH__SFA',
        'ARK__BUTLER',
        'PURDUE__CSFULL',

        // MIDWEST
        'KANSAS__PENN',
        'SETON__NC ST',
        'CLEM__NM ST',
        'AUBURN__C OF C',

        'TCU__SYR',
        'MICHST__BUCKNL',
        'URI__OKLA',
        'DUKE__IONA',
    ];
}

function loadActual(matchup) {
    const actual = require('./actual.json');
    _.forEach(actual.games, (game) => {
        const winner_key = `${game.winner}__${game.loser}`;
        const loser_key =  `${game.loser}__${game.winner}`;
        matchup[winner_key].p = 100;
        matchup[loser_key].p = 0;
    });
}
