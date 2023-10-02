// import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/App.jsx'
import { NextUIProvider } from '@nextui-org/react'

const root = createRoot(document.getElementById('root'))
root.render(
    <>
        <NextUIProvider>
            <App />
        </NextUIProvider>
    </>
)
