var contactsContainer = document.getElementById('contacts');
var firstNameInput = document.querySelector('#first-name');
var lastNameInput = document.querySelector('#last-name');
var phoneInput = document.querySelector('#phone');
var mailInput = document.querySelector('#mail');
var addContactButton = document.querySelector('.add-contact');
var inputs = Array.from(document.querySelectorAll('.input-form'));
var contactsVar;

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
  contactsVar = contacts
}

function createContactStructure(contact) {
  var contactElement = document.createElement('li');
  var name = document.createElement('h1');
  var phoneNumber = document.createElement('p');
  var email = document.createElement('p');
  var deleteContactButton = document.createElement('button');
  var editContactButton = document.createElement('button');
  var editPanel = createEditContactForm(contact);
  putTextInNode(name, phoneNumber, email, contact);
  createDeleteContactButton(deleteContactButton, contact);
  createEditContactButton(editContactButton, contact);
  contactElement.append(name);
  contactElement.append(phoneNumber);
  contactElement.append(email);
  contactElement.append(deleteContactButton);
  contactElement.append(editContactButton);
  contactElement.append(editPanel);
  contactsContainer.append(contactElement)
}

function putTextInNode(name, phone, mail, contact) {
  name.innerHTML = contact.firstName + ' ' + contact.lastName;
  phone.innerHTML = contact.phoneNumber;
  mail.innerHTML = contact.email;
}

function createDeleteContactButton(button, contact) {
 button.classList.add('delete-single-contact');
 button.innerHTML = 'Remove contact';
 button.addEventListener('click', function() {
    removeContact(contact.id)
  });
}

function createEditContactButton(button, contact) {
  button.classList.add('edit-single-contact');
  button.innerHTML = 'Edit contact';
  button.addEventListener('click', function() {
    showEditContactForm(contact.id)
  })
}

function createEditContactForm(contact) {
  var editForm = document.createElement('div');
  editForm.classList.add('contact-edit');
  editForm.classList.add('hidden');
  editForm.id = contact.id;
  createEditFormInputs(editForm);
  editForm.append(createSaveEditsOption());
  return editForm
}

function createEditFormInputs(parentNode) {
  inputs.forEach(function (item) {
    var label = document.createElement('label');
    var input = document.createElement('input');
    label.innerText = item.innerText;
    label.appendChild(input);
    parentNode.appendChild(label)
  });
}

function createSaveEditsOption(contact) {
  var saveButton = document.createElement('button');
  saveButton.innerHTML = 'Save edits';
  saveButton.addEventListener('click', function() {
    updateContact(contact.id, firstName, lastName, phone, email)
  });
  return saveButton
}

function showEditContactForm(item) {
  var clickedDiv = document.getElementById(item);
  clickedDiv.classList.toggle('hidden')
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
  if (contactA.lastName < contactB.lastName) {
    return -1;
  } else if (contactA.lastName > contactB.lastName) {
    return 1;
  }
  return 0;
}