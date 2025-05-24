export default function Hamburger({ isOpen, toggleMenu }: {isOpen: boolean; toggleMenu: () => void;}) {
  return (
    <button
      className="flex sm:hidden flex-col justify-center items-end w-11 h-11 p-2 space-y-1.5 rounded-sm  hover:bg-off-white active:bg-off-white cursor-pointer"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={toggleMenu}
    >
      <span
        className={
          `w-7 h-1 bg-white rounded-full transition-all duration-300 ease-in-out
          ${isOpen ? "rotate-45 translate-y-2.5" : ""}`
        }
      />
      <span
        className={
          `w-4 h-1 bg-white rounded-full transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-0" : ""}`
        }
      />
      <span
        className={
          `w-6 h-1 bg-white rounded-full transition-all duration-300 ease-in-out
          ${isOpen ? "w-7 -rotate-45 -translate-y-2.5" : ""}`
        }
      />
    </button>
  );
}