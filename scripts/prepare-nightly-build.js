const packageJson = require('../package.json');
const fs = require('fs');
const path = require('path');

const date = new Date();

const padToTwoDigit = value => (value < 10 ? `0${value}` : `${value}`);

const newPackageJson = {
    ...packageJson,
    version: `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}${padToTwoDigit(
        date.getHours()
    )}${padToTwoDigit(date.getMinutes())}`,
    name: 'waypoint-nightly',
    displayName: 'Waypoint Nightly Build',
};

fs.writeFileSync(
    path.resolve(__dirname, '../package.json'),
    JSON.stringify(newPackageJson, null, ' ')
);

const readmeContent = fs.readFileSync(
    path.resolve(__dirname, '../README.md'),
    'utf8'
);

const lines = [
    '## This is a nightly build of Waypoint. Please use the stable version for day to day use.',
    ...readmeContent.split(/\r?\n/),
];

fs.writeFileSync(path.resolve(__dirname, '../README.md'), lines.join('\n'));
