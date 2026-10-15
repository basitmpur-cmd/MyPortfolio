// All personal content lives here so it is easy to edit.
export const profile = {
  name: 'Abdulbasit Mohammadpur',
  studentId: '3011539478',
  phone: '437-878-9221',
  email: 'amoha893@my.centennialcollege.ca',
  location: 'Toronto, Ontario, Canada',
  title: 'Full-stack web developer',
  bio: [
    'I am a software student in Toronto learning to build web applications with the MERN stack: MongoDB, Express, React and Node.js.',
    'I like turning an idea into a clear interface, and I care about readable code, version control and deploying work people can actually open.',
  ],
};

export const projects = [
  { title: 'Study Planner', image: '/images/project1.svg', role: 'Front-end developer',
    description: 'A React app for planning weekly study sessions and tracking deadlines.',
    outcome: 'Built with reusable components and React state as a practice project.' },
  { title: 'Express Task API', image: '/images/project2.svg', role: 'Back-end developer',
    description: 'A REST API built with Node.js, Express and MongoDB with create, read, update and delete routes.',
    outcome: 'Completed all routes with Mongoose validation and error handling.' },
  { title: 'Events Board', image: '/images/project3.svg', role: 'Full-stack developer',
    description: 'A MERN app for posting and browsing local events with a form and a list view.',
    outcome: 'Connected the React front end to the Express and MongoDB back end.' },
];

export const education = [
  { credential: 'Software Engineering Technology - Artificial Intelligence (Ontario College Advanced Diploma)', school: 'Centennial College, Toronto', dates: 'In progress (3-year program)' },
  { credential: 'COMP-229 Web Application Development (MERN stack)', school: 'Centennial College, Toronto', dates: 'Fall 2026 (Semester 3)' },
];

export const services = [
  { title: 'Web development', image: '/images/service1.svg', text: 'Responsive websites and single-page apps built with React.' },
  { title: 'Back-end and APIs', image: '/images/service2.svg', text: 'Node.js and Express servers with MongoDB data storage.' },
  { title: 'Mobile-friendly apps', image: '/images/service3.svg', text: 'Interfaces that work well on phones, tablets and desktops.' },
];