const pages = [
    {
        title: "Tutorial & Training Session",
        type: 'desc',
        contentHTML: `
    <div class="sub-title">Instructions</div>
    <div class="description">Todays user study is about “Colormaps in Network Visualization/Graph” (Node link diagram).
    </div>`
    },
    {
        title: "Color-blind Test",
        type: 'color-blind',
        contentHTML: `
    <style>
        .test_image-wrapper {
            display: inline-block;
            width: 320px;
            height: 350px;
            padding: 10px;
        }

        .test_image-wrapper img {
            width: 300px;
            display: inline-block;
        }

        .test_image-wrapper input {
            width: 300px;
            font-size: 18px;
            height: 30px;
            line-height: 30px;
            text-align: right;
        }

        #task-complete-button {
            display: inline-block;
            width: 150px;
            margin: 15px 20px;
        }

        .button {
            position: static;
        }

        .button.back-page-button {
            float: left;
        }

        .button.next-page-button {
            float: right;
        }
    </style>
    <div class="description">This study examines the usability of colors in network visualizations. Therefore, before
        the experiment, you need a color-blind test.
    </div>
    <div class="description">Look at the picture below and enter what number you see.</div>
    <div class="description"></div>
    <div class="test_image-wrapper">
        <img id='color-blind-img_1' src="image/color-blind/1.gif" alt="color blind test">
        <input id="blind_test_1">
    </div>
    <div class="test_image-wrapper">
        <img id='color-blind-img_2' src="image/color-blind/2.gif" alt="color blind test">
        <input id="blind_test_2">
    </div>
    <div class="test_image-wrapper">
        <img id='color-blind-img_3' src="image/color-blind/3.gif" alt="color blind test">
        <input id="blind_test_3">
    </div>
    <br>
    <div class="test_image-wrapper">
        <img id='color-blind-img_4' src="image/color-blind/4.gif" alt="color blind test">
        <input id="blind_test_4">
    </div>
    <div class="test_image-wrapper">
        <img id='color-blind-img_5' src="image/color-blind/5.gif" alt="color blind test">
        <input id="blind_test_5">
    </div>
    <div class="test_image-wrapper">
        <img id='color-blind-img_6' src="image/color-blind/6.gif" alt="color blind test">
        <input id="blind_test_6">
    </div>
    <br>
    <br>`,
    },
    {
        title: "Definition of Network Graph",
        type: 'desc',
        contentHTML: `
    <div class="sub-title">What is Network Graph, Network Map, Node-Link Diagram?
    </div>
    <div class="description">This type of visualisation shows how things are interconnected through the use of nodes /
        vertices and link lines to represent their connections and help illuminate the type of relationships between a
        group of entities.
    </div>
    <div class="image-wrapper">
        <img src="image/network_diagram.svg" alt="Node Link Diagram" height="300">
    </div>`
    },
    {
        title: "Node link Diagram Metrics",
        type: 'desc',
        contentHTML: `
    <div class="description">There are different statistic metrics to analyse any node link diagram. Few will be explained here in order to get familiar with them and use them in actual user study.
    </div>
    <div class="description">1. Degree of Node</div>
    <div class="description">2. Betweenness</div>
    <div class="description">3. Common Neighbors</div>
    <div class="description">4. Clusters</div>`,
    },
    {
        title: "1. Degree",
        type: "animation_deg",
        contentHTML: `
    <div class="description">It simply counts the number of edges that a node has.</div>
    <div class="image-wrapper">
        <img id='diagram-img' src="image/degree/network_diagram-degree_0.svg" alt="degree_animation" height="300">
    </div>`,
    },
    {
        title: "1. Degree",
        type: "task_deg",
        contentHTML: `
    <div class="sub-title">Select the highest degree node.</div>
    <div class="render-area">
        <div class="button start-button">Start</div>
        <svg id="network"></svg>
    </div>`,
    }
];
