import Image from 'next/image';

interface Message {
  text: string;
  time: string;
}

interface Props {
  author: string;
  location: string;
  avatar: string;
  messages: Message[];
}

export const Comment = ({ author, avatar, messages, location }: Props) => {
  return (
    <div className='flex gap-3 items-end'>
      <div className='w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-600'>
        <Image src={avatar} alt={author} className='w-full h-full object-cover' />
      </div>

      <div className='flex flex-col gap-1 max-w-xs'>
        <span className='text-gray-400 text-sm px-1'>
          {author},{location}
        </span>
        {messages.map((msg, i) => (
          <div key={i} className='bg-[#2a2a2a] text-white rounded-2xl rounded-bl-sm px-4 py-3'>
            <p className='text-sm leading-relaxed'>{msg.text}</p>
            <span className='text-gray-500 text-xs float-right mt-1 ml-4'>{msg.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
