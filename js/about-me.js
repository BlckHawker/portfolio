import utils from "./utils.js";

window.onload = () => {
    loadContacts();
    loadBanner();
    changeName();
    utils.changeTitle();
}

async function loadBanner() {
    await utils.getBannerElement().then(html => { document.querySelector("#banner").innerHTML = html} );
}

async function loadContacts() {
    utils.getContactInfo().
        then(data =>
            document.querySelector("#contactLinks").innerHTML = data);
}

async function changeName() {
    await utils.getAboutMeInfo().then(data => {
        const firstName = data["FirstName"];

        document.querySelector('h1').innerHTML = `${firstName} Bentley`;
        document.querySelector('p').innerHTML = `${data['Description']}`.replace("firstName", firstName);
    });
}