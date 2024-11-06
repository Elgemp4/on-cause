import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Message from './Message';
import NavBar from './Nav';


function App() {
  const api_key = "API-cb40e06ec2cea8be26e638e981ae8c1804b41742";

  const [name, setName] = useState("");
  const [me, setMe] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [messages, setMessages] = useState([]);

  const [senders, setSenders] = useState([]);

  const [writingMessage, setWritingMessage] = useState("");

  const scrollbar = useRef(null);

  useEffect(() => {
    async function load_messages(){ //Chargement des données au login
      const messages = await axios.get("http://localhost/ultime-test/api/content/items/messages");
      setLimitedMessages(messages.data);
      const senders = await axios.get("http://localhost/ultime-test/api/content/items/senders");
      setSenders(senders.data);
    }
    load_messages();

    if(scrollbar.current != null)
      scrollbar.current.scrollTop = scrollbar.current.scrollHeight
  }, [scrollbar.current]);


  const setLimitedMessages = (messages) => { //Défini la liste de message en ne prenant que les 15 derniers
    if(messages.length > 15){
      messages = messages.splice(-15, Infinity);
    }
    setMessages(messages);
  }

  const disconnect = (e) => { //Déconnecte l'utilisateur
    e.preventDefault();
    setMe({});
    setIsLoggedIn(false);
  }

  const connect = async (e) => {
    e.preventDefault();

    try{
      const result = await axios.get(`http://localhost/ultime-test/api/content/items/senders?filter={ \"sender\": \"${name}\"}`)
      let me;
      if(result.data.length != 0){ //Si le sender existe
        me = result.data[0];
      }
      else{ //Si le sender n'existe pas alors le créer
        
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

      setMe(me); //Définir mon identité
      setSenders([...senders, me]); //M'ajouter à la liste des senders
      setIsLoggedIn(true) //Définir que je suis connecté

    }catch(e){
      alert("Une erreur réseau est survenue");
    }
  }
  
  const sendMessage = async (e) => {
    e.preventDefault();
    
    //Envoyer le message
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

    //Prendre les 15 derniers message et vider le champs au dessus
    setLimitedMessages([...messages, sentMessage.data]);
    setWritingMessage("");
  }

  return (
    <div className='content'>
      <NavBar name={name} setWritingMessage={setWritingMessage} writingMessage={writingMessage} isLoggedIn={isLoggedIn} sendMessage={sendMessage} />
      <main className='page-main'>
        {
        !isLoggedIn ? 
        <form onSubmit={connect} className='connection'>
          <input required type='text' className='input' value={name} onChange={(e) => setName(e.target.value)} placeholder='Votre pseudo' />
          <button type="submit" className='button'>Envoyer</button>
        </form> : 
        <div className="message-page">
          <div className='message-container' ref={scrollbar}>
          {messages.map((mess) => <Message key={mess._id} message={mess} me={me} senders={senders}/>)}
          </div>
          <button className="button button-red" onClick={(e) => disconnect(e) }>Exit</button>
        </div>
        }
      </main>
      <footer className='footer' >@Pierre Chalier - 2022</footer>
    </div>
  )
}

export default App
