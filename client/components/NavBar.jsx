const React = require('react')
const { useState, useEffect } = require('react')
const { useNavigate } = require('react-router-dom');
const PropTypes = require('prop-types')
const ProfilePicture = require('./ProfilePicture.jsx')
const { useCookies } = require('react-cookie');
const { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } = require('@nextui-org/react');

function NavBarRhs({ loggedIn }) {
    if (loggedIn) {
        return (
            <>
                <Dropdown>
                    <DropdownTrigger>
                    <Button isIconOnly radius="full"> 
                        <ProfilePicture username='alice'/>
                    </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="profile">My Account</DropdownItem>
                        <DropdownItem key="logOut" className="text-danger" color="danger">
                        Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </>
        )
    } else {
        return (
            <Button as={Link} color="primary" href="/login" variant="flat">
                Login
            </Button>
        )
    }
}

function NavBar (props) {

    let navigate = useNavigate(); 
    useEffect() => {
        function handleClick(path) {
            navigate(path);
        }
    }

    const [cookie, setCookie] = useCookies(['token']);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (cookie.token) {
            setLoggedIn(true);
            // console.log("Logged in")
        } else {
            setLoggedIn(false);
            // console.log("Logged out")
        }
    }, [cookie.token]);

    return (
        <>
            <Navbar isBordered>
                <NavbarBrand onClick={handleClick}>
                    <img src="/pictures/logos/pasmaSquare.png" alt="PASMA" className="w-12 h-12 mr-2" />
                    <p className="font-bold text-inherit">PASMA</p>
                </NavbarBrand>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Feed
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Profile
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Cookie Viewer
                        </Link>
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        <NavBarRhs loggedIn={loggedIn} />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
      
        </>
    )
}

module.exports = NavBar;
