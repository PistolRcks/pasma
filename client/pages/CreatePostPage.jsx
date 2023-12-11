const React = require('react')
const { useCookies } = require('react-cookie')
const CreatePostForm = require('../components/CreatePostForm')

/**
 * Renders the create post page.
 * @param {object} props - Unused.
 */
function CreatePostPage(props) {
    const [cookies] = useCookies()

    return (
        <div className={cookies.darkMode ? "dark text-foreground bg-background h-screen" : ""}>
            <CreatePostForm/>
        </div>
    )
}

module.exports = CreatePostPage
