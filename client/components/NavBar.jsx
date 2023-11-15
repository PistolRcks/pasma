const React = require("react");
const { useState, useEffect } = require("react");
const { Link } = require("react-router-dom");
const PropTypes = require("prop-types");
const ProfilePicture = require("./ProfilePicture.jsx");
const { useCookies } = require("react-cookie");
const {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} = require("@nextui-org/react");
const LoginModalButton = require("./LoginModalButton.jsx");

function NavBar(props) {
    const [cookie, setCookie] = useCookies([
        "token",
        "username",
        "profilePicture",
        "userType",
    ]);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (cookie.token) {
            setLoggedIn(true);
            console.log("Logged in");
        } else {
            setLoggedIn(false);
            console.log("Logged out");
        }
    }, [cookie.token]);

    return (
        <>
            <Navbar isBordered>
                <NavbarBrand>
                    <Link to={loggedIn ? "/feed" : "/"}>
                        <img
                            src="/pictures/logos/pasmaSquare.png"
                            alt="PASMA"
                            className="w-12 h-12 mr-2"
                        />
                    </Link>
                </NavbarBrand>

                <NavbarContent
                    className="hidden sm:flex gap-4"
                    justify="center"
                >
                    <NavbarItem>
                        <Input label="Search" size="sm" />
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        {loggedIn ? (
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button isIconOnly radius="full">
                                        <ProfilePicture
                                            username={cookie.username}
                                        />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="profile">
                                        <Link to="/account">My Account</Link>
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logOut"
                                        className="text-danger"
                                        color="danger"
                                    >
                                        <Link to="/">Log Out</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <LoginModalButton variant="flat" />
                        )}
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
}

module.exports = NavBar;
