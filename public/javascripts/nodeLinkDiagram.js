async function drawGraph(dataName, refCentrality, colorMapName, isTutorial, completionFunction, clusterQuestion) {
    const startTime = Util.getTime();
    const graph = await $.getJSON('./data/' + dataName + '.json');
    const colorMap = Constant.colorMaps[colorMapName];

    // Set Render Size
    const svg = d3.select("svg#network"),
        svgWidth = 720,
        svgHeight = 600,
        width = svgHeight * 0.75,
        height = svgHeight * 0.75;

    // No Magic Number !
    const nodeRadius = graph.nodes.length < 250 ? 8 - graph.nodes.length / 50 : 3,
        linkColor = '#000',
        linkOpacity = 0.25,
        legendX = 25,
        legendY = 50,
        legendSize = 10;

    let maxAxisVal = undefined,
        minCentralityVal = undefined,
        maxCentralityVal = undefined;

    let answeredNodes, correctAnswerNode, highlightNode;

    setAxisInfo();
    drawColorLegend();
    drawLinks();
    if (refCentrality === 'cluster') {
        answeredNodes = [];
        correctAnswerNode = clusterQuestion.correctAnswerNode;
        highlightNode = clusterQuestion.highlightNode;

        drawHighlightNode();

        $('body').append('<div class="button task-complete-button">Complete</div>');
        $('.task-complete-button').mousedown(function () {
            checkAnswerResult(answeredNodes);
            this.remove();
        });
    }
    drawNodes();

    function drawHighlightNode() {
        d3.selectAll('.node').remove();
        _.forEach(highlightNode, (nodeId) => {
            const node = graph.nodes[nodeId];
            const coord = getCoord({ x: node.x, y: node.y });
            const color = '#000';
            svg.append('circle')
                .attrs({
                    cx: coord.x,
                    cy: coord.y,
                    r: nodeRadius + 5,
                    fill: color
                })
                .classed('node', true)
                .on('click', function () {
                    answer(node);
                })
        });
        _.forEach(answeredNodes, (nodeId) => {
            const node = graph.nodes[nodeId];
            const coord = getCoord({ x: node.x, y: node.y });
            const color = '#777';
            svg.append('circle')
                .attrs({
                    cx: coord.x,
                    cy: coord.y,
                    r: nodeRadius + 5,
                    fill: color
                })
                .classed('node', true)
                .on('click', function () {
                    answer(node);
                })
        });

        drawNodes();

    }

    /**
     * Set Axis Information
     */
    function setAxisInfo() {
        // position
        const maxXNode = _.maxBy(graph.nodes, function (node) {
            return Math.abs(node.x);
        });
        const maxAbsX = Math.abs(maxXNode.x);
        const maxYNode = _.maxBy(graph.nodes, function (node) {
            return Math.abs(node.y);
        });
        const maxAbsY = Math.abs(maxYNode.y);
        maxAxisVal = maxAbsX > maxAbsY ? maxAbsX : maxAbsY;

        // centrality
        const minCentralityNode = _.minBy(graph.nodes, function (node) {
            return node[refCentrality];
        });
        minCentralityVal = minCentralityNode[refCentrality];
        const maxCentralityNode = _.maxBy(graph.nodes, function (node) {
            return node[refCentrality];
        });
        maxCentralityVal = maxCentralityNode[refCentrality];

    }

    /**
     * Draw Color Legend
     */
    function drawColorLegend() {
        svg.append('text')
            .text(refCentrality)
            .attrs({
                x: legendX,
                y: legendY - 5,
                'text-anchor': 'start',
                'alignment-baseline': 'ideographic'
            });

        if (refCentrality === 'cluster') {
            for (let i = 0; i <= 4; i++) {
                const color = getHexColor(i);
                svg.append('rect')
                    .attrs({
                        x: legendX + i * 40,
                        y: legendY,
                        width: legendSize,
                        height: legendSize,
                        fill: color,
                    });
                svg.append('text')
                    .text(i)
                    .attrs({
                        x: legendX + i * 40,
                        y: legendY + legendSize + 15,
                        'text-anchor': 'start',
                        'alignment-baseline': 'central'
                    })

            }
        } else {
            for (let i = 0; i <= 255; i++) {
                const relative = i / 255;
                const virtualCentrality = Util.getAbsoluteVal(relative, minCentralityVal, maxCentralityVal);
                const color = getHexColor(virtualCentrality);
                svg.append('rect')
                    .attrs({
                        x: legendX + i,
                        y: legendY,
                        width: legendSize,
                        height: legendSize,
                        fill: color,
                    });
                if (i === 0 || i === 127 || i === 255) {
                    svg.append('text')
                        .text(virtualCentrality.toFixed(2))
                        .attrs({
                            x: legendX + i,
                            y: legendY + legendSize + 15,
                            'text-anchor': 'middle',
                            'alignment-baseline': 'central'
                        })
                }
            }
        }
    }

    /**
     * Draw Nodes
     */
    function drawNodes() {
        _.forEach(graph.nodes, function (node) {
            const coord = getCoord({ x: node.x, y: node.y });
            const color = getHexColor(node[refCentrality]);
            svg.append('circle')
                .attrs({
                    cx: coord.x,
                    cy: coord.y,
                    r: nodeRadius,
                    fill: color
                })
                .classed('node', true)
                .on('click', function () {
                    answer(node);
                })
            // Code to verify that colors are applied correctly
            // svg.append('text')
            //     .text(node[refCentrality])
            //     .attrs({
            //         x: coord.x,
            //         y: coord.y,
            //         fill: '#e55',
            //         'alignment-baseline': 'central',
            //         'text-anchor': 'middle'
            //     });
        });
    }

    /**
     * Draw Links
     */
    function drawLinks() {
        _.forEach(graph.links, function (link) {
            const sourceNodeIdx = link.source;
            const targetNodeIdx = link.target;
            const sourceCoord = getCoord(graph.nodes[sourceNodeIdx]);
            const targetCoord = getCoord(graph.nodes[targetNodeIdx]);

            svg.append('line')
                .attrs({
                    x1: sourceCoord.x,
                    x2: targetCoord.x,
                    y1: sourceCoord.y,
                    y2: targetCoord.y,
                    stroke: linkColor,
                    opacity: linkOpacity
                })
        });
    }

    /**
     * 'pos' is the coordinate with center point (0,0).
     * Returns the top-left point to be (0,0).
     * @param pos
     * @returns {{x: number, y: number}}
     */
    function getCoord(pos) {
        return {
            x: (svgWidth / 2) + (pos.x / maxAxisVal) * (width / 2),
            y: (svgHeight / 2) + (pos.y / maxAxisVal) * (height / 2)
        }
    }

    /**
     * Get Hexadecimal Color from centrality
     * @param centrality
     * @returns {string} : rgb({r}, {g}, {b})
     */
    function getHexColor(centrality) {
        const relativeVal = refCentrality === 'cluster' ?
            centrality : Util.getRelativeVal(centrality, minCentralityVal, maxCentralityVal);
        return colorMap(relativeVal);
    }

    function answer(node) {
        if (refCentrality === 'cluster') {
            addAnswer(node);
            return;
        }
        checkAnswerResult(node)
    }

    function addAnswer(node) {
        const nodeId = graph.nodes.indexOf(node);
        if (answeredNodes.includes(nodeId)) {
            answeredNodes.splice(answeredNodes.indexOf(nodeId), 1)
        } else {
            answeredNodes.push(nodeId);
        }
        console.log(answeredNodes);
        drawHighlightNode();
    }

    function checkAnswerResult(userAnswerNode) {
        const elapsedTime = Util.getTimeDiffFrom(startTime);
        let isCorrect = (refCentrality === 'cluster') ?
            Util.equalElemInArray(correctAnswerNode, userAnswerNode) : userAnswerNode[refCentrality] >= maxCentralityVal;
        console.log(elapsedTime, isCorrect);

        if (isTutorial) {
            const isCorrectText = isCorrect ? 'CORRECT' : 'WRONG';
            svg.append('text')
                .text('Your answer is ' + isCorrectText + ' and time completion is ' + elapsedTime + ' seconds')
                .attrs({
                    x: 50,
                    y: svgHeight - 10,
                    'text-anchor': 'start',
                    'alignment-baseline': 'ideographic'
                })
        }

        completionFunction();

        return { elapsedTime, isCorrect }
    }
}
