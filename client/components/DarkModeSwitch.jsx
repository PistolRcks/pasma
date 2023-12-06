const React = require("react")
const { Switch } = require("@nextui-org/react")
const { MoonStars, Sun } = require("@phosphor-icons/react")


function DarkModeSwitch(props) {
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
        ></Switch>
    )
}

module.exports = DarkModeSwitch;
