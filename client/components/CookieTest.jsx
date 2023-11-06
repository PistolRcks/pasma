const React = require('react')
const { useState, useEffect } = require('react');
const PropTypes = require('prop-types');
const { Button, Input } = require("@nextui-org/react");
const { useCookies } = require('react-cookie');

function CookieTest (props) {
    const { cookieName } = props

    const [cookie, setCookie] = useCookies([cookieName]);

    return (
        <>
            <Input
                label="Cookie Value"
                placeholder=""
                value={cookie.token}
                onChange={(e) => {
                    setCookie(cookieName, e.target.value);
                }}
            />
        </>
    )

}

module.exports = {
    CookieTest
}
