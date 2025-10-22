
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PagePlaceholder = ({ title, description, icon }: PagePlaceholderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
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
        <Button onClick={() => navigate("/dashboard")} className="bg-iraav-dark-blue hover:bg-iraav-navy">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PagePlaceholder;
