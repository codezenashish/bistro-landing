import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hook";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

 
  const item = {
    id: id,
    name: "Paneer Butter Masala",
    price: 250,
    description: "Rich and creamy tomato-based gravy with soft paneer cubes.",
    image: "https://via.placeholder.com/400"
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to order!");
      navigate("/login");
      return;
    }
    toast.success(`${item.name} added to cart!`);
    // Dispatch cart action yahan aayega
  };

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col md:flex-row gap-8">
      <img src={item.image} alt={item.name} className="w-full md:w-1/2 rounded-xl shadow-lg" />
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-orange-600 text-2xl font-semibold">₹{item.price}</p>
        <p className="text-gray-600 leading-relaxed">{item.description}</p>
        
        <button 
          onClick={handleAddToCart}
          className="w-full md:w-auto px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition"
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;