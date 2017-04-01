var appGiftr = {
    key: "giftr-pada0008"
    , data: {
        people: []
    }
    , peopleId: null
}
var editOn = 0;
var errOn = 0;
var personId = null;

function jInit() {
    if (!(localStorage.getItem(appGiftr.key) === null)) {
        appGiftr.data = localStorage.getItem(appGiftr.key);
        appGiftr.data = JSON.parse(appGiftr.data);
    }
    first_load();
    window.addEventListener('push', changedPage);
}

function first_load() {
    var name = document.getElementById("name");
    var dob = document.getElementById("dob");
    var ul = document.getElementById("contact-list");
    name.value = "";
    dob.value = "";
    editOn = 0;
    if (appGiftr.data.people.length) {
        ul.innerHTML = "";
        for (var i = 0; i < appGiftr.data.people.length; i++) {
            var li = document.createElement("li");
            var span = document.createElement("span");
            var aSpanName = document.createElement("a");
            var a = document.createElement("a");
            var aSpanGifts = document.createElement("span");
            li.className = "table-view-cell";
            li.setAttribute("id", appGiftr.data.people[i].id);
            span.className = "name";
            aSpanName.setAttribute("href", "#personModal")
            aSpanName.innerHTML = appGiftr.data.people[i].name;
            a.className = "navigate-right pull-right";
            a.setAttribute("href", "gifts.html");
            aSpanGifts.className = "dob";
            var dt = moment(appGiftr.data.people[i].dob).format("MMM do")
            aSpanGifts.innerHTML = dt;
            a.appendChild(aSpanGifts);
            span.appendChild(aSpanName);
            li.appendChild(span);
            li.appendChild(a);
            ul.appendChild(li);
            aSpanName.addEventListener('touchend', function (i) {
                return function () {
                    editPeople(i);
                }
            }(i));
            a.addEventListener('touchstart', setPersonId(i));
        }
    }
    var savebtn = document.getElementById('savebtn');
    savebtn.addEventListener('touchend', save_people);
    var closebtn = document.getElementById('closebtn');
    var closelink = document.querySelector('#personModal header a');
    closebtn.addEventListener('click', function () {
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        var name = document.getElementById("name");
        var dob = document.getElementById("dob");
        name.value = "";
        dob.value = "";
        errOn = 0;
        name.parentElement.classList.remove("err");
        dob.parentElement.classList.remove("err");
        closelink.dispatchEvent(myClick);
    });
}

function setPersonId(id) {
    return function () {
        personId = id;
    };
}

function editPeople(i) {
    var name = document.getElementById("name");
    var dob = document.getElementById("dob");
    name.parentElement.classList.remove("err");
    dob.parentElement.classList.remove("err");
    name.value = appGiftr.data.people[i].name;
    dob.value = appGiftr.data.people[i].dob;
    editOn = i + 1;
}

function checkPeople() {
    var name = document.getElementById("name");
    var dob = document.getElementById("dob");
    var err = document.getElementById("error");
    err.innerHTML = "";
    errOn = 0;
    if (name.value == "" && dob.value == "") {
        err.innerHTML = "Name & DOB required!!";
        errOn = 1;
    }else if (name.value == "") {
        err.innerHTML = "Name required!!";
        errOn = 1;
    }
    else if (dob.value == "") {
       err.innerHTML = "DOB required!!";
         errOn = 1;
    }
}

function changedPage() {
    var contentDiv = document.querySelector('.content');
    switch (contentDiv.id) {
    case 'first':
        first_load();
        break;
    case 'second':
        second_load();
        break;
    }
}

function save_people() {
    checkPeople();
    if (errOn == 0) {
        var name = document.getElementById("name");
        var dob = document.getElementById("dob");
        if (editOn > 0) {
            appGiftr.data.people[editOn - 1].name = name.value
            appGiftr.data.people[editOn - 1].dob = dob.value
            editOn = 0;
        }
        else {
            var person = {
                id: Math.random().toString(36).substring(7)
                , name: name.value
                , dob: dob.value
                , ideas: []
            }
            appGiftr.data.people.push(person);
        }
        shortPeople();
        storeLocal();
        var closelink = document.querySelector('#personModal header a');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        closelink.dispatchEvent(myClick);
        first_load();
    }
}

function shortPeople() {
    appGiftr.data.people.sort(function (a, b) {
        var x = new Date(a.dob)
            , y = new Date(b.dob);
        var p = moment(a.dob).format("MMDD")
        var q = moment(b.dob).format("MMDD")
        var z = p < q ? -1 : 1;
        return z;
    });
}

function storeLocal() {
    var d = JSON.stringify(appGiftr.data);
    localStorage.removeItem(appGiftr.key);
    localStorage.setItem(appGiftr.key, d);
}

function second_load() {
    var idea = document.getElementById("idea");
    var store = document.getElementById("store");
    var url = document.getElementById("url");
    var cost = document.getElementById("cost");
    var person = document.getElementById("person");
    idea.value = "";
    store.value = "";
    url.value = "";
    cost.value = "";
    person.innerHTML = appGiftr.data.people[personId].name;
    errOn = 0;
    console.log(appGiftr.data.people[personId], appGiftr.data.people[personId].ideas.length);
    var ul = document.getElementById("gift-list");
    ul.innerHTML = "";
    if (appGiftr.data.people[personId] && appGiftr.data.people[personId].ideas.length) {
        for (var i = 0; i < appGiftr.data.people[personId].ideas.length; i++) {
            var li = document.createElement("li");
            li.className = "table-view-cell media";
            var span = document.createElement("span");
            span.className = "pull-right icon icon-trash midline";
            var div = document.createElement("div");
            div.className = "media-body";
            div.innerHTML = appGiftr.data.people[personId].ideas[i].idea;
            var pStore = document.createElement("p");
            pStore.innerHTML = appGiftr.data.people[personId].ideas[i].store;
            var purl = document.createElement("p");
            var url_a = document.createElement("a");
            url_a.setAttribute("href", appGiftr.data.people[personId].ideas[i].url);
            url_a.setAttribute("target", "_blank");
            url_a.innerHTML = appGiftr.data.people[personId].ideas[i].url;
            var cost = document.createElement("p");
            cost.innerHTML = appGiftr.data.people[personId].ideas[i].cost;
            purl.appendChild(url_a);
            div.appendChild(pStore);
            div.appendChild(purl);
            div.appendChild(cost);
            li.appendChild(span);
            li.appendChild(div);
            ul.appendChild(li);
            span.addEventListener("click", function (i) {
                return function () {
                    if (confirm("Are you sure want to delete this ?")) {
                        appGiftr.data.people[personId].ideas.splice(i, 1);
                        storeLocal();
                    }
                    second_load();
                }
            }(i));
        }
    }
    var saveidea = document.getElementById('saveidea');
    saveidea.addEventListener('touchend', save_idea);
    var cloaseidea = document.getElementById('closeidea');
    cloaseidea.addEventListener('click', function () {
        var idea = document.getElementById("idea");
        var store = document.getElementById("store");
        var url = document.getElementById("url");
        var cost = document.getElementById("cost");
        idea.value = "";
        store.value = "";
        url.value = "";
        cost.value = "";
        errOn = 0;
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        var closelink = document.querySelector('#giftModal header a');
        closelink.dispatchEvent(myClick);
    });
}

function checkIdea() {
    var idea = document.getElementById("idea");
    if (idea.value == "") {
        errOn = 1;
    }
}

function save_idea() {
    checkIdea();
    if (errOn == 1) {
        var e = document.getElementById("errorIdea");
        e.innerHTML = "Idea should be filled !!";
        setTimeout(function () {
            e.innerHTML = "";
            errOn = 0;
        }, 4000);
    }
    else {
        var idea = document.getElementById("idea");
        var store = document.getElementById("store");
        var url = document.getElementById("url");
        var cost = document.getElementById("cost");
        var idea = {
            idea: idea.value
            , store: store.value
            , url: url.value
            , cost: cost.value
        }
        appGiftr.data.people[personId].ideas.push(idea);
        storeLocal();
        idea.value = "";
        store.value = "";
        url.value = "";
        cost.value = "";
        editOn = 0;
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        var closelink = document.querySelector('#giftModal header a');
        closelink.dispatchEvent(myClick);
        second_load();
    }
}
document.addEventListener("deviceready", jInit);