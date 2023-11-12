import { getContactInfo, getBannerElement } from './utils.js'

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
    getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html });
}