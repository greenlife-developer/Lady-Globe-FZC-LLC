"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var button_1 = require("@/components/ui/button");
var react_router_dom_1 = require("react-router-dom");
var PagePlaceholder = function (_a) {
    var title = _a.title, description = _a.description, icon = _a.icon;
    var navigate = (0, react_router_dom_1.useNavigate)();
    return (<div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-iraav-dark-blue flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="bg-white border rounded-lg p-8 text-center">
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">This is a placeholder page</h3>
          <p className="text-gray-600">
            This page represents the {title.toLowerCase()} module in the IRAAV Amazon Solution. 
            In a complete implementation, this would contain interactive tables, forms, and 
            visualizations for {title.toLowerCase()} data.
          </p>
        </div>
        <button_1.Button onClick={function () { return navigate("/dashboard"); }} className="bg-iraav-dark-blue hover:bg-iraav-navy">
          Back to Dashboard
        </button_1.Button>
      </div>
    </div>);
};
exports.default = PagePlaceholder;
