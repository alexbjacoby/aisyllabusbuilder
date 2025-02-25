import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- Must import the file containing @tailwind
import AISyllabusStatementBuilder from './AISyllabusStatementBuilder';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
<React.StrictMode>
<AISyllabusStatementBuilder />
</React.StrictMode>
);
