// Here is the file which will act as the launching point for our React frontend.

const React = require('react');
const ProfilePicture = require('../components/ProfilePicture.jsx');
const FourOhFourPage = require('./404Page.jsx');
const {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} = require('react-router-dom');

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route index element={ /** Eventually, the login page will be here */ <h1>Here's the main page!</h1>} />
        <Route path='/test/profile_picture' element={<ProfilePicture username='alice' />} />
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

