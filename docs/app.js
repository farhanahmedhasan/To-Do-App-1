//Selecting The DOM Elements
const clear = document.querySelector('.clear')
const date = document.getElementById('date')
const list = document.getElementById('list')
const input = document.getElementById('input')

//Classes Name 
const CHECK = 'fa-check-circle'
const UNCHECK = 'fa-circle'
const LINE_THROUGH = 'lineThrough'

//Showing Todays Date
const today = new Date()
const options = {weekday: 'long', month:'long', day:'numeric'}
date.innerHTML = today.toLocaleDateString('en-US', options)

//Variables
let List;
let id;

//Dealing With Local Storage							   
//Get Item From Local Storage
let data = localStorage.getItem('TODO')

//Check if data is empty or not
if (data) {
	List = JSON.parse(data)
	id = List.length //Set the id to the last one in the list
	loadList(List) //This Function Fires When User Clicks on The Refresh Icon
}
else {
	List = []; //User using or app for first time
	id = 0;
}

//Load List To the user interface from local storage
function loadList(array) {
	array.forEach(item => {
		addToDo(item.name,item.id,item.done,item.trash)
	});
}

//Clear The Local Storage
clear.addEventListener('click', () => {
	localStorage.clear()
	location.reload()
})

//Add a ToDo Function This function will add a toDo
function addToDo(todo,id,done,trash) {
	if(trash){return}
	const DONE = done ? CHECK : UNCHECK //Check if a toDo is completed or not
	const LINE = done ? LINE_THROUGH : "";
	const item = `
		<li class="item">
			<i class="far ${DONE} complete" id="${id}" job="complete"></i>
			<p class="text ${LINE}">${todo}</p>
			<i class="fas fa-trash delete" id="${id}" job="delete"></i>
		</li>
	`
	const position = 'beforeend';
	list.insertAdjacentHTML(position,item)
}

//Add an item to the list when user hits enter Key
document.addEventListener('keyup', (key) => {
	if (key.keyCode == 13) {
		const todo = input.value
		if (todo) { //(If input isn't empty)
			addToDo(todo,id,false,false)
			List.push({ //Storing to our array
				name: todo,
				id: id,
				done: false,
				trash: false
			})
			//Add item to Local Storage (we have to put this code where we updated our array)
			localStorage.setItem('TODO',JSON.stringify(List))
			id++
		}
		input.value=''
	}
})

//Target The Items Inside List Class
list.addEventListener('click', (event) => {
	const element = event.target // Returns the click element inside the list class
	const elementJob = element.attributes.job.value //This will return job value either complete or delete

	if (elementJob == 'complete') {
		completeToDo(element) //This Function will fire when user clicks circle icon
	}
	else if (elementJob == 'delete'){
		removeToDo(element) //This Function will fire when user clicks trash icon
	}

	//Add item to Local Storage (we have to put this code where we updated our array)
	localStorage.setItem('TODO',JSON.stringify(List))
})

//Function to Check Or Uncheck a toDo icon upon user clicks
function completeToDo(element) {
	element.classList.toggle(CHECK)
	element.classList.toggle(UNCHECK)
	element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH)

	List[element.id].done = List[element.id].done ? false:true //Update the array done value if a todo is complete
}

//Function to Delete A todo
function removeToDo(element) {
	element.parentNode.parentNode.removeChild(element.parentNode)
	List[element.id].trash = true //Update the array trash value if a todo is removed
}