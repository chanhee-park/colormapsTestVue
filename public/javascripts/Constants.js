const Constant = {
    that: this,
    colorMaps: {
        // https://github.com/d3/d3-scale-chromatic
        'heat': d3.interpolateYlOrRd, // multi hue : from yellow to red
        'brewer_blues': d3.interpolateBlues, // single hue : blue
        'brewer_yellow-green-blue': d3.interpolateYlGnBu,
        'viridis': d3.interpolateViridis,
        'magma': d3.interpolateMagma,
        'rainbow': d3.interpolateSinebow,
        'category': function (clusterNum) {
            return d3.schemeCategory10[clusterNum];
        },
    },

    centralityName: {
        "deg": "Degree",
        "deg_log": "Degree",
        "cls": "cls",
        "page": "page",
        "btw": "Betweenness"
    },
};

console.log(Constant);
