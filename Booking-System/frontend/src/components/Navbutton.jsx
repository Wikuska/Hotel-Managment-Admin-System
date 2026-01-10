import { Link } from "react-router-dom";

export default function Navbutton({ href, name }) {
  return (
    <li>
      <Link
        to={href}
        className="block py-2 px-3 text-black md:bg-transparent md:p-0 text-xl"
      >
        {name}
      </Link>
    </li>
  );
}
