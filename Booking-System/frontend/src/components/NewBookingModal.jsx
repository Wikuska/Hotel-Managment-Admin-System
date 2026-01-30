import { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { MODAL_INPUT_CLASS, MODAL_LABEL_CLASS } from "../utils/constants";
import ModalInput from "./ModalInput";
import Button from "./Button";

export default function NewBookingModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="New Reservation"
      maxWidth="max-w-5xl"
    >
      <div className="border-zinc-200 border-2 rounded-xl p-5">
        <span className="text-2xl">Check Availability</span>
        <div className="flex items-end w-full mt-5">
          <ModalInput
            label="Arrival Date"
            input_type="date"
            input_name="date_in"
          />
          <ModalInput
            label="Departure Date"
            input_type="date"
            input_name="date_out"
          />
          <div className="flex flex-col flex-1">
            <label htmlFor="guests_in_room" className={MODAL_LABEL_CLASS}>
              Number of guests
            </label>
            <select name="guests_in_room" className={MODAL_INPUT_CLASS}>
              {[1, 2, 3, 4].map((number) => (
                <option value={number}>{number}</option>
              ))}
            </select>
          </div>
          <Button text="Check availability" additional_style="h-11" />
        </div>
      </div>
      <div className="border-zinc-200 border-2 rounded-xl p-5">
        <span className="text-2xl">Select Room</span>
        <div className="mt-5">
          {["all", "1 double", "2 single"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
        pb-1 px-4 text-sm font-medium transition-colors relative capitalize 
        ${
          activeTab === tab
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
        }
      `}
            >
              {tab}
            </button>
          ))}
        </div>
        <select name="chosen_room" className={MODAL_INPUT_CLASS}>
          {[1, 2, 3, 4].map((number) => (
            <option value={number}>Room {number}</option>
          ))}
        </select>
      </div>
      <div className="border-zinc-200 border-2 rounded-xl p-5">
        <span className="text-2xl">Select Guest</span>
        <div className="mt-5 flex">
          <input
            type="text"
            placeholder="Find guest (name/last name)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-zinc-200 border-2 rounded-xl p-2"
          />
          <Button text="+ New Guest" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-5">
        <Button text="Confirm Reservation" />
        <Button text="Cancel" />
      </div>
    </ModalWrapper>
  );
}
