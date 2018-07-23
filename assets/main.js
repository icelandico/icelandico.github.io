var contactsContainer = document.getElementById('contacts');
var firstNameInput = document.querySelector('#first-name');
var lastNameInput = document.querySelector('#last-name');
var mailInput = document.querySelector('#mail');
var addContactButton = document.querySelector('.add-contact');
var phoneInput = document.querySelector('#phone');
var emailInput = document.querySelector('#mail');
var removeSelectedContactsButton = document.querySelector('.remove-contact');

syncContacts();

addContactButton.addEventListener('click', validateAddedContact);
phoneInput.addEventListener('focusout', function() {
  validatePhone(phoneInput.value)
});
emailInput.addEventListener('focusout', function() {
  validateMail(emailInput.value)
});

removeSelectedContactsButton.addEventListener('click', function() {
  var selectedContacts = document.querySelectorAll('.checkbox:checked');
  selectedContacts.forEach(function (selectedItem) {
    var contactId = selectedItem.getAttribute('id');
    removeContact(contactId)
  })
});

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
  });
}

function createContactStructure(contact) {
  var contactElement = document.createElement('li');
  var deleteCheckbox = document.createElement('input');
  deleteCheckbox.type = 'checkbox';
  deleteCheckbox.classList.add('checkbox');
  deleteCheckbox.title = 'Select to remove';
  deleteCheckbox.id = contact.id;
  var name = document.createElement('h1');
  var phoneNumber = document.createElement('p');
  var email = document.createElement('p');
  var deleteContactButton = document.createElement('button');
  var editContactButton = document.createElement('button');
  contactElement.id = contact.id;
  putTextInNode(name, phoneNumber, email, contact);
  createDeleteContactButton(deleteContactButton, contact);
  createEditContactButton(editContactButton, contact, contactElement);
  contactElement.append(name);
  contactElement.append(phoneNumber);
  contactElement.append(email);
  contactElement.append(deleteContactButton);
  contactElement.append(editContactButton);
  contactElement.append(deleteCheckbox);
  contactsContainer.append(contactElement)
}

function putTextInNode(name, phone, mail, contact) {
  name.innerHTML = contact.firstName + ' ' + contact.lastName;
  phone.innerHTML = contact.phoneNumber;
  mail.innerHTML = contact.email;
}

function createDeleteContactButton(button, contact) {
 button.classList.add('delete-single-contact');
 button.classList.add('edit-button');
 button.innerHTML = 'Remove';
 button.addEventListener('click', function() {
    removeContact(contact.id)
  });
}

function createEditContactButton(button, contact, parentNode) {
  button.classList.add('edit-single-contact');
  button.classList.add('edit-button');
  button.innerHTML = 'Edit';
  button.addEventListener('click', function() {
    var editPanelDiv = document.querySelector('.contact-edit');
    if (!document.body.contains(editPanelDiv)) {
      createEditContactForm(contact)
    } else {
      parentNode.removeChild(editPanelDiv)
    }
  })
}

function createEditContactForm(contact) {
  var editForm = document.createElement('div');
  var listItem = document.getElementById(contact.id);
  editForm.classList.add('contact-edit');
  createEditFormInputs(editForm, contact);
  listItem.append(editForm);
  return editForm
}

function createEditFormInputs(parentNode, contact) {
  var saveButton = document.createElement('button');
  saveButton.innerHTML = 'Save edits';
  saveButton.classList.add('edit-button');
  saveButton.classList.add('save-button');
  var inputFirstName = document.createElement('input');
  inputFirstName.value = contact.firstName;
  inputFirstName.classList.add('edit-input');
  var inputLastName = document.createElement('input');
  inputLastName.value = contact.lastName;
  inputLastName.classList.add('edit-input');
  var inputPhone = document.createElement('input');
  inputPhone.value = contact.phoneNumber;
  inputPhone.classList.add('edit-input');
  var inputMail = document.createElement('input');
  inputMail.value = contact.email;
  inputMail.classList.add('edit-input');
  parentNode.append(inputFirstName);
  parentNode.append(inputLastName);
  parentNode.append(inputPhone);
  parentNode.append(inputMail);
  parentNode.append(saveButton);
  inputPhone.addEventListener('focusout', function() {
    validatePhone(inputPhone.value)
  });
  inputMail.addEventListener('focusout', function() {
    validateMail(inputMail.value)
  });
  saveButton.addEventListener('click', function() {
    if (!validateEditedContact()) {
      updateContact(contact.id, inputFirstName.value, inputLastName.value, inputPhone.value, inputMail.value)
    } else {
      alert('Fill all fields and check them to edit contact!')
    }
  });
}

function updateContact(contactId, firstName, lastName, phone, mail) {
  var updatedContact = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phone,
    email: mail
  };
  fetch(
    'http://localhost:3000/contacts/' + contactId, {
      method: 'PATCH',
      body: JSON.stringify(updatedContact),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(syncContacts)
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

function validateAddedContact() {
  var inputs = Array.from(document.querySelectorAll('.menu-input'));
  var inputsValues = inputs.map(input => input.value);
  var everyAreFilled = function(input) {
    return input === '';
  };
  if (inputsValues.some(everyAreFilled)) {
    alert('Fill all fields!')
  } else {
    addContact();
  }
}

function validateEditedContact() {
  var editInputs = Array.from(document.querySelectorAll('.edit-input'));
  var editInputsValues = editInputs.map(input => input.value);
  var everyAreFilled = function(input) {
    return input === '';
  };
  return editInputsValues.some(everyAreFilled)
}

function validatePhone(phoneInput) {
  var numberValidCharacters = new RegExp(/^\d{9}$/g);
  if (phoneInput.match(numberValidCharacters)) {
    return true
  } else if (phoneInput === '') {
    return true
  } else {
    alert('Phone number need to to have 9 digits and no spaces!');
    return true
  }
}

function validateMail(mailInput) {
  var emailValidCharacters = new RegExp(/[a-z0-9._]+@[a-z0-9.-]+\.[a-z]/gi);
  if (mailInput.match(emailValidCharacters)) {
    return true
  } else if (mailInput === '') {
      return true
  } else {
      alert ('Enter a valid email address!');
      return true
  }
}
