import { getContactInfo, getBannerElement, highlightBanner } from './utils.js'

window.onload = () => {
    loadContacts();
    loadBanner();
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