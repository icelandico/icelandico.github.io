var contactsContainer = document.getElementById('contacts');

syncContacts()

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