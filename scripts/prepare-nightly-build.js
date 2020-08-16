const packageJson = require('../package.json');
const fs = require('fs');
const path = require('path');

const nextVersion = Number(packageJson.version.split('.')[1]) + 1;

const newPackageJson = {
    ...packageJson,
    version: `${packageJson.version.split('.')[0]}.${nextVersion}.${
        packageJson.version.split('.')[2]
    }`,
    name: 'waypoint nightly',
    displayName: 'waypoint nightly',
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
