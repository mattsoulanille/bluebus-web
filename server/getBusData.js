
class NoDayFoundError extends Error { };
class NoSchoolFoundError extends Error { };

const moment = require("moment");
const rp = require("request-promise");
const cheerio = require("cheerio");
const cheerioTableParser = require("cheerio-tableparser");

const days = {
    0: ["Sunday"],
    1: ["Monday"],
    2: ["Tuesday"],
    3: ["Wednesday"],
    4: ["Thursday"],
    5: ["Friday"],
    6: ["Saturday Daytime", "Saturday Night"]
};

const schools = {
    "Bryn Mawr": ["Leave Bryn Mawr", "Bryn Mawr to Haverford", "Leaves BMC"],
    "Haverford": ["Leave Haverford", "Leaves Stokes", "Haverford to Bryn Mawr"],
};

//const ignored = ["Arrive Haverford", "Arrive Bryn Mawr", "Leaves Suburban Square", "Leaves HC South Lot Bus Stop", "Leaves Suburban Square"];




async function getBusData(url) {
    var $ = cheerio.load((await rp(url)));
    cheerioTableParser($);
    var rawTables = $("table");

    var tables = [];
    for (let i = 0; i < rawTables.length; i++) {
        var table = $(rawTables[i]).parsetable();
        tables[i] = table;
    }

    var departureSets = tables
        .map(parseTable)
        .reduce(function(allTimes, addTimes) {
            // { "Haverford" : Set(), "Bryn Mawr" : Set() }
            var combined = {};
            for (let i in schools) {
                combined[i] = new Set([...allTimes[i], ...addTimes[i]]);
            }
            return combined;
        });

    var departures = {};
    for (let i in departureSets) {
        departures[i] = [...departureSets[i]].sort();
    }

    return departures;
}

function parseTable(table) {
    var day = getTableDay(table);

    var departureSeconds = {};
    for (let school in schools) {
        departureSeconds[school] = new Set();
    }

    for (let j in table) {
        let col = table[j];

        var school;
        try {
            school = getSchool(col);
        }
        catch (e) {
            if (e instanceof NoSchoolFoundError) {
                continue; // Skip this column
            }
        }

        var timesInDay = getTimes(col);
        var times = new Set([...timesInDay].map(function(time) {
            return time + 3600 * 24 * day;
        }));


        departureSeconds[school] = new Set(
            [...departureSeconds[school], ...times]
        );
    }

    return departureSeconds;
}


function getTableDay(table) {
    // For each column in the table
    for (let j in table) {
        let col = table[j];

        // For each entry in the column
        for (let i in col) {
            let entryString = col[i].toLowerCase();

            // For each possible day
            for (let d in days) {
                let strings = days[d];

                // For each string corresponding to the day
                for (let s in strings) {
                    let dayString = strings[s].toLowerCase();
                    // Check if the entry in the column
                    // contains the string of the day
                    if (entryString.includes(dayString)) {
                        return d;
                    }
                }
            }
        }
    }
    throw new NoDayFoundError();
}

function getTimes(col) {
    // Returns a list of time in seconds since the start of the day
    // Match pm, p.m, pm., p.m.
    const pm = /p\.?m\.?/;

    // Match am, a.m, am., a.m.
    const am = /a\.?m\.?/;

    const timeRegex = /\s*(\d\d?)(:(\d\d))?\s*/;
    const andRegex = /and/;

    var timesToReturn = new Set();

    // Becomes 1 when pm
    // Becomes 2 when going from pm to am
    var timeOffset = 0;

    for (let i in col) {
        var str = col[i];

        if (pm.test(str)) {
            timeOffset = 1;
        }
        else if (am.test(str) && timeOffset === 1) {
            // For the case that they write 12:15 am after
            // a bunch of pm times.
            timeOffset = 2;
        }

        // Sometimes they write things like
        // "12:55 and 1 p.m."
        // in one entry
        let splitOverAnd = str.split("and");
        for (let j in splitOverAnd) {
            let timeString = splitOverAnd[j];
            let matches = timeString.match(timeRegex);
            if (matches) {
                let hour = matches[1] | 0;
                let minute = matches[3] | 0;
                let timeInSeconds =
                    3600 * hour +
                    60 * minute +
                    3600 * 12 * timeOffset;

                timesToReturn.add(timeInSeconds);
            }

        }
    }
    return timesToReturn;
}

// Refactor with getTableDay
// Write a getStringInCol function
function getSchool(col) {
    // Ignored is a list of table headings that aren't used.
    for (let i in col) {
        let str = col[i].toLowerCase();

        for (let school in schools) {
            let names = schools[school];

            for (let j in names) {
                var name = names[j].toLowerCase();
                if (str.includes(name)) {
                    return school;
                }
            }
        }
    }
    throw new NoSchoolFoundError();
}


module.exports = getBusData;
