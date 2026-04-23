import { FiSun, FiMoon } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

type LogoBlockProps = {
  wrapClass: string;
  halfClass: string;
  imgClass: string;
};

function LogoBlock({ wrapClass, halfClass, imgClass }: LogoBlockProps) {
  return (
    <div
      className={`relative ${wrapClass} bg-purple flex items-center justify-center rounded-r-2xl overflow-hidden`}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 ${halfClass} bg-purple-light rounded-tl-2xl`}
      />
      <img src="/logo.png" alt="Logo" className={`relative z-10 ${imgClass}`} />
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="text-muted-1 hover:text-white hover:bg-transparent"
    >
      {theme === "light" ? (
        <FiMoon className={`size-6`} />
      ) : (
        <FiSun className={`size-6`} />
      )}
    </Button>
  );
}
export default function Navbar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-25.75 flex-col items-center justify-between bg-navy-4 rounded-r-2xl">
        <LogoBlock
          wrapClass="w-[103px] h-[103px]"
          halfClass="h-[52px]"
          imgClass="w-10 h-10"
        />
        <div className="flex flex-col items-center gap-6 pb-8">
          <ThemeToggle />
          <div className="w-full h-px bg-[#494E6E]" />
          <img
            src="/user.png"
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-purple transition-all cursor-pointer"
          />
        </div>
      </aside>

      {/* Mobile topbar */}
      <header className="lg:hidden fixed inset-x-0 top-0 z-50! h-18 bg-navy-4 flex items-center justify-between overflow-hidden">
        <LogoBlock
          wrapClass="w-[72px] h-[72px]"
          halfClass="h-9"
          imgClass="w-8 h-8"
        />
        <div className="flex items-center gap-4 pr-6">
          <ThemeToggle />
          <div className="w-px h-18 bg-[#494E6E]" />
          <img
            src="/user.png"
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
        </div>
      </header>
    </>
  );
}
