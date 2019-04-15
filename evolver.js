/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */
const _ = require('lodash');
const fs = require('fs');
// const path = require('path');

// const fivethirtyeight = fs.readFileSync('2018_538.csv', 'utf8');
const fivethirtyeight = fs.readFileSync('2019_538_womens.csv', 'utf8');

const lines = _.split(fivethirtyeight, '\n');
// const header = _.head(lines);
const teamLines = _.drop(lines);

const teams = _.compact(_.map(teamLines, (teamLine) => {
    if (!teamLine) {
        return null;
    }

    const teamData = _.split(teamLine, ',');

    const [
        gender,
        forecastDate,
        playinFlag,
        round1,
        round2,
        round3,
        round4,
        round5,
        round6,
        round7,
        resultsTo,
        alive,
        id,
        name,
        rating,
        region,
        seed,
        slot,
    ] = teamData;

    const team = {
        gender,
        forecastDate,
        playinFlag,
        round1: _.toNumber(round1),
        round2: _.toNumber(round2),
        round3: _.toNumber(round3),
        round4: _.toNumber(round4),
        round5: _.toNumber(round5),
        round6: _.toNumber(round6),
        round7: _.toNumber(round7),
        resultsTo,
        alive,
        id,
        name,
        rating,
        region,
        seed,
        slot,
    };

    return team;
}));

const ordered = _.sortBy(teams, 'name');
const summaries = _.map(ordered, team => `${team.id} - ${team.name} (${team.region} - ${team.seed})`);

console.log({
    summaries,
});

const regionalGames = {
    'Seed 1': {
        round: 2,
        next: 'Round 2 - GCA',
    },
    'Seed 16a': {
        round: 1,
        next: 'Seed 16',
    },
    'Seed 16b': {
        round: 1,
        next: 'Seed 16',
    },
    'Seed 16': {
        round: 2,
        next: 'Round 2 - GCA',
    },
    'Seed 8': {
        round: 2,
        next: 'Round 2 - HCA',
    },
    'Seed 9': {
        round: 2,
        next: 'Round 2 - HCA',
    },
    'Seed 5': {
        round: 2,
        next: 'Round 2 - IDA',
    },
    'Seed 12': {
        round: 2,
        next: 'Round 2 - IDA',
    },
    'Seed 4': {
        round: 2,
        next: 'Round 2 - JDA',
    },
    'Seed 13': {
        round: 2,
        next: 'Round 2 - JDA',
    },
    'Seed 6': {
        round: 2,
        next: 'Round 2 - KEB',
    },
    'Seed 11a': {
        round: 1,
        next: 'Seed 11',
    },
    'Seed 11b': {
        round: 1,
        next: 'Seed 11',
    },
    'Seed 11': {
        round: 2,
        next: 'Round 2 - KEB',
    },
    'Seed 3': {
        round: 2,
        next: 'Round 2 - LEB',
    },
    'Seed 14': {
        round: 2,
        next: 'Round 2 - LEB',
    },
    'Seed 7': {
        round: 2,
        next: 'Round 2 - MFB',
    },
    'Seed 10': {
        round: 2,
        next: 'Round 2 - MFB',
    },
    'Seed 2': {
        round: 2,
        next: 'Round 2 - NFB',
    },
    'Seed 15': {
        round: 2,
        next: 'Round 2 - NFB',
    },

    'Round 2 - GCA': {
        round: 3,
        next: 'Sweet - CA',
    },
    'Round 2 - HCA': {
        round: 3,
        next: 'Sweet - CA',
    },
    'Round 2 - IDA': {
        round: 3,
        next: 'Sweet - DA',
    },
    'Round 2 - JDA': {
        round: 3,
        next: 'Sweet - DA',
    },
    'Round 2 - KEB': {
        round: 3,
        next: 'Sweet - EB',
    },
    'Round 2 - LEB': {
        round: 3,
        next: 'Sweet - EB',
    },
    'Round 2 - MFB': {
        round: 3,
        next: 'Sweet - FB',
    },
    'Round 2 - NFB': {
        round: 3,
        next: 'Sweet - FB',
    },

    'Sweet - CA': {
        round: 4,
        next: 'Elite - A',
    },
    'Sweet - DA': {
        round: 4,
        next: 'Elite - A',
    },
    'Sweet - EB': {
        round: 4,
        next: 'Elite - B',
    },
    'Sweet - FB': {
        round: 4,
        next: 'Elite - B',
    },

    'Elite - A': {
        round: 5,
        next: 'Four',
    },
    'Elite - B': {
        round: 5,
        next: 'Four',
    },
};

const regions = [
    'Greensboro',
    'Portland',
    'Chicago',
    'Albany',
];

const finalGames = {
    'Greensboro - Four': {
        round: 6,
        key: 'Greensboro - Four',
        next: 'Final 1',
    },
    'Portland - Four': {
        round: 6,
        key: 'Portland - Four',
        next: 'Final 1',
    },
    'Chicago - Four': {
        round: 6,
        key: 'Chicago - Four',
        next: 'Final 2',
    },
    'Albany - Four': {
        round: 6,
        key: 'Albany - Four',
        next: 'Final 2',
    },

    'Final 1': {
        round: 7,
        key: 'Final 1',
        next: 'Winner',
    },
    'Final 2': {
        round: 7,
        key: 'Final 2',
        next: 'Winner',
    },

    Winner: {
        round: 8,
        key: 'Winner',
    },
};

const allRegions = _.transform(regionalGames, (outer, matchup, key) => {
    _.transform(regions, (inner, region) => {
        inner[`${region} - ${key}`] = {
            ...matchup,
            key: `${region} - ${key}`,
            next: `${region} - ${matchup.next}`,
        };
    }, outer);
}, {});

const games = {
    ...allRegions,
    ...finalGames,
};

const gamesOrdered = _.orderBy(games, ['round'], ['desc']);

const teamGames = _.map(teams, (team) => {
    const seed = `${team.region} - Seed ${team.seed}`;
    let seedValue = team.seed;

    let round2;
    // Convert play-in seed numbers (e.g. 16a to 16)
    if (_.includes(team.seed, 'a') || _.includes(team.seed, 'b')) {
        const round1 = seed;
        round2 = games[round1].next;
        seedValue = _.trim(team.seed, 'ab');
    } else {
        round2 = seed;
    }

    // console.log({
    //     team,
    //     round2,
    // });

    const round3 = games[round2].next;
    const round4 = games[round3].next;
    const round5 = games[round4].next;
    const round6 = games[round5].next;
    const round7 = games[round6].next;
    const round8 = games[round7].next;

    return {
        team: team.name,
        seedValue: _.toNumber(seedValue),
        round2,
        round3,
        round4,
        round5,
        round6,
        round7,
        round8,
        all: [round2, round3, round4, round5, round6, round7, round8],
    };
});

const espnPopular = {
    Baylor: 'Winner',
    'Notre Dame': 'Final',
    Connecticut: 'Four',
    'Mississippi State': 'Four',

    Stanford: 'Elite',
    Louisville: 'Elite',
    Iowa: 'Elite',
    Oregon: 'Elite',

    'Texas A&M': 'Sweet',
    'Iowa State': 'Sweet',
    'Oregon State': 'Sweet',
    Maryland: 'Sweet',
    'South Carolina': 'Sweet',
    'North Carolina State': 'Sweet',
    'Miami (FL)': 'Sweet',
    Syracuse: 'Sweet',

    'Michigan State': 'Round 2',
    Marquette: 'Round 2',
    DePaul: 'Round 2',
    'Brigham Young': 'Round 2',

    Michigan: 'Round 2',
    Gonzaga: 'Round 2',
    UCLA: 'Round 2',
    Rutgers: 'Round 2',

    'North Carolina': 'Round 2',
    'Florida State': 'Round 2',
    Kentucky: 'Round 2',
    Missouri: 'Round 2',

    Clemson: 'Round 2',
    'Arizona State': 'Round 2',
    'South Dakota State': 'Round 2',
    Texas: 'Round 2',
};

const alfa = {
    Baylor: 'Winner',
    'Notre Dame': 'Final 2',
    Oregon: 'Portland - Four',
    Connecticut: 'Albany - Four',
    Iowa: 'Greensboro - Elite - B',
    'Mississippi State': 'Portland - Elite - A',
    Stanford: 'Chicago - Elite - B',
    Louisville: 'Albany - Elite - A',
    'South Carolina': 'Greensboro - Sweet - DA',
    'North Carolina State': 'Greensboro - Sweet - EB',
    'Miami (FL)': 'Portland - Sweet - DA',
    Syracuse: 'Portland - Sweet - EB',
    'Texas A&M': 'Chicago - Sweet - DA',
    'Iowa State': 'Chicago - Sweet - EB',
    'Oregon State': 'Albany - Sweet - DA',
    Maryland: 'Albany - Sweet - EB',
    California: 'Greensboro - Round 2 - HCA',
    'Florida State': 'Greensboro - Round 2 - IDA',
    Kentucky: 'Greensboro - Round 2 - KEB',
    Missouri: 'Greensboro - Round 2 - MFB',
    'South Dakota': 'Portland - Round 2 - HCA',
    'Arizona State': 'Portland - Round 2 - IDA',
    'South Dakota State': 'Portland - Round 2 - KEB',
    Texas: 'Portland - Round 2 - MFB',
    'Central Michigan': 'Chicago - Round 2 - HCA',
    Marquette: 'Chicago - Round 2 - IDA',
    DePaul: 'Chicago - Round 2 - KEB',
    Auburn: 'Chicago - Round 2 - MFB',
    Michigan: 'Albany - Round 2 - HCA',
    Gonzaga: 'Albany - Round 2 - IDA',
    UCLA: 'Albany - Round 2 - KEB',
    Buffalo: 'Albany - Round 2 - MFB',
    'Abilene Christian': 'Greensboro - Seed 16',
    'North Carolina': 'Greensboro - Seed 9',
    Bucknell: 'Greensboro - Seed 12',
    Belmont: 'Greensboro - Seed 13',
    Princeton: 'Greensboro - Seed 11',
    Maine: 'Greensboro - Seed 14',
    Drake: 'Greensboro - Seed 10',
    Mercer: 'Greensboro - Seed 15',
    Southern: 'Portland - Seed 16',
    Clemson: 'Portland - Seed 9',
    'Central Florida': 'Portland - Seed 12',
    'Florida Gulf Coast': 'Portland - Seed 13',
    Quinnipiac: 'Portland - Seed 11',
    Fordham: 'Portland - Seed 14',
    Indiana: 'Portland - Seed 10',
    'Portland State': 'Portland - Seed 15',
    'Bethune-Cookman': 'Chicago - Seed 16',
    'Michigan State': 'Chicago - Seed 9',
    Rice: 'Chicago - Seed 12',
    'Wright State': 'Chicago - Seed 13',
    'Missouri State': 'Chicago - Seed 11',
    'New Mexico State': 'Chicago - Seed 14',
    'Brigham Young': 'Chicago - Seed 7',
    'UC-Davis': 'Chicago - Seed 15',
    'Robert Morris': 'Albany - Seed 16',
    'Kansas State': 'Albany - Seed 9',
    'Arkansas-Little Rock': 'Albany - Seed 12',
    'Boise State': 'Albany - Seed 13',
    Tennessee: 'Albany - Seed 11',
    Radford: 'Albany - Seed 14',
    Rutgers: 'Albany - Seed 7',
    Towson: 'Albany - Seed 15',
};

const beta = {
    Baylor: 'Winner',
    'Notre Dame': 'Final 2',
    Oregon: 'Portland - Four',
    Connecticut: 'Albany - Four',
    Iowa: 'Greensboro - Elite - B',
    'Mississippi State': 'Portland - Elite - A',
    Stanford: 'Chicago - Elite - B',
    Louisville: 'Albany - Elite - A',
    'South Carolina': 'Greensboro - Sweet - DA',
    'North Carolina State': 'Greensboro - Sweet - EB',
    'Miami (FL)': 'Portland - Sweet - DA',
    Syracuse: 'Portland - Sweet - EB',
    'Texas A&M': 'Chicago - Sweet - DA',
    'Iowa State': 'Chicago - Sweet - EB',
    'Oregon State': 'Albany - Sweet - DA',
    Maryland: 'Albany - Sweet - EB',
    California: 'Greensboro - Round 2 - HCA',
    'Florida State': 'Greensboro - Round 2 - IDA',
    Kentucky: 'Greensboro - Round 2 - KEB',
    Missouri: 'Greensboro - Round 2 - MFB',
    'South Dakota': 'Portland - Round 2 - HCA',
    'Arizona State': 'Portland - Round 2 - IDA',
    'South Dakota State': 'Portland - Round 2 - KEB',
    Texas: 'Portland - Round 2 - MFB',
    'Central Michigan': 'Chicago - Round 2 - HCA',
    Marquette: 'Chicago - Round 2 - IDA',
    DePaul: 'Chicago - Round 2 - KEB',
    Auburn: 'Chicago - Round 2 - MFB',
    Michigan: 'Albany - Round 2 - HCA',
    Gonzaga: 'Albany - Round 2 - IDA',
    UCLA: 'Albany - Round 2 - KEB',
    Buffalo: 'Albany - Round 2 - MFB',
    'Abilene Christian': 'Greensboro - Seed 16',
    'North Carolina': 'Greensboro - Seed 9',
    Bucknell: 'Greensboro - Seed 12',
    Belmont: 'Greensboro - Seed 13',
    Princeton: 'Greensboro - Seed 11',
    Maine: 'Greensboro - Seed 14',
    Drake: 'Greensboro - Seed 10',
    Mercer: 'Greensboro - Seed 15',
    Southern: 'Portland - Seed 16',
    Clemson: 'Portland - Seed 9',
    'Central Florida': 'Portland - Seed 12',
    'Florida Gulf Coast': 'Portland - Seed 13',
    Quinnipiac: 'Portland - Seed 11',
    Fordham: 'Portland - Seed 14',
    Indiana: 'Portland - Seed 10',
    'Portland State': 'Portland - Seed 15',
    'Bethune-Cookman': 'Chicago - Seed 16',
    'Michigan State': 'Chicago - Seed 9',
    Rice: 'Chicago - Seed 12',
    'Wright State': 'Chicago - Seed 13',
    'Missouri State': 'Chicago - Seed 11',
    'New Mexico State': 'Chicago - Seed 14',
    'Brigham Young': 'Chicago - Seed 7',
    'UC-Davis': 'Chicago - Seed 15',
    'Robert Morris': 'Albany - Seed 16',
    'Kansas State': 'Albany - Seed 9',
    'Arkansas-Little Rock': 'Albany - Seed 12',
    'Boise State': 'Albany - Seed 13',
    Tennessee: 'Albany - Seed 11',
    Radford: 'Albany - Seed 14',
    Rutgers: 'Albany - Seed 7',
    Towson: 'Albany - Seed 15',
};

const charlie = {
    Baylor: 'Winner',
    'Notre Dame': 'Final 2',
    Oregon: 'Portland - Four',
    Connecticut: 'Albany - Four',
    Iowa: 'Greensboro - Elite - B',
    'Mississippi State': 'Portland - Elite - A',
    Stanford: 'Chicago - Elite - B',
    Louisville: 'Albany - Elite - A',
    'South Carolina': 'Greensboro - Sweet - DA',
    'North Carolina State': 'Greensboro - Sweet - EB',
    'Miami (FL)': 'Portland - Sweet - DA',
    Syracuse: 'Portland - Sweet - EB',
    'Texas A&M': 'Chicago - Sweet - DA',
    'Iowa State': 'Chicago - Sweet - EB',
    'Oregon State': 'Albany - Sweet - DA',
    Maryland: 'Albany - Sweet - EB',
    California: 'Greensboro - Round 2 - HCA',
    'Florida State': 'Greensboro - Round 2 - IDA',
    Kentucky: 'Greensboro - Round 2 - KEB',
    Missouri: 'Greensboro - Round 2 - MFB',
    'South Dakota': 'Portland - Round 2 - HCA',
    'Arizona State': 'Portland - Round 2 - IDA',
    'South Dakota State': 'Portland - Round 2 - KEB',
    Texas: 'Portland - Round 2 - MFB',
    'Central Michigan': 'Chicago - Round 2 - HCA',
    Marquette: 'Chicago - Round 2 - IDA',
    DePaul: 'Chicago - Round 2 - KEB',
    Auburn: 'Chicago - Round 2 - MFB',
    Michigan: 'Albany - Round 2 - HCA',
    Gonzaga: 'Albany - Round 2 - IDA',
    UCLA: 'Albany - Round 2 - KEB',
    Buffalo: 'Albany - Round 2 - MFB',
    'Abilene Christian': 'Greensboro - Seed 16',
    'North Carolina': 'Greensboro - Seed 9',
    Bucknell: 'Greensboro - Seed 12',
    Belmont: 'Greensboro - Seed 13',
    Princeton: 'Greensboro - Seed 11',
    Maine: 'Greensboro - Seed 14',
    Drake: 'Greensboro - Seed 10',
    Mercer: 'Greensboro - Seed 15',
    Southern: 'Portland - Seed 16',
    Clemson: 'Portland - Seed 9',
    'Central Florida': 'Portland - Seed 12',
    'Florida Gulf Coast': 'Portland - Seed 13',
    Quinnipiac: 'Portland - Seed 11',
    Fordham: 'Portland - Seed 14',
    Indiana: 'Portland - Seed 10',
    'Portland State': 'Portland - Seed 15',
    'Bethune-Cookman': 'Chicago - Seed 16',
    'Michigan State': 'Chicago - Seed 9',
    Rice: 'Chicago - Seed 12',
    'Wright State': 'Chicago - Seed 13',
    'Missouri State': 'Chicago - Seed 11',
    'New Mexico State': 'Chicago - Seed 14',
    'Brigham Young': 'Chicago - Seed 7',
    'UC-Davis': 'Chicago - Seed 15',
    'Robert Morris': 'Albany - Seed 16',
    'Kansas State': 'Albany - Seed 9',
    'Arkansas-Little Rock': 'Albany - Seed 12',
    'Boise State': 'Albany - Seed 13',
    Tennessee: 'Albany - Seed 11',
    Radford: 'Albany - Seed 14',
    Rutgers: 'Albany - Seed 7',
    Towson: 'Albany - Seed 15',
};

const delta = {
    Baylor: 'Winner',
    'Notre Dame': 'Final 2',

    Oregon: 'Portland - Four',
    Connecticut: 'Albany - Four',

    Iowa: 'Greensboro - Elite - B',
    'Mississippi State': 'Portland - Elite - A',
    Stanford: 'Chicago - Elite - B',
    Louisville: 'Albany - Elite - A',

    'South Carolina': 'Greensboro - Sweet - DA',
    'North Carolina State': 'Greensboro - Sweet - EB',
    'Miami (FL)': 'Portland - Sweet - DA',
    Syracuse: 'Portland - Sweet - EB',
    'Texas A&M': 'Chicago - Sweet - DA',
    'Iowa State': 'Chicago - Sweet - EB',
    'Oregon State': 'Albany - Sweet - DA',
    Maryland: 'Albany - Sweet - EB',

    'North Carolina': 'Greensboro - Round 2 - HCA',
    'Florida State': 'Greensboro - Round 2 - IDA',
    Kentucky: 'Greensboro - Round 2 - KEB',
    Missouri: 'Greensboro - Round 2 - MFB',

    'South Dakota': 'Portland - Round 2 - HCA',
    'Arizona State': 'Portland - Round 2 - IDA',
    'South Dakota State': 'Portland - Round 2 - KEB',
    Texas: 'Portland - Round 2 - MFB',

    'Central Michigan': 'Chicago - Round 2 - HCA',
    Marquette: 'Chicago - Round 2 - IDA',
    DePaul: 'Chicago - Round 2 - KEB',
    Auburn: 'Chicago - Round 2 - MFB',

    Michigan: 'Albany - Round 2 - HCA',
    Gonzaga: 'Albany - Round 2 - IDA',
    UCLA: 'Albany - Round 2 - KEB',
    Rutgers: 'Albany - Round 2 - MFB',

    'Abilene Christian': 'Greensboro - Seed 16',
    California: 'Greensboro - Seed 8',
    Bucknell: 'Greensboro - Seed 12',
    Belmont: 'Greensboro - Seed 13',
    Princeton: 'Greensboro - Seed 11',
    Maine: 'Greensboro - Seed 14',
    Drake: 'Greensboro - Seed 10',
    Mercer: 'Greensboro - Seed 15',
    Southern: 'Portland - Seed 16',
    Clemson: 'Portland - Seed 9',
    'Central Florida': 'Portland - Seed 12',
    'Florida Gulf Coast': 'Portland - Seed 13',
    Quinnipiac: 'Portland - Seed 11',
    Fordham: 'Portland - Seed 14',
    Indiana: 'Portland - Seed 10',
    'Portland State': 'Portland - Seed 15',
    'Bethune-Cookman': 'Chicago - Seed 16',
    'Michigan State': 'Chicago - Seed 9',
    Rice: 'Chicago - Seed 12',
    'Wright State': 'Chicago - Seed 13',
    'Missouri State': 'Chicago - Seed 11',
    'New Mexico State': 'Chicago - Seed 14',
    'Brigham Young': 'Chicago - Seed 7',
    'UC-Davis': 'Chicago - Seed 15',
    'Robert Morris': 'Albany - Seed 16',
    'Kansas State': 'Albany - Seed 9',
    'Arkansas-Little Rock': 'Albany - Seed 12',
    'Boise State': 'Albany - Seed 13',
    Tennessee: 'Albany - Seed 11',
    Radford: 'Albany - Seed 14',
    Buffalo: 'Albany - Seed 10',
    Towson: 'Albany - Seed 15',
};

const echo = {
    Baylor: 'Winner',
    'Notre Dame': 'Final 2',
    'Mississippi State': 'Portland - Four',
    Connecticut: 'Albany - Four',
    Iowa: 'Greensboro - Elite - B',
    Oregon: 'Portland - Elite - B',
    Stanford: 'Chicago - Elite - B',
    Louisville: 'Albany - Elite - A',
    'South Carolina': 'Greensboro - Sweet - DA',
    'North Carolina State': 'Greensboro - Sweet - EB',
    'Miami (FL)': 'Portland - Sweet - DA',
    Syracuse: 'Portland - Sweet - EB',
    Marquette: 'Chicago - Sweet - DA',
    'Iowa State': 'Chicago - Sweet - EB',
    'Oregon State': 'Albany - Sweet - DA',
    Maryland: 'Albany - Sweet - EB',
    California: 'Greensboro - Round 2 - HCA',
    'Florida State': 'Greensboro - Round 2 - IDA',
    Kentucky: 'Greensboro - Round 2 - KEB',
    Missouri: 'Greensboro - Round 2 - MFB',
    'South Dakota': 'Portland - Round 2 - HCA',
    'Arizona State': 'Portland - Round 2 - IDA',
    'South Dakota State': 'Portland - Round 2 - KEB',
    Texas: 'Portland - Round 2 - MFB',
    'Central Michigan': 'Chicago - Round 2 - HCA',
    'Texas A&M': 'Chicago - Round 2 - JDA',
    DePaul: 'Chicago - Round 2 - KEB',
    Auburn: 'Chicago - Round 2 - MFB',
    Michigan: 'Albany - Round 2 - HCA',
    Gonzaga: 'Albany - Round 2 - IDA',
    UCLA: 'Albany - Round 2 - KEB',
    Buffalo: 'Albany - Round 2 - MFB',
    'Abilene Christian': 'Greensboro - Seed 16',
    'North Carolina': 'Greensboro - Seed 9',
    Bucknell: 'Greensboro - Seed 12',
    Belmont: 'Greensboro - Seed 13',
    Princeton: 'Greensboro - Seed 11',
    Maine: 'Greensboro - Seed 14',
    Drake: 'Greensboro - Seed 10',
    Mercer: 'Greensboro - Seed 15',
    Southern: 'Portland - Seed 16',
    Clemson: 'Portland - Seed 9',
    'Central Florida': 'Portland - Seed 12',
    'Florida Gulf Coast': 'Portland - Seed 13',
    Quinnipiac: 'Portland - Seed 11',
    Fordham: 'Portland - Seed 14',
    Indiana: 'Portland - Seed 10',
    'Portland State': 'Portland - Seed 15',
    'Bethune-Cookman': 'Chicago - Seed 16',
    'Michigan State': 'Chicago - Seed 9',
    Rice: 'Chicago - Seed 12',
    'Wright State': 'Chicago - Seed 13',
    'Missouri State': 'Chicago - Seed 11',
    'New Mexico State': 'Chicago - Seed 14',
    'Brigham Young': 'Chicago - Seed 7',
    'UC-Davis': 'Chicago - Seed 15',
    'Robert Morris': 'Albany - Seed 16',
    'Kansas State': 'Albany - Seed 9',
    'Arkansas-Little Rock': 'Albany - Seed 12',
    'Boise State': 'Albany - Seed 13',
    Tennessee: 'Albany - Seed 11',
    Radford: 'Albany - Seed 14',
    Rutgers: 'Albany - Seed 7',
    Towson: 'Albany - Seed 15',
};

// const bracket = adam1;

function convertBracket(bracket) {
    const converted = _.transform(bracket, (result, round, team) => {
        const bracketMatchups = _.find(teamGames, { team });

        // console.log('AAA', {
        //     bracketMatchups,
        //     team,
        // })

        const keys = _.dropRightWhile(bracketMatchups.all, match => !_.includes(match, round));

        _.forEach(keys, (key, index) => {
            const points = index === 0 ? 0 : (2 ** (index - 1));
            // const points = index === 0 ? 0 : (2 ** (index - 1)) + bracketMatchups.seedValue;

            result[key] = {
                key,
                name: team,
                round: games[key].round,
                seedValue: bracketMatchups.seedValue,
                points,
            };
        });
    }, {});

    return converted;
}

function applyPick(pickTeam, round, result) {
    const keys = _.take(pickTeam.all, round - 1);
    return _.transform(keys, (inner, key, index) => {
        // const points = index === 0 ? 0 : (2 ** (index - 1)) + pickTeam.seedValue;
        const points = index === 0 ? 0 : (2 ** (index - 1));

        inner[key] = {
            name: pickTeam.team,
            points,
            key,
            round: index + 1,
        };
    }, result);
}

function strategyFavorite(game) {
    const roundCurr = `round${game.round}`;
    const roundNext = `round${game.round - 1}`;

    const pickTeams = _.filter(teamGames, {
        [roundCurr]: game.key,
    });

    const favorite = _.maxBy(pickTeams, (team) => {
        const oddsTeam = _.find(teams, { name: team.team });
        return oddsTeam[roundNext];
    });
    return favorite;
}

function strategyGreedy(game) {
    const roundCurr = `round${game.round}`;

    const pickTeams = _.filter(teamGames, {
        [roundCurr]: game.key,
    });

    // TODO: Replace with call to actual value function
    // TODO: Shuffle first
    const greedy = _.maxBy(pickTeams, team => team.seedValue);
    return greedy;
}

function strategyRandom(game) {
    const roundCurr = `round${game.round}`;
    const pickTeams = _.filter(teamGames, {
        [roundCurr]: game.key,
    });
    return _.sample(pickTeams);
}

function strategyTeam(game, team) {
    const roundCurr = `round${game.round}`;
    const pickTeams = _.filter(teamGames, {
        [roundCurr]: game.key,
    });
    return _.find(pickTeams, {
        team,
    });
}

function strategyWeighted(game) {
    if (game.round < 1) {
        // TODO
        return null;
    }

    let rng = Math.random();
    const roundCurr = `round${game.round}`;
    const roundNext = `round${game.round - 1}`;

    const pickTeams = _.shuffle(_.filter(teamGames, {
        [roundCurr]: game.key,
    }));

    const pick = _.find(pickTeams, (team) => {
        const oddsTeam = _.find(teams, { name: team.team });
        rng -= oddsTeam[roundNext];

        if (rng <= 0) {
            return true;
        }

        return false;
    });
    return pick;
}

function strategyAll(game, strategy = 'weighted', pickPrev) {
    let pickStrategy = strategy;

    if (pickStrategy === 'evolve_10') {
        if (pickPrev && Math.random() < 0.9) {
            const pick = strategyTeam(game, pickPrev.name);
            if (pick) {
                return pick;
            }
        }
        pickStrategy = 'weighted';
        // const pickNext = strategyWeighted(game);

        // console.log('TTT', {
        //     game,
        //     pickPrev,
        //     pickNext,
        // });
    }

    if (pickStrategy === 'mixed_20') {
        pickStrategy = Math.random() < 0.2 ? 'weighted' : 'favorite';
    }

    switch (pickStrategy) {
    case 'weighted':
        return strategyWeighted(game);
    case 'favorite':
        return strategyFavorite(game);
    case 'greedy':
        return strategyGreedy(game);
    case 'random':
        return strategyRandom(game);
    default:
        return strategyWeighted(game);
    }
}

function generate(strategy = 'weighted', bracketPrev) {
    const generated = _.transform(gamesOrdered, (result, game) => {
        if (result[game.key]) {
            return;
        }

        const pickPrev = _.get(bracketPrev, game.key);
        const pickNext = strategyAll(game, strategy, pickPrev);

        if (!pickNext) {
            return;
        }

        applyPick(pickNext, game.round, result);
    }, {});

    return generated;
}

function scoreBracket(bracket, generated) {
    return _.mapValues(bracket, (game, key) => {
        let points = 0;
        if (_.get(generated, `${key}.name`) === game.name) {
            points = _.get(generated, `${key}.points`);
        }

        // console.log('GGG', {
        //     key,
        //     a: _.get(generated, `${key}.name`),
        //     b: game.name,
        //     points,
        //     possible: _.get(generated, `${key}.points`),
        // });

        return {
            ...game,
            points,
        };
    });
}

function sumBracket(winners) {
    const score = _.sumBy(_.values(winners), 'points');
    return score;
}

function buildResult(score) {
    const z = 1.960; // 95% confidence
    const avg = _.sum(score) / score.length;

    const variance = _.sumBy(score, value => value ** 2) / score.length;

    const std = Math.sqrt(variance, 2);

    const low = avg - (z * (std / Math.sqrt(score.length)));
    const hgh = avg + (z * (std / Math.sqrt(score.length)));

    return {
        min: _.min(score),
        max: _.max(score),
        std,
        cnt: score.length,
        low,
        avg,
        hgh,
        cnf: `${_.round(low)} - ${_.round(hgh)}`,
    };
}

function buildResults(brackets, scores) {
    const results = _.map(brackets, (bracket, key) => {
        const score = scores[key];

        return {
            ...buildResult(score),
            bracket,
            key,
        // actual: sumBracket(scoreBracket(brackets[key], brackets.reality)),
        };
    });
    return results;
}

function scoreBrackets(brackets, result) {
    return _.mapValues(brackets, (bracket) => {
        return sumBracket(scoreBracket(bracket, result));
    });
}

function saveScores(scoresNext, scoresPrev, targets) {
    _.forEach(scoresNext, (score, key) => {
        scoresPrev[key] = scoresPrev[key] || [];
        if (_.isNil(targets)) {
            scoresPrev[key].push(score);
        } else {
            const scoreVersus = _.sumBy(targets, target => (score > target ? 1 : 0));
            scoresPrev[key].push(scoreVersus);
        }
    });
}

let count = 0;

const scale = 10;

const initialCount = 4 * scale;
const expandCount = 1 * scale;
const evolveCount = 3 * scale;
const cutoff = evolveCount + expandCount;
const generations = 1 * scale;
const finalCount = 50 * scale;

const poolCount = 5 * scale;
const poolSize = 20;

const pools = [];

for (let i = 0; i < poolCount; i += 1) {
    pools[i] = {};
    for (let j = 0; j < poolSize; j += 1) {
        const key = `p_${i}_${j}`;
        pools[i][key] = generate('weighted');
    }
}

// const scoringStrategy = 'value';
const scoringStrategy = 'pool';
// const scoringStrategy = 'spoiler';
const target = 'espnPopular';

const manual = {
    alfa: convertBracket(alfa),
    // beta: convertBracket(beta),
    // charlie: convertBracket(charlie),
    delta: convertBracket(delta),
    espnPopular: convertBracket(espnPopular),
    favorite: generate('favorite'),
    // greedy: generate('greedy'),
//     reality: convertBracket(reality),
};

const generated = {};

for (let i = 0; i < initialCount; i += 1) {
    const next = generate('mixed_20');
    const key = `m_i${i}_c${count}`;
    // next.key = `m_i${i}_c${count}`;
    // generated[next.key] = next;
    generated[key] = next;
    count += 1;
}

const scores = {};
const debug = true;

for (let g = 0; g < generations; g += 1) {
    console.log(`Generation ${g} started... (${_.keys(generated).length} alive)`);
    console.log(`\t... evolving ${evolveCount}`);
    const evolved = _.sampleSize(generated, evolveCount);
    // eslint-disable-next-line no-loop-func
    _.forEach(evolved, (prev) => {
        const next = generate('evolve_10', prev);
        const key = `e_g${g}_c${count}`;
        // next.key = `e_g${g}_c${count}`;
        // if (debug) {
        //     console.log(`\t\t... ${prev.key} -> ${next.key}`);
        // }
        generated[key] = next;
        count += 1;
    });
    console.log(`\t... expanding ${expandCount}`);
    for (let i = 0; i < expandCount; i += 1) {
        const next = generate('mixed_20');
        const key = `m_g${g}_c${count}`;
        // next.key = `m_g${g}_c${count}`;
        // generated[next.key] = next;
        generated[key] = next;
        count += 1;
    }

    console.log(`\t... analyzing ${finalCount} * ${poolCount} pools`);
    for (let i = 0; i < finalCount; i += 1) {
        const result = generate();

        let versus = null;
        if (scoringStrategy === 'spoiler') {
            versus = [sumBracket(scoreBracket(manual[target], result))];
        } else if (scoringStrategy === 'pool') {
            versus = _.map(pools, (pool) => {
                const poolScores = _.map(pool, (bracket) => {
                    return sumBracket(scoreBracket(bracket, result));
                });

                return _.max(poolScores);
            });
        }

        const manualScores = scoreBrackets(manual, result);
        const generatedScores = scoreBrackets(generated, result);

        saveScores(manualScores, scores, versus);
        saveScores(generatedScores, scores, versus);
    }

    console.log('\t... scoring');
    const keys = _.keys(generated);
    const sorted = _.sortBy(keys, (key) => {
        const result = buildResult(scores[key]);
        return result.avg;
    });

    const kill = keys.length - cutoff;
    console.log(`\t... killing ${kill}`);
    const worst = _.take(sorted, kill);
    _.forEach(worst, (key) => {
        if (debug) {
            const result = buildResult(scores[key]);
            console.log(`\t\t... ${key} (${result.avg})`);
        }
        delete generated[key];
        delete scores[key];
    });

    // console.log('GGG', {
    //     g,
    //     generated,
    // });
}

const outputKeys = ['key', 'avg', 'cnf', 'cnt', 'std'];
const resultsManual = buildResults(manual, scores);

const resultsOutput = _.map(resultsManual, result => _.pick(result, outputKeys));

const resultsGenerated = buildResults(generated, scores);

const results = [
    ...resultsManual,
    ...resultsGenerated,
];

const resultsSorted = _.orderBy(results, ['avg'], ['desc']);

const top10 = _.map(_.take(resultsSorted, 10), (result) => {
    const byTeam = _.groupBy(_.values(result.bracket), 'name');
    const picks = _.mapValues(byTeam, (team) => {
        const game = _.maxBy(team, 'round');
        if (!game) {
            console.log('Bad result', {
                game,
                team,
                byTeam,
                result,
            });
        }
        return game.key;
    });

    return {
        picks,
        ..._.pick(result, outputKeys),
    };
});

console.log(JSON.stringify(top10, null, 2));

console.log({
    resultsOutput,
    scores: _.map(resultsSorted, result => _.pick(result, outputKeys)),
});
