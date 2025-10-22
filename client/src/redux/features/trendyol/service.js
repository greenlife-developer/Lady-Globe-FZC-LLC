import axios from "axios";
;
const API_URL = import.meta.env.VITE_API_URL;


// Get Orders from amazon
const getInventory = async () => {
  const response = await axios.get(`${API_URL}/api/trdyol/get-inventory`);

  return response.data;
};

// update price
const updatePrice = async (formData) => {
  const response = await axios.post(`${API_URL}/api/trdyol/update-price`, formData);
  return response.data;
};

// add product to excluded list 
const excludeProduct = async (formData) => {
  const response = await axios.post(`${API_URL}/api/trdyol/add-excluded-product`, formData);
  return response.data;
};

//fetch inactive/excluded products
const getInactiveProducts = async () => {
  const response = await axios.get(`${API_URL}/api/trdyol/get-excluded-products`);
  return response.data;
};

const removeFromExcluded = async (productCode) => {
  const response = await axios.post(`${API_URL}/api/trdyol/remove-excluded-product/${productCode}`);
  return response.data;
}

const trendyolDataService = {
  getInventory,
  updatePrice,
  excludeProduct,
  getInactiveProducts,
  removeFromExcluded,
};

export default trendyolDataService;
