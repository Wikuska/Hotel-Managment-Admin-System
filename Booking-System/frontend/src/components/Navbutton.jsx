export default function Navbutton({ href, name }) {
  return (
    <li>
      <a
        href={href}
        className="block py-2 px-3 text-black md:bg-transparent md:p-0 text-xl"
      >
        {name}
      </a>
    </li>
  );
}
