import { getContactInfo, getBannerElement, highlightBanner, changeTitle } from './utils.js'
let projects = [];
let filters = [];
let validProjects = []; //projects that match the filter

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
            getFilters('tools');
            getFilters('libraries');
            getFilters('languages');
            localStorage.setItem("filters", JSON.stringify(filters));
            getValidProjects();
        });
}

function createProjectLayout(project, flexClass) {
    let html = "";
    if (project.hasHR)
        html += "<hr>";
    const wordSpan = `<span><h2>${project.title}</h2><h4>${project.getProjectTimeFrame()}</h4>${project.getToolLibrariesLanguages()}${project.getDescription()}${project.getLinks()}</span>`;
    html += `<div class="${flexClass}"> ${wordSpan}${project.getImage()}</div>`;
    return html;
}

function getFilters(filterType) {
    let localStorageFilters = JSON.parse(localStorage.getItem("filters") || "[]").filter(filter => filter.type === filterType);
    let targetedFilters = [];
    const filterNames = removeDuplicates(projects.flatMap(project => {
        switch (filterType) {
            case 'tools':
                return project.tools;
            case 'languages':
                return project.languages;
            case 'libraries':
                return project.libraries;
        }
    })).sort();

    if (localStorageFilters.length == 0) {
        targetedFilters = filterNames.map(name => { return { name, checked: true, type: filterType } });
    }

    else {
        //check if new filters have been added
        targetedFilters = filterNames.map(name => {
            for (const tool of localStorageFilters) {
                if (tool.name == name) {
                    return { name, checked: tool.checked, type: filterType };
                }
            }
            return { name, checked: true, type: filterType };
        });

    }

    const element = document.querySelector(`#${filterType}-filter`);
    const legend = document.createElement('legend');
    legend.innerHTML = filterType.charAt(0).toUpperCase() + filterType.slice(1);
    element.appendChild(legend);
    targetedFilters.forEach(filter => {
        const div = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.onclick = checkboxClick;
        checkbox.type = "checkbox";
        checkbox.name = filter.name;
        checkbox.value = filter.name;
        checkbox.dataset['type'] = filterType;
        checkbox.id = filter.name;
        checkbox.checked = filter.checked;
        const label = document.createElement('label')
        label.htmlFor = filter.name;
        label.appendChild(document.createTextNode(filter.name));
        div.appendChild(checkbox);
        div.appendChild(label);
        element.appendChild(div);
    });

    filters = filters.concat(targetedFilters);
}

function getValidProjects() {
    validProjects = [];
    for (const project of projects) {
        for (const filter of filters) {
            if (!filter.checked)
                continue;
            let applicableProject = false;
            switch (filter.type) {
                case 'tools':
                    applicableProject = project.tools.includes(filter.name);
                    break;
                case 'languages':
                    applicableProject = project.languages.includes(filter.name);
                    break;
                case 'libraries':
                    applicableProject = project.libraries.includes(filter.name);
                    break;
            }
            if (applicableProject) {
                validProjects.push(project);
                break;
            }
        }
    }

    document.querySelector("#results").innerHTML = `Showing ${validProjects.length} out of ${projects.length} projects`;
    console.log(validProjects);
    const html = validProjects.map((p, ix) => createProjectLayout(p, ix % 2 == 0 ? "flex" : "flex-reverse"));
    document.querySelector("#projects").innerHTML = `<div class="project">${html.join("")}</div>`;
}

function checkboxClick(e) {
    filters.find(filter => filter.name === e.target.name).checked = e.target.checked;
    localStorage.setItem("filters", JSON.stringify(filters));
    getValidProjects();
}

function removeDuplicates(arr) {
    return arr.filter((value, ix) => arr.indexOf(value) === ix && value)
}

async function loadContacts() {
    getContactInfo().
        then(data =>
            document.querySelector("#contactLinks").innerHTML = data);
}