import { getContactInfo, getBannerElement, highlightBanner, getAboutMeInfo, changeTitle } from './utils.js'

window.onload = () => {
    loadContacts();
    loadBanner();
    changeName();
    changeTitle();
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

async function changeName() {
    await getAboutMeInfo().then(data => {
        const firstName = data["FirstName"];

        document.querySelector('h1').innerHTML = `${firstName} Bentley`;
        document.querySelector('p').innerHTML = `${data['Description']}`.replace("firstName", firstName);
    });
}