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
const { logOut } = require("../dataHelper.js")

function NavBar(props) {
    const [cookie, setCookie, removeCookie] = useCookies([
        "token",
        "username",
        "profilePicture",
        "userType",
    ]);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (cookie.token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [cookie.token]);

    async function doLogOut() {
        const logOutResponse = await logOut(cookie.token);

        if (logOutResponse == "OK") {
            removeCookie("token");
            removeCookie("username");
            removeCookie("profilePicture");
            removeCookie("userType");
            setLoggedIn(false);
        } else {
            alert("Error logging out");
            console.log("Error logging out");
        }
    }

    return (
        <>
            <Navbar isBordered>
                <NavbarBrand>
                    <Link to={loggedIn ? "/feed" : "/"} className="flex">
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
                                    <Button
                                        isIconOnly
                                        radius="full"
                                        data-testid="navBarProfilePicture"
                                    >
                                        <ProfilePicture
                                            username={cookie.username}
                                        />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="profile">
                                        <Link to="/account" className="flex">
                                            My Account
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logOut"
                                        className="text-danger"
                                        color="danger"
                                        onClick={doLogOut}
                                    >
                                        <Link to="/" className="flex">
                                            Log Out
                                        </Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <LoginModalButton color="primary" variant="flat" />
                        )}
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
}

module.exports = NavBar;
