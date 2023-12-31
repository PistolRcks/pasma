// Here is the file which will act as the launching point for our React frontend.

const React = require('react');
const {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Outlet,
    RouterProvider
} = require('react-router-dom');
const { useCookies } = require('react-cookie')

// Test components
const ProfilePicture = require('../components/ProfilePicture.jsx');
const CookieTest = require('../components/CookieTest.jsx');
const ChangePassword = require('../components/ChangePassword.jsx');
const NavBar = require('../components/NavBar.jsx');

// Pages
const AccountSettingsPage = require('./AccountSettingsPage.jsx');
const CreatePostPage = require('./CreatePostPage.jsx');
const IndexPage = require('./IndexPage.jsx');
const PostFeedPage = require('./PostFeedPage.jsx');
const PostPage = require('./PostPage.jsx');
const ProfilePage = require('./ProfilePage.jsx');
const CreateCommentPage = require('./CreateCommentPage.jsx');
const EditPostPage = require('./EditPostPage.jsx');

// Error Pages
const FourOhFourPage = require('./404Page.jsx');

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route index element={<IndexPage />} />
        <Route
            element={
                <div>
                    <NavBar />
                    <Outlet />
                </div>
            }
        >
            <Route path='/create' element={<CreatePostPage />}/>
            <Route path='/feed' element={/* Eventually, this should be a verified page */ <PostFeedPage />} />
            <Route path='/edit/:id' element={<EditPostPage />} />
            <Route path='/post/:id' element={<PostPage />} />
            <Route path='/comment/:parentId' element={/* Eventually, this should be a verified page */ <CreateCommentPage />} />
            <Route path='/profile/:username' element={<ProfilePage />} />
            <Route path='/account' element={<AccountSettingsPage />} />
            <Route path='/test/profile_picture' element={<ProfilePicture username='alice' />} />
            <Route path='/test/change_password' element={<ChangePassword username='alice' />} /> 
            <Route path='/test/cookie' element={<CookieTest cookieName='token' />} /> 
            <Route path='/api' />
            <Route path='*' element={<FourOhFourPage />} />
        </Route>
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
    const [cookies] = useCookies()

    return (
        <div className={cookies.darkMode ? "dark text-foreground bg-background" : ""}><RouterProvider router={router} /></div>
    )
}

module.exports = App;

