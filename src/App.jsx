import { useEffect, useState } from 'react'
import axios from 'axios';


function App() {
  const api_key = "API-cb40e06ec2cea8be26e638e981ae8c1804b41742";

  const [name, setName] = useState("");
  const [me, setMe] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [messages, setMessages] = useState([]);

  const [senders, setSenders] = useState([]);

  const [writingMessage, setWritingMessage] = useState("");


  useEffect(() => {
    async function load_messages(){
      const messages = await axios.get("http://localhost/ultime-test/api/content/items/messages");
      setMessages(messages.data);
      const senders = await axios.get("http://localhost/ultime-test/api/content/items/senders");
      setSenders(senders.data);
    }
    load_messages();
  }, []);

  const disconnect = (e) => {
    e.preventDefault();
    setMe({});
    setIsLoggedIn(false);
  }

  const connect = async (e) => {
    e.preventDefault();

    try{
      const result = await axios.get(`http://localhost/ultime-test/api/content/items/senders?filter={ \"sender\": \"${name}\"}`)
      let me;
      if(result.data.length != 0){
        me = result.data[0];
      }
      else{
        
        const createdSender = await axios.post(`http://localhost/ultime-test/api/content/item/senders`, {
          "data":
              {
              "sender": name,
              "_state": 1
          }
        },{headers: {
          "api-key": api_key
        }});
        me = createdSender.data;
      }
      setMe(me);
      setSenders([...senders, me]);
      setIsLoggedIn(true)

    }catch(e){
      console.log(e);
      alert("Une erreur réseau est survenue");
    }
  }
  
  const sendMessage = async (e) => {
    e.preventDefault();
    
    const sentMessage = await axios.post(`http://localhost/ultime-test/api/content/item/messages`, {
      "data":
      {
        "sender": {
          "_model": "senders",
          "_id": me._id
      },
      "message": writingMessage,
      "_state": 1
      }
    },{headers: {
      "api-key": api_key
    }});

    setMessages([...messages, sentMessage.data]);

    setWritingMessage("");
  }

  return (
    <div className='min-h-dvh max-w-screen-md m-auto'>
      <nav className="bg-slate-500 p-4 text-center font-bold text-white">
        {isLoggedIn ?<h1>{name}</h1> :  <></> }
        <h1 className="text-2xl ">On cause ?</h1>
        {isLoggedIn ?
        <form onSubmit={(e) => sendMessage(e)} className='flex flex-col'>
          <textarea className='text-black' value={writingMessage} onChange={(e) => setWritingMessage(e.target.value)} ></textarea>
          <button type="submit" className='button'>Envoyer</button>
        </form> :  <></> }
      </nav>
      <main className='block min-h-full'>
        {
        !isLoggedIn ? 
        <form onSubmit={connect} className='flex items-center flex-col h-80 p-8'>
          <input type='text' className='border-2 rounded-md border-gray-500' value={name} onChange={(e) => setName(e.target.value)} placeholder='Votre pseudo' />
          <button type="submit" className='button'>Envoyer</button>
        </form> : 
        <div className="flex flex-col gap-4 items-center">
          <div className='flex flex-col gap-4  overflow-scroll h-80 w-full p-4'>
          {messages.map(
            (mess) => 
            <div key={mess._id} className={
            (me._id == mess.sender._id ? "flex flex-col items-end" : "")}>
              <h3 className='font-bold' dangerouslySetInnerHTML={{__html: senders.find((sender) => sender._id == mess.sender._id).sender}}></h3>
              <p dangerouslySetInnerHTML={{__html: mess.message}}></p>
              <hr className='w-full'></hr>
            </div>)
            }
          </div>
          <button className="button" onClick={(e) => disconnect(e) }>Exit</button>
        </div>
        }
      </main>
      <footer className='bg-slate-500 p-4 text-center text-2xl font-bold text-white' >@Pierre Chalier - 2022</footer>
    </div>
  )
}

export default App
