import { MenuItem as MenuItemType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type Props = {
  menuItem: MenuItemType;
  addToCart: () => void;
  isAddedToCart: boolean;
};

const MenuItem = ({ menuItem, addToCart, isAddedToCart }: Props) => {
  return (
    <Card className={"cursor-pointer"} onClick={addToCart}>
      <div className="flex items-center px-4 ">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>{menuItem.name}</CardTitle>
          </CardHeader>
          <CardContent className="font-bold">
            ₹{(menuItem.price / 100).toFixed(2)}
          </CardContent>
        </div>

        {isAddedToCart && <CheckCircle className="text-green-400 mr-5" />}
      </div>
    </Card>
  );
};

export default MenuItem;
