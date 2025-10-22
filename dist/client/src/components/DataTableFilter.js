"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var popover_1 = require("@/components/ui/popover");
var select_1 = require("@/components/ui/select");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var date_picker_1 = require("@/components/ui/date-picker");
var DataTableFilter = function (_a) {
    var filters = _a.filters, onFilterChange = _a.onFilterChange;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)({}), activeFilters = _c[0], setActiveFilters = _c[1];
    var handleFilterChange = function (name, value) {
        var _a;
        var updatedFilters = __assign(__assign({}, activeFilters), (_a = {}, _a[name] = value, _a));
        if (value === undefined || value === "" || value === null) {
            delete updatedFilters[name];
        }
        setActiveFilters(updatedFilters);
    };
    var applyFilters = function () {
        onFilterChange(activeFilters);
        setIsOpen(false);
    };
    var clearFilters = function () {
        setActiveFilters({});
        onFilterChange({});
        setIsOpen(false);
    };
    var getActiveFilterCount = function () {
        return Object.keys(activeFilters).length;
    };
    return (<popover_1.Popover open={isOpen} onOpenChange={setIsOpen}>
      <popover_1.PopoverTrigger asChild>
        <button_1.Button variant="outline" size="sm" className="h-8 gap-1">
          <lucide_react_1.Filter className="h-3.5 w-3.5"/>
          <span>Filter</span>
          {getActiveFilterCount() > 0 && (<span className="ml-1 rounded-full bg-primary w-5 h-5 text-[11px] flex items-center justify-center text-primary-foreground">
              {getActiveFilterCount()}
            </span>)}
        </button_1.Button>
      </popover_1.PopoverTrigger>
      <popover_1.PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {getActiveFilterCount() > 0 && (<button_1.Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={clearFilters}>
                <lucide_react_1.X className="h-3.5 w-3.5"/>
                <span>Clear all</span>
              </button_1.Button>)}
          </div>
          <div className="space-y-4">
            {filters.map(function (filter) { return (<div key={filter.name} className="space-y-2">
                <label_1.Label htmlFor={filter.name}>{filter.name}</label_1.Label>
                
                {filter.type === 'select' && filter.options && (<select_1.Select value={activeFilters[filter.name] || ""} onValueChange={function (value) { return handleFilterChange(filter.name, value); }}>
                    <select_1.SelectTrigger id={filter.name}>
                      <select_1.SelectValue placeholder={filter.placeholder || "Select ".concat(filter.name)}/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      {filter.options.map(function (option) { return (<select_1.SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </select_1.SelectItem>); })}
                    </select_1.SelectContent>
                  </select_1.Select>)}
                
                {filter.type === 'text' && (<input_1.Input id={filter.name} placeholder={filter.placeholder || "Search ".concat(filter.name)} value={activeFilters[filter.name] || ""} onChange={function (e) { return handleFilterChange(filter.name, e.target.value); }}/>)}
                
                {filter.type === 'date' && (<date_picker_1.DatePicker id={filter.name} date={activeFilters[filter.name]} setDate={function (date) { return handleFilterChange(filter.name, date); }} placeholder={filter.placeholder || "Pick a date"}/>)}
                
                {/* Add support for date-range if needed */}
              </div>); })}
          </div>
          
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button_1.Button variant="outline" size="sm" onClick={function () { return setIsOpen(false); }}>
              Cancel
            </button_1.Button>
            <button_1.Button size="sm" onClick={applyFilters}>
              Apply
            </button_1.Button>
          </div>
        </div>
      </popover_1.PopoverContent>
    </popover_1.Popover>);
};
exports.default = DataTableFilter;
