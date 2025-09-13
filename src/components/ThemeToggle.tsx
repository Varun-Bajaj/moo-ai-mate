import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full border-2 transition-all duration-300 hover:scale-105"
    >
      <Sun 
        className={`h-4 w-4 transition-all duration-300 ${
          theme === 'light' 
            ? 'rotate-0 scale-100 text-yellow-500' 
            : '-rotate-90 scale-0'
        }`} 
      />
      <Moon 
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 text-blue-400' 
            : 'rotate-90 scale-0'
        }`} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
