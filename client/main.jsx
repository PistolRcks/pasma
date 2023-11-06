const React = require('react')
const { createRoot } = require('react-dom/client')

const App = require('./pages/App.jsx')
const { NextUIProvider } = require('@nextui-org/react')

const root = createRoot(document.getElementById('root'))
root.render(
    <>
        <NextUIProvider>
            <App />
        </NextUIProvider>
    </>
)
