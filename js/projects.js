import { getContactInfo, getBannerElement, highlightBanner, changeTitle } from './utils.js'
let projects = [];
let toolsFilters = [];
let librariesFilters = [];
let languagesFilters = [];
let validProjects = [];

window.onload = () => {
    loadProjects();
    loadContacts();
    loadBanner();
    changeTitle();
}

class Project {
    constructor({ hasHR, title, startDate, endDate, tools, libraries, languages, links, image, description }) {
        this.hasHR = hasHR;
        this.title = title;
        this.startDate = new Date(`${startDate.split(' ')[0]} 1, ${startDate.split(' ')[1]} 00:00:00`);
        this.endDate = new Date(`${endDate.split(' ')[0]} 1, ${endDate.split(' ')[1]} 00:00:00`);
        this.tools = tools;
        this.libraries = libraries;
        this.languages = languages;
        this.links = links;
        this.image = image;
        this.description = description;
    }

    getProjectTimeFrame() {
        const startDate = this.getDate(this.startDate);
        const endDate = this.getDate(this.endDate);

        if (startDate === endDate)
            return startDate;
        return `${startDate} - ${endDate}`
    }

    getDate(date) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    getToolLibrariesLanguages() {
        return `<p class="tools"><b>Languages/Libraries/Tools:</b> ${this.languages.concat(this.libraries).concat(this.tools).join(", ")}</p>`
    }

    getDescription() {
        return `${this.description.split('\n').map(d => `<p>${d}</p>`).join("")}`;
    }
    getLinks() {
        const arr = this.links.map(link => { return `<a href="${link['Link']}" target="_blank">${link['Name']}</a>` });
        return `<div class="project-links"><span>${arr.join(" | ")}</span></div>`
    }

    getImage() {
        const src = this.image['src'];
        const alt = this.image['alt'];

        if (!src || !alt)
            return `<img src="img/WIP.png" alt="This is a work in progress">`;
        return `<img src="${src}" alt="${alt}">`;
    }

}

async function loadBanner() {
    await getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html });

    let dropDown = document.querySelector(".dropdown");
    highlightBanner(dropDown);
}

async function loadProjects() {
    await fetch("./jsons/projects.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            projects = data['Projects'].map(p => new Project({ hasHR: true, title: p['Title'], startDate: p['Start Date'], endDate: p['End Date'], tools: p['Tools'], libraries: p['Libraries'], languages: p['Languages'], image: p['Image'], description: p['Description'], links: p['Links'] }))
            const html = projects.map((p, ix) => createProjectLayout(p, ix % 2 == 0 ? "flex" : "flex-reverse"));
            
            getAllTools();
            getAllLibraries();
            getAllLanguages();
            console.log(toolsFilters)
            console.log(librariesFilters)
            console.log(languagesFilters)


            document.querySelector("#projects").innerHTML = `<div class="project">${html.join("")}</div>`;

            
        });

    function createProjectLayout(project, flexClass) {
        let html = "";
        if (project.hasHR)
            html += "<hr>";
        const wordSpan = `<span><h2>${project.title}</h2><h4>${project.getProjectTimeFrame()}</h4>${project.getToolLibrariesLanguages()}${project.getDescription()}${project.getLinks()}</span>`;
        html += `<div class="${flexClass}"> ${wordSpan}${project.getImage()}</div>`;
        return html;
    }
}

function getAllTools() {
    const arr = removeDuplicates(projects.flatMap(p => p.tools)).sort();
    const element = document.querySelector("#tools-filter");
    element.innerHTML = "<legend>Tools</legend>" + arr.map(tool => `<div>
                                                <input type="checkbox" id="${tool}" name="${tool}" checked />
                                                <label for="${tool}">${tool}</label>
                                            </div>`).join("");
    toolsFilters = arr.map(l => {return {name: l, checked: true}});

}

function getAllLibraries() {
    const arr = removeDuplicates(projects.flatMap(p => p.libraries)).sort();
    const element = document.querySelector("#libraries-filter");
    element.innerHTML = "<legend>Libraries</legend>" + arr.map(library => `<div>
                                                <input type="checkbox" id="${library}" name="${library}" checked />
                                                <label for="${library}">${library}</label>
                                            </div>`).join("");
    librariesFilters = arr.map(l => {return {name: l, checked: true}});
}

function getAllLanguages() {
    const arr = removeDuplicates(projects.flatMap(p => p.languages)).sort();
    const element = document.querySelector("#languages-filter");
    element.innerHTML = "<legend>Languages</legend>" + arr.map(language => `<div>
                                                <input type="checkbox" id="${language}" name="${language}" checked />
                                                <label for="${language}">${language}</label>
                                            </div>`).join("");
    languagesFilters = arr.map(l => {return {name: l, checked: true}});
}

function removeDuplicates(arr) {
    return arr.filter((value, ix) => arr.indexOf(value) === ix && value)
}

async function loadContacts() {
    getContactInfo().
        then(data =>
            document.querySelector("#contactLinks").innerHTML = data);
}