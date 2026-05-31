import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?:boolean;
};

const DatePicker = forwardRef(({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  disabled,
}: PropsType, ref) => {

  const pickerRef = useRef<any>(null);

  useEffect(() => {
    pickerRef.current = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
      clickOpens: !disabled,
    });

    return () => {
      pickerRef.current?.destroy?.();
    };
  }, [mode, onChange, id, defaultDate]);

  // ✅ expose clear method
  useImperativeHandle(ref, () => ({
    clear: () => pickerRef.current?.clear?.(),
  }));

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
});

export default DatePicker;
