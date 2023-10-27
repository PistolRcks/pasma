// import 'bootstrap/dist/css/bootstrap.min.css'

// mport React from 'react'
const React = require('react')
// import { createRoot } from 'react-dom/client'
const { createRoot } = require('react-dom/client')

const { App } = require('./Components/App.jsx')
const { NextUIProvider } = require('@nextui-org/react')

const root = createRoot(document.getElementById('root'))
root.render(
    <>
        <NextUIProvider>
            <App />
        </NextUIProvider>
    </>
)
