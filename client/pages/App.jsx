// Here is the file which will act as the launching point for our React frontend.

const React = require('react');
const {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} = require('react-router-dom');

// Test components
const ProfilePicture = require('../components/ProfilePicture.jsx');
const CookieTest = require('../components/CookieTest.jsx');
const ChangePassword = require('../components/ChangePassword.jsx');

// Pages
const FourOhFourPage = require('./404Page.jsx');

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route index element={ /** Eventually, the main page will be here */ <h1>Here's the main page!</h1>} />
        <Route path='/test/profile_picture' element={<ProfilePicture username='alice' />} />
        <Route path='/test/change_password' element={<ChangePassword username='alice' />} /> 
        <Route path='/test/cookie' element={<CookieTest cookieName='token' />} /> 
        <Route path='api' />
        <Route path='*' element={<FourOhFourPage />} />
        </>
    )
)

/**
 * Renders the application itself. Routing happens here.
 * 
 * @param {object} props - Not required. 
 * @returns The rendered router for the app.
 */
function App (props) {
    return (
        <RouterProvider router={router} />
    )
}

module.exports = App;

