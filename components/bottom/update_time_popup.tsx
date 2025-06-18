import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configure dayjs to use GMT+7
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

type Props = {
  onClose: () => void;
  onSubmit: (time: string) => void;
};

export function UpdateTimePopup({ onClose, onSubmit }: Props) {
  const [value, setValue] = React.useState("");
  console.log(value);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-brand-BADFCD rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        {/* Main Content */}
        <div className="p-4 pb-0">
          <h3>New Event Time</h3>
          <div className="h-12">
            <input
              type="time"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`w-full h-full text-base px-4 border border-black border-l-0 border-solid focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 border-solid border-t border-l border-r rounded-tr-lg border-b rounded-br-lg border-t-0`}
            />
          </div>
        </div>
        {/* Footer */}
        <div className="p-4 gap-24 bg-brand-BADFCD rounded-b-2xl flex justify-center">
          <button
            onClick={onClose}
            className="px-8 bg-brand-BDC3C0 text-white rounded-full font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (value.length !== 5) {
                alert("invalid input time");
                return;
              }
              await onSubmit(value);
            }}
            className="px-8 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
