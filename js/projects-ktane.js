import { getContactInfo, getBannerElement, highlightBanner, changeTitle } from './utils.js'

var carosolIndex;

window.onload = () => {

    carosolIndex = document.querySelector("#carousel-page-num");
    loadProjects();
    loadContacts();
    loadBanner();
    changeTitle();
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
        for(let i = 0; i < lfaNames.length; i++) {
            lfaHtml += createLFAProject(lfaNames[i]);
        }
        document.querySelector("#lfa").innerHTML += lfaHtml;

        //load carosol
        function modulo(number, mod) {
            let result = number % mod;
            if (result < 0) {
              result += mod;
            }
            return result;
          }
          
          function setUpCarousel(carousel) {
            function handleNext() {
              currentSlide = modulo(currentSlide + 1, numSlides);
              changeSlide(currentSlide);
            }
          
            function handlePrevious() {
              currentSlide = modulo(currentSlide - 1, numSlides);
              changeSlide(currentSlide);
            }
          
            function changeSlide(slideNumber) {
              carousel.style.setProperty('--current-slide', slideNumber);
              carosolIndex.innerHTML = `${slideNumber + 1} of ${numSlides}`;
            }
          
            // get elements
            const buttonPrevious = carousel.querySelector('[data-carousel-button-previous]');
            const buttonNext = carousel.querySelector('[data-carousel-button-next]');
            const slidesContainer = carousel.querySelector('[data-carousel-slides-container]');
          
            // carousel state we need to remember
            let currentSlide = 0;
            let numSlides = slidesContainer.children.length;

            // set up events
            buttonPrevious.addEventListener('click', handlePrevious);
            buttonNext.addEventListener('click', handleNext);

            carosolIndex.innerHTML = `1 of ${numSlides}`;
          }
          
          const carousels = document.querySelectorAll('[data-carousel]');
          carousels.forEach(setUpCarousel);
          
    });

    function createLFAProject(name) {
        let html = "";

        //create slides div
        html += `<div class="slide">`

        //create name 
        html += `<h2>${name}</h2>`

        //create comparson div
        html += `<div class="comparison">`

        //create content
        html += createLFASpan(name, true);
        html += createLFASpan(name, false);

        //close comparsion div
        html += `</div>`

        //close slides div
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

async function loadBanner() {
    await getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html} );

    let dropDown = document.querySelector(".dropdown");
    highlightBanner(dropDown);
}