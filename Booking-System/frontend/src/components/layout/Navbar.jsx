import Navbutton from "./Navbutton";

export default function Navbar() {
  return (
    <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border  border-gray-200 bg-white">
      <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-5 pl-20 pr-20">
        <a>
          <span className="self-center text-3xl text-heading whitespace-nowrap">
            Hotel Admin System
          </span>
        </a>
        <div className="block w-auto">
          <ul className="flex flex-row space-x-15 border-0">
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
