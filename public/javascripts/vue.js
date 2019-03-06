const app = new Vue({
    el: '#app',
    data: {
        loginButtonLocked: false,
        isSigned: false,
        user: {
            uid: undefined,
            uname: undefined,
            loginTime: undefined,
            test: {
                'color_blind': false,
                'tutorial_test': [],
                'real_test': [],
            },
        },
        pageNum: 0,
        pageInfo: pages[0],
    },

    methods: {
        login: () => {
            console.log('Login button is clicked.');
            const inputName = $('input#input-name').val();
            const isNameable = !_.isUndefined(inputName) || inputName.length >= 1;
            if (this.loginButtonLocked) {
                console.log('Login button is locked.');
            } else if (!isNameable) {
                console.log('There are not user name in input area.');
                alert("Enter Your Name.");
            } else {
                this.loginButtonLocked = true;
                loginModule.login();
            }
        },
        setUserInfo: (id, name) => {
            app.$data.user.uid = id;
            app.$data.user.uname = name;
            app.$data.user.loginTime = Date.now();
            app.$data.isSigned = true;
        },
        printUserInfo: () => {
            console.log({
                uid: app.$data.user.uid,
                uname: app.$data.user.uname,
                loginTime: app.$data.user.loginTime,
                test: app.$data.user.test
            });
        },
        backPage: () => {
            app.$data.pageNum -= 1;
            app.changePage();
        },
        nextPage: () => {
            app.$data.pageNum += 1;
            app.changePage();
        },
        changePage: () => {
            clearTimeout(intervalFunc);
            console.log("Page " + app.$data.pageNum);
            app.$data.pageInfo = pages[app.$data.pageNum];
            app.pageInteraction(app.$data.pageInfo.type);
            app.printUserInfo();
        },
        pageInteraction: (type) => {
            if (type === 'animation_deg') {
                app.animation('image/degree/network_diagram-degree_', 10);
            } else if (type === 'task0') {
                console.log('TASK 1/3');
                app.task('karate', 'deg', 'magma', 0);
            } else if (type === 'task1') {
                console.log('TASK 2/3');
                app.task('karate', 'btw', 'brewer_yellow-green-blue', 1);
            } else if (type === 'task2') {
                console.log('TASK 3/3');
                app.task('karate', 'cls', 'rainbow', 2);
            } else if (type === 'save') {
                writeUserTestData(app.$data.user);
            }
        },
        blindTest: () => {
            console.log('Blind Test');
            const correctVals = [15, 5, 75, 8, 48, 7];
            let color_blind = false;

            for (let i = 1; i <= 6; i++) {
                const val = parseInt($('#blind_test_' + i).val());
                const correct_val = correctVals[i - 1];
                if (val === undefined || val === '' || isNaN(val)) {
                    alert("Please enter a number in every input window.");
                    return;
                }
                color_blind = val === correct_val ? color_blind : true;
            }
            const addedText = color_blind ? "" : "NOT ";
            app.$data.user.test['color_blind'] = color_blind;
            alert("You are " + addedText + "color-blind.");
        },
        task: (data, centrality, colormap, taskNum) => {
            $('svg#network').empty();
            $('div.render-area').prepend('<div class="button start-button">Start</div>');
            setTimeout(function () {
                $('.start-button').click(function () {
                    console.log("click");
                    $(this).remove();
                    drawGraph(data, centrality, colormap, true, taskNum)
                });
            }, 1000);
        }
    }
});

let intervalFunc;