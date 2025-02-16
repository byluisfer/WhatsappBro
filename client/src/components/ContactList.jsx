import React from 'react';

const contacts = [
  {
    id: 1,
    name: 'Design chat',
    message: 'Jessie Rollins sent...',
    avatar: '/Profile_Photo2.webp',
  },
  {
    id: 2,
    name: 'Osman Campos',
    message: 'You: Hey! We are read...',
    avatar: '/Profile_Photo2.webp',
  },
  {
    id: 3,
    name: 'Jayden Church',
    message: 'I prepared some varia...',
    avatar: '/Profile_Photo2.webp',
  },
  {
    id: 4,
    name: 'Jacob Mcleod',
    message: 'And send me the proto...',
    avatar: '/Profile_Photo2.webp',
  },
  {
    id: 5,
    name: 'Jasmin Lowery',
    message: 'You: Ok! Let’s discuss it on th...',
    avatar: '/Profile_Photo2.webp',
  },
];

const ContactList = () => {
  return (
    <div className="fixed top-36 left-5 p-2 min-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center p-4 mb-2 cursor-pointer"
        >
          <div className="flex items-center justify-center text-xl font-bold rounded-full">
            {contact.avatar.includes('/') ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              contact.avatar
            )}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-white font-bold text-lg">{contact.name}</h3>
            <p className="text-gray-300 text-sm">{contact.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
