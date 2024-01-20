







document.addEventListener('DOMContentLoaded', function() {
  const dogForm = document.getElementById('dog-form');
  const tableBody = document.getElementById('table-body');

  // Function to fetch and render dogs on page load
  function fetchAndRenderDogs() {
    fetch('http://localhost:3000/dogs')
      .then(response => response.json())
      .then(dogs => renderDogs(dogs));
  }

  // Function to render dogs in the table
  function renderDogs(dogs) {
    tableBody.innerHTML = '';
    dogs.forEach(dog => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button data-id="${dog.id}" class="edit-btn">Edit</button></td>
      `;
      tableBody.appendChild(row);
    });

    // Add event listeners to the "Edit" buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
      button.addEventListener('click', () => populateForm(button.dataset.id));
    });
  }

  // Function to populate the form with dog information
  function populateForm(dogId) {
    fetch(`http://localhost:3000/dogs/${dogId}`)
      .then(response => response.json())
      .then(dog => {
        dogForm.elements['name'].value = dog.name;
        dogForm.elements['breed'].value = dog.breed;
        dogForm.elements['sex'].value = dog.sex;
        dogForm.dataset.id = dog.id; // Store the dog id in the form's dataset
      });
  }

  // Event listener for form submission
  dogForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const dogId = dogForm.dataset.id;
    const formData = new FormData(dogForm);
    
    // Make a PATCH request to update the dog information
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.get('name'),
        breed: formData.get('breed'),
        sex: formData.get('sex')
      })
    })
    .then(response => response.json())
    .then(updatedDog => {
      // Fetch and render all dogs to reflect the updated information
      fetchAndRenderDogs();
      // Clear the form after submission
      dogForm.reset();
      // Remove the stored dog id from the form's dataset
      delete dogForm.dataset.id;
    });
  });

  // Fetch and render dogs on page load
  fetchAndRenderDogs();
});
