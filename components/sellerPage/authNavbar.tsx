import { Button } from "../ui/button";

export const AuthNavBar = () => {
  return (
    <div
      className="w-full p-5 px-8 mx-auto flex justify-between sm:px-4 xs:px-3 bg-opacity-15 bg-cover bg-center"
      style={{
        backgroundImage: `url("/img1.png")`,

        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top 50%",
      }}
      // style={{ backgroundImage: "/img1.png" }}
    >
      <Button className="px-10 bg-[#b9cf9e] hover:bg-[#c4d7ae] hover:shadow-md shadow-sm text-lg sm:text-sm sm:px-5 xs:px-2 xs:text-xs">
        <a href="/">GETJEWELS SELLERS</a>
      </Button>
      <div className="flex gap-4 xs:gap-2">
        <Button className="px-7 bg-[#F5F5F5] hover:bg-[#eaeaea]  text-black sm:text-sm sm:px-2 xs:px-2 xs:text-xs">
          <a href="/login">SignIn</a>
        </Button>
        <Button className="px-7 bg-[#F5F5F5] hover:bg-[#eaeaea]  text-black sm:text-sm sm:px-3 xs:px-2 xs:text-xs">
          <a href="/signup">SignUp</a>
        </Button>
      </div>
    </div>
  );
};
