import { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useTheme from "../hooks/useTheme";
  
export default function ThemeSwitcher() {
    const [colorTheme, setTheme] = useTheme();
    const [darkSide, setDarkSide] = useState(
      colorTheme === "light" ? true : false
    );
  
    const toggleDarkMode = (checked: boolean) => {
      setTheme(colorTheme);
      setDarkSide(checked);
    };
  
    return (
      <>
        <DarkModeSwitch
          checked={darkSide}
          onChange={toggleDarkMode}
          size={30}
        />
      </>
    );
}
