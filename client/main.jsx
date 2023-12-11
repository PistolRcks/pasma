const React = require('react')
const { createRoot } = require('react-dom/client')

const App = require('./pages/App.jsx')

const { NextUIProvider } = require('@nextui-org/react')
const { CookiesProvider } = require('react-cookie')

const root = createRoot(document.getElementById('root'))
root.render(
    <>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <NextUIProvider>
                <App />
            </NextUIProvider>
        </CookiesProvider>
    </>
)
