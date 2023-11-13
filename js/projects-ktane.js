import { getContactInfo, getBannerElement } from './utils.js'

window.onload = () => {
    loadProjects();
    loadContacts();
    loadBanner();
}

async function loadProjects() {
    await fetch('./jsons/ktane-projects.json')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        const generalProjects = data['Projects'];
        const lfaNames = data['LFA'];

        //add other projects
        let generalHtml = "";
        for(let i = 0; i < generalProjects.length; i++) {
            generalHtml += createGeneralProjectLayout(generalProjects[i]);
        }

        
        document.querySelector("#projects").innerHTML += `<div class="project">${generalHtml}</div>`;

        //add LFA
        let lfaHtml = "";
        for(let i = 0; i < lfaNames.length; i++){
            lfaHtml += createLFAProject(lfaNames[i]);
        }
        document.querySelector("#lfa").innerHTML += lfaHtml;
    });

    function createLFAProject(name) {
        let html = "";

        html += "<hr>"
        html += `<h3>${name}</h3>`
        html += `<div class="comparison">`
        html += createLFASpan(name, true);
        html += createLFASpan(name, false);
        html += `</div>`
        return html;
    }

    function createLFASpan(name, start) {
        const text = start ? "Before" : "After";
        return `<span class="center-image"><p class="center-text comparison-text">${text}</p><img src="img/LFA/${name}/${text}.png" alt=""></span>`
    }

    function createGeneralProjectLayout(projectData) {
        let html = "";
        html += "<hr>";
        html += `<h2>${projectData['Title']}</h2>`
        html += `<h4>${projectData['Date']}</h4>`

        const wordSpan = `<span>` + getLanguages(projectData) + getTools(projectData) + getDescription(projectData) + getLinks(projectData) + `</span>`;
        html += `<div class="flex"> ${wordSpan}`;

        const image = projectData['Image'];
        const src = image['src']
        const alt = image['alt'];

        if (!src || !alt)
            html += `<img src="img/WIP.png" alt="This is a work in progress">`;
        else
            html += `<img src="${src}" alt="${alt}">`;

        html += "</div>";
        return html;
    }

    function getTools (projectData) {
        return `<p class="tools"><b>Tools:</b> ${projectData['Tools'].join(", ")}</p>`
    }

    function getLanguages(projectData) {
        return `<p class="languages"><b>Languages/Libraries:</b> ${projectData['Languages'].join(", ")}</p>`
    }

    function getDescription(projectData) {
        return `${projectData['Description'].map(d => `<p>${d}</p>`).join("")}`;
    }

    function getLinks(projectData) {
        const arr = projectData['Links'].map(link => { return `<a href="${link['Link']}" target="_blank">${link['Name']}</a>` });
        return arr.join(" | ");
    }
}

async function loadContacts() {
    getContactInfo().
        then(data =>
            document.querySelector("#contactLinks").innerHTML = data);
}

async function loadBanner() {
    getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html} );
}