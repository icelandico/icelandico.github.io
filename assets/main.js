var contactsContainer = document.getElementById('contacts');
var firstNameInput = document.querySelector('#input-first-name');
var lastNameInput = document.querySelector('#input-last-name');
var phoneInput = document.querySelector('#input-phone');
var mailInput = document.querySelector('#input-mail');
var addContactButton = document.querySelector('.add-contact');

addContactButton.addEventListener('click', addContact);

syncContacts();

function getContacts() {
  return fetch (
    'http://localhost:3000/contacts'
  ).then(
    function (response) {
      return response.json()
    }
  )
}

function syncContacts() {
  getContacts().then(displayContacts)
}

function displayContacts(contacts) {
  contactsContainer.innerHTML = '';
  contacts.forEach(function (contact) {
    createContactStructure(contact)
  })
}

function createContactStructure(contact) {
  var contactElement = document.createElement('li');
  var name = document.createElement('h1');
  var phoneNumber = document.createElement('p');
  var email = document.createElement('p');
  name.innerHTML = contact.firstName + ' ' + contact.lastName;
  phoneNumber.innerHTML = contact.phoneNumber;
  email.innerHTML = contact.email;
  contactElement.append(name);
  contactElement.append(phoneNumber);
  contactElement.append(email);
  contactsContainer.append(contactElement)
}

function addContact() {
  var contact = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    phoneNumber: phoneInput.value,
    email: mailInput.value
  };

  fetch(
    'http://localhost:3000/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function () {
      syncContacts()
  })
}