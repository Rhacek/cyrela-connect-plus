
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Adicionando a classe overflow-x-hidden ao elemento raiz
const rootElement = document.getElementById("root")!;
rootElement.classList.add("overflow-x-hidden");

createRoot(rootElement).render(<App />);
