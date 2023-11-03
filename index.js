//Cohort API address (used default from link) and specific cohort (default from link) I am posting/pulling API data to and from. 
const COHORT = "2109-CPU-RM-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const state = {
  events: [],
};

//Refence constants for HTML fields
const eventList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

 //Sync state with async and render
async function render() {
  await getEvents();
  renderEvents();
}
render();

//Get events information from API
async function getEvents() {
  try {
    const response = await fetch(API_URL);
   if (!response.ok) {
    throw new Error("Failed to fetch events");
   }
    
    const data = await response.json();
    state.events = data.data;
  } catch (error) {
    console.error(error);
  }
}
//Render events in list format with CSS formatting, also includes addition of delete button in list
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }
  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.description}</p>
      <p>${event.location}</p>
      <p>${event.date}</p>
      <button class="delete-button" data-event-id="${event.id}">Delete</button>
    `;
    return li;
  });
  eventList.replaceChildren(...eventCards);
}

//Event listener for delete button
eventList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
      const eventId = event.target.getAttribute("data-event-id");
      deleteEvent(eventId);
    }
  });
/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addEvent(event) {
  event.preventDefault();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        location: addEventForm.location.value,
        date: addEventForm.date.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}
//Delete function for event API data
async function deleteEvent(eventId) {
    try {
      const response = await fetch(API_URL + `/${eventId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Event successfully deleted, update the UI or throw error if failed
        render();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error(error);
    }
  }