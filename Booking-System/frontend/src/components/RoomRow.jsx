export default function RoomRow({ room }) {
  return (
    <tr>
      <td className="p-3">{room.number}</td>
      <td className="text-left">{room.floor}</td>
      <td className="text-left">{room.beds}</td>
      <td className="text-left">{room.is_occupied ? "Occupied" : "Free"}</td>
      <td>Room details</td>
    </tr>
  );
}
