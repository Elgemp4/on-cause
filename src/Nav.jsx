export default function NavBar({name, writingMessage, setWritingMessage, isLoggedIn, sendMessage}){
    return <>
        <nav className="bg-slate-500 p-4 text-center font-bold text-white py-5">
        {isLoggedIn ?
            <h4 className="text-slate-400">Connecté en tant que : {name}</h4> :  
            <></>}
        <h1 className="text-2xl mb-2">On cause ?</h1>
        {isLoggedIn ?
            <form onSubmit={(e) => sendMessage(e)} className='flex flex-col'>
                <textarea required className='message-input' value={writingMessage} onChange={(e) => setWritingMessage(e.target.value)} ></textarea>
                <button type="submit" className='button'>Envoyer</button>
            </form> :  
            <></> }
  </nav>
  </>
}