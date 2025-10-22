"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var table_1 = require("@/components/ui/table");
var pagination_1 = require("@/components/ui/pagination");
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var switch_1 = require("@/components/ui/switch");
var react_redux_1 = require("react-redux");
var slice_1 = require("../redux/features/trendyol/slice");
var sonner_1 = require("sonner");
// Helper pagination generator
var getPaginationRange = function (totalPages, currentPage) {
    var delta = 2;
    var range = [];
    for (var i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
    }
    if (currentPage - delta > 2)
        range.unshift("...");
    if (currentPage + delta < totalPages - 1)
        range.push("...");
    range.unshift(1);
    if (totalPages > 1)
        range.push(totalPages);
    return range;
};
var Inventory = function () {
    var _a;
    var _b = (0, react_1.useState)(1), currentPage = _b[0], setCurrentPage = _b[1];
    var _c = (0, react_1.useState)([]), filteredData = _c[0], setFilteredData = _c[1];
    var _d = (0, react_1.useState)(""), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = (0, react_1.useState)(null), selectedProduct = _e[0], setSelectedProduct = _e[1];
    var _f = (0, react_1.useState)([]), inventoryData = _f[0], setInventoryData = _f[1];
    var _g = (0, react_1.useState)([]), inactiveProducts = _g[0], setInactiveProducts = _g[1];
    var _h = (0, react_1.useState)(""), newPrice = _h[0], setNewPrice = _h[1];
    var dispatch = (0, react_redux_1.useDispatch)();
    var _j = (0, react_redux_1.useSelector)(function (state) { return state.trendyolData; }), inventory = _j.inventory, excludedProducts = _j.excludedProducts, loading = _j.loading;
    var itemsPerPage = 20;
    var totalPages = Math.ceil(filteredData.length / itemsPerPage);
    var paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    var getStatusClass = function (qty) {
        if (qty > 10)
            return "bg-emerald-100 text-emerald-800 border border-emerald-300";
        if (qty === 0)
            return "bg-red-100 text-red-800 border border-red-300";
        return "bg-amber-100 text-amber-800 border border-amber-300";
    };
    (0, react_1.useEffect)(function () {
        dispatch((0, slice_1.getInventory)());
        dispatch((0, slice_1.getExcludedProducts)());
    }, [dispatch]);
    (0, react_1.useEffect)(function () {
        if (inventory && Array.isArray(inventory)) {
            setInventoryData(inventory);
            setFilteredData(inventory);
        }
        if (excludedProducts && Array.isArray(excludedProducts)) {
            setInactiveProducts(excludedProducts);
        }
    }, [inventory, excludedProducts]);
    // 🔍 Handle search
    (0, react_1.useEffect)(function () {
        var query = searchQuery.toLowerCase();
        var results = inventoryData.filter(function (item) {
            var _a, _b, _c, _d;
            return (((_a = item.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query)) ||
                ((_b = item.brand) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(query)) ||
                ((_c = String(item.productContentId)) === null || _c === void 0 ? void 0 : _c.includes(query)) ||
                ((_d = String(item.productCode)) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(query)));
        });
        setFilteredData(results);
        setCurrentPage(1);
    }, [searchQuery, inventoryData]);
    var handleUpdatePrice = function (product) {
        setSelectedProduct(product);
        setNewPrice(product.salePrice);
    };
    var handleSavePrice = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, updates, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Updated Price:", newPrice);
                    formData = {
                        barcode: selectedProduct.barcode,
                        quantity: selectedProduct.quantity,
                        newPrice: Number(newPrice),
                        productCode: selectedProduct.productCode,
                        product_id: selectedProduct._id,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch((0, slice_1.updatePrice)(formData))];
                case 2:
                    updates = _a.sent();
                    console.log("Price update response:", updates);
                    if (updates.message === "Price updated successfully") {
                        sonner_1.toast.success("Price updated successfully");
                        dispatch((0, slice_1.getInventory)());
                    }
                    setSelectedProduct(null);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error updating price:", error_1);
                    sonner_1.toast.error("Failed to update price", error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Toggle Active/Inactive
    var handleToggle = function (product, checked) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, productCode, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    formData = {
                        product_id: product._id,
                        productCode: product.productCode,
                    };
                    productCode = formData.productCode;
                    if (!checked) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch((0, slice_1.removeFromExcluded)(productCode))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, dispatch((0, slice_1.addToExcludedProducts)(formData))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    dispatch((0, slice_1.getExcludedProducts)());
                    dispatch((0, slice_1.getInventory)());
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error("Error toggling product:", error_2);
                    sonner_1.toast.error("Failed to toggle product", {
                        description: (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || "Unknown error",
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleRefreshProducts = function () {
        dispatch((0, slice_1.getInventory)());
        dispatch((0, slice_1.getExcludedProducts)());
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center text-gray-900">
          <lucide_react_1.Package className="h-7 w-7"/>
          <span className="ml-2">Inventory</span>
        </h2>
        <p className="text-gray-500">Manage your product inventory</p>
      </div>

      <div className="bg-gray-900 rounded-lg shadow">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <lucide_react_1.RefreshCcw onClick={handleRefreshProducts} className="h-5 w-5 text-white cursor-pointer hover:text-yellow-400"/>
            Inventory Overview
          </h3>

          <input_1.Input placeholder="Search by product code, name, ID, or brand..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="max-w-sm bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-yellow-400"/>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table_1.Table>
            <table_1.TableHeader className="bg-gray-800">
              <table_1.TableRow>
                <table_1.TableHead className="text-white w-[300px]">Product</table_1.TableHead>
                <table_1.TableHead className="text-white">Buy Box</table_1.TableHead>
                <table_1.TableHead className="text-white">Quantity</table_1.TableHead>
                <table_1.TableHead className="text-white">Status</table_1.TableHead>
                <table_1.TableHead className="text-white">Seller</table_1.TableHead>
                <table_1.TableHead className="text-white text-center">Active</table_1.TableHead>
                <table_1.TableHead className="text-white w-[100px] text-center">
                  Actions
                </table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {paginatedData.map(function (item) {
            var _a;
            return (<table_1.TableRow key={item.productContentId} className="border-b border-gray-800 text-white hover:bg-gray-800/50">
                  {/* Product */}
                  <table_1.TableCell className="flex items-center gap-3">
                    <img src={(_a = item.images[0]) === null || _a === void 0 ? void 0 : _a.url} alt={item.title} className="w-12 h-12 rounded-md object-cover"/>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-gray-400">
                        {item.brand} <span>, {item.productCode}</span>
                      </div>
                    </div>
                  </table_1.TableCell>

                  {/* Buy Box */}
                  <table_1.TableCell>
                    <div className="flex flex-col items-start">
                      <span className={"text-sm font-semibold ".concat(item.isBuyBox === "true"
                    ? "text-green-400"
                    : "text-red-400")}>
                        {item.isBuyBox === "true" ? "✅ Yes" : "❌ No"}
                      </span>
                      <span className="text-yellow-300 font-semibold">
                        ${item.salePrice}
                      </span>
                    </div>
                  </table_1.TableCell>

                  {/* Quantity */}
                  <table_1.TableCell>{item.quantity}</table_1.TableCell>

                  {/* Status */}
                  <table_1.TableCell>
                    <span className={"px-3 py-1 rounded-full text-xs font-medium ".concat(getStatusClass(item.quantity))}>
                      {item.quantity > 10
                    ? "In Stock"
                    : item.quantity === 0
                        ? "Out of Stock"
                        : "Low Stock"}
                    </span>
                  </table_1.TableCell>

                  {/* Seller */}
                  <table_1.TableCell>
                    <span className="">{item.seller}</span>
                  </table_1.TableCell>

                  <table_1.TableCell className="text-center">
                    <switch_1.Switch defaultChecked={!inactiveProducts.some(function (excluded) {
                    return excluded.productCode === item.productCode;
                })} onCheckedChange={function (checked) { return handleToggle(item, checked); }} className="data-[state=checked]:bg-yellow-400 data-[state=unchecked]:bg-gray-600"/>
                  </table_1.TableCell>

                  {/* Actions */}
                  <table_1.TableCell className="text-center">
                    <button onClick={function () { return handleUpdatePrice(item); }} className="text-blue-400 hover:text-blue-300" title="Update Price">
                      <lucide_react_1.Edit3 className="h-5 w-5 inline"/>
                    </button>
                  </table_1.TableCell>
                </table_1.TableRow>);
        })}

              {paginatedData.length === 0 && (<table_1.TableRow>
                  <table_1.TableCell colSpan={6} className="text-center text-gray-400 py-6">
                    No products found.
                  </table_1.TableCell>
                </table_1.TableRow>)}
            </table_1.TableBody>
          </table_1.Table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center text-white">
          <div>
            Showing {paginatedData.length} of {filteredData.length}
          </div>
          <pagination_1.Pagination>
            <pagination_1.PaginationContent className="flex flex-wrap justify-end gap-1">
              {getPaginationRange(totalPages, currentPage).map(function (page, idx) {
            return page === "..." ? (<span key={idx} className="px-2 text-gray-400">
                    ...
                  </span>) : (<pagination_1.PaginationItem key={idx}>
                    <pagination_1.PaginationLink href="#" isActive={currentPage === page} onClick={function () { return setCurrentPage(page); }} className={"px-3 py-1 rounded-md transition-colors ".concat(currentPage === page
                    ? "bg-yellow-400 text-gray-900 font-semibold"
                    : "text-white hover:bg-gray-700")}>
                      {page}
                    </pagination_1.PaginationLink>
                  </pagination_1.PaginationItem>);
        })}
            </pagination_1.PaginationContent>
          </pagination_1.Pagination>
        </div>
      </div>

      {/* Update Price Modal */}
      {selectedProduct && (<dialog_1.Dialog open={true} onOpenChange={function () { return setSelectedProduct(null); }}>
          <dialog_1.DialogContent>
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Update Price</dialog_1.DialogTitle>
            </dialog_1.DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <img src={(_a = selectedProduct.images[0]) === null || _a === void 0 ? void 0 : _a.url} alt={selectedProduct.title} className="w-16 h-16 rounded-md object-cover"/>
                <div>
                  <p className="font-semibold">{selectedProduct.title}</p>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.brand}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Price
                </label>
                <input_1.Input type="number" value={newPrice} onChange={function (e) { return setNewPrice(e.target.value); }} className="mt-1"/>
              </div>
            </div>

            <dialog_1.DialogFooter>
              <button_1.Button variant="outline" onClick={function () { return setSelectedProduct(null); }}>
                Cancel
              </button_1.Button>
              <button_1.Button onClick={handleSavePrice}>Save</button_1.Button>
            </dialog_1.DialogFooter>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>)}
    </div>);
};
exports.default = Inventory;
