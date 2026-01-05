
const fs = require('fs');
const { ABOUT_DATA } = require('./lib/about-data-temp'); // temporary require, need to handle module export

// Wait, about-data.ts is TS. Node can't require it directly without ts-node.
// I'll just manually create the JSON content since there are only 3 projects. It's safer than setting up a TS execution environment just for this extraction.
