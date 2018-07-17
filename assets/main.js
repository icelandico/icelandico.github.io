var contactsContainer = document.getElementById('contacts');
var firstNameInput = document.querySelector('#first-name');
var lastNameInput = document.querySelector('#last-name');
var phoneInput = document.querySelector('#phone');
var mailInput = document.querySelector('#mail');
var addContactButton = document.querySelector('.add-contact');

syncContacts();

addContactButton.addEventListener('click', addContact);

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
  contacts.sort(sortContacts);
  contacts.forEach(function (contact) {
    createContactStructure(contact)
  })
}

function createContactStructure(contact) {
  var contactElement = document.createElement('li');
  var name = document.createElement('h1');
  var phoneNumber = document.createElement('p');
  var email = document.createElement('p');
  var deleteContactButton = document.createElement('button');
  deleteContactButton.classList.add('delete-single-contact');
  deleteContactButton.innerHTML = 'Remove contact';
  deleteContactButton.addEventListener('click', function() {
    removeContact(contact.id)
  });
  name.innerHTML = contact.firstName + ' ' + contact.lastName;
  phoneNumber.innerHTML = contact.phoneNumber;
  email.innerHTML = contact.email;
  contactElement.append(name);
  contactElement.append(phoneNumber);
  contactElement.append(email);
  contactElement.append(deleteContactButton);
  contactsContainer.append(contactElement)
}

function addContact() {
  var contact = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    phoneNumber: phoneInput.value,
    email: mailInput.value
  };
  clearInputValues();
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

function removeContact(id) {
  fetch(
    'http://localhost:3000/contacts/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function () {
    syncContacts()
  })
}

function clearInputValues() {
  var menuInputsValue = Array.from(document.querySelectorAll('.menu-input'));
  menuInputsValue.forEach(input => input.value = '')
}

function sortContacts(contactA, contactB) {
  if (contactA.firstName < contactB.firstName) {
    return -1;
  } else if (contactA.firstName > contactB.firstName) {
    return 1;
  }
  return 0;
}