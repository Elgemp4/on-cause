


export default function Message({message, me, senders}) {
    const getName = () => {
        return senders.find((sender) => sender._id == message.sender._id).sender;
    }

    const isTargetedAtMe = () => {
        return message.message.toLowerCase().indexOf(`@${me.sender.toLowerCase()}`) != -1;
    }
    
    return <>
        <div key={message._id} className={(me._id == message.sender._id ? "flex flex-col items-end " : " ") + (isTargetedAtMe() ? "bg-yellow-300" : " ")}>
              <h3 className='font-bold' dangerouslySetInnerHTML={{__html: getName()}}></h3>
              <p dangerouslySetInnerHTML={{__html: message.message}}></p>
              <hr className='w-full'></hr>
        </div>
    </>
}