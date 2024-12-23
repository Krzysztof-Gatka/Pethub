import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useEffect } from 'react'
import './App.css'

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [count, setCount] = useState(0)
  const [apireload, setapireload] = useState('<dodaj d do /reloa w pethub/backend/index.js>')
  const [msg, setMsg] = useState('<po kliknięciu powinna pojawić się godzina>')
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch(`${apiUrl}/reload`)
    .then(response => response.json())
    .then(data => setapireload(data['data']))
  },[])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Inżynierka Szkielet</h1>
      <h4>Zmień mnie żeby sprawdzić czy przeładowanie frontendu działa poprawnie (pethub/frontend/src/app.tsx)</h4>
      <h4>{apireload}</h4>
      <button onClick={
        () => {
          fetch(`${apiUrl}/now`)
            .then(response => response.json())
            .then(data => setMsg(data["current"]))
        }
        
      }>
          Sprawdź czy API działa poprawnie {msg}
      </button>
      <br />
      <button onClick={
        () => {
          fetch(`${apiUrl}/users`)
          .then(response => response.json())
          .then(data => setUsers(data))
        }
      }>Sprawdź czy baza danych działa poprawnie</button>
      {
        users.length == 0 && <p>po kliknięciu powinna pojawić się lista użytkowników</p>
      }
      {
        users.map((user) => {
          return <h3 key={user['user_id']}>{user['name']}: {user['second_name']}</h3>
      
        })
      }
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
