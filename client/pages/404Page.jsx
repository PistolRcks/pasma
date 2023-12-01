const { Button } = require('@nextui-org/button');
const React = require('react');
const { Link } = require('react-router-dom')

/**
 * Renders the 404 page.
 * @param {object} props - Unused.
 */
function FourOhFourPage(props) {
    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='h-56 grid grid-cols-1 gap-4 justify-items-center'>
                <div className='justify-self-start'>
                    <p className='text-5xl text-rose-600'>404!</p>
                </div>
                <div>
                    <p className='text-sm'>We couldn't find the page you were looking for!</p>
                </div>
                <div>
                    <Button color='primary'>
                        <Link to={"/"}>Click here to return to the homepage.</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

module.exports = FourOhFourPage;
