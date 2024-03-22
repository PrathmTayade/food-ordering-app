import hero from "../assets/hero.png";

const Hero = () => {
  return (
    <div>
      <img src={hero} className="w-full max-h-[400px] object-cover" />
    </div>
  );
};

export default Hero;
