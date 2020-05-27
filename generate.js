const fs = require('fs');

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


// Read dashboards from list
let dashboards = [];
fs.readdirSync('dashboards').forEach(process);

// Process an element
function process(element) {
    // Read config
    let config = JSON.parse(fs.readFileSync('dashboards/' + element + '/config.json'));

    // Read dashboard data
    let dashboardData = []
    let files = [];
    let file = 'dashboards/' + element + '/dashboard.json'
    if (fs.existsSync(file)) {
        // Single dashboard mode
        let data = JSON.parse(fs.readFileSync(file))
        files.push({
            name: data.title,
            location: element + '/dashboard.json'
        });
        dashboardData.push(data);
    } else {
        // Multi dashboard mode
        let counter = 1;
        let file = 'dashboards/' + element + '/dashboard_' + counter + '.json';
        while(fs.existsSync(file)) {
            let data = JSON.parse(fs.readFileSync(file))
            files.push({
                name: data.title,
                location: element + '/dashboard_' + counter + '.json'
            });
            dashboardData.push(data);
            counter++;
            file = 'dashboards/' + element + '/dashboard_' + counter + '.json'
        }
    }

    // Check screenshots
    let screenshots = [];
    fs.readdirSync('dashboards/' + element).forEach((file) => {
        if (file.endsWith('.png')) {
            screenshots.push(file);
        }
    });

    // Get event_types from all dashboards
    let sources = config.sources || [];
    dashboardData.forEach((dashboard) => {
        dashboard.widgets.forEach((widget) => {
            sources = sources.concat(widget.event_types).unique().filter((value) => value !== null);
        });
    });

    // Add to array
    dashboards.push({
        name: element,
        sources,
        config,
        files: files,
        screenshots,
    });
}

// Write out data for use in front-end
console.log(dashboards);
let json = JSON.stringify({
    'dashboards': dashboards
});
fs.writeFileSync('src/data.json', json);


