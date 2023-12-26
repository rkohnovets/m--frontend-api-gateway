import type { Message } from '../../../Types/ChatTypes.tsx'

const OtherUserMessageBlock = (message: Message) => {
    return (
        <div className='px-2 py-1 m-2 mr-auto bg-indigo-400 p-1 rounded-lg w-fit max-w-2xl'>
            <p className='text-left'>
                {message.text}
            </p>
        </div>
    )
}
export default OtherUserMessageBlock