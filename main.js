// our data
const state = {
    todotasks: [],
    donetasks: []
}

// instead of => { return our_html }
const view = (state) => `
    <header>My to-do list</header>
    <section class="todosection">
        <h1>To-do</h1>
        <ul>
            ${state.todotasks.map(task => `<li id="${task.id}" draggable="true" ondragstart="app.run('dragFromToDoTask', event)">${task.text}</li>`).join("")}
        </ul>
        <div>
            <form onsubmit="app.run('add', this);return false;">
                <input name="task" placeholder="add a task" />
                <button>Add</button>
            </form>
        </div>
    </section>
    <section class="donesection" ondragover="event.preventDefault()" ondrop="app.run('addToDoneTask', event)">
        <h1>Done</h1>
        <ul>
            ${state.donetasks.map(task => `<li id="${task.id}" draggable="true" ondragstart="app.run('dragFromDoneTask', event)">${task.text}</li>`).join("")}
        </ul>
    </section>
    <section class="deletesection" ondragover="event.preventDefault()" ondrop="app.run('deleteTask', event)">
        <h1>Delete</h1>
    </section>
`
// all update func return a state
const update = {
    add: (state, form) => {
        // access data in a form
        const data = new FormData(form)
        const task = {
            id: window.crypto.getRandomValues(new Uint8Array(3)).join(""),
            text: data.get('task'),
            status: 0
        }
        state.todotasks.push(task)
        return state
    },
    dragFromToDoTask: (state, event) => {
        event.dataTransfer.setData('text', event.target.id)
        return state
    },
    addToDoneTask: (state, event) => {
        const id = event.dataTransfer.getData('text')
        const index = state.todotasks.findIndex(task => task.id == id)
        const task = state.todotasks.find(task => task.id == id)
        state.todotasks.splice(index, 1)
        state.donetasks.push(task)
        return state
    },
    dragFromDoneTask: (state, event) => {
        event.dataTransfer.setData('text', event.target.id)
        return state
    },
    deleteTask: (state, event) => {
        const id = event.dataTransfer.getData('text')
        const index = state.donetasks.findIndex(task => task.id == id)
        state.donetasks.splice(index, 1)
        return state
    }
}

app.start('todoApp', state, view, update)
