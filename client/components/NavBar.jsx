const React = require('react')
const { useState, useEffect } = require('react')
const { retrieveProfilePicture } = require('../dataHelper.js')
const PropTypes = require('prop-types')
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

function NavBar (props) {
    return (
        <>
            <Navbar isBordered>
                <NavbarBrand>
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
                    <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                    </NavbarItem>
                    <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Sign Up
                    </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
      
        </>
    )
}

module.exports = NavBar;
