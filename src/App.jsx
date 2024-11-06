import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  const [name, setName] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  
  const connect = (e) => {
    e.preventDefault();
    setIsLoggedIn(true)
  }
  
  console.log("Name : " + name);
  return (
    <div className='min-h-dvh'>
      <nav className="bg-slate-500 p-4 text-center text-2xl font-bold text-white">
        {!isLoggedIn ? <></> : <h1>{name}</h1>}
        <h1>On cause ?</h1>
      </nav>
      <main className='h-full'>
        {
        !isLoggedIn ? 
        <form onSubmit={connect} className='flex justify-end items-center flex-col'>
          <input type='text' className='border-2 rounded-md border-gray-500' value={name} onChange={(e) => setName(e.target.value)} placeholder='Votre pseudo' />
          <button type="submit" className='bg-red-500'>Envoyer</button>
        </form> : 
        <div>
          
        </div>
        }
      </main>
      <footer className='bg-slate-500 p-4 text-center text-2xl font-bold text-white' >@Pierre Chalier - 2022</footer>
    </div>
  )
}

export default App
