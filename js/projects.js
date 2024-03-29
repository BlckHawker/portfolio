import { getContactInfo, getBannerElement, highlightBanner, changeTitle } from './utils.js'

window.onload = () => {
    loadProjects();
    loadContacts();
    loadBanner();
    changeTitle();
}

async function loadBanner() {
    await getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html} );

    let dropDown = document.querySelector(".dropdown");
    highlightBanner(dropDown);
}

async function loadProjects() {
    await fetch("./jsons/projects.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const jsonData = data['Projects'];

            let html = "";
            for (let i = 0; i < jsonData.length; i++) {
                const divClass = i % 2 == 0 ? "flex" : "flex-reverse";
                const project = jsonData[i];
                html += createProjectLayout(project, divClass, 2, 4, true);
            }

            document.querySelector("#projects").innerHTML += `<div class="project">${html}</div>`;
        });

    function createProjectLayout(projectData, flexClass, titleHeaderNum, dateHeaderNum, haveHR) {
        let html = "";
        if (haveHR)
            html += "<hr>";
        const titleHeaderElement = `h${titleHeaderNum}`;
        const dateHeaderElement = `h${dateHeaderNum}`;

        html += `<${titleHeaderElement}>${projectData['Title']}</${titleHeaderElement}>`;
        html += `<${dateHeaderElement}>${projectData['Date']}</${dateHeaderElement}>`
        const wordSpan = `<span>` + getLanguages(projectData) + getTools(projectData) + getDescription(projectData) + getLinks(projectData) + `</span>`;
       
        
        html += `<div class="${flexClass}"> ${wordSpan}`;

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
        return `${projectData['Description'].split('\n').map(d => `<p>${d}</p>`).join("")}`;
    }

    function getLinks(projectData) {
        const arr = projectData['Links'].map(link => { return `<a href="${link['Link']}" target="_blank">${link['Name']}</a>` });
        return`<div class="project-links"><span>${arr.join(" | ")}</span></div>`;
    }


}

async function loadContacts() {
    getContactInfo().
        then(data =>
            document.querySelector("#contactLinks").innerHTML = data);
}