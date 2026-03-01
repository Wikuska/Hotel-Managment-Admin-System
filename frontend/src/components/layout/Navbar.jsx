import Navbutton from "./Navbutton";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 w-full bg-white border-b border-zinc-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between w-full p-4 px-6 md:px-12 lg:px-20">
        <a href="/" className="cursor-pointer">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-zinc-800">
            Hotel Admin System
          </span>
        </a>

        <div className="w-full md:w-auto mt-4 md:mt-0">
          <ul className="flex flex-row flex-wrap justify-center gap-4 md:gap-8">
            <Navbutton href={"/"} name={"Dashboard"} />
            <Navbutton href={"/bookings"} name={"Bookings"} />
            <Navbutton href={"/rooms"} name={"Rooms"} />
            <Navbutton href={"/guests"} name={"Guests"} />
          </ul>
        </div>
      </div>
    </nav>
  );
}
