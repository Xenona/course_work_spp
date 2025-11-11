import type { BoardInMenu } from '../Api'
import './index.css'

const root = document.createElement('root')
root.classList.add('root')
document.body.append(root)

const boardList = document.createElement('div')
boardList.classList.add('boardList')
root.append(boardList)

function createEntryEl(entry: BoardInMenu) {
  const root = document.createElement('a')
  root.href = `/boards/${entry.uuid}`
  root.classList.add('boardEntry')

  const title = document.createElement('h1')
  title.textContent = entry.name
  root.append(title)

  const uuidInfo = document.createElement('h2')
  uuidInfo.textContent = entry.uuid
  root.append(uuidInfo)

  return root
}

async function refreshBoards() {
  const res: BoardInMenu[] = await (await fetch('/api/boards')).json()
  boardList.replaceChildren(...res.map(createEntryEl))

  // setTimeout(() => refreshBoards(), 1000)
}

refreshBoards()

const createField = document.createElement('div')
createField.classList.add('createField')
const createInput = document.createElement('input')
const createBtn = document.createElement('button')
createBtn.textContent = 'NEW'
createField.append(createInput)
createField.append(createBtn)

root.append(createField)

async function createNewBoard() {
  const name = createInput.value
  if (name.length == 0) return

  const newB = await fetch('/api/boards', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  const { uuid } = await newB.json()
  window.location.href = `/boards/${uuid}`
}

createBtn.addEventListener('click', () => createNewBoard())
