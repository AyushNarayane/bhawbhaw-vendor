import { AddProductsPage } from "../optionsPages/addProducts";
import CalculatorPage from "../optionsPages/calculator";
import FAQsPage from "../optionsPages/faqs";
import { HelpDesk } from "../optionsPages/helpDesk";
import { MyProductPage } from "../optionsPages/myProducts";
import { OrdersPage } from "../optionsPages/orders";
import { SellerProductsPage } from "../optionsPages/products";
import RemittansePage from "../optionsPages/remittansePage";
import { UserProfileGen } from "../optionsPages/userProfileGen";

export const OptionPageProvider = ({ active }: { active: string }) => {
  return (
    <>
      {active == "addProduct" && <AddProductsPage />}
      {active == "myProduct" && <MyProductPage />}
      {active == "products" && <MyProductPage />}
      {active == "calculator" && <CalculatorPage />}
      {active == "faqs" && <FAQsPage />}
      {active == "helpdesk" && <HelpDesk />}
      {active == "profile" && <UserProfileGen />}
      {active == "orders" && <OrdersPage />}
      {active == "remittance" && <RemittansePage />}
    </>
  );
};
