const React = require("react")
const { useCookies } = require('react-cookie')
const { Switch } = require("@nextui-org/react")
const { MoonStars, Sun } = require("@phosphor-icons/react")


function DarkModeSwitch(props) {
    const [cookies, setCookie, removeCookie] = useCookies(["darkMode"])
    
    return(
        <Switch
            defaultSelected
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
