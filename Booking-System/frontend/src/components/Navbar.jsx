import Navbutton from "./NavButton";

export default function Navbar() {
  return (
    <nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border  border-gray-200 bg-white">
      <div class="max-w-screen flex flex-wrap items-center justify-between mx-auto p-5 pl-20 pr-20">
        <a>
          <span class="self-center text-3xl text-heading whitespace-nowrap">
            Hotel Admin System
          </span>
        </a>
        <div class="block w-auto">
          <ul class="flex flex-row space-x-15 border-0">
            <Navbutton href={"#"} name={"Dashboard"} />
            <Navbutton href={"#"} name={"Bookings"} />
            <Navbutton href={"#"} name={"Rooms"} />
            <Navbutton href={"#"} name={"Guests"} />
          </ul>
        </div>
      </div>
    </nav>
  );
}
