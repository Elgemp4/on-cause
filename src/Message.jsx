


export default function Message({message, me, senders}) {
    const getName = () => {
        return senders.find((sender) => sender._id == message.sender._id).sender;
    }

    const isTargetedAtMe = () => {
        const searched = `@${me.sender.toLowerCase()}`;
        
        return message.message.toLowerCase().indexOf(searched) != -1; //Renvoie si on me mentionne
    }
    
    return <>
        <div key={message._id} className={"message " + (me._id == message.sender._id ? "message-personal " : " ") + (isTargetedAtMe() ? "message-targeted" : " ")}>
              <h3 className='font-bold' dangerouslySetInnerHTML={{__html: getName()}}></h3>
              <p dangerouslySetInnerHTML={{__html: message.message.replace(`@${me.sender.toLowerCase()}`, me.sender)}}></p>
        </div>
        <hr className='w-full'></hr>
    </>
}