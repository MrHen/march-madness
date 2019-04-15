/* eslint-disable no-param-reassign */
const _ = require('lodash');
const fs = require('fs');
// const path = require('path');

// const fivethirtyeight = fs.readFileSync('2018_538.csv', 'utf8');
const fivethirtyeight = fs.readFileSync('2019_538_womens.csv', 'utf8');

const lines = _.split(fivethirtyeight, '\n');
const header = _.head(lines);
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

const regionalMatchups = {
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

const finalMatchups = {
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

const Greensboro = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'Greensboro';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});
const Portland = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'Portland';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});
const Chicago = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'Chicago';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});
const Albany = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'Albany';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});

const matchups = {
    ...Greensboro,
    ...Portland,
    ...Chicago,
    ...Albany,
    ...finalMatchups,
};

const teamMatchups = _.map(teams, (team) => {
    const seed = `${team.region} - Seed ${team.seed}`;
    let seedValue = team.seed;

    let round2;
    if (_.includes(team.seed, 'a') || _.includes(team.seed, 'b')) {
        const round1 = seed;
        round2 = matchups[round1].next;
        seedValue = _.trim(team.seed, 'ab');
    } else {
        round2 = seed;
    }

    // console.log({
    //     team,
    //     round2,
    // });

    const round3 = matchups[round2].next;
    const round4 = matchups[round3].next;
    const round5 = matchups[round4].next;
    const round6 = matchups[round5].next;
    const round7 = matchups[round6].next;
    const round8 = matchups[round7].next;

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
        const bracketMatchups = _.find(teamMatchups, { team });

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
                round: matchups[key].round,
                seedValue: bracketMatchups.seedValue,
                points,
            };
        });
    }, {});

    return converted;
}

function generate(strategy = 'weighted') {
    const picks = _.orderBy(matchups, ['round'], ['desc']);

    const generated = _.transform(picks, (result, pick) => {
        if (result[pick.key]) {
            return;
        }

        if (pick.round < 1) {
            // TODO
            return;
        }

        let pickStrategy = strategy;
        if (pickStrategy === 'mixed') {
            pickStrategy = Math.random() < 0.2 ? 'weighted' : 'favorite';
        }

        let rng = Math.random();
        const round = `round${pick.round}`;

        const pickTeams = _.shuffle(_.filter(teamMatchups, {
            [round]: pick.key,
        }));

        // console.log('generate', {
        //     key: pick.key,
        //     pickTeams: _.map(pickTeams, 'team'),
        //     // picked: _.map(result, 'name'),
        //     collison: _.filter(pickTeams, (team) => {
        //         return _.find(result, { name: team.team });
        //     }),
        // });

        const favorite = _.maxBy(pickTeams, (team) => {
            const oddsTeam = _.find(teams, { name: team.team });
            return oddsTeam[`round${pick.round - 1}`];
        });

        const greedy = _.maxBy(pickTeams, team => team.seedValue);

        const pickTeam = _.find(pickTeams, (team) => {
            if (pickStrategy === 'weighted') {
                const oddsTeam = _.find(teams, { name: team.team });
                rng -= oddsTeam[`round${pick.round - 1}`];
            } else if (pickStrategy === 'random') {
                rng -= 1 / pickTeams.length;
            } else if (pickStrategy === 'favorite') {
                if (favorite.team === team.team) {
                    rng = 0;
                }
            } else if (pickStrategy === 'greedy') {
                if (greedy.team === team.team) {
                    rng = 0;
                }
            }

            if (rng <= 0) {
                return true;
            }

            return false;
        });

        if (!pickTeam) {
            return;
        }

        const keys = _.take(pickTeam.all, pick.round - 1);
        _.transform(keys, (inner, key, index) => {
            // const points = index === 0 ? 0 : (2 ** (index - 1)) + pickTeam.seedValue;
            const points = index === 0 ? 0 : (2 ** (index - 1));

            inner[key] = {
                name: pickTeam.team,
                points,
                key,
                round: index + 1,
            };
        }, result);
    }, {});

    return generated;
}

function scoreBracket(bracket, generated) {
    return _.mapValues(bracket, (matchup, key) => {
        // console.log('GGG', {
        //     key,
        // });

        let points = 0;
        if (_.get(generated, `${key}.name`) === matchup.name) {
            points = _.get(generated, `${key}.points`);
        }

        return {
            ...matchup,
            points,
        };
    });
}

function sumBracket(winners) {
    const score = _.sumBy(_.values(winners), 'points');
    return score;
}

let count = 0;

const scale = 10;

const initialCount = 20 * scale;
const expandCount = 20 * scale;
const pruneCount = 20 * scale;
const cutoff = 40 * scale;
const generations = 2 * scale;
const finalCount = 100 * scale;

const manual = {
    alfa: convertBracket(alfa),
    beta: convertBracket(beta),
    charlie: convertBracket(charlie),
    delta: convertBracket(delta),
    espnPopular: convertBracket(espnPopular),
    favorite: generate('favorite'),
    greedy: generate('greedy'),
//     reality: convertBracket(reality),
};

const generated = {};

for (let i = 0; i < initialCount; i += 1) {
    generated[`m_i${i}_${count}`] = generate('mixed');
    count += 1;
}

// for (let i = 0; i < generateCount; i += 1) {
//     generated[`r_${i}`] = generate('random');
// }

const scores = {};
const target = 'espnPopular';

for (let g = 0; g < generations; g += 1) {
    console.log(`Generation ${g} started... (${_.keys(generated).length} alive)`);
    console.log(`\t... searching ${expandCount}`);
    for (let i = 0; i < expandCount; i += 1) {
        generated[`m_g${g}_c${count}`] = generate('mixed');
        count += 1;
    }

    console.log(`\t... expanding ${pruneCount}`);
    for (let i = 0; i < pruneCount; i += 1) {
        const result = generate();
        const versus = sumBracket(scoreBracket(manual[target], result));

        _.forEach(manual, (bracket, key) => {
            const winners = scoreBracket(bracket, result);
            const score = sumBracket(winners);

            scores[key] = scores[key] || [];
            // scores[key].push(score);

            const scoreVersus = score > versus ? 1 : 0;
            scores[key].push(scoreVersus);
        });

        _.forEach(generated, (bracket, key) => {
            const winners = scoreBracket(bracket, result);
            const score = sumBracket(winners);

            scores[key] = scores[key] || [];
            // scores[key].push(score);

            const scoreVersus = score > versus ? 1 : 0;
            scores[key].push(scoreVersus);
        });

        generated[`p_g${g}_c${count}`] = result;
        count += 1;
    }

    console.log(`\t... analyzing ${finalCount}`);
    for (let i = 0; i < finalCount; i += 1) {
        const result = generate();
        const versus = sumBracket(scoreBracket(manual[target], result));

        _.forEach(manual, (bracket, key) => {
            const winners = scoreBracket(bracket, result);
            const score = sumBracket(winners);

            scores[key] = scores[key] || [];
            // scores[key].push(score);

            const scoreVersus = score > versus ? 1 : 0;
            scores[key].push(scoreVersus);
        });

        _.forEach(generated, (bracket, key) => {
            const winners = scoreBracket(bracket, result);
            const score = sumBracket(winners);

            scores[key] = scores[key] || [];
            // scores[key].push(score);

            const scoreVersus = score > versus ? 1 : 0;
            scores[key].push(scoreVersus);
        });
    }

    console.log('\t... scoring');
    const keys = _.keys(generated);
    const sorted = _.sortBy(keys, key => _.sum(scores[key]) / scores[key].length);

    const kill = keys.length - cutoff;
    console.log(`\t... killing ${kill}`);
    const worst = _.take(sorted, kill);
    _.forEach(worst, (key) => {
        delete generated[key];
        delete scores[key];
    });
}

const resultsManual = _.map(manual, (bracket, key) => {
    const score = scores[key];
    return {
        bracket,
        key,
        min: _.min(score),
        max: _.max(score),
        avg: _.sum(score) / score.length,
        cnt: score.length,
        // actual: sumBracket(scoreBracket(brackets[key], brackets.reality)),
    };
});

const resultsOutput = _.map(resultsManual, result => _.pick(result, ['key', 'min', 'max', 'avg']));

const resultsGenerated = _.map(generated, (bracket, key) => {
    const score = scores[key];
    return {
        bracket,
        key,
        min: _.min(score),
        max: _.max(score),
        avg: _.sum(score) / score.length,
        cnt: score.length,
        // actual: sumBracket(scoreBracket(generated[key], brackets.reality)),
    };
});

const results = [
    ...resultsManual,
    ...resultsGenerated,
];

const resultsSorted = _.orderBy(results, ['avg'], ['desc']);

const top10 = _.map(_.take(resultsSorted, 10), (result) => {
    const byTeam = _.groupBy(_.values(result.bracket), 'name');
    const picks = _.mapValues(byTeam, team => _.maxBy(team, 'round').key);

    return {
        picks,
        key: result.key,
        min: result.min,
        max: result.max,
        avg: result.avg,
        cnt: result.cnt,
    };
});

// const best = _.maxBy(results, 'avg');
// const byTeam = _.groupBy(_.values(best.bracket), 'name');
// const picks = _.mapValues(byTeam, (team) => {
//     return _.maxBy(team, 'round').key;
// });

// const picks = _.orderBy(_.values(best), ['round', 'name'], ['desc', 'asc']);
// const output = _.keyBy(best.bracket, 'name');

console.log(JSON.stringify(top10, null, 2));

console.log({
    // bracket,
    // generated,
    // winners,
    // brackets,
    // results,
    // resultsGenerated,
    // best,
    scores: _.map(resultsSorted, result => _.pick(result, ['avg', 'cnt'])),
    // top10,
    resultsOutput,
    // picks,
    // best: best.bracket,
    // adam1,
    // converted: convertBracket(adam1),
    // adam1: scoreBracket(brackets.adam1, brackets.adam1),
});

// console.log(byTeam);

// console.log(scores);
