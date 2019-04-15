/* eslint-disable no-param-reassign */
const _ = require('lodash');
const fs = require('fs');
// const path = require('path');

// const fivethirtyeight = fs.readFileSync('2018_538.csv', 'utf8');
const fivethirtyeight = fs.readFileSync('2019_538.csv', 'utf8');

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
    'South - Four': {
        round: 6,
        key: 'South - Four',
        next: 'Final 1',
    },
    'West - Four': {
        round: 6,
        key: 'West - Four',
        next: 'Final 1',
    },
    'East - Four': {
        round: 6,
        key: 'East - Four',
        next: 'Final 2',
    },
    'Midwest - Four': {
        round: 6,
        key: 'Midwest - Four',
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

const south = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'South';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});
const west = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'West';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});
const east = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'East';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});
const midwest = _.transform(regionalMatchups, (result, value, key) => {
    const region = 'Midwest';
    result[`${region} - ${key}`] = {
        ...value,
        key: `${region} - ${key}`,
        next: `${region} - ${value.next}`,
    };
}, {});

const matchups = {
    ...south,
    ...west,
    ...east,
    ...midwest,
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

const adam1 = {
    'Murray State': 'Winner',
    Houston: 'Final',
    Nevada: 'Four',
    'North Carolina State': 'Four',

    Buffalo: 'Elite',
    Gonzaga: 'Elite',
    Butler: 'Elite',
    'Rhode Island': 'Elite',

    Syracuse: 'Sweet',
    'College of Charleston': 'Sweet',
    'St. Bonaventure': 'Sweet',
    Villanova: 'Sweet',
    Providence: 'Sweet',
    Xavier: 'Sweet',
    'Loyola (IL)': 'Sweet',
    Creighton: 'Sweet',

    Duke: 'Round 2',
    'New Mexico State': 'Round 2',
    Pennsylvania: 'Round 2',
    Purdue: 'Round 2',

    'Stephen F. Austin': 'Round 2',
    'Wichita State': 'Round 2',
    'Virginia Tech': 'Round 2',
    Lipscomb: 'Round 2',

    Michigan: 'Round 2',
    'Ohio State': 'Round 2',
    'Florida State': 'Round 2',
    Cincinnati: 'Round 2',

    'Maryland-Baltimore County': 'Round 2',
    Bucknell: 'Round 2',
    Tennessee: 'Round 2',
    Davidson: 'Round 2',
};

const ian1 = {
    Cincinnati: 'Winner',
    Villanova: 'Final',
    Gonzaga: 'Four',
    Kansas: 'Four',

    Duke: 'Elite',
    Purdue: 'Elite',
    'North Carolina': 'Elite',
    Virginia: 'Elite',

    'Michigan State': 'Sweet',
    'New Mexico State': 'Sweet',
    'Texas Tech': 'Sweet',
    'Wichita State': 'Sweet',
    Houston: 'Sweet',
    'Florida State': 'Sweet',
    Tennessee: 'Sweet',
    Kentucky: 'Sweet',

    'Rhode Island': 'Round 2',
    Bucknell: 'Round 2',
    Auburn: 'Round 2',
    'Seton Hall': 'Round 2',

    Butler: 'Round 2',
    Florida: 'Round 2',
    'West Virginia': 'Round 2',
    'Virginia Tech': 'Round 2',

    'Texas A&M': 'Round 2',
    Michigan: 'Round 2',
    'Ohio State': 'Round 2',
    Xavier: 'Round 2',

    Texas: 'Round 2',
    'Loyola (IL)': 'Round 2',
    Arizona: 'Round 2',
    Creighton: 'Round 2',
};

const michael1 = {
    Duke: 'Winner',
    Virginia: 'Final',

    Michigan: 'Four',
    Kentucky: 'Four',

    'Michigan State': 'Elite',
    Tennessee: 'Elite',
    'North Carolina': 'Elite',
    Gonzaga: 'Elite',

    'Virginia Tech': 'Sweet',
    'Louisiana State': 'Sweet',
    'Kansas State': 'Sweet',
    Purdue: 'Sweet',
    'Florida State': 'Sweet',
    'Texas Tech': 'Sweet',
    Kansas: 'Sweet',
    Houston: 'Sweet',

    'Virginia Commonwealth': 'Round 2',
    'Mississippi State': 'Round 2',
    Maryland: 'Round 2',
    Louisville: 'Round 2',
    Oklahoma: 'Round 2',
    Wisconsin: 'Round 2',
    'Saint Mary\'s (CA)': 'Round 2',
    Cincinnati: 'Round 2',

    Baylor: 'Round 2',
    Marquette: 'Round 2',
    Buffalo: 'Round 2',
    Florida: 'Round 2',
    Washington: 'Round 2',
    Auburn: 'Round 2',
    'Ohio State': 'Round 2',
    Wofford: 'Round 2',
};

const alpha = {
    Virginia: 'Winner',
    Duke: 'Final 2',
    Gonzaga: 'West - Four',
    'North Carolina': 'Midwest - Four',
    Tennessee: 'South - Elite - B',
    Michigan: 'West - Elite - B',
    'Michigan State': 'East - Elite - B',
    'Iowa State': 'Midwest - Elite - B',
    'Kansas State': 'South - Sweet - DA',
    Villanova: 'South - Sweet - EB',
    'Florida State': 'West - Sweet - DA',
    Buffalo: 'West - Sweet - EB',
    'Virginia Tech': 'East - Sweet - DA',
    'Louisiana State': 'East - Sweet - EB',
    Kansas: 'Midwest - Sweet - DA',
    Kentucky: 'Midwest - Sweet - FB',
    Oklahoma: 'South - Round 2 - HCA',
    Wisconsin: 'South - Round 2 - IDA',
    Purdue: 'South - Round 2 - LEB',
    Cincinnati: 'South - Round 2 - MFB',
    Syracuse: 'West - Round 2 - HCA',
    Marquette: 'West - Round 2 - IDA',
    'Texas Tech': 'West - Round 2 - LEB',
    Florida: 'West - Round 2 - MFB',
    'Central Florida': 'East - Round 2 - HCA',
    'Mississippi State': 'East - Round 2 - IDA',
    Maryland: 'East - Round 2 - KEB',
    Louisville: 'East - Round 2 - MFB',
    'Utah State': 'Midwest - Round 2 - HCA',
    Auburn: 'Midwest - Round 2 - IDA',
    Houston: 'Midwest - Round 2 - LEB',
    Wofford: 'Midwest - Round 2 - MFB',
    'Gardner-Webb': 'South - Seed 16',
    Mississippi: 'South - Seed 8',
    Oregon: 'South - Seed 12',
    'UC-Irvine': 'South - Seed 13',
    "Saint Mary's (CA)": 'South - Seed 11',
    'Old Dominion': 'South - Seed 14',
    Iowa: 'South - Seed 10',
    Colgate: 'South - Seed 15',
    'Prairie View': 'West - Seed 16',
    Baylor: 'West - Seed 9',
    'Murray State': 'West - Seed 12',
    Vermont: 'West - Seed 13',
    "St. John's (NY)": 'West - Seed 11',
    'Northern Kentucky': 'West - Seed 14',
    Nevada: 'West - Seed 7',
    Montana: 'West - Seed 15',
    'North Dakota State': 'East - Seed 16',
    'Virginia Commonwealth': 'East - Seed 8',
    Liberty: 'East - Seed 12',
    'Saint Louis': 'East - Seed 13',
    Belmont: 'East - Seed 11',
    Yale: 'East - Seed 14',
    Minnesota: 'East - Seed 10',
    Bradley: 'East - Seed 15',
    Iona: 'Midwest - Seed 16',
    Washington: 'Midwest - Seed 9',
    'New Mexico State': 'Midwest - Seed 12',
    Northeastern: 'Midwest - Seed 13',
    'Ohio State': 'Midwest - Seed 11',
    'Georgia State': 'Midwest - Seed 14',
    'Seton Hall': 'Midwest - Seed 10',
    'Abilene Christian': 'Midwest - Seed 15',
};

const beta = {
    Duke: 'Winner',
    Virginia: 'Final 1',
    Gonzaga: 'West - Four',
    'North Carolina': 'Midwest - Four',
    Tennessee: 'South - Elite - B',
    Michigan: 'West - Elite - B',
    'Michigan State': 'East - Elite - B',
    Kentucky: 'Midwest - Elite - B',
    'Kansas State': 'South - Sweet - DA',
    Purdue: 'South - Sweet - EB',
    'Florida State': 'West - Sweet - DA',
    'Texas Tech': 'West - Sweet - EB',
    'Virginia Tech': 'East - Sweet - DA',
    'Louisiana State': 'East - Sweet - EB',
    Auburn: 'Midwest - Sweet - DA',
    Houston: 'Midwest - Sweet - EB',
    Oklahoma: 'South - Round 2 - HCA',
    Wisconsin: 'South - Round 2 - IDA',
    Villanova: 'South - Round 2 - KEB',
    Cincinnati: 'South - Round 2 - MFB',
    Syracuse: 'West - Round 2 - HCA',
    Marquette: 'West - Round 2 - IDA',
    Buffalo: 'West - Round 2 - KEB',
    Nevada: 'West - Round 2 - MFB',
    'Virginia Commonwealth': 'East - Round 2 - HCA',
    'Mississippi State': 'East - Round 2 - IDA',
    Maryland: 'East - Round 2 - KEB',
    Louisville: 'East - Round 2 - MFB',
    'Utah State': 'Midwest - Round 2 - HCA',
    Kansas: 'Midwest - Round 2 - JDA',
    'Iowa State': 'Midwest - Round 2 - KEB',
    'Seton Hall': 'Midwest - Round 2 - MFB',
    'Gardner-Webb': 'South - Seed 16',
    Mississippi: 'South - Seed 8',
    Oregon: 'South - Seed 12',
    'UC-Irvine': 'South - Seed 13',
    "Saint Mary's (CA)": 'South - Seed 11',
    'Old Dominion': 'South - Seed 14',
    Iowa: 'South - Seed 10',
    Colgate: 'South - Seed 15',
    'Fairleigh Dickinson': 'West - Seed 16',
    Baylor: 'West - Seed 9',
    'Murray State': 'West - Seed 12',
    Vermont: 'West - Seed 13',
    'Arizona State': 'West - Seed 11',
    'Northern Kentucky': 'West - Seed 14',
    Florida: 'West - Seed 10',
    Montana: 'West - Seed 15',
    'North Dakota State': 'East - Seed 16',
    'Central Florida': 'East - Seed 9',
    Liberty: 'East - Seed 12',
    'Saint Louis': 'East - Seed 13',
    Belmont: 'East - Seed 11',
    Yale: 'East - Seed 14',
    Minnesota: 'East - Seed 10',
    Bradley: 'East - Seed 15',
    Iona: 'Midwest - Seed 16',
    Washington: 'Midwest - Seed 9',
    'New Mexico State': 'Midwest - Seed 12',
    Northeastern: 'Midwest - Seed 13',
    'Ohio State': 'Midwest - Seed 11',
    'Georgia State': 'Midwest - Seed 14',
    Wofford: 'Midwest - Seed 7',
    'Abilene Christian': 'Midwest - Seed 15',
};

const charlie = {
    Duke: 'Winner',
    Virginia: 'Final 1',
    Gonzaga: 'West - Four',
    'North Carolina': 'Midwest - Four',
    Tennessee: 'South - Elite - B',
    Michigan: 'West - Elite - B',
    'Michigan State': 'East - Elite - B',
    Kentucky: 'Midwest - Elite - B',
    'Kansas State': 'South - Sweet - DA',
    Purdue: 'South - Sweet - EB',
    'Florida State': 'West - Sweet - DA',
    'Texas Tech': 'West - Sweet - EB',
    'Virginia Tech': 'East - Sweet - DA',
    'Louisiana State': 'East - Sweet - EB',
    Auburn: 'Midwest - Sweet - DA',
    Houston: 'Midwest - Sweet - EB',
    Oklahoma: 'South - Round 2 - HCA',
    Oregon: 'South - Round 2 - IDA',
    Villanova: 'South - Round 2 - KEB',
    Cincinnati: 'South - Round 2 - MFB',
    Syracuse: 'West - Round 2 - HCA',
    Marquette: 'West - Round 2 - IDA',
    Buffalo: 'West - Round 2 - KEB',
    Nevada: 'West - Round 2 - MFB',
    'Virginia Commonwealth': 'East - Round 2 - HCA',
    'Mississippi State': 'East - Round 2 - IDA',
    Maryland: 'East - Round 2 - KEB',
    Louisville: 'East - Round 2 - MFB',
    Washington: 'Midwest - Round 2 - HCA',
    Kansas: 'Midwest - Round 2 - JDA',
    'Iowa State': 'Midwest - Round 2 - KEB',
    Wofford: 'Midwest - Round 2 - MFB',
    'Gardner-Webb': 'South - Seed 16',
    Mississippi: 'South - Seed 8',
    Wisconsin: 'South - Seed 5',
    'UC-Irvine': 'South - Seed 13',
    "Saint Mary's (CA)": 'South - Seed 11',
    'Old Dominion': 'South - Seed 14',
    Iowa: 'South - Seed 10',
    Colgate: 'South - Seed 15',
    'Fairleigh Dickinson': 'West - Seed 16',
    Baylor: 'West - Seed 9',
    'Murray State': 'West - Seed 12',
    Vermont: 'West - Seed 13',
    'Arizona State': 'West - Seed 11',
    'Northern Kentucky': 'West - Seed 14',
    Florida: 'West - Seed 10',
    Montana: 'West - Seed 15',
    'North Dakota State': 'East - Seed 16',
    'Central Florida': 'East - Seed 9',
    Liberty: 'East - Seed 12',
    'Saint Louis': 'East - Seed 13',
    Belmont: 'East - Seed 11',
    Yale: 'East - Seed 14',
    Minnesota: 'East - Seed 10',
    Bradley: 'East - Seed 15',
    Iona: 'Midwest - Seed 16',
    'Utah State': 'Midwest - Seed 8',
    'New Mexico State': 'Midwest - Seed 12',
    Northeastern: 'Midwest - Seed 13',
    'Ohio State': 'Midwest - Seed 11',
    'Georgia State': 'Midwest - Seed 14',
    'Seton Hall': 'Midwest - Seed 10',
    'Abilene Christian': 'Midwest - Seed 15',
};

const delta = {
    Duke: 'Winner',
    Virginia: 'Final 1',
    Gonzaga: 'West - Four',
    'North Carolina': 'Midwest - Four',
    Tennessee: 'South - Elite - B',
    Michigan: 'West - Elite - B',
    'Michigan State': 'East - Elite - B',
    Kentucky: 'Midwest - Elite - B',
    'Kansas State': 'South - Sweet - DA',
    Purdue: 'South - Sweet - EB',
    'Florida State': 'West - Sweet - DA',
    'Texas Tech': 'West - Sweet - EB',
    'Virginia Tech': 'East - Sweet - DA',
    'Louisiana State': 'East - Sweet - EB',
    Auburn: 'Midwest - Sweet - DA',
    Houston: 'Midwest - Sweet - EB',
    Oklahoma: 'South - Round 2 - HCA',
    Wisconsin: 'South - Round 2 - IDA',
    Villanova: 'South - Round 2 - KEB',
    Cincinnati: 'South - Round 2 - MFB',
    Syracuse: 'West - Round 2 - HCA',
    'Murray State': 'West - Round 2 - IDA',
    Buffalo: 'West - Round 2 - KEB',
    Nevada: 'West - Round 2 - MFB',
    'Central Florida': 'East - Round 2 - HCA',
    'Mississippi State': 'East - Round 2 - IDA',
    Maryland: 'East - Round 2 - KEB',
    Louisville: 'East - Round 2 - MFB',
    'Utah State': 'Midwest - Round 2 - HCA',
    Kansas: 'Midwest - Round 2 - JDA',
    'Iowa State': 'Midwest - Round 2 - KEB',
    Wofford: 'Midwest - Round 2 - MFB',
    'Gardner-Webb': 'South - Seed 16',
    Mississippi: 'South - Seed 8',
    Oregon: 'South - Seed 12',
    'UC-Irvine': 'South - Seed 13',
    "Saint Mary's (CA)": 'South - Seed 11',
    'Old Dominion': 'South - Seed 14',
    Iowa: 'South - Seed 10',
    Colgate: 'South - Seed 15',
    'Fairleigh Dickinson': 'West - Seed 16',
    Baylor: 'West - Seed 9',
    Marquette: 'West - Seed 5',
    Vermont: 'West - Seed 13',
    'Arizona State': 'West - Seed 11',
    'Northern Kentucky': 'West - Seed 14',
    Florida: 'West - Seed 10',
    Montana: 'West - Seed 15',
    'North Dakota State': 'East - Seed 16',
    'Virginia Commonwealth': 'East - Seed 8',
    Liberty: 'East - Seed 12',
    'Saint Louis': 'East - Seed 13',
    Belmont: 'East - Seed 11',
    Yale: 'East - Seed 14',
    Minnesota: 'East - Seed 10',
    Bradley: 'East - Seed 15',
    Iona: 'Midwest - Seed 16',
    Washington: 'Midwest - Seed 9',
    'New Mexico State': 'Midwest - Seed 12',
    Northeastern: 'Midwest - Seed 13',
    'Ohio State': 'Midwest - Seed 11',
    'Georgia State': 'Midwest - Seed 14',
    'Seton Hall': 'Midwest - Seed 10',
    'Abilene Christian': 'Midwest - Seed 15',
};

const delta2 = {
    Duke: 'Winner',
    Virginia: 'Final 1',
    Gonzaga: 'West - Four',
    'North Carolina': 'Midwest - Four',

    Tennessee: 'South - Elite',
    'Texas Tech': 'West - Elite',
    'Michigan State': 'East - Elite',
    Kentucky: 'Midwest - Elite',

    Oregon: 'South - Sweet',
    Villanova: 'South - Sweet',
    Auburn: 'Midwest - Sweet',
    'Iowa State': 'West - Sweet',
    'Virginia Tech': 'East - Sweet',
    Maryland: 'East - Sweet',
    'Florida State': 'West - Sweet',
    Michigan: 'Midwest - Sweet',

    Oklahoma: 'South - Round 2',
    'Kansas State': 'South - Round 2',
    Purdue: 'South - Round 2',
    Cincinnati: 'South - Round 2',

    Syracuse: 'West - Round 2',
    'Murray State': 'West - Round 2',
    Buffalo: 'West - Round 2',
    Nevada: 'West - Round 2',

    'Central Florida': 'East - Round 2',
    'Mississippi State': 'East - Round 2',
    'Louisiana State': 'East - Round 2',
    Louisville: 'East - Round 2',

    'Utah State': 'Midwest - Round 2',
    Kansas: 'Midwest - Round 2',
    Houston: 'Midwest - Round 2',
    Wofford: 'Midwest - Round 2',
};

const echo = {
    Duke: 'Winner',
    Virginia: 'Final 1',
    Gonzaga: 'West - Four',
    'North Carolina': 'Midwest - Four',
    Tennessee: 'South - Elite - B',
    Michigan: 'West - Elite - B',
    'Michigan State': 'East - Elite - B',
    Kentucky: 'Midwest - Elite - B',
    'Kansas State': 'South - Sweet - DA',
    Purdue: 'South - Sweet - EB',
    'Florida State': 'West - Sweet - DA',
    'Texas Tech': 'West - Sweet - EB',
    'Virginia Tech': 'East - Sweet - DA',
    'Louisiana State': 'East - Sweet - EB',
    Auburn: 'Midwest - Sweet - DA',
    Houston: 'Midwest - Sweet - EB',
    Oklahoma: 'South - Round 2 - HCA',
    Oregon: 'South - Round 2 - IDA',
    Villanova: 'South - Round 2 - KEB',
    Cincinnati: 'South - Round 2 - MFB',
    Syracuse: 'West - Round 2 - HCA',
    Marquette: 'West - Round 2 - IDA',
    Buffalo: 'West - Round 2 - KEB',
    Nevada: 'West - Round 2 - MFB',
    'Central Florida': 'East - Round 2 - HCA',
    'Mississippi State': 'East - Round 2 - IDA',
    Maryland: 'East - Round 2 - KEB',
    Louisville: 'East - Round 2 - MFB',
    'Utah State': 'Midwest - Round 2 - HCA',
    Kansas: 'Midwest - Round 2 - JDA',
    'Iowa State': 'Midwest - Round 2 - KEB',
    Wofford: 'Midwest - Round 2 - MFB',
    'Gardner-Webb': 'South - Seed 16',
    Mississippi: 'South - Seed 8',
    Wisconsin: 'South - Seed 5',
    'UC-Irvine': 'South - Seed 13',
    "Saint Mary's (CA)": 'South - Seed 11',
    'Old Dominion': 'South - Seed 14',
    Iowa: 'South - Seed 10',
    Colgate: 'South - Seed 15',
    'Fairleigh Dickinson': 'West - Seed 16',
    Baylor: 'West - Seed 9',
    'Murray State': 'West - Seed 12',
    Vermont: 'West - Seed 13',
    'Arizona State': 'West - Seed 11',
    'Northern Kentucky': 'West - Seed 14',
    Florida: 'West - Seed 10',
    Montana: 'West - Seed 15',
    'North Dakota State': 'East - Seed 16',
    'Virginia Commonwealth': 'East - Seed 8',
    Liberty: 'East - Seed 12',
    'Saint Louis': 'East - Seed 13',
    Belmont: 'East - Seed 11',
    Yale: 'East - Seed 14',
    Minnesota: 'East - Seed 10',
    Bradley: 'East - Seed 15',
    Iona: 'Midwest - Seed 16',
    Washington: 'Midwest - Seed 9',
    'New Mexico State': 'Midwest - Seed 12',
    Northeastern: 'Midwest - Seed 13',
    'Ohio State': 'Midwest - Seed 11',
    'Georgia State': 'Midwest - Seed 14',
    'Seton Hall': 'Midwest - Seed 10',
    'Abilene Christian': 'Midwest - Seed 15',
};

const spoiler = {
    Duke: 'Winner',
    Virginia: 'Final 1',
    Gonzaga: 'West - Four',
    'North Carolina': 'Midwest - Four',
    Tennessee: 'South - Elite - B',
    Michigan: 'West - Elite - B',
    'Michigan State': 'East - Elite - B',
    Kentucky: 'Midwest - Elite - B',
    'Kansas State': 'South - Sweet - DA',
    Purdue: 'South - Sweet - EB',
    'Florida State': 'West - Sweet - DA',
    'Texas Tech': 'West - Sweet - EB',
    'Virginia Tech': 'East - Sweet - DA',
    'Louisiana State': 'East - Sweet - EB',
    Auburn: 'Midwest - Sweet - DA',
    Houston: 'Midwest - Sweet - EB',
    Oklahoma: 'South - Round 2 - HCA',
    Wisconsin: 'South - Round 2 - IDA',
    Villanova: 'South - Round 2 - KEB',
    Cincinnati: 'South - Round 2 - MFB',
    Syracuse: 'West - Round 2 - HCA',
    Marquette: 'West - Round 2 - IDA',
    Buffalo: 'West - Round 2 - KEB',
    Nevada: 'West - Round 2 - MFB',
    'Central Florida': 'East - Round 2 - HCA',
    'Mississippi State': 'East - Round 2 - IDA',
    Maryland: 'East - Round 2 - KEB',
    Louisville: 'East - Round 2 - MFB',
    Washington: 'Midwest - Round 2 - HCA',
    Kansas: 'Midwest - Round 2 - JDA',
    'Iowa State': 'Midwest - Round 2 - KEB',
    Wofford: 'Midwest - Round 2 - MFB',
    'Gardner-Webb': 'South - Seed 16',
    Mississippi: 'South - Seed 8',
    Oregon: 'South - Seed 12',
    'UC-Irvine': 'South - Seed 13',
    "Saint Mary's (CA)": 'South - Seed 11',
    'Old Dominion': 'South - Seed 14',
    Iowa: 'South - Seed 10',
    Colgate: 'South - Seed 15',
    'Fairleigh Dickinson': 'West - Seed 16',
    Baylor: 'West - Seed 9',
    'Murray State': 'West - Seed 12',
    Vermont: 'West - Seed 13',
    "St. John's (NY)": 'West - Seed 11',
    'Northern Kentucky': 'West - Seed 14',
    Florida: 'West - Seed 10',
    Montana: 'West - Seed 15',
    'North Dakota State': 'East - Seed 16',
    'Virginia Commonwealth': 'East - Seed 8',
    Liberty: 'East - Seed 12',
    'Saint Louis': 'East - Seed 13',
    Belmont: 'East - Seed 11',
    Yale: 'East - Seed 14',
    Minnesota: 'East - Seed 10',
    Bradley: 'East - Seed 15',
    Iona: 'Midwest - Seed 16',
    'Utah State': 'Midwest - Seed 8',
    'New Mexico State': 'Midwest - Seed 12',
    Northeastern: 'Midwest - Seed 13',
    'Ohio State': 'Midwest - Seed 11',
    'Georgia State': 'Midwest - Seed 14',
    'Seton Hall': 'Midwest - Seed 10',
    'Abilene Christian': 'Midwest - Seed 15',
};

const reality = {
    Villanova: 'Winner',
    Michigan: 'Final',
    'Loyola (IL)': 'Four',
    Kansas: 'Four',

    'Kansas State': 'Elite',
    'Florida State': 'Elite',
    'Texas Tech': 'Elite',
    Duke: 'Elite',

    Kentucky: 'Sweet',
    Nevada: 'Sweet',
    Gonzaga: 'Sweet',
    'Texas A&M': 'Sweet',
    'West Virginia': 'Sweet',
    Purdue: 'Sweet',
    Clemson: 'Sweet',
    Syracuse: 'Sweet',

    'Maryland-Baltimore County': 'Round 2',
    Buffalo: 'Round 2',
    Tennessee: 'Round 2',
    Cincinnati: 'Round 2',

    Xavier: 'Round 2',
    'Ohio State': 'Round 2',
    Houston: 'Round 2',
    'North Carolina': 'Round 2',

    Alabama: 'Round 2',
    Marshall: 'Round 2',
    Florida: 'Round 2',
    Butler: 'Round 2',

    'Seton Hall': 'Round 2',
    Auburn: 'Round 2',
    'Michigan State': 'Round 2',
    'Rhode Island': 'Round 2',
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
            const points = index === 0 ? 0 : (2 ** (index - 1)) + bracketMatchups.seedValue;

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
            const points = index === 0 ? 0 : (2 ** (index - 1)) + pickTeam.seedValue;

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
//     adam1: convertBracket(adam1),
//     ian1: convertBracket(ian1),
    alpha: convertBracket(alpha),
    beta: convertBracket(beta),
    charlie: convertBracket(charlie),
    delta: convertBracket(delta),
    delta2: convertBracket(delta2),
    echo: convertBracket(echo),
    spoiler: convertBracket(spoiler),
    favorite: generate('favorite'),
    michael1: convertBracket(michael1),
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
        const versus = sumBracket(scoreBracket(manual.favorite, result));

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
        const versus = sumBracket(scoreBracket(manual.favorite, result));

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
    const sorted = _.sortBy(keys, (key) => _.sum(scores[key]) / scores[key].length);

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

const resultsOutput = _.map(resultsManual, (result) => _.pick(result, ['key', 'min', 'max', 'avg']));

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
    const picks = _.mapValues(byTeam, (team) => _.maxBy(team, 'round').key);

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
