"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePicker = DatePicker;
var React = require("react");
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var button_1 = require("@/components/ui/button");
var calendar_1 = require("@/components/ui/calendar");
var popover_1 = require("@/components/ui/popover");
function DatePicker(_a) {
    var date = _a.date, setDate = _a.setDate, _b = _a.mode, mode = _b === void 0 ? "single" : _b, selected = _a.selected, onSelect = _a.onSelect, id = _a.id, _c = _a.placeholder, placeholder = _c === void 0 ? "Pick a date" : _c, _d = _a.numberOfMonths, numberOfMonths = _d === void 0 ? 1 : _d, defaultMonth = _a.defaultMonth;
    // Determine which props to use based on mode
    var finalSelected = mode === "single" ? date : selected;
    // Create type-safe handlers
    var handleSingleSelect = function (date) {
        if (mode === "single" && setDate) {
            setDate(date);
        }
    };
    var handleRangeSelect = function (range) {
        if (mode === "range" && onSelect) {
            onSelect(range);
        }
    };
    return (<popover_1.Popover>
      <popover_1.PopoverTrigger asChild>
        <button_1.Button id={id} variant={"outline"} className={(0, utils_1.cn)("w-full justify-start text-left font-normal", !finalSelected && "text-muted-foreground")}>
          <lucide_react_1.Calendar className="mr-2 h-4 w-4"/>
          {mode === "single" && finalSelected ? ((0, date_fns_1.format)(finalSelected, "PPP")) : mode === "range" && finalSelected ? (<>
              {(0, date_fns_1.format)(finalSelected.from, "PPP")} -{" "}
              {finalSelected.to
                ? (0, date_fns_1.format)(finalSelected.to, "PPP")
                : ""}
            </>) : (<span>{placeholder}</span>)}
        </button_1.Button>
      </popover_1.PopoverTrigger>
      <popover_1.PopoverContent className="w-auto p-0" align="start">
        {mode === "single" ? (<calendar_1.Calendar mode="single" selected={finalSelected} onSelect={handleSingleSelect} initialFocus numberOfMonths={numberOfMonths} defaultMonth={defaultMonth} className={(0, utils_1.cn)("p-3 pointer-events-auto")}/>) : (<calendar_1.Calendar mode="range" selected={finalSelected} onSelect={handleRangeSelect} initialFocus numberOfMonths={numberOfMonths} defaultMonth={defaultMonth} className={(0, utils_1.cn)("p-3 pointer-events-auto")}/>)}
      </popover_1.PopoverContent>
    </popover_1.Popover>);
}
