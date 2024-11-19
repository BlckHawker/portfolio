import utils from "../utils.js";

window.onload = () => {
    loadContacts();
    loadBanner();
    utils.changeTitle();
    loadProjects();
}

async function loadContacts() {
    utils.getContactInfo().
        then(data =>
            document.querySelector("#contactLinks").innerHTML = data);
}

async function loadBanner() {
    await utils.getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html} );
}

async function loadProjects() {
    
    await fetch(`${utils.getProjectRoot()}/jsons/projects/ideas.json`)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        const projects = data["ProjectIdeas"];

        //add ideas
        document.querySelector("#ideas").innerHTML += projects.map(obj => createProjectLayout(obj));
    });

    function createProjectLayout(obj) {
        return `<div>
            <hr>
            <h3>${obj['Title']}</h3>
            ${obj['Description'].replaceAll("{root}", utils.getProjectRoot()).split("\n").map(str => `<p>${str}</p>`)}
        </div>`
    }
}