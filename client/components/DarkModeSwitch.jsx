const React = require("react")
const { useCookies } = require('react-cookie')
const { Switch } = require("@nextui-org/react")
const { MoonStars, Sun } = require("@phosphor-icons/react")

/**
 * Creates a switch that controls dark mode across the site through the use of a cookie.
 * 
 * @param {Object} props Unused.
 */
function DarkModeSwitch(props) {
    const [cookies, setCookie, removeCookie] = useCookies()
    
    return(
        <Switch
            defaultSelected={!cookies.darkMode}
            size="lg"
            color="primary"
            thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                    <Sun className={className} />
                ) : (
                    <MoonStars className={className} />
                )
            }
            onValueChange={(isSelected) => {
                !isSelected ? 
                    setCookie("darkMode", true, "/")
                :
                    removeCookie("darkMode", "/")
            }}
        ></Switch>
    )
}

module.exports = DarkModeSwitch;
