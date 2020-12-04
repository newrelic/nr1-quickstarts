const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const path = require('path');


// First argument should be path to quickstarts folder
let directory = process.argv[2];


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
let quickstarts = fs.readdirSync(directory)
        .filter((element) => !element.startsWith('_'))
        .map(processQuickstart);


//
// Process a quickstarts element
//
function processQuickstart(element) {
    //
    // Quickstart data
    //
    let quickstart = {
        name: '',
        authors: [],
        sources: [],
        alerts: [],
        dashboards: [],
        flex: [],
    }


    //
    // Read config and store attributes
    //
    let configContents = fs.readFileSync(directory + element + '/config.yaml', 'utf8');
    let config = yaml.safeLoad(configContents);
    quickstart.id = element;
    quickstart.name = config.name || element;
    quickstart.description = config.description || '';
    quickstart.authors = config.authors || [];
    quickstart.sources = config.sources || [];
    quickstart.alerts = config.alerts || [];


    //
    // Read dashboard directory and read in all dashboards + screenshots
    //
    quickstart.dashboards = fs.readdirSync(directory + element + '/dashboards/')
        .filter((filename) => filename.endsWith('json'))
        .map((filename) => {

        let dashboard = {
            'name': '',
            'description': '',
            'filename': filename,
            'sources': [],
            'screenshots': [],
        };

        // Retrieve dashboard json and store dashboard name
        let dashboardJson = JSON.parse(fs.readFileSync(directory + element + '/dashboards/' + filename));
        dashboard.name = dashboardJson.title;
        if (dashboardJson.filter) {
            dashboard.sources = dashboardJson.filter.event_types || '';
        }
        quickstart.sources = quickstart.sources.concat(dashboard.sources);

        // Check if an image exists with same name as dashboard
        dashboard.screenshots = ['.png', '.jpeg', '.gif'].map((imageType) => {
            if (fs.existsSync(directory + element + '/dashboards/' + path.parse(filename).name + imageType)) {
                return path.parse(filename).name + imageType;
            }
        }).filter((dashboard) => dashboard);

        return dashboard;
    });


    //
    // Read flex directory
    //
    if (fs.existsSync(directory + element + '/flex')) {
        quickstart.flex = fs.readdirSync(directory + element + '/flex/')
            .map((filename) => {
                // We want to remove the flex events from the sources list, as it will add a lot of unknown data sources
                // We know where the data sources are coming from, so it's not really unknown
                // We do this by parsing each file and retrieving the specific event_type
                let flexContents = fs.readFileSync(directory + element + '/flex/' + filename, 'utf8');
                let flexConfig = yaml.safeLoad(flexContents);

                flexConfig.integrations.forEach(integration => {
                    integration.config.apis.forEach(api => {
                        quickstart.sources = quickstart.sources.filter((source) => source == api.event_type);
                    })
                });

                return filename;
            });
        quickstart.sources.push('Flex');
    }


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
fs.writeFileSync('data.json', json);
