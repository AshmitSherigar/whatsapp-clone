import React from "react";
import TopBar from "./TopBar";

const Home = () => {
  return (
    <>
      <TopBar isLoginVisible={true} />
      <div className="h-screen w-full flex items-center justify-center bg-[#FCF5EB]">
        <div className="border h-140 w-7xl bg-gray-100 rounded-2xl flex items-center justify-center p-20">
          <h1 className="text-3xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, ea.
            Facere accusamus rem deserunt ex eos delectus nostrum deleniti vero,
            quasi, inventore praesentium illum velit accusantium omnis at
            molestias! Eligendi consequuntur voluptates nulla in veniam quam,
            officia cum aspernatur? Dolore, consequatur vero ea expedita labore
            cumque, corrupti vitae accusantium obcaecati officiis laudantium
            exercitationem in incidunt fugiat nam. Quod esse deleniti omnis,
            fugiat illo temporibus officia, debitis iste asperiores doloribus
            aliquid? Vero alias quisquam voluptates accusantium illum, aperiam
            sit ex iusto atque repudiandae quo. Fugit ut dicta quod fugiat sint
            ex amet iusto, odit repellendus quidem, molestias error magni,
            facilis earum.
          </h1>
        </div>
      </div>
    </>
  );
};

export default Home;
