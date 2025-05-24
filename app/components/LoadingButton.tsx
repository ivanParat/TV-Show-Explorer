import NavButton from "./layout/NavButton";

export default function LoadingButton(){
  return (
    <NavButton> 
      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
    </NavButton>
  );
}