const app = new Vue({
    el: '#app',
    data: {
        loginButtonLocked: false,
        isSigned: false,
        user: {
            uid: undefined,
            uname: undefined,
            loginTime: undefined,

        },
        pageNum: 0,
        pageInfo: pages[0],
    },

    methods: {
        login: () => {
            console.log('Login button is clicked.');
            const inputName = $unameInputField.val();
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
                loginTime: app.$data.user.loginTime
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
            app.$data.pageInfo = pages[app.$data.pageNum];
            app.pageInteraction(app.$data.pageInfo.type)
        },
        pageInteraction: (type) => {
            if (type === 'animation_deg') {
                app.animation('image/degree/network_diagram-degree_', 10);
            } else if (type === 'task_deg') {
                app.task('karate', 'deg', 'magma');
            }
        },
        blindTest: () => {
            console.log('hi');
            const correctVals = [15, 5, 75, 8, 48, 7];
            let color_blind = false;

            for (let i = 1; i <= 6; i++) {
                const val = parseInt($('#blind_test_' + i).val());
                const correct_val = correctVals[i - 1];
                if (val === undefined || val === '' || isNaN(val)) {
                    alert("Please enter a number in every input window.");
                    return;
                }
                console.log(val === correct_val, val, correct_val);
                color_blind = val === correct_val ? color_blind : true;
            }
            const addedText = color_blind ? "" : "NOT ";
            alert("You are " + addedText + "color-blind.")
        },

        animation: (imgUrl, numOfImg) => {
            console.log('ani');
            const imgFormat = '.svg';
            let imgNum = 0;

            const testInterval = setInterval(function () {
                imgNum = (imgNum < numOfImg) ? (imgNum + 1) : 0;
                console.log(imgUrl + imgNum + imgFormat);
                $('#diagram-img').attr("src", imgUrl + imgNum + imgFormat);
            }, 1000);

            setTimeout(function () {
                clearTimeout(testInterval);
            }, 1000 * numOfImg * 2);
        },

        task: (data, centrality, colormap) => {
            setTimeout(function () {
                $('.start-button').click(function () {
                    console.log("click");
                    $(this).remove();
                    drawGraph(data, centrality, colormap, true, function () {
                        $('body').append('<a class="button next-page-button" href="slide6_btw_def.html">NEXT</a>');
                    })
                });
            }, 1000);
        }
    }
});

