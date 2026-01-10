

import Link from 'next/link';


export default function Message({ message }) {

    return (
        <div className=" md:w-10/8 w-screen border pb-4">
            <div className="flex space-x-3 w-full mb">
                <div className="flex w-full mt-2  ">
                    <div>
                        <span className="text-xs font-bold text-gray-500 leading-none px-2">{message.userId}</span>
                        <div className="flex  justify-between  text-white p-3 rounded-l-lg rounded-lg ">
                            <p className="break-word wrap-normal whitespace-pre-line text-sm overflow-hidden text-ellipsis line-clamp-10">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                        {message.isEdited ? (
                            <Link href={`/messages/versions/${message.id}`}>
                                <span className="text-xs hover:underline active:text-gray-300 active:underline text-gray-500 leading-none px-2">
                                    editado
                                </span>
                            </Link>) : null
                        }
                    </div>

                </div>
                <div className="flex items-center space-x-2 ml-auto">
                    {message.canEdit ? (
                        <Link href={`/messages/edit/${message.id}`}>
                            <span className="ml-2 cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 text-gray-500 active:text-gray-300 hover:text-white mb-3"
                                >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                            </span>
                        </Link>
                    ) : null
                    }

                    <Link href={`/messages/${message.id}/comments`} className="px-2">
                        <span className="ml-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="w-4 h-4 cursor-pointer active:text-gray-300 text-gray-500 hover:text-white mt-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.38 8.38 0 0112.5 3a8.5 8.5 0 018.5 8.5z"
                                />
                            </svg>
                        </span>
                        <span className="text-xs text-gray-500 px-1">{message.comments}</span>

                    </Link>
                </div>
            </div>
            {

                message.comments > 0 ? ( 

                    message.commentsContent.map((c) => (
                        
                        <div key={c["id"]} className="h-full break-word wrap-normal whitespace-pre-line mx-10 h-10 border mt-1 rounded-lg text-xs p-3 hover:bg-gray-900">
                        
                        <span className='font-bold text-gray-600 leading-none'>{c["id"]}</span>
                        <span className='font-bold text-gray-600 leading-none px-2'>{c["userId"]}</span>
                        <p className='mb-2 text-gray-400'>{c["content"]}</p>
                        <span className=' text-gray-600 leading-none '>{c["date"].toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className=' text-gray-600 leading-none px-2'>{c["date"].toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                        <span className=' text-gray-600 leading-none px-2'>{c["date"].toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                        </div>

                    ))
                    

                    
                ) : null

            }
        </div>
    );
}
