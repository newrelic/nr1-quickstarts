const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const path = require('path');

// Helper to remove duplicates from an array
// Thank you StackOverflow: https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};


//
// Read all quickstarts, filter out the ones starting with _ and process each
//
let quickstarts = fs.readdirSync('quickstarts')
        .filter((element) => !element.startsWith('_'))
        .map(process);


//
// Process a quickstarts element
//
function process(element) {
    //
    // Quickstart data
    //
    let quickstart = {
        name: '',
        authors: [],
        sources: [],
        alerts: [],
        dashboards: [],
    }


    //
    // Read config and store attributes
    //
    let configContents = fs.readFileSync('quickstarts/' + element + '/config.yaml', 'utf8');
    let config = yaml.safeLoad(configContents);
    quickstart.id = element;
    quickstart.name = config.name || element;
    quickstart.authors = config.authors || [];
    quickstart.sources = config.sources || [];
    quickstart.alerts = config.alerts || [];


    //
    // Read dashboard directory and read in all dashboards + screenshots
    //
    quickstart.dashboards = fs.readdirSync('quickstarts/' + element + '/dashboards/')
        .filter((filename) => filename.endsWith('json'))
        .map((filename) => {

        let dashboard = {
            'name': '',
            'filename': filename,
            'sources': [],
            'screenshots': [],
        };

        // Retrieve dashboard json and store dashboard name
        let dashboardJson = JSON.parse(fs.readFileSync('quickstarts/' + element + '/dashboards/' + filename));
        dashboard.name = dashboardJson.title;
        dashboard.sources = dashboardJson.filter.event_types;
        quickstart.sources = quickstart.sources.concat(dashboard.sources);

        // Check if an image exists with same name as dashboard
        dashboard.screenshots = ['.png', '.jpeg', '.gif'].map((imageType) => {
            if (fs.existsSync('quickstarts/' + element + '/dashboards/' + path.parse(filename).name + imageType)) {
                return path.parse(filename).name + imageType;
            }
        }).filter((dashboard) => dashboard);

        return dashboard;
    });


    //
    // Remove duplicates from sources
    //
    quickstart.sources = Array.from(new Set(quickstart.sources)).sort();


    return quickstart;
}


//
// Write out data for use in front-end
//
console.log(util.inspect(quickstarts, false, null, true /* enable colors */))
let json = JSON.stringify({
    'quickstarts': quickstarts
});
fs.writeFileSync('src/data.json', json);


