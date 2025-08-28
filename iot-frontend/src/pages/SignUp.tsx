import signUpStyles from "./SignUp.module.css";
import SideBarSignUp from "../components/SideBarSignUp";
import {useThemeContext} from "../contexts/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {Button} from "@mui/material";

const SignUp = () => {

    const { darkMode, toggleDarkMode } = useThemeContext();

    return (
        <div className={signUpStyles.mainContainer}>
            <div className={signUpStyles.sideBarSignUpContainer}>
                <SideBarSignUp darkMode={darkMode} />
            </div>
            <div className={signUpStyles.footer}>
                <Button
                    onClick={toggleDarkMode}
                    variant="contained"
                    sx={{
                        boxShadow: '0px 0px 4px #000',
                        borderRadius: '50%',
                        width: 50,
                        height: 50,
                        minWidth: 0,
                        minHeight: 0,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        backgroundColor: darkMode ? '#000' : '#FFF',
                        color: darkMode ? '#FFF' : '#000',
                        '&:hover': {
                            backgroundColor: darkMode ? '#000' : '#FFF',
                            boxShadow: '0px 0px 4px #000',
                        },
                        '&:focus': { outline: 'none', boxShadow: '0px 0px 4px #000' },
                        '&:active': { outline: 'none', boxShadow: '0px 0px 4px #000' },
                    }}
                >
                    {darkMode ? <DarkModeIcon fontSize="medium" /> : <LightModeIcon fontSize="medium" />}
                </Button>
            </div>
        </div>
    );
};

export default SignUp;