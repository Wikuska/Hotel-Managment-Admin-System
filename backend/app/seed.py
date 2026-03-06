from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models import Room, Guest, Booking
from datetime import date


def seed_database():
    db: Session = SessionLocal()
    
    try:
        if db.query(Room).first():
            return

        print("🌱 Seeding database with demo data...")

        rooms = [
        Room(number="101", capacity=1, floor=1, room_type="single"),
        Room(number="102", capacity=2, floor=1, room_type="double", room_status="occupied"),
        Room(number="103", capacity=2, floor=1, room_type="twin"),
        Room(number="104", capacity=3, floor=1, room_type="triple_3s"),

        Room(number="201", capacity=2, floor=2, room_type="double", room_status="dirty"),
        Room(number="202", capacity=2, floor=2, room_type="twin"),
        Room(number="203", capacity=3, floor=2, room_type="triple_1d1s", room_status="maintenance"),

        Room(number="301", capacity=4, floor=3, room_type="quad_2d"),
        Room(number="302", capacity=4, floor=3, room_type="quad_4s"),
        Room(number="303", capacity=1, floor=3, room_type="single", room_status="dirty"),
        ]
        db.add_all(rooms)

        guests = [
            Guest(first_name="Jan", last_name="Kowalski", email="jan.kowalski@example.com", phone="123456789"),
            Guest(first_name="Anna", last_name="Nowak", email="anna.nowak@example.com", phone="987654321"),
            Guest(first_name="Piotr", last_name="Wiśniewski", email="piotr.w@example.com", phone="555111222"),
            Guest(first_name="Katarzyna", last_name="Wójcik", email="k.w@example.com", phone="555333444"),
            Guest(first_name="Michał", last_name="Kamiński", email="m.kaminski@example.com", phone="666111222"),
            Guest(first_name="Agnieszka", last_name="Lewandowska", email="a.lew@example.com", phone="666333444"),
            Guest(first_name="Tomasz", last_name="Zieliński", email="t.zielinski@example.com", phone="777111222"),
            Guest(first_name="Magdalena", last_name="Szymańska", email="m.szymanska@example.com", phone="777333444"),
            Guest(first_name="Paweł", last_name="Dąbrowski", email="p.dabrowski@example.com", phone="888111222"),
            Guest(first_name="Natalia", last_name="Kaczmarek", email="n.kaczmarek@example.com", phone="888333444"),
        ]

        db.add_all(guests)
        
        bookings = [
        Booking(room_id=1, guest_id=1, date_from=date(2025, 4, 10), date_to=date(2025, 4, 12), status="confirmed"),
        Booking(room_id=2, guest_id=2, date_from=date(2025, 4, 11), date_to=date(2025, 4, 15), status="checked_in"),
        Booking(room_id=3, guest_id=3, date_from=date(2025, 4, 5), date_to=date(2025, 4, 8), status="checked_out"),
        Booking(room_id=4, guest_id=4, date_from=date(2025, 4, 12), date_to=date(2025, 4, 14), status="confirmed"),
        Booking(room_id=5, guest_id=5, date_from=date(2025, 4, 1), date_to=date(2025, 4, 3), status="checked_out"),
        Booking(room_id=6, guest_id=6, date_from=date(2025, 4, 15), date_to=date(2025, 4, 18), status="confirmed"),
        Booking(room_id=7, guest_id=7, date_from=date(2025, 4, 2), date_to=date(2025, 4, 4), status="no_show"),
        Booking(room_id=8, guest_id=8, date_from=date(2025, 4, 20), date_to=date(2025, 4, 25), status="confirmed"),
        Booking(room_id=9, guest_id=9, date_from=date(2025, 4, 10), date_to=date(2025, 4, 11), status="cancelled"),
        Booking(room_id=10, guest_id=10, date_from=date(2025, 4, 18), date_to=date(2025, 4, 22), status="confirmed"),
    ]

        db.add_all(bookings)

        db.commit()
        print("✅ Demo data seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error during seeding: {e}")
    finally:
        db.close()