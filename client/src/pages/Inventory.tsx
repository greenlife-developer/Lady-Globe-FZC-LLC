import { useEffect, useState } from "react";
import {
  Package,
  RefreshCcw,
  Check,
  X,
  Clock,
  Edit3,
  Power,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import {
  getInventory,
  updatePrice,
  addToExcludedProducts,
  getExcludedProducts,
  removeFromExcluded,
} from "../redux/features/trendyol/slice";
import { toast } from "sonner";

// Helper pagination generator
const getPaginationRange = (totalPages: number, currentPage: number) => {
  const delta = 2;
  const range = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }
  if (currentPage - delta > 2) range.unshift("...");
  if (currentPage + delta < totalPages - 1) range.push("...");
  range.unshift(1);
  if (totalPages > 1) range.push(totalPages);
  return range;
};

const Inventory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [inactiveProducts, setInactiveProducts] = useState<any[]>([]);
  const [newPrice, setNewPrice] = useState("");
  const dispatch = useDispatch();

  const { inventory, excludedProducts, loading } = useSelector(
    (state: any) => state.trendyolData
  );

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (qty: number) => {
    if (qty > 10)
      return "bg-emerald-100 text-emerald-800 border border-emerald-300";
    if (qty === 0) return "bg-red-100 text-red-800 border border-red-300";
    return "bg-amber-100 text-amber-800 border border-amber-300";
  };

  useEffect(() => {
    dispatch(getInventory());
    dispatch(getExcludedProducts());
  }, [dispatch]);

  useEffect(() => {
    if (inventory && Array.isArray(inventory)) {
      setInventoryData(inventory);
      setFilteredData(inventory);
    }

    if (excludedProducts && Array.isArray(excludedProducts)) {
      setInactiveProducts(excludedProducts);
    }
  }, [inventory, excludedProducts]);


  // 🔍 Handle search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const results = inventoryData.filter((item) => {
      return (
        item.title?.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        String(item.productContentId)?.includes(query) ||
        String(item.productCode)?.toLowerCase().includes(query)
      );
    });
    setFilteredData(results);
    setCurrentPage(1);
  }, [searchQuery, inventoryData]);

  const handleUpdatePrice = (product: any) => {
    setSelectedProduct(product);
    setNewPrice(product.salePrice);
  };

  const handleSavePrice = async () => {
    console.log("Updated Price:", newPrice);
    const formData = {
      barcode: selectedProduct.barcode,
      quantity: selectedProduct.quantity,
      newPrice: Number(newPrice),
      productCode: selectedProduct.productCode,
      product_id: selectedProduct._id,
    };
    try {
      const updates = await dispatch(updatePrice(formData));
      console.log("Price update response:", updates);
      if (updates.message === "Price updated successfully") {
        toast.success("Price updated successfully");
        dispatch(getInventory());
      }
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price", error.message);
    }
  };

  // Toggle Active/Inactive
  const handleToggle = async (product: any, checked: boolean) => {
    try {
      const formData = {
        product_id: product._id,
        productCode: product.productCode,
      };

      const { productCode } = formData;

      if (checked) {
        await dispatch(removeFromExcluded(productCode));
      } else {
        await dispatch(addToExcludedProducts(formData));
      }

      dispatch(getExcludedProducts());
      dispatch(getInventory());
    } catch (error: any) {
      console.error("Error toggling product:", error);
      toast.error("Failed to toggle product", {
        description: error?.message || "Unknown error",
      });
    }
  };

  const handleRefreshProducts = () => {
    dispatch(getInventory());
    dispatch(getExcludedProducts());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center text-gray-900">
          <Package className="h-7 w-7" />
          <span className="ml-2">Inventory</span>
        </h2>
        <p className="text-gray-500">Manage your product inventory</p>
      </div>

      <div className="bg-gray-900 rounded-lg shadow">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <RefreshCcw
              onClick={handleRefreshProducts}
              className="h-5 w-5 text-white cursor-pointer hover:text-yellow-400"
            />
            Inventory Overview
          </h3>

          <Input
            placeholder="Search by product code, name, ID, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-yellow-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-white w-[300px]">Product</TableHead>
                <TableHead className="text-white">Buy Box</TableHead>
                <TableHead className="text-white">Quantity</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Seller</TableHead>
                <TableHead className="text-white text-center">Active</TableHead>
                <TableHead className="text-white w-[100px] text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow
                  key={item.productContentId}
                  className="border-b border-gray-800 text-white hover:bg-gray-800/50"
                >
                  {/* Product */}
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={item.images[0]?.url}
                      alt={item.title}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-gray-400">
                        {item.brand} <span>, {item.productCode}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Buy Box */}
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <span
                        className={`text-sm font-semibold ${
                          item.isBuyBox === "true"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {item.isBuyBox === "true" ? "✅ Yes" : "❌ No"}
                      </span>
                      <span className="text-yellow-300 font-semibold">
                        ${item.salePrice}
                      </span>
                    </div>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell>{item.quantity}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        item.quantity
                      )}`}
                    >
                      {item.quantity > 10
                        ? "In Stock"
                        : item.quantity === 0
                        ? "Out of Stock"
                        : "Low Stock"}
                    </span>
                  </TableCell>

                  {/* Seller */}
                  <TableCell>
                    <span className="">{item.seller}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Switch
                      defaultChecked={
                        !inactiveProducts.some(
                          (excluded) =>
                            excluded.productCode === item.productCode
                        )
                      }
                      onCheckedChange={(checked) => handleToggle(item, checked)}
                      className="data-[state=checked]:bg-yellow-400 data-[state=unchecked]:bg-gray-600"
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleUpdatePrice(item)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Update Price"
                    >
                      <Edit3 className="h-5 w-5 inline" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-400 py-6"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center text-white">
          <div>
            Showing {paginatedData.length} of {filteredData.length}
          </div>
          <Pagination>
            <PaginationContent className="flex flex-wrap justify-end gap-1">
              {getPaginationRange(totalPages, currentPage).map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        currentPage === page
                          ? "bg-yellow-400 text-gray-900 font-semibold"
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Update Price Modal */}
      {selectedProduct && (
        <Dialog open={true} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Price</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <img
                  src={selectedProduct.images[0]?.url}
                  alt={selectedProduct.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
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
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePrice}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Inventory;
