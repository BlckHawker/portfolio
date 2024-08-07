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
                html += createProjectLayout(project, divClass, true);
            }

            document.querySelector("#projects").innerHTML += `<div class="project">${html}</div>`;
            
        });

    function createProjectLayout(projectData, flexClass, haveHR) {
        let html = "";
        if (haveHR)
            html += "<hr>";
        const wordSpan = `<span><h2>${projectData['Title']}</h2><h4>${projectData['Date']}</h4>${getTools(projectData)}${getDescription(projectData)}${getLinks(projectData)}</span>`;
        
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
        return `<p class="tools"><b>Languages/Libraries/Tools:</b> ${projectData['Tools'].join(", ")}</p>`
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