import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, ShoppingCart, Package, LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();



  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-iraav-dark-blue">
              WMWM
            </span>
            <span className="text-2xl font-normal text-gray-600">
              Trendyol Solution
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Existing Login Button */}
            <Button
              onClick={() => navigate("/login")}
              className="bg-iraav-dark-blue hover:bg-iraav-navy"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-iraav-bg-light py-20">
          <div className="container text-center">
            <h1 className="text-5xl font-bold text-iraav-dark-blue mb-6">
              WMWM Trendyol Solution
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The comprehensive analytics and management platform for Trendyol
              sellers. Monitor your orders, inventory, payments, and more in one
              place.
            </p>
            <div className="mt-10">
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-iraav-dark-blue hover:bg-iraav-navy"
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-iraav-bg-light p-6 rounded-lg text-center">
                <div className="bg-iraav-accent-yellow w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4">
                  <BarChart className="h-7 w-7 text-iraav-dark-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
                <p className="text-gray-600">
                  Visualize your Trendyol business performance with interactive
                  charts and comprehensive reports.
                </p>
              </div>

              <div className="bg-iraav-bg-light p-6 rounded-lg text-center">
                <div className="bg-iraav-accent-yellow w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="h-7 w-7 text-iraav-dark-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">Order Management</h3>
                <p className="text-gray-600">
                  Track all your orders in real-time, manage refunds, and
                  analyze buying patterns.
                </p>
              </div>

              <div className="bg-iraav-bg-light p-6 rounded-lg text-center">
                <div className="bg-iraav-accent-yellow w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4">
                  <Package className="h-7 w-7 text-iraav-dark-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">Inventory Control</h3>
                <p className="text-gray-600">
                  Monitor stock levels, get alerts for low inventory, and
                  optimize reordering.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-iraav-bg-cream">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to boost your Trendyol business?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of Trendyol sellers who trust IRAAV for their
              business analytics.
            </p>
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="bg-iraav-dark-blue hover:bg-iraav-navy"
            >
              Start Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-iraav-dark-blue text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-bold">WMWM</span>
                <span className="text-xl font-light">Trendyol Solution</span>
                <span className="ml-2 text-xs bg-iraav-accent-yellow text-iraav-dark-blue px-2 py-0.5 rounded">
                  v1.0.0
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} WMWM Solutions. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
