const React = require('react')
const { useState, useEffect } = require('react')
const { Link } = require('react-router-dom');
const PropTypes = require('prop-types')
const ProfilePicture = require('./ProfilePicture.jsx')
const { useCookies } = require('react-cookie');
const { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } = require('@nextui-org/react');
const { logOut } = require('../dataHelper.js')

function NavBar (props) {

    const [cookie, setCookie] = useCookies(['token', 'username', 'profilePicture', 'userType']);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (cookie.token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [cookie.token]);

    async function myLogOut() {
        const logOutResponse = await logOut(cookie.token)

        if (logOutResponse == "OK") {
            setCookie('token', '');
            setCookie('username', '');
            setCookie('profilePicture', '');
            setCookie('userType', '');
            setLoggedIn(false);
        }
        else {
            alert("Error logging out")
            console.log("Error logging out")
        }
    }

    return (
        <>
            <Navbar isBordered>
                <NavbarBrand >
                    <Link to={loggedIn ? '/feed' : '/'} className="flex">
                        <img src="/pictures/logos/pasmaSquare.png" alt="PASMA" className="w-12 h-12 mr-2" />
                    </Link>
                </NavbarBrand>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Input label="Search" size="sm" />
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        {loggedIn ?
                            <Dropdown>
                                <DropdownTrigger>
                                <Button isIconOnly radius="full"> 
                                    <ProfilePicture username={cookie.username}/>
                                </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="profile"><Link to='/account' className="flex">My Account</Link></DropdownItem>
                                    <DropdownItem key="logOut" className="text-danger" color="danger" onClick={ myLogOut }><Link to='/' className="flex">Log Out</Link></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        :
                            <Button color="primary" variant="flat"><Link to='/login' className="flex">
                                Login
                            </Link></Button>
                    
                        }
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
      
        </>
    )
}

module.exports = NavBar;
